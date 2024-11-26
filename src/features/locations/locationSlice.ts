import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from "../../app/store";

interface Location {
    idEmplacement: number;
    idHote: number;
    nom: string;
    adresse: string;
    description: string;
    commodites: string[];
    image: string | null;
    latitude: number;
    longitude: number;
    prixParNuit: number;
    dateDebut: string;
    dateFin: string;
}

interface LocationState {
    locations: Location[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: LocationState = {
    locations: [],
    status: 'idle',
    error: null,
};

// Action asynchrone pour récupérer les emplacements d'un hôte
export const fetchLocationsAsync = createAsyncThunk<
    Location[],
    number,
    { state: RootState }
>(
    'locations/fetchLocations',
    async (userId, { getState }) => {
        const state = getState();
        const token = state.users.token; // Récupère le token
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/emplacements/host/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des emplacements.');
        }
        return await response.json() as Location[];
    }
);

// Action asynchrone pour ajouter un emplacement
export const addLocationAsync = createAsyncThunk<
    Location,
    Omit<Location, 'idEmplacement'>,
    { state: RootState }
>(
    'locations/addLocation',
    async (location, { getState }) => {
        const state = getState();
        const token = state.users.token; // Récupère le token

        console.log("Données envoyées au backend :", location);

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/emplacements`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
        });

        console.log("[FRONT] Réponse du backend :", response);

        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout de l\'emplacement.');
        }
        return await response.json() as Location;
    }
);


// Action asynchrone pour mettre à jour un emplacement
export const updateLocationAsync = createAsyncThunk<
    Location,
    Location,
    { state: RootState }
>(
    'locations/updateLocation',
    async (location, { getState }) => {
        const state = getState();
        const token = state.users.token; // Récupère le token
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/emplacements/${location.idEmplacement}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de l\'emplacement.');
        }
        return await response.json() as Location;
    }
);

// Action asynchrone pour supprimer un emplacement
export const deleteLocationAsync = createAsyncThunk<
    number,
    number,
    { state: RootState }
>(
    'locations/deleteLocation',
    async (idEmplacement, { getState }) => {
        const state = getState();
        const token = state.users.token; // Récupère le token
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/emplacements/${idEmplacement}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'emplacement.');
        }
        return idEmplacement;
    }
);

const locationSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLocationsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLocationsAsync.fulfilled, (state, action: PayloadAction<Location[]>) => {
                state.status = 'succeeded';
                state.locations = action.payload;
            })
            .addCase(fetchLocationsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Erreur inconnue';
            })
            .addCase(addLocationAsync.fulfilled, (state, action: PayloadAction<Location>) => {
                state.locations.push(action.payload);
            })
            .addCase(updateLocationAsync.fulfilled, (state, action: PayloadAction<Location>) => {
                const index = state.locations.findIndex(
                    (loc) => loc.idEmplacement === action.payload.idEmplacement
                );
                if (index !== -1) {
                    state.locations[index] = action.payload;
                }
            })
            .addCase(deleteLocationAsync.fulfilled, (state, action: PayloadAction<number>) => {
                state.locations = state.locations.filter(
                    (location) => location.idEmplacement !== action.payload
                );
            });
    },
});

export default locationSlice.reducer;
