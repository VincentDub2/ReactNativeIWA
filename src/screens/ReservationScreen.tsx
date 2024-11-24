import React, { useState } from "react";
import { View, Text, TextInput, Button, Platform, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

type RouteParams = {
    marker: {
        id: string;
        title: string;
        prix: number;
    };
};

const ReservationScreen = () => {
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const navigation = useNavigation();
    const { marker } = route.params; // Récupère les infos du marqueur sélectionné
    const [dateDebut, setDateDebut] = useState<Date | null>(null);
    const [dateFin, setDateFin] = useState<Date | null>(null);
    const [showDateDebutPicker, setShowDateDebutPicker] = useState(false);
    const [showDateFinPicker, setShowDateFinPicker] = useState(false);
    const token = useSelector((state: RootState) => {
        return state.users.token;
    });
    const userId = useSelector((state: { users: { id: string } }) => state.users.id); // Récupère l'ID de l'utilisateur depuis Redux

    const handleReservation = async () => {
        if (!token) {
            Alert.alert("Erreur", "Vous devez être connecté pour effectuer cette action.");
            return;
        }

        if (!dateDebut || !dateFin) {
            Alert.alert("Erreur", "Veuillez sélectionner les dates.");
            return;
        }

        const body = {
            idEmplacement: marker.id,
            idVoyageur: userId,
            dateArrive: dateDebut.toISOString(),
            dateDepart: dateFin.toISOString(),
            prix: marker.prix,
        };

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert("Félicitation !", "Votre réservation a été effectuée avec succès!");
            } else {
                const errorText = await response.text();
                Alert.alert("Erreur", `Échec : ${errorText}`);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Une erreur est survenue.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Réserver l'emplacement : {marker.title}
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setShowDateDebutPicker(true)}
                >
                    <Text style={styles.buttonText}>Choisir ma date d'arrivée</Text>
                </TouchableOpacity>
                {dateDebut && (
                    <Text style={styles.dateText}>
                        Date d'arrivée: {dateDebut.toLocaleDateString()}
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

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setShowDateFinPicker(true)}
                >
                    <Text style={styles.buttonText}>Choisir ma date de départ</Text>
                </TouchableOpacity>
                {dateFin && (
                    <Text style={styles.dateText}>
                        Date de départ: {dateFin.toLocaleDateString()}
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

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleReservation}
                >
                    <Text style={styles.confirmButtonText}>
                        Confirmer la réservation
                    </Text>
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
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
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
        borderRadius: 30,
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
        borderRadius: 30,
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