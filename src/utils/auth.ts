import { store } from "../app/store"; // Importe ton store Redux

/**
 * Récupère le token depuis Redux
 * @returns Le token de l'utilisateur ou `undefined` si non connecté
 */
export const getToken = (): string | undefined => {
    return store.getState().users.token; // Accède au token dans le slice Redux
};
