import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/client'

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
}

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notifications/')
            return response.data.results || response.data
        } catch (error) {
            return rejectWithValue('Failed to fetch notifications')
        }
    }
)

export const fetchUnreadCount = createAsyncThunk(
    'notifications/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notifications/unread-count/')
            return response.data.unread_count
        } catch (error) {
            return rejectWithValue('Failed to fetch unread count')
        }
    }
)

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            await api.post(`/notifications/${notificationId}/read/`)
            return notificationId
        } catch (error) {
            return rejectWithValue('Failed to mark as read')
        }
    }
)

export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/notifications/mark-all-read/')
            return true
        } catch (error) {
            return rejectWithValue('Failed to mark all as read')
        }
    }
)

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload)
            state.unreadCount += 1
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false
                state.notifications = action.payload
            })
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n.id === action.payload)
                if (notification && !notification.is_read) {
                    notification.is_read = true
                    state.unreadCount = Math.max(0, state.unreadCount - 1)
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.is_read = true)
                state.unreadCount = 0
            })
    },
})

export const { addNotification, setUnreadCount } = notificationsSlice.actions
export default notificationsSlice.reducer
