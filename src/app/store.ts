import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import locationReducer from '../features/locations/locationSlice'
import usersReducer from '../features/users/usersSlice'
import evaluationsReducer from "../features/evaluations/evaluationsSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import languageReducer from "../features/setting/languageSlice";
import emplacementReducer from "../features/emplacements/emplacementSlice";

export const store = configureStore({
    reducer: {
        users: usersReducer,
        locations: locationReducer,
        evaluations: evaluationsReducer,
        notifications: notificationsReducer,
        language: languageReducer,
        emplacements: emplacementReducer,
    }
})

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>
