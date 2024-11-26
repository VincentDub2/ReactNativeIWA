import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {Notification} from "../../models/Notification";
import axios from "axios";
import {getApiUrl} from "../../utils/api";
import {RootState} from "../../app/store";



interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationsState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};


const API_URL = getApiUrl();
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue, getState }) => {
        const state = getState() as RootState; // Accède à l'état global
        const userId = state.users.id; // Récupère l'ID utilisateur
        const token = state.users.token; // Récupère le token utilisateur

        if (!userId || !token) {
            return rejectWithValue('Utilisateur non authentifié ou ID/token manquant.');
        }

        try {
            const response = await axios.get(
                `${API_URL}/notification/recipient/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Vérifiez si la réponse est valide
            if (response.status !== 200) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = response.data;


            // Gestion des cas où la réponse est vide ou non conforme
            if (!data) {
                return []; // Retourne un tableau vide si la réponse est null ou undefined
            }

            if (!Array.isArray(data)) {
                throw new Error('La réponse API doit être un tableau.');
            }

            return data as Notification[];
        } catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la récupération des notifications.');
        }
    }
);

export const markAsReadAPI = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId: number, { rejectWithValue, getState }) => {
        const state = getState() as RootState;
        const userId = state.users.id;
        const token = state.users.token;

        if (!userId || !token) {
            return rejectWithValue('Utilisateur non authentifié ou ID/token manquant.');
        }
        try {
            const response = await axios.put(
                `${API_URL}/notification/${notificationId}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            return notificationId;
        }
        catch (error: any) {
            return rejectWithValue(error.message || 'Erreur lors de la mise à jour de la notification.');
        }
    }
);



const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        loadNotifications(state, action: PayloadAction<Notification[]>) {
            state.notifications = action.payload;
        },
        markAsRead: (state, action) => {
            const notification = state.notifications.find(
                (notif) => notif.id === action.payload
            );
            if (notification) {
                notification.read = true;
                state.unreadCount -= 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.unreadCount = state.notifications.filter((notif) => !notif.read).length; // Calculer le nombre de notifications non lues
                state.loading = false; // Arrêter le chargement
            })
            .addCase(markAsReadAPI.fulfilled, (state, action) => {
                const notification = state.notifications.find((notif) => notif.id === action.payload);
                if (notification) {
                    notification.read = true;
                    state.unreadCount -= 1; // Met à jour le compteur de notifications non lues
                }
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { markAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
