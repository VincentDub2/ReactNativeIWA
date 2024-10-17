import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface User {
    id: number
    name: string
    email: string
    isAuthenticated: boolean;
}

const initialState: User = {
    id: 0,
    name: '',
    email: '',
    isAuthenticated: false,
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
        setId: (state, action: PayloadAction<number>) => {
            state.id = action.payload
        },
        login: (state) => {
            state.isAuthenticated = true;  // Action pour gérer la connexion
        },
        logout: (state) => {
            state.isAuthenticated = false; // Action pour gérer la déconnexion
        },
    },
})


export const {setName,setEmail,setId, login, logout } = usersSlice.actions
export default usersSlice.reducer
