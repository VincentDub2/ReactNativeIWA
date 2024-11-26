import { store } from "../app/store";
import { User } from "../models/User";

/**
 * Récupère l'utilisateur depuis Redux
 * @returns L'utilisateur ou `undefined` si non connecté
 */
export const getUser = (): User | undefined => {
    try {
        const user = store.getState().users;
        if (!user) {
            console.error("Utilisateur non authentifié");
            return undefined;
        }
        return user;
    }catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        return undefined;
    }
};

/**
 * Récupère l'id de l'utilisateur depuis Redux
 * @returns L'id ou `undefined` si non connecté
 */
export const getUserId = (): number | undefined => {
    try {
        const id = store.getState().users.id;
        if (!id) {
            console.error("Utilisateur non authentifié");
            return undefined;
        }
        return id;
    }
    catch (error) {
        console.error("Erreur lors de la récupération de l'id :", error);
        return undefined;
    }
}
