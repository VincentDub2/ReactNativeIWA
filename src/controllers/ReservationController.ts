import { Alert } from "react-native";
import { ReservationRequest } from "../models/Reservation";
import {getApiUrl} from "../utils/api";
import { getToken } from "../utils/auth";

const apiBaseUrl = getApiUrl();
export const ReservationController = {
    async makeReservation(body: ReservationRequest, token: string): Promise<void> {
        try {
            const response = await fetch(`${apiBaseUrl}/reservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert("Félicitations !", "Votre réservation a été effectuée avec succès !");
            } else {
                const errorText = await response.text();
                Alert.alert("Erreur", `Échec : ${errorText}`);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Une erreur est survenue.");
        }
    },

    async deleteReservation(id: any): Promise<boolean> {
        try {
            const token = getToken(); // Récupère le token depuis Redux
            if (!token) {
                Alert.alert("Erreur", "Vous devez être connecté pour effectuer cette action.");
                return false;
            }

            const response = await fetch(`${apiBaseUrl}/reservation/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                Alert.alert("Succès", "La réservation a été supprimée avec succès.");
                return true;
            } else {
                const errorText = await response.text();
                Alert.alert("Erreur", `Échec de suppression : ${errorText}`);
                return false;
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Une erreur est survenue.");
            return false;
        }
    },
};
