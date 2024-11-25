import { Alert } from "react-native";
import { ReservationRequest } from "../models/Reservation";
import {getApiUrl} from "../utils/api";

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
};
