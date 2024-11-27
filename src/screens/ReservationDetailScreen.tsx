import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { ReservationController } from "../controllers/ReservationController";
import { fetchUserReservationsAsync } from "../features/users/usersSlice";

export default function ReservationDetailScreen() {
    type RouteParams = {
        reservationId: string;
    };

    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const { reservationId } = route.params!;
    const token = useSelector((state: RootState) => state.users.token);

    const handleDelete = async () => {
        const success = await ReservationController.deleteReservation(reservationId);
        if (success) {
            dispatch(fetchUserReservationsAsync());
            navigation.goBack(); // Retour à l'écran précédent
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>Souhaitez-vous supprimer cette réservation ?</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    questionText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    deleteButton: {
        backgroundColor: "red",
        width: 200, // Largeur du bouton
        height: 50, // Hauteur du bouton
        justifyContent: "center", // Centre verticalement
        alignItems: "center", // Centre horizontalement
        borderRadius: 8, // Coins arrondis
        elevation: 5, // Ombre pour Android
        shadowColor: "#000", // Ombre pour iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    deleteButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});