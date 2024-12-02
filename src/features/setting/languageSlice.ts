import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import i18n from "../../i18n";

// Action asynchrone pour changer la langue
export const changeLanguageAsync = createAsyncThunk<
    string, // Type de succès (la langue changée)
    string, // Argument passé à l'action
    { rejectValue: string } // Type de rejet (erreur)
>(
    "language/changeLanguageAsync",
    async (newLanguage, { rejectWithValue }) => {
        try {
            await i18n.changeLanguage(newLanguage);
            return newLanguage; // Succès : retourne la langue
        } catch (error) {
            return rejectWithValue("Erreur lors du changement de langue"); // Rejet : retourne un message d'erreur
        }
    }
);

const languageSlice = createSlice({
    name: "language",
    initialState: {
        currentLanguage: i18n.language || "en", // Langue initiale
        status: "idle", // idle, loading, succeeded, failed
        error: null as string | null,
    },
    reducers: {}, // Pas besoin de reducers synchrones ici
    extraReducers: (builder) => {
        builder
            .addCase(changeLanguageAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(changeLanguageAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentLanguage = action.payload; // Met à jour Redux avec la nouvelle langue
            })
            .addCase(changeLanguageAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Erreur inconnue"// Enregistre l'erreur
            });
    },
});

export default languageSlice.reducer;
