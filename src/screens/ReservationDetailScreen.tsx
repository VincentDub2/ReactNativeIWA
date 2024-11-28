import React, {useEffect, useRef, useState} from "react";
import {View, Text, Button, StyleSheet, TouchableOpacity, Image, Platform, ScrollView} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { ReservationController } from "../controllers/ReservationController";
import { fetchUserReservationsAsync } from "../features/users/usersSlice";
import {fetchOneEmplacementAsync} from "../features/emplacements/emplacementSlice";
import MapView, {Marker} from "react-native-maps";
import {StarRatingDisplay} from "react-native-star-rating-widget";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import {Calendar} from "react-native-calendars";

export default function ReservationDetailScreen() {
    type RouteParams = {
        reservationId: string;
    };

    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const dispatch = useDispatch<AppDispatch>();
    const [markedDates, setMarkedDates] = useState({});



    const navigation = useNavigation();
    const { reservationId } = route.params!;
    const mapRef = useRef<any>();
    const token = useSelector((state: RootState) => state.users.token);
    const userId = useSelector((state: RootState) => state.users.id);
    const reservation = useSelector((state: RootState) => state.users.reservations.find(reservation => reservation.idReservation === reservationId));
    const marker = useSelector((state: RootState) => state.emplacements.emplacementView);
    const allReservations = useSelector((state: RootState) => state.users.reservations);
    const markerStatus = useSelector((state: RootState) => state.emplacements.status);
    const [messageSent, setMessageSent] = useState(false);

    useEffect(() => {
        dispatch(fetchOneEmplacementAsync(reservation?.idEmplacement || 1));
    }, [dispatch, reservation?.idEmplacement]);

    const handleDelete = async () => {
        const success = await ReservationController.deleteReservation(reservationId);
        if (success) {
            dispatch(fetchUserReservationsAsync());
            navigation.goBack(); // Retour à l'écran précédent
        }
    };


    useEffect(() => {
        if (mapRef.current && marker) {
            mapRef.current.animateToRegion({
                latitude: marker.latitude,
                longitude: marker.longitude,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
            });
        }
    }, [marker]);

    const handleContactButton = async (hostId: number) => {
        try {
            let conversationId;
            const responseConversations = await axios.get(
                `${process.env.EXPO_PUBLIC_API_URL}/messages/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const conversations = responseConversations.data;
            const existingConversation = conversations.find(
                (conv: any) =>
                    (conv.personOneId === userId && conv.personTwoId === hostId) ||
                    (conv.personOneId === hostId && conv.personTwoId === userId),
            );

            if (existingConversation) {
                conversationId = existingConversation.id;
            } else {
                const responseCreateConversation = await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URL}/messages/conversation`,
                    null,
                    {
                        params: {
                            personOneId: userId,
                            personTwoId: hostId,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                conversationId = responseCreateConversation.data.id;
            }
            const message = new URLSearchParams();
            message.append("conversationId", conversationId.toString());
            message.append("senderId", userId.toString());
            message.append("contenu", "quack!");
            await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/messages/send`,
                message,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log("Message envoyé : 'quack !'");
            setMessageSent(true);
        } catch (error) {
            console.error("Erreur lors de la gestion du bouton de contact", error);
            console.log("Une erreur s'est produite lors de l'envoi du message.");
        }
    };

    const generateAvailabilityDates = (start, end) => {
        const markedDates = {};
        let currentDate = new Date(start);
        const endDate = new Date(end);

        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            markedDates[dateString] = {
                color: '#b6e9f2', // Bleu clair pour disponibilité
                textColor: 'black',
                startingDay: dateString === start,
                endingDay: dateString === end,
            };
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return markedDates;
    };

    const handleDayPress = (day) => {
        const dateStr = day.dateString;
        if (markedDates[dateStr] && markedDates[dateStr].color === '#3b98a8') {
            console.log(`Jour réservé cliqué : ${dateStr}`);
        }
    };

    useEffect(() => {
        if (reservation) {
            setMarkedDates(generateAvailabilityDates(reservation.dateDebut,reservation.dateFin));
        }
    }, [reservation]);


    if (markerStatus === "loading" || !reservation) {
        return (
            <View style={styles.container}>
                <Text>Chargement de l'emplacement...</Text>
            </View>
        );
    }

    if (markerStatus === "failed") {
        return (
            <View style={styles.container}>
                <Text>Erreur lors de la récupération de l'emplacement.</Text>
            </View>
        );
    }

    if (!marker) {
        return (
            <View style={styles.container}>
                <Text>Aucun emplacement trouvé.</Text>
            </View>
        );
    }


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Image de l'emplacement */}
            <Text style={styles.mainTitle}>Détails de la réservation</Text>
            <Image
                source={typeof marker?.image === "string" ? { uri: marker.image } : null}
                style={styles.image}
            />
            {/* Nom de l'emplacement */}
            <Text style={styles.title}>{marker?.nom}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reservation</Text>
                <Calendar
                    markingType="period"
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    theme={{
                        selectedDayBackgroundColor: '#f0ad4e',
                        todayTextColor: '#007bff',
                    }}
                    monthFormat={'MMMM yyyy'}
                    firstDay={1}
                    locale={'fr'}
                />
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#b6e9f2' }]} />
                        <Text style={styles.legendText}>Période reservé</Text>
                    </View>
                </View>
            </View>

            {/* Section Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{marker?.description}</Text>
            </View>

            {/* Section Adresse */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Adresse</Text>
                <Text style={styles.address}>{marker?.adresse}</Text>
            </View>

            {/* Section Adresse */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Commoditées</Text>
                <View>
                    {marker?.commodites.map((commodite, index) => (
                        <Text key={index} style={styles.address}>
                            {" "}
                            {commodite}
                        </Text>
                    ))}
                </View>
            </View>

            {/* Section Localisation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Localisation</Text>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                        latitudeDelta: 0.08,
                        longitudeDelta: 0.08,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }}
                        title={marker.nom}
                        description={marker.adresse}
                    />
                </MapView>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contacter l'hôte</Text>
                <TouchableOpacity
                    style={styles.hostButton}
                    onPress={() => {
                        if (!messageSent) handleContactButton(marker.idHote);
                    }}
                >
                    <Text style={styles.hostButton}>
                        {messageSent ? "Message envoyé" : "Envoyer un message"}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Moyenne des avis</Text>
                <View className="items-center">
                    <StarRatingDisplay rating={marker.note || 0} />
                </View>
                <View>
                    <Text style={styles.sectionTitle}>Dernier avis</Text>
                </View>
                {marker.evaluations.length > 0 ? (
                    marker.evaluations.map((evaluation, index) => (
                        <View key={index}>
                            <Text style={styles.description}>{evaluation.commentaire}</Text>
                            <StarRatingDisplay rating={evaluation.note} />
                        </View>
                    ))
                ) : (
                    <Text style={styles.description}>Aucun avis pour le moment</Text>
                )}
            </View>
            <View style={styles.container}>
                <Text style={styles.questionText}>Souhaitez-vous annulez cette réservation ?</Text>
                <TouchableOpacity className="bg-primary-100 font-bold rounded items-center p-4" onPress={handleDelete}>
                    <Text className="text-2xl color-white">Annulez</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: "bold",

        color: "#333",
        marginBottom: 15,
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
    },
    dateText: {
        marginTop: 10,
        fontSize: 16,
        color: "#333",
    },
    button: {
        backgroundColor: "#cccccc", // Couleur des boutons principaux
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: "center",
        width: "80%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    confirmButton: {
        backgroundColor: "#f0ac4e", // Couleur du bouton de confirmation
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 9,
        marginTop: 20,
        width: "80%",
        alignItems: "center",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
        textAlign: "center",
    },
    section: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "black",
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 5,
    },
    description: {
        fontSize: 16,
        color: "#666",
        lineHeight: 22,
    },
    address: {
        fontSize: 16,
        color: "#555",
    },
    map: {
        height: 200,
        borderRadius: 10,
    },
    hostButton: {
        backgroundColor: "#f0ac4e", // Couleur du bouton
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        width: "80%",
        alignSelf: "center",
    },
    hostButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    hostButton2: {
        backgroundColor: "#e3d2a1", // Couleur du bouton
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
        width: "80%",
        alignSelf: "center",
    },
    legendContainer: {
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    legendColor: {
        width: 15,
        height: 15,
        borderRadius: 3,
        marginRight: 5,
    },
    legendText: {
        fontSize: 14,
        color: '#333',
    },
});
