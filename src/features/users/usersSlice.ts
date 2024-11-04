import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface User {
    id: number
    username: string //nom
    lastname: string //prenom 
    firstname : string
    email: string
    phone: string
    isAuthenticated: boolean;
}

const initialState: User = {
    id: 0,
    username: '',
    lastname: '',
    firstname: '',
    email: '',
    phone: '',
    isAuthenticated: false,
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        },
        setLastName: (state, action: PayloadAction<string>) => {
            state.lastname = action.payload
        },
        setFirstName: (state, action: PayloadAction<string>) => {
            state.firstname = action.payload
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
        setPhone: (state, action: PayloadAction<string>) => {
            state.phone = action.payload
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


export const {setUserName, setLastName, setFirstName ,setEmail, setPhone, setId, login, logout } = usersSlice.actions
export default usersSlice.reducer
