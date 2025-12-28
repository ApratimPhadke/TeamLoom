import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/client'

// Check for stored auth on load
const storedUser = localStorage.getItem('user')
const storedTokens = localStorage.getItem('tokens')

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    tokens: storedTokens ? JSON.parse(storedTokens) : null,
    isAuthenticated: !!storedTokens,
    loading: false,
    error: null,
}

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login/', { email, password })
            const { user, access, refresh } = response.data

            // Store tokens
            const tokens = { access, refresh }
            localStorage.setItem('tokens', JSON.stringify(tokens))
            localStorage.setItem('user', JSON.stringify(user))

            return { user, tokens }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.detail || 'Login failed'
            )
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register/', userData)
            const { user, tokens } = response.data

            localStorage.setItem('tokens', JSON.stringify(tokens))
            localStorage.setItem('user', JSON.stringify(user))

            return { user, tokens }
        } catch (error) {
            return rejectWithValue(
                error.response?.data || 'Registration failed'
            )
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { getState }) => {
        try {
            const { tokens } = getState().auth
            if (tokens?.refresh) {
                await api.post('/auth/logout/', { refresh: tokens.refresh })
            }
        } catch (error) {
            // Ignore logout errors
        } finally {
            localStorage.removeItem('tokens')
            localStorage.removeItem('user')
        }
    }
)

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me/')
            localStorage.setItem('user', JSON.stringify(response.data))
            return response.data
        } catch (error) {
            return rejectWithValue('Failed to fetch user')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload }
            localStorage.setItem('user', JSON.stringify(state.user))
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.tokens = action.payload.tokens
                state.isAuthenticated = true
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.tokens = action.payload.tokens
                state.isAuthenticated = true
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.tokens = null
                state.isAuthenticated = false
            })
            // Fetch current user
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload
            })
    },
})

export const { clearError, updateUser } = authSlice.actions
export default authSlice.reducer
