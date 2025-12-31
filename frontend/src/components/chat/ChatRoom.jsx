import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Send, Smile, Paperclip, MoreVertical, ArrowLeft, X, File, Image as ImageIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import api from '../../api/client'
import toast from 'react-hot-toast'

export default function ChatRoom({ groupId, groupName, onBack }) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [connected, setConnected] = useState(false)
    const [typingUsers, setTypingUsers] = useState([])
    const { user } = useSelector((state) => state.auth)
    const wsRef = useRef(null)
    const messagesEndRef = useRef(null)
    const typingTimeoutRef = useRef(null)
    const fileInputRef = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [filePreview, setFilePreview] = useState(null)
    const [uploading, setUploading] = useState(false)

    // Scroll to bottom on new messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Fetch message history
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/chat/groups/${groupId}/messages/`)
                setMessages(res.data.results || res.data)
                setLoading(false)
            } catch (err) {
                console.error('Failed to fetch messages', err)
                setLoading(false)
            }
        }
        fetchMessages()
    }, [groupId])

    // WebSocket connection
    useEffect(() => {
        // Get token from localStorage (stored as JSON object with access/refresh)
        const storedTokens = localStorage.getItem('tokens')
        const token = storedTokens ? JSON.parse(storedTokens).access : null

        if (!token) {
            console.error('No auth token found')
            return
        }

        // Use window location to support both dev and production
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsHost = window.location.host // This goes through Vite proxy
        const wsUrl = `${wsProtocol}//${wsHost}/ws/chat/${groupId}/?token=${token}`

        const ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
            console.log('Chat WebSocket connected')
            setConnected(true)
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.type === 'message') {
                // Message from backend - add to list
                setMessages((prev) => [...prev, data.message])
            } else if (data.type === 'typing') {
                if (data.user_id !== user?.id) {
                    setTypingUsers((prev) => {
                        if (!prev.includes(data.user_name)) {
                            return [...prev, data.user_name]
                        }
                        return prev
                    })
                    // Remove after 3 seconds
                    setTimeout(() => {
                        setTypingUsers((prev) => prev.filter((u) => u !== data.user_name))
                    }, 3000)
                }
            } else if (data.type === 'user_joined') {
                // Could show a system message
            }
        }

        ws.onclose = () => {
            console.log('Chat WebSocket disconnected')
            setConnected(false)
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        return () => {
            ws.close()
        }
    }, [groupId, user?.id])

    // Send message
    const sendMessage = useCallback(async () => {
        // Handle file upload
        if (selectedFile) {
            setUploading(true)
            try {
                const formData = new FormData()
                formData.append('file', selectedFile)
                formData.append('group_id', groupId)

                const res = await api.post('/chat/upload/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                // Send file message via WebSocket
                if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                        type: 'message',
                        content: newMessage.trim() || `Sent a file: ${selectedFile.name}`,
                        message_type: res.data.file_type === 'image' ? 'image' : 'file',
                        file_url: res.data.file_url,
                        file_name: selectedFile.name
                    }))
                }

                setSelectedFile(null)
                setFilePreview(null)
                setNewMessage('')
                toast.success('File sent!')
            } catch (err) {
                toast.error('Failed to upload file')
                console.error(err)
            }
            setUploading(false)
            return
        }

        // Regular text message
        if (!newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return
        }

        wsRef.current.send(JSON.stringify({
            type: 'message',
            content: newMessage.trim()
        }))

        setNewMessage('')
    }, [newMessage, selectedFile, groupId])

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File must be less than 10MB')
            return
        }

        setSelectedFile(file)

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => setFilePreview(e.target.result)
            reader.readAsDataURL(file)
        } else {
            setFilePreview(null)
        }
    }

    // Cancel file selection
    const cancelFile = () => {
        setSelectedFile(null)
        setFilePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Handle typing indicator
    const handleTyping = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'typing', is_typing: true }))
        }
    }

    // Handle key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="flex flex-col h-[600px] bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-dark-700 bg-dark-800">
                {onBack && (
                    <button onClick={onBack} className="p-1 hover:bg-dark-700 rounded-lg lg:hidden">
                        <ArrowLeft size={20} className="text-dark-300" />
                    </button>
                )}
                <div className="flex-1">
                    <h3 className="font-semibold text-dark-100">{groupName || 'Group Chat'}</h3>
                    <p className="text-xs text-dark-400">
                        {connected ? (
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Connected
                            </span>
                        ) : (
                            'Connecting...'
                        )}
                    </p>
                </div>
                <button className="p-2 hover:bg-dark-700 rounded-lg">
                    <MoreVertical size={18} className="text-dark-400" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mb-4">
                            <Send size={24} className="text-primary-400" />
                        </div>
                        <p className="text-dark-300 font-medium">No messages yet</p>
                        <p className="text-dark-500 text-sm">Be the first to say hello!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        // Handle both API format (sender_id) and WebSocket format (sender.id)
                        const senderId = msg.sender_id || msg.sender?.id
                        const senderName = msg.sender_name || msg.sender?.name || msg.sender?.first_name || 'Unknown'
                        const isOwn = senderId === user?.id

                        const senderAvatar = msg.sender_avatar || msg.sender?.avatar_url

                        // Show avatar/name if first message or different sender from previous
                        const prevSenderId = messages[index - 1]?.sender_id || messages[index - 1]?.sender?.id
                        const showHeader = index === 0 || prevSenderId !== senderId

                        return (
                            <div
                                key={msg.id || index}
                                className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar for other users */}
                                {!isOwn && showHeader ? (
                                    senderAvatar ? (
                                        <img
                                            src={senderAvatar}
                                            alt={senderName}
                                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="avatar w-8 h-8 text-xs shrink-0">
                                            {senderName?.[0]?.toUpperCase() || '?'}
                                        </div>
                                    )
                                ) : (
                                    <div className="w-8 shrink-0" />
                                )}

                                <div className={`max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
                                    {/* Always show sender name for others */}
                                    {!isOwn && showHeader && (
                                        <p className="text-xs text-primary-400 font-medium mb-1">
                                            {senderName}
                                        </p>
                                    )}
                                    {/* Show "You" label for own messages */}
                                    {isOwn && showHeader && (
                                        <p className="text-xs text-dark-400 mb-1 text-right">
                                            You
                                        </p>
                                    )}
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${isOwn
                                            ? 'bg-primary-500 text-white rounded-br-md'
                                            : 'bg-dark-700 text-dark-100 rounded-bl-md'
                                            }`}
                                    >
                                        {/* Handle image messages */}
                                        {msg.message_type === 'image' && msg.file_url && (
                                            <a
                                                href={msg.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <img
                                                    src={msg.file_url}
                                                    alt={msg.file_name || 'Image'}
                                                    className="max-w-xs rounded-lg mb-2 hover:opacity-90 transition"
                                                />
                                            </a>
                                        )}
                                        {/* Handle file messages */}
                                        {msg.message_type === 'file' && msg.file_url && (
                                            <a
                                                href={msg.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-lg ${isOwn ? 'bg-white/20' : 'bg-dark-600'
                                                    }`}
                                            >
                                                <File size={20} />
                                                <span className="text-sm truncate">{msg.file_name || 'File'}</span>
                                            </a>
                                        )}
                                        {/* Text content */}
                                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                    </div>
                                    <p className={`text-[10px] text-dark-500 mt-1 ${isOwn ? 'text-right' : ''}`}>
                                        {msg.created_at && formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}

                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-dark-400 text-sm">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-dark-700 bg-dark-800">
                {/* File Preview */}
                {selectedFile && (
                    <div className="mb-3 p-3 bg-dark-700 rounded-lg flex items-center gap-3">
                        {filePreview ? (
                            <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                        ) : (
                            <div className="w-16 h-16 bg-dark-600 rounded flex items-center justify-center">
                                <File size={24} className="text-dark-400" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-dark-200 truncate">{selectedFile.name}</p>
                            <p className="text-xs text-dark-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button onClick={cancelFile} className="p-2 hover:bg-dark-600 rounded">
                            <X size={18} className="text-dark-400" />
                        </button>
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-dark-400 hover:text-dark-200"
                        title="Attach file"
                    >
                        <Paperclip size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <textarea
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value)
                                handleTyping()
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder={selectedFile ? "Add a caption (optional)..." : "Type a message..."}
                            rows={1}
                            className="input resize-none min-h-[44px] max-h-[120px] pr-10"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200">
                            <Smile size={20} />
                        </button>
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={(!newMessage.trim() && !selectedFile) || !connected || uploading}
                        className="btn-primary p-3 disabled:opacity-50"
                    >
                        {uploading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
