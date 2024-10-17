import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
    name: string;
    address: string;
    amenities: string[];
}

interface LocationState {
    locations: Location[];
}

const initialState: LocationState = {
    locations: [],
};

export const locationSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {
        addLocation: (state, action: PayloadAction<Location>) => {
            state.locations.push(action.payload);
        },
    },
});

export const { addLocation } = locationSlice.actions;
export default locationSlice.reducer;
