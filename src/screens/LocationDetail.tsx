import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import ConfirmationModal from '../components/ConfirmationModal'; // Import de la modale de confirmation
import CustomButton from '../components/CustomButton';
import { deleteLocationAsync } from '../features/locations/locationSlice';
import axios from 'axios';


const LocationDetail = () => {
    const route = useRoute();
    const [reservations, setReservations] = useState([]);

    const { idEmplacement } = route.params;
    console.log('idEmplacement', idEmplacement);
    console.log('route', route.params);
    const token = useSelector((state: RootState) => state.users.token); // Récupérer le token depuis Redux


    const location = useSelector((state: RootState) =>
        state.locations.locations.find(loc => loc.idEmplacement === idEmplacement)
    );

    useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/reservation/emplacement/${idEmplacement}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => setReservations(data));
    }, [idEmplacement, token]);


    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [isModalVisible, setModalVisible] = useState(false); // État pour gérer la modale

    if (!location) {
        return (
            <View style={styles.container}>
                <Text style={styles.notFound}>Emplacement introuvable. Il a peut-être été supprimé ou modifié.</Text>
            </View>
        );
    }

    const handleEditLocation = () => {
        navigation.navigate('EditLocation', { location });
    };

    const confirmDeleteLocation = () => {
        setModalVisible(false); // Ferme la modale
        dispatch(deleteLocationAsync(location.idEmplacement)); // Suppression via le store
        navigation.goBack();
    };

    const handleDeleteLocation = () => {
        setModalVisible(true); // Ouvre la modale
    };

    const handleReservationClick = (idVoyageur) => {
        console.log(`ID de l'utilisateur : ${idVoyageur}`);
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

    const generateReservationDates = (reservations) => {
        const reservationDates = {};

        reservations.forEach((reservation) => {
            const periodStart = new Date(reservation.dateArrive);
            const periodEnd = new Date(reservation.dateDepart);

            for (
                let currentDate = new Date(periodStart);
                currentDate <= periodEnd;
                currentDate.setDate(currentDate.getDate() + 1)
            ) {
                const futureDate = new Date(currentDate); // Décalage d'un jour
                futureDate.setDate(futureDate.getDate() + 1);

                const dateString = futureDate.toISOString().split('T')[0];

                reservationDates[dateString] = {
                    color: '#3b98a8', // Bleu foncé pour les jours réservés
                    textColor: 'white', // Texte blanc pour une meilleure visibilité
                };
            }
        });

        return reservationDates;
    };




    const markedDates = {
        ...generateAvailabilityDates(location.dateDebut, location.dateFin),
        ...generateReservationDates(reservations),
    };

    const handleDayPress = (day) => {
        const dateStr = day.dateString;
        if (markedDates[dateStr] && markedDates[dateStr].color === '#3b98a8') {
            console.log(`Jour réservé cliqué : ${dateStr}`);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image
                    source={typeof location.image === 'string' ? { uri: location.image } : null}
                    style={styles.image}
                />
                <Text style={styles.title}>{location.nom}</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{location.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Adresse</Text>
                    <Text style={styles.address}>{location.adresse}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Localisation</Text>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.08,
                            longitudeDelta: 0.08,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            title={location.nom}
                            description={location.adresse}
                        />
                    </MapView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Disponibilité</Text>
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
                            <Text style={styles.legendText}>Période de disponibilité</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#3b98a8' }]} />
                            <Text style={styles.legendText}>Jours réservés</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Réservations</Text>
                    {reservations.length === 0 ? (
                        <Text style={styles.noReservationText}>Aucune réservation disponible pour cet emplacement.</Text>
                    ) : (
                        reservations.map((reservation) => (
                            <View
                                key={reservation.idReservation}
                                style={styles.reservationCard}
                                onClick={() => handleReservationClick(reservation.idVoyageur)}
                            >
                                <Text style={styles.reservationText}>Voyageur: {reservation.idVoyageur}</Text>
                                <Text style={styles.reservationText}>Arrivée: {reservation.dateArrive.split('T')[0]}</Text>
                                <Text style={styles.reservationText}>Départ: {reservation.dateDepart.split('T')[0]}</Text>
                                <Text style={styles.reservationText}>Prix: {reservation.prix.toFixed(2)}€</Text>
                            </View>
                        ))
                    )}
                </View>

                <CustomButton
                    action={handleDeleteLocation}
                    color="#d9534f"
                    text="Supprimer l'emplacement"
                />
            </ScrollView>

            <View style={styles.buttonContainer}>
                <CustomButton
                    action={handleEditLocation}
                    color="#f0ad4e"
                    text="Modifier l'emplacement"
                />
            </View>

            <ConfirmationModal
                visible={isModalVisible}
                message="Êtes-vous sûr de vouloir supprimer cet emplacement ?"
                onConfirm={confirmDeleteLocation}
                onCancel={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 80,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    section: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
    },
    address: {
        fontSize: 16,
        color: '#555',
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    map: {
        height: 200,
        borderRadius: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        left: 30,
        right: 30,
    },
    notFound: {
        fontSize: 18,
        color: '#d9534f',
        textAlign: 'center',
        marginTop: 50,
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
    reservationCard: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#e3f2fd', // Couleur de fond pour le style
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reservationText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    noReservationText: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
    },

});

export default LocationDetail;
