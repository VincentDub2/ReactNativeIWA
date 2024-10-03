import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface User {
    id: number
    name: string
    email: string
}

const initialState: User = {
    id: 0,
    name: '',
    email: '',
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
    },
})


export const {setName,setEmail,setId } = usersSlice.actions
export default usersSlice.reducer
