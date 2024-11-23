import React, { useState } from 'react';
import { Marker, Callout, CalloutSubview } from 'react-native-maps';
import { Image, View, Text, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types'; // Adjust the path as necessary
import {useTranslation} from "react-i18next";

interface CustomMarkerProps {
    marker: any; // Marqueur contenant les données
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ marker }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [selectedMarker, setSelectedMarker] = useState<any>(null);

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
                title={marker.title}
            >
                <Image
                    source={require('../../../assets/images/tente2.png')}
                    style={{ width: 28, height: 28 }}
                />
                <Callout style={styles.customCallout} onPress={handleReservation}>
                    <View>
                        <Text style={styles.calloutTitle}>{marker.title}</Text>
                        <Text>{marker.description}</Text>
                        <Text>{t('map.price')}: {marker.prix} €</Text>
                        <Text>{t('map.capacity')}: {marker.capacity} {t('map.people')}</Text>
                        <Text>{t('map.amenities_title')}:</Text>
                        {marker.amenities.map((amenity: string, idx: number) => (
                            <Text key={idx}>- {amenity}</Text>
                        ))}
                        <StarRatingDisplay
                            starStyle={{ margin: 0, padding: 0 }}
                            rating={marker.rating}
                            starSize={24}
                        />
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
