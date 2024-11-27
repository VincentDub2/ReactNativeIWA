import { Alert } from "react-native";
import { ReservationRequest } from "../models/Reservation";
import {getApiUrl} from "../utils/api";
import { getToken } from "../utils/auth";

const apiBaseUrl = getApiUrl();
export const ReservationController = {
    async getReservations(token: string): Promise<any[]> {
        try {
            const response = await fetch(`${apiBaseUrl}/reservation`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data; // Renvoie la liste des réservations
            } else {
                const errorText = await response.text();
                Alert.alert("Erreur", `Impossible de récupérer les réservations : ${errorText}`);
                return [];
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Une erreur est survenue lors de la récupération des réservations.");
            return [];
        }
    },

    async makeReservation(body: ReservationRequest, token: string): Promise<void> {
        try {
            // Étape 1 : Récupérer les réservations existantes
            const existingReservations = await this.getReservations(token);

            // Étape 2 : Vérifier si une réservation existe déjà avec les mêmes idEmplacement et idVoyageur
            const today = new Date();

            const hasConflict = existingReservations.some((reservation) => {
                const existingEndDate = new Date(reservation.dateDepart);

                // Vérifie si l'idEmplacement et l'idVoyageur correspondent ET si la date de fin n'est pas dépassée
                return (
                    reservation.idEmplacement === body.idEmplacement &&
                    reservation.idVoyageur === body.idVoyageur &&
                    existingEndDate >= today // Conflit si la réservation existante est encore valide
                );
            });

            if (hasConflict) {
                Alert.alert(
                    "Erreur",
                    "Une réservation pour cet emplacement et ce voyageur est encore active."
                );
                return;
            }

            // Étape 3 : Ajouter la réservation si elle n'existe pas
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
            Alert.alert("Erreur", "Une erreur est survenue lors de l'ajout de la réservation.");
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
