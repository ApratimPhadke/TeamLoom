import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import { store } from './store'
import './index.css'

// Google OAuth Client ID - set this in .env as VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            className: 'bg-dark-800 text-dark-100 border border-dark-600',
                            success: {
                                iconTheme: { primary: '#10b981', secondary: '#fff' },
                            },
                            error: {
                                iconTheme: { primary: '#ef4444', secondary: '#fff' },
                            },
                        }}
                    />
                </BrowserRouter>
            </Provider>
        </GoogleOAuthProvider>
    </React.StrictMode>
)
