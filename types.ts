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
    idLocation: number;
    idHost: number;
    name: string;
    address: string;
    description: string;
    amenities: string[];
    image: any;
    latitude: number;
    longitude: number;
    pricePerNight: number;
    dispo: {
        startDate: string;
        endDate: string;
    };
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
};
