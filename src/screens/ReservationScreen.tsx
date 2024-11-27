import React, { useState } from "react";
import { View, Text, Platform, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import {Emplacement} from "../models/Emplacement";
import {ReservationRequest} from "../models/Reservation";
import {ReservationController} from "../controllers/ReservationController";
import { addReservation } from "../features/users/usersSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../types";

type RouteParams = {
   marker: Emplacement;
};

const ReservationScreen = () => {
    const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
    const { marker } = route.params;
    const [dateDebut, setDateDebut] = useState<Date | null>(null);
    const [dateFin, setDateFin] = useState<Date | null>(null);
    const [showDateDebutPicker, setShowDateDebutPicker] = useState(false);
    const [showDateFinPicker, setShowDateFinPicker] = useState(false);
    
    type ReservationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReservationScreen'>;
    
    const navigation = useNavigation<ReservationScreenNavigationProp>();

    const token = useSelector((state: RootState) => state.users.token);
    const userId = useSelector((state: RootState) => state.users.id);

    const formatDateToLocalDateTime = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}T00:00:00`;
    };

    const generateRandomId = (): string => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const handleReservation = async () => {
        if (!token) {
            Alert.alert("Erreur", "Vous devez être connecté pour effectuer cette action.");
            return;
        }

        if (!dateDebut || !dateFin) {
            Alert.alert("Erreur", "Veuillez sélectionner les dates.");
            return;
        }

        const reservationId = generateRandomId();

        const body: ReservationRequest = {
            idEmplacement: marker.idEmplacement,
            idVoyageur: userId,
            dateArrive: formatDateToLocalDateTime(dateDebut),
            dateDepart: formatDateToLocalDateTime(dateFin),
            prix: marker.prixParNuit,
        };
        await ReservationController.makeReservation(body, token);
        dispatch(
            addReservation({
                id: reservationId,
                nom: marker.nom,
                dateDebut: formatDateToLocalDateTime(dateDebut),
                dateFin: formatDateToLocalDateTime(dateFin),
                adresse: marker.adresse,
                idEmplacement: marker.idEmplacement,
                idReservation: undefined
            })
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {/* Titre principal */}
                <Text style={styles.mainTitle}>Réservation de l'emplacement</Text>
                {/* Nom et description */}
                <Text style={styles.emplacementName}>{marker.nom}</Text>
                <Text style={styles.emplacementDescription}>{marker.description}</Text>

                {/* Bouton pour choisir la date d'arrivée */}
                <TouchableOpacity style={styles.button} onPress={() => setShowDateDebutPicker(true)}>
                    <Text style={styles.buttonText}>Choisir ma date d'arrivée</Text>
                </TouchableOpacity>
                {dateDebut && (
                    <Text style={styles.dateText}>
                        Date d'arrivée : {dateDebut.toLocaleDateString()}
                    </Text>
                )}
                {showDateDebutPicker && (
                    <DateTimePicker
                        value={dateDebut || new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={(event, selectedDate) => {
                            setShowDateDebutPicker(false);
                            if (selectedDate) setDateDebut(selectedDate);
                        }}
                    />
                )}

                {/* Bouton pour choisir la date de départ */}
                <TouchableOpacity style={styles.button} onPress={() => setShowDateFinPicker(true)}>
                    <Text style={styles.buttonText}>Choisir ma date de départ</Text>
                </TouchableOpacity>
                {dateFin && (
                    <Text style={styles.dateText}>
                        Date de départ : {dateFin.toLocaleDateString()}
                    </Text>
                )}
                {showDateFinPicker && (
                    <DateTimePicker
                        value={dateFin || new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={(event, selectedDate) => {
                            setShowDateFinPicker(false);
                            if (selectedDate) setDateFin(selectedDate);
                        }}
                    />
                )}

                {/* Bouton de confirmation */}
                <TouchableOpacity style={styles.confirmButton} onPress={handleReservation}>
                    <Text style={styles.confirmButtonText}>Confirmer la réservation</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        marginBottom: 20,
    },
    emplacementName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#8B4513",
        marginBottom: 10,
        textAlign: "center",
    },
    emplacementDescription: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
        textAlign: "center",
    },
    dateText: {
        marginTop: 10,
        fontSize: 16,
        color: "#333",
    },
    button: {
        backgroundColor: "#d2b48c", // Couleur des boutons principaux
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: "center",
        width: "80%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    confirmButton: {
        backgroundColor: "#8B4513", // Couleur du bouton de confirmation
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 9,
        marginTop: 20,
        width: "80%",
        alignItems: "center",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ReservationScreen;
function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}

