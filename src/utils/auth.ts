import { store } from "../app/store"; // Importe ton store Redux

/**
 * Récupère le token depuis Redux
 * @returns Le token de l'utilisateur ou `undefined` si non connecté
 */
export const getToken = (): string | undefined => {
    try {
        const token = store.getState().users.token; // Accède au token dans le slice Redux
        if (!token) {
            console.error("Utilisateur non authentifié");
            return undefined;
        }
        return token;
    }catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return undefined;
    }
};
