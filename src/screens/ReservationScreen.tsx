import React, { useState } from "react";
import { View, Text, TextInput, Button, Platform, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";

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
    const userId = useSelector((state: { users: { id: string } }) => state.users.id); // Récupère l'ID de l'utilisateur depuis Redux
    const [dateDebut, setDateDebut] = useState<Date | null>(null);
    const [dateFin, setDateFin] = useState<Date | null>(null);
    const [showDateDebutPicker, setShowDateDebutPicker] = useState(false);
    const [showDateFinPicker, setShowDateFinPicker] = useState(false);

    const handleReservation = async () => {
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
            const response = await fetch("http://localhost:8090/api/v1/reservation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                Alert.alert("Succès", "Votre réservation a été enregistrée.");
                navigation.goBack(); // Retourne à la carte après la réservation
            } else {
                Alert.alert("Erreur", "Impossible d'effectuer la réservation.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Une erreur est survenue.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Réserver l'emplacement : {marker.title}</Text>
            <Text>ID: {marker.id}</Text>

            <Button title="Date d'arrivée" onPress={() => setShowDateDebutPicker(true)} />
            {dateDebut && <Text>Date d'arrivée: {dateDebut.toLocaleDateString()}</Text>}
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

            <Button title="Date de départ" onPress={() => setShowDateFinPicker(true)} />
            {dateFin && <Text>Date de départ: {dateFin.toLocaleDateString()}</Text>}
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

            <Button title="Confirmer la réservation" onPress={handleReservation} />
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default ReservationScreen;