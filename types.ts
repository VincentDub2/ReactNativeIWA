// types.ts

// Type de l'état global
export interface UserState {
    name: string;
}


// Définition des types d'actions
export const SET_NAME = 'SET_NAME';

// Type des actions possibles
export interface SetNameAction {
    type: typeof SET_NAME;
    payload: string;
}

// Union des types d'actions
export type UserActionTypes = SetNameAction;


export interface Location {
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

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    NavigationTab: undefined;
    LocationDetail: { location: Partial<Location> }; // Utilise Partial pour rendre les propriétés optionnelles
    AddLocation: undefined;
    EditLocation: { location: Partial<Location> };
    Users: undefined;
    Messagerie: undefined;
    ReservationScreen: { marker: any };
    EvaluationScreen: undefined;
    MapScreen: undefined;
};
