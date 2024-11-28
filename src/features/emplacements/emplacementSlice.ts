import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from "../../app/store";
import {getToken} from "../../utils/auth";
import axios from "axios";
import {getApiUrl} from "../../utils/api";
import {Evaluation} from "../../models/Evaluation";


export interface Emplacement {
    idEmplacement: number;
    idHote: number;
    nom: string;
    adresse: string;
    description: string;
    commodites: string[];
    note: number;
    capacity: number;
    image: string | null;
    latitude: number;
    longitude: number;
    prixParNuit: number;
    dateDebut: string;
    dateFin: string;
    evaluations: evaluation[];
}

interface evaluation {
    note: number;
    commentaire: string;
}
interface emplacementState {
    emplacements: Emplacement[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    emplacementView: Emplacement | null;
}

const fakeEmplacement = {
    idEmplacement: 1,
    idHote: 1,
    nom: "Emplacement test",
    adresse: "1 rue de test",
    description: "Description de test",
    commodites: ["test1", "test2"],
    note: 3,
    capacity: 5,
    image: null,
    latitude: 0,
    longitude: 0,
    prixParNuit: 50,
    dateDebut: "2021-12-01",
    dateFin: "2021-12-31",
    evaluations: [
        {
            note: 4,
            commentaire: "Très bon emplacement"
        },
        {
            note: 2,
            commentaire: "Mauvais emplacement"
        }
    ]
}

const initialState: emplacementState = {
    emplacements: [],
    status: 'idle',
    error: null,
    emplacementView: fakeEmplacement,
};

const API_URL = getApiUrl();

/**
 * Action asynchrone pour récupérer les emplacements tous les emplacements
 */
export const fetchEmplacementsAsync = createAsyncThunk<
    Emplacement[],
    void,
    { state: RootState }
>(
    'locations/fetchEmplacements',
    async (_, { getState }) => {
        const state = getState();
        const token = state.users.token; // Récupère le token
        const response = await fetch(`${API_URL}/emplacements`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des emplacements.');
        }


        const data = await response.json();

        console.log(data);


        const emplacementWithNote = await Promise.all(
            data.map(async (emplacement: Emplacement) => {
                emplacement.note = await fetchAverageNote(emplacement.idEmplacement) || -1;
                emplacement.capacity = Math.floor(Math.random() * 10) + 1;
                emplacement.evaluations = await fetchEvaluation(emplacement.idEmplacement) || [];
                return emplacement;
            })
        );

        console.log(emplacementWithNote);

        return emplacementWithNote as Emplacement[];
    }
);



async function fetchAverageNote(emplacementId: number): Promise<number | null> {
    const token = getToken();

    try {
        const response = await axios.get(
            `${API_URL}/evaluation/emplacement/${emplacementId}/average-note`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
    return response.data; // Retourne `null` si aucune note n'est disponible
} else {
    throw new Error(`Erreur HTTP : ${response.status}`);
}
} catch (error) {
    //console.error(`Erreur lors de la récupération de la note moyenne pour l'emplacement ${emplacementId} :`, error);
    return null; // Retourne `null` par défaut en cas d'erreur
}
}

async function fetchEvaluation(emplacementId: number): Promise<Evaluation[] | null> {
    const token = getToken();

    try {
        const response = await axios.get(
            `${API_URL}/evaluation/emplacement/${emplacementId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            return response.data ; // Retourne `null` si aucune note n'est disponible
        } else {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
    } catch (error) {
        //console.error(`Erreur lors de la récupération de la note moyenne pour l'emplacement ${emplacementId} :`, error);
        return null; // Retourne `null` par défaut en cas d'erreur
    }
}
/**
 * Action asynchrone pour récupérer les emplacements tous les emplacements
 */
export const fetchOneEmplacementAsync = createAsyncThunk<
    Emplacement,
    number, // L'ID de l'emplacement à récupérer
    { state: RootState }
>(
    'emplacements/fetchOneEmplacement',
    async (idEmplacement, { getState }) => {
        const state = getState();
        const token = state.users.token; // Récupère le token

        const response = await axios.get(`${API_URL}/emplacements/${idEmplacement}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Erreur lors de la récupération de l’emplacement.');
        }

        const emplacement = response.data;

        // Récupérer les notes et évaluations
        emplacement.note = await fetchAverageNote(emplacement.idEmplacement) || -1;
        emplacement.evaluations = await fetchEvaluation(emplacement.idEmplacement) || [];

        return emplacement as Emplacement;
    }
);

const emplacementSlice = createSlice({
    name: 'emplacements',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmplacementsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEmplacementsAsync.fulfilled, (state, action: PayloadAction<Emplacement[]>) => {
                state.status = 'succeeded';
                state.emplacements = action.payload;
            })
            .addCase(fetchEmplacementsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Erreur inconnue';
            })
            // Gestion d'un seul emplacement
            .addCase(fetchOneEmplacementAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOneEmplacementAsync.fulfilled, (state, action: PayloadAction<Emplacement>) => {
                state.status = 'succeeded';
                state.emplacementView = action.payload;
            })
            .addCase(fetchOneEmplacementAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Erreur inconnue';
            });

    },
});

export default emplacementSlice.reducer;
