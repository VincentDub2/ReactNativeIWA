import { getToken } from "../utils/auth";
import axios from "axios";
import { Alert } from "react-native";
import { Evaluation } from "../models/Evaluation";

export default class EvaluationController {

    static async submitEvaluation(evaluation: {
        hotelId: number;
        voyageurId: number;
        reservationId: number;
        emplacementId: number;
        note: number;
        commentaire: string;
    }): Promise<void> {
        try {
            const token = getToken(); // Récupérer le token utilisateur
            if (!token) {
                Alert.alert("Erreur", "Utilisateur non authentifié.");
                return;
            }

            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/evaluation`,
                {
                    hoteId: evaluation.hotelId,
                    voyageurId: evaluation.voyageurId,
                    reservationId: evaluation.reservationId,
                    emplacementId: evaluation.emplacementId,
                    note: evaluation.note,
                    commentaire: evaluation.commentaire,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                Alert.alert("Succès", "Votre évaluation a été soumise avec succès !");
            } else {
                console.error("Erreur lors de la soumission :", response.status);
                Alert.alert("Erreur", "Une erreur est survenue lors de la soumission de votre évaluation.");
            }
        } catch (error: any) {
            console.error("Erreur lors de la soumission :", error);
            Alert.alert("Erreur", error.message || "Une erreur est survenue.");
        }
    }

}
