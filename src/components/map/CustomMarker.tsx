import React, { useEffect, useState } from 'react';
import { Marker, Callout, CalloutSubview } from 'react-native-maps';
import { Image, View, Text, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types'; // Adjust the path as necessary
import {useTranslation} from "react-i18next";
import {Emplacement} from "../../models/Emplacement";
import EmplacementController from '../../controllers/EmplacementController';

interface CustomMarkerProps {
    marker: Emplacement; // Marqueur contenant les données
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ marker }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [selectedMarker, setSelectedMarker] = useState<any>(null);
    const [averageNote, setAverageNote] = useState<number | null>(null);


    useEffect(() => {
        const fetchNote = async () => {
            try {
                const note = await EmplacementController.fetchAverageNote(marker.idEmplacement);
                setAverageNote(note);
            } catch (error) {
                console.error("Erreur lors de la récupération de la note moyenne :", error);
            }
        };
    
        fetchNote();
    }, [marker.idEmplacement]);


    const handleReservation = () => {
        navigation.navigate("ReservationScreen", { marker });
    };


    return (
        <>
            {/* Marker avec Callout */}
            <Marker
                coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                }}
                title={marker.nom}
            >
                <Image
                    source={require('../../../assets/images/tente2.png')}
                    style={{ width: 28, height: 28 }}
                />
                <Callout style={styles.customCallout} onPress={handleReservation}>
                    <View>
                        <Text style={styles.calloutTitle}>{marker.nom}</Text>
                        <Text>{marker.description}</Text>
                        <Text>{t('map.price')}: {marker.prixParNuit} €</Text>
                        <Text>{t('map.capacity')}: {marker.capacity} {t('map.people')}</Text>
                        <Text>{t('map.amenities_title')}:</Text>
                        {marker.commodites?.map((amenity: string, idx: number) => (
                                <Text key={idx}>- {amenity}</Text>
                            ))}
                        {averageNote !== null ? (
                            <>
                                <StarRatingDisplay
                                    starStyle={{ margin: 0, padding: 0 }}
                                    rating={averageNote}
                                    starSize={24}
                                />
                            </>
                        ) : (
                            <Text>0 avis</Text> // Message si aucune note
                        )}
                    </View>
                </Callout>
            </Marker>
        </>
    );
};

const styles = StyleSheet.create({
    calloutTitle: {
        fontWeight: 'bold',
    },
    customCallout: {
        objectFit: 'contain',
        width: 200,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50, // Place le bouton en bas de l'écran
        alignSelf: 'center',
        backgroundColor: 'transparent',
    },
    button: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomMarker;
function setAverageNote(note: number) {
    throw new Error('Function not implemented.');
}

