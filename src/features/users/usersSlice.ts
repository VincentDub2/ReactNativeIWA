import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Reservation {
    nom: string;
    dateDebut: string | null;
    dateFin: string | null;
    adresse: string;
}

export interface User {
    id: number
    username: string //nom
    lastname: string //prenom 
    firstname : string
    email: string
    phone: string
    isAuthenticated: boolean;
    reservations: Reservation[];
}

const initialState: User = {
    id: 0,
    username: '',
    lastname: '',
    firstname: '',
    email: '',
    phone: '',
    isAuthenticated: false,
    reservations: [],
}

// Action asynchrone pour gérer l'enregistrement
export const registerAsync = createAsyncThunk(
    'users/registerAsync',
    async (credentials: { email: string; password: string; username: string; firstname: string; lastname: string }) => {
        try {
            const response = await fetch('http://localhost:8090/api/v1/user/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const textData = await response.text();
                //console.warn("Réponse en texte du serveur :", textData);
                throw new Error("La réponse du serveur n'est pas au format JSON");
            }

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'enregistrement');
            }

            return data;
        } catch (error) {
            //console.error("Erreur lors de l'enregistrement :", error);
            throw error;
        }
    }
);

// Action asynchrone pour gérer la connexion
export const loginAsync = createAsyncThunk(
    'users/loginAsync',
    async (credentials: { email: string; password: string }) => {
        try {
            const response = await fetch('http://localhost:8090/api/v1/user/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log("Réponse JSON du serveur:", data);
                if (!response.ok) {
                    throw new Error(data.message || 'Erreur de connexion');
                }
                return data;
            } else {
                // La réponse est en texte brut (le token)
                const token = await response.text();

                if (!response.ok) {
                    throw new Error(token || 'Erreur de connexion');
                }
                
                // Retourne le token dans un format compatible avec Redux
                return { token };
            }
        } catch (error) {
            //console.error("Erreur lors de la connexion :", error);
            throw error;
        }
    }
);

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
            state.isAuthenticated = false;
            state.id = 0;
            state.username = '';
            state.lastname = '';
            state.firstname = '';
            state.email = '';
            state.phone = '';
            state.reservations = [];
        },
        addReservation: (state, action: PayloadAction<Reservation>) => {
            state.reservations.push(action.payload); // Ajouter une nouvelle réservation
        },
        removeReservation: (state, action: PayloadAction<number>) => {
            state.reservations.splice(action.payload, 1); // Supprimer une réservation par son index
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.id = action.payload.id;
                state.username = action.payload.username;
                state.lastname = action.payload.lastname;
                state.firstname = action.payload.firstname;
                state.email = action.payload.email;
                state.phone = action.payload.phone;
                // Ajouter des informations supplémentaires si nécessaire
            })
            .addCase(loginAsync.rejected, (state) => {
                state.isAuthenticated = false;
            });
    },
})


export const {setUserName, setLastName, setFirstName ,setEmail, setPhone, setId, login, logout, addReservation, removeReservation} = usersSlice.actions
export default usersSlice.reducer
