import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const tokens = localStorage.getItem('tokens')
        if (tokens) {
            const { access } = JSON.parse(tokens)
            config.headers.Authorization = `Bearer ${access}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const tokens = localStorage.getItem('tokens')
                if (tokens) {
                    const { refresh } = JSON.parse(tokens)
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
                        refresh,
                    })

                    const newTokens = {
                        access: response.data.access,
                        refresh: response.data.refresh || refresh,
                    }
                    localStorage.setItem('tokens', JSON.stringify(newTokens))

                    originalRequest.headers.Authorization = `Bearer ${newTokens.access}`
                    return api(originalRequest)
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('tokens')
                localStorage.removeItem('user')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
