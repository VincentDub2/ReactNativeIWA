import { store } from "../app/store";
import {User} from "../features/users/usersSlice"; // Importe ton store Redux

/**
 * Récupère l'user depuis Redux
 * @returns L'user ou `undefined` si non connecté
 */
export const getUser = (): User | undefined => {
    return store.getState().users; // Accède à l'user dans le slice Redux
};

/**
 * Récupère l'id de l'user depuis Redux
 * @returns L'id de l'user ou `undefined` si non connecté
 */

export const getUserId = (): number | undefined => {
    return store.getState().users.id; // Accède à l'id de l'user dans le slice Redux
}
