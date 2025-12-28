import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/client'

const initialState = {
    groups: [],
    currentGroup: null,
    myGroups: [],
    recommended: [],
    loading: false,
    error: null,
}

export const fetchGroups = createAsyncThunk(
    'groups/fetchGroups',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/groups/', { params })
            return response.data.results || response.data
        } catch (error) {
            return rejectWithValue('Failed to fetch groups')
        }
    }
)

export const fetchGroupById = createAsyncThunk(
    'groups/fetchGroupById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/groups/${id}/`)
            return response.data
        } catch (error) {
            return rejectWithValue('Failed to fetch group')
        }
    }
)

export const fetchMyGroups = createAsyncThunk(
    'groups/fetchMyGroups',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/groups/my_groups/')
            return response.data
        } catch (error) {
            return rejectWithValue('Failed to fetch my groups')
        }
    }
)

export const fetchRecommended = createAsyncThunk(
    'groups/fetchRecommended',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/groups/recommended/')
            return response.data
        } catch (error) {
            return rejectWithValue('Failed to fetch recommendations')
        }
    }
)

export const createGroup = createAsyncThunk(
    'groups/createGroup',
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await api.post('/groups/', groupData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create group')
        }
    }
)

export const joinGroup = createAsyncThunk(
    'groups/joinGroup',
    async ({ groupId, message }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/groups/${groupId}/join/`, { message })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to send join request')
        }
    }
)

export const leaveGroup = createAsyncThunk(
    'groups/leaveGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            await api.post(`/groups/${groupId}/leave/`)
            return groupId
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to leave group')
        }
    }
)

const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        clearCurrentGroup: (state) => {
            state.currentGroup = null
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch groups
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false
                state.groups = action.payload
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch group by ID
            .addCase(fetchGroupById.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchGroupById.fulfilled, (state, action) => {
                state.loading = false
                state.currentGroup = action.payload
            })
            .addCase(fetchGroupById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // My groups
            .addCase(fetchMyGroups.fulfilled, (state, action) => {
                state.myGroups = action.payload
            })
            // Recommended
            .addCase(fetchRecommended.fulfilled, (state, action) => {
                state.recommended = action.payload
            })
            // Create group
            .addCase(createGroup.fulfilled, (state, action) => {
                state.myGroups.unshift(action.payload)
            })
            // Leave group
            .addCase(leaveGroup.fulfilled, (state, action) => {
                state.myGroups = state.myGroups.filter(g => g.id !== action.payload)
            })
    },
})

export const { clearCurrentGroup, clearError } = groupsSlice.actions
export default groupsSlice.reducer
