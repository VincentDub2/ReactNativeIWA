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

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    NavigationTab: undefined;
};
