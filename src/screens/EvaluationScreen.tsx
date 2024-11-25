import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import StarRating from "react-native-star-rating-widget";
import EvaluationController from "../controllers/EvaluationController";
import CustomButton from "../components/CustomButton";

export default function EvaluationScreen({ route, navigation }: any) {
    const { reservation } = route.params;
    const emplacementId = reservation.emplacementId; // Utilisez l'ID de l'emplacement

    const [rating, setRating] = useState(0);
    const handleRatingChange = (newRating: number) => {
        setRating(Math.round(newRating)); // Arrondir avant de mettre à jour
    };
    const [comment, setComment] = useState("");

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert("Erreur", "Veuillez donner une note.");
            return;
        }

        try {
            // Créer une évaluation et l'envoyer via le contrôleur
            //console.log("Soumission de l'évaluation :", rating, comment, reservation);
            await EvaluationController.submitEvaluation({
                hotelId: reservation.hotelId,
                voyageurId: reservation.voyageurId,
                reservationId: reservation.id,
                emplacementId: reservation.idEmplacement,
                note: rating,
                commentaire: comment,
            });

            navigation.goBack(); // Retour à l'écran précédent
        } catch (error) {
            Alert.alert("Erreur", "Une erreur est survenue lors de la soumission.");
            console.error("Erreur lors de la soumission :", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Évaluez votre séjour à {reservation.nom}</Text>
            <Text>Date d'arrivée : {new Date(reservation.dateDebut).toLocaleDateString()}</Text>
            <Text>Date de départ : {new Date(reservation.dateFin).toLocaleDateString()}</Text>

            <Text style={styles.label}>Note :</Text>
            <StarRating
                rating={rating}
                maxStars={5} // Nombre maximal d'étoiles
                starSize={24} // Taille des étoiles
                onChange={handleRatingChange} // Méthode pour gérer les changements
            />

            <Text style={styles.label}>Commentaire :</Text>
            <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
                placeholder="Laissez un commentaire..."
            />

            <View style={styles.button}>
			    <CustomButton action={handleSubmit} color="#E9D69F" text="Soumettre mon évaluation" />
			</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    label: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: "bold",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    button: {
		width: "50%",
		alignItems: "center",
	},
});