import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {User} from "../../models/User";
import {Reservation} from "../../models/Reservation";


const initialState: User = {
    id: 0,
    username: '',
    lastname: '',
    firstname: '',
    email: '',
    phone: '',
    password: undefined,
    isAuthenticated: false,
    reservations: [],
    token: undefined,
}

// Action asynchrone pour gérer l'enregistrement
export const registerAsync = createAsyncThunk(
    'users/registerAsync',
    async (credentials: { email: string; password: string; username: string; firstname: string; lastname: string }) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/auth/register`, {
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

export const loginAsync = createAsyncThunk(
    'users/loginAsync',
    async (credentials: { email: string; password: string }) => {
        console.log('Tentative de connexion avec les informations suivantes:', credentials);
        console.log('URL de l\'API publique:', process.env.EXPO_PUBLIC_API_URL);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            // Vérifiez directement si la réponse est OK
            if (!response.ok) {
                const errorMessage = await response.text(); // Extraire le message d'erreur si disponible
                throw new Error(errorMessage || 'Erreur de connexion');
            }

            const contentType = response.headers.get('content-type');

            // Vérifiez si la réponse est en JSON
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Réponse JSON du serveur:', data);
                return data; // Retournez l'objet JSON (ex. utilisateur avec token ou informations)
            }

            // Si la réponse est en texte brut (ex. token uniquement)
            const token = await response.text();
            //console.log('Token reçu du serveur:', token);
            return { token }; // Retournez un objet contenant uniquement le token
        } catch (error: any) {
            //console.error('Erreur lors de la connexion:', error.message || error);
            throw new Error(error.message || 'Erreur inconnue');
        }
    }
);

function decodeJWT(token: string): any {
    try {
        const base64Url = token.split('.')[1]; // Récupère le payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload); // Retourne le payload décodé
    } catch (error) {
        //console.error('Erreur lors du décodage du JWT :', error);
        return null;
    }
}

export const fetchUserByIdAsync = createAsyncThunk(
    'users/fetchUserById',
    async (userId: number, { getState }) => {
        const state: RootState = getState() as RootState;
        const token = state.users.token; // Récupère le token depuis Redux

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Inclut le token dans les headers
                'Content-Type': 'application/json',
            },
        });

        //console.log("Réponse du serveur:", response);

        if (!response.ok) {
            console.log("Erreur lors de la récupération des informations utilisateur");
            throw new Error('Erreur lors de la récupération des informations utilisateur');
        }

        return await response.json(); // Retourne les données utilisateur
    }
);

export const updateUserAsync = createAsyncThunk(
    'users/updateUserAsync',
    async (userData: { id: number; username: string; email: string; firstname: string; lastname: string, password?: string }, { getState }) => {
        const state: RootState = getState() as RootState;
        const token = state.users.token; // Récupérez le token pour l'authentification

        // Récupérez le mot de passe existant depuis Redux
        const password = state.users.password;


        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/${userData.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, // Authentifiez avec le token
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                firstName: userData.firstname,
                lastName: userData.lastname,
                password: password,
            }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Erreur lors de la mise à jour des informations utilisateur.');
        }

        return await response.json(); // Retourne les nouvelles données utilisateur
    }
);

export const fetchUserReservationsAsync = createAsyncThunk(
    'users/fetchUserReservations',
    async (_, { getState }) => {
        const state: RootState = getState() as RootState;
        const token = state.users.token;
        const userId = state.users.id;

        if (!token || !userId) {
            throw new Error("Token ou ID utilisateur manquant.");
        }

        const reservationsResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reservation`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!reservationsResponse.ok) {
            const errorText = await reservationsResponse.text();
            throw new Error(`Erreur lors de la récupération des réservations : ${errorText}`);
        }

        const reservationsData = await reservationsResponse.json();

        // Filtrer les réservations pour celles de l'utilisateur connecté
        const userReservations = reservationsData.filter(
            (reservation: any) => reservation.idVoyageur === userId
        );

        // Aller chercher les détails pour chaque réservation
        const enrichedReservations = await Promise.all(
            userReservations.map(async (reservation: any) => {
                try {
                    const emplacementResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/emplacements/${reservation.idEmplacement}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!emplacementResponse.ok) {
                        throw new Error(`Erreur lors de la récupération de l'emplacement : ${reservation.idEmplacement}`);
                    }

                    const emplacementData = await emplacementResponse.json();

                    return {
                        nom: emplacementData.nom,
                        adresse: emplacementData.adresse,
                        dateDebut: reservation.dateArrive,
                        dateFin: reservation.dateDepart,
                        idEmplacement: reservation.idEmplacement,
                    };
                } catch (error) {
                    //console.error(`Erreur pour l'emplacement ${reservation.idEmplacement}:`, error);
                    return {
                        nom: "Emplacement inconnu",
                        adresse: "Non disponible",
                        dateDebut: reservation.dateArrive,
                        dateFin: reservation.dateDepart,
                        idEmplacement: reservation.idEmplacement,
                    };
                }
            })
        );

        return enrichedReservations;
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
            console.log('Nouvelle réservation ajoutée :', action.payload);
        },
        removeReservation: (state, action: PayloadAction<number>) => {
            state.reservations.splice(action.payload, 1); // Supprimer une réservation par son index
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.fulfilled, (state, action) => {
                const decodedToken = decodeJWT(action.payload.token);

                if (decodedToken) {
                    state.id = parseInt(decodedToken.sub, 10);
                }

                state.isAuthenticated = true;
                state.username = action.payload.username;
                state.lastname = action.payload.lastname;
                state.firstname = action.payload.firstname;
                state.email = action.payload.email;
                state.phone = action.payload.phone;
                state.token = action.payload.token;
            })
            .addCase(loginAsync.rejected, (state) => {
                state.isAuthenticated = false;
            })
            .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
                const user = action.payload;
                state.id = user.id;
                state.username = user.username;
                state.lastname = user.lastName;
                state.firstname = user.firstName;
                state.email = user.email;
                state.phone = user.phone;
                state.password = user.password || state.password;
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.firstname = action.payload.firstName;
                state.lastname = action.payload.lastName;
                state.password = undefined;
            })
            .addCase(updateUserAsync.rejected, (state, action) => {
                //console.error('Erreur lors de la mise à jour des informations utilisateur :', action.error.message);
            })
            .addCase(fetchUserReservationsAsync.fulfilled, (state, action) => {
                state.reservations = action.payload;
            })
            .addCase(fetchUserReservationsAsync.rejected, (state, action) => {
                console.error('Erreur lors de la récupération des réservations :', action.error.message);
            });
    },
})


export const {setUserName, setLastName, setFirstName ,setEmail, setPhone, setId, login, logout, addReservation, removeReservation} = usersSlice.actions
export default usersSlice.reducer
