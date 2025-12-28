import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import groupsReducer from './groupsSlice'
import notificationsReducer from './notificationsSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        groups: groupsReducer,
        notifications: notificationsReducer,
    },
    devTools: import.meta.env.DEV,
})
