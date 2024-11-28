import React, { useEffect, useState } from 'react';
import { Marker, Callout, CalloutSubview } from 'react-native-maps';
import { Image, View, Text, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types'; // Adjust the path as necessary
import { useTranslation } from "react-i18next";
import { Emplacement } from "../../features/emplacements/emplacementSlice";

interface CustomMarkerProps {
    marker: Emplacement; // Marqueur contenant les données
    mapRef: React.RefObject<any>; // Référence à la carte pour centrer le Marker
}


const CustomMarker: React.FC<CustomMarkerProps> = ({ marker, mapRef }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [selectedMarker, setSelectedMarker] = useState<any>(null);
    const [averageNote, setAverageNote] = useState<number | null>(null);
    const [isClicked, setIsClicked] = useState(false);


    const handleReservation = () => {
        navigation.navigate("ReservationScreen", { marker });
    };

    const handlePress = () => {
        setIsClicked(true);

        // Centrer le Marker en bas de l'écran
        if (mapRef && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: marker.latitude - 0.0015, // Ajuste la latitude pour centrer le Callout
                longitude: marker.longitude,
                latitudeDelta: 0.05, // Garde le même niveau de zoom
                longitudeDelta: 0.05,
            });
        }
        

        // Réinitialiser l'état après 150 ms
        setTimeout(() => setIsClicked(false), 150);
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
                onPress={() => {
                    setIsClicked(true); // Active l'état de clic
                    setTimeout(() => setIsClicked(false), 150); // Réinitialise après 150ms
                    console.log(marker);
                }}
            >
                <View
                    style={[
                        styles.markerIconContainer,
                        isClicked && styles.markerIconClicked, // Applique le style temporaire
                    ]}
                >
                    <Image
                        source={require('../../../assets/images/tente2.png')}
                        style={styles.markerIcon}
                    />
                </View>
                <Callout style={styles.customCallout} onPress={handleReservation}>
                    <View style={styles.calloutContent}>
                        {/* Afficher l'image */}
                        <Image
                            source={{ uri: marker.image }} // Lien de l'image depuis `marker.image`
                            style={styles.calloutImage}
                            resizeMode="cover"
                        />

                        {/* Contenu textuel */}
                        <Text style={styles.calloutTitle}>{marker.nom}</Text>
                        <Text style={styles.calloutDescription}>{marker.description}</Text>
                        <Text style={styles.calloutDetails}>
                            <Text style={styles.calloutHighlight}>{marker.prixParNuit} €</Text>
                        </Text>
                        {/* <Text style={styles.calloutDetails}>
                            {t('map.capacity')}: <Text style={styles.calloutHighlight}>{marker.capacity} {t('map.people')}</Text>
                        </Text> */}

                        {/* Commodités */}
                        {marker.commodites?.map((amenity: string, idx: number) => (
                            <Text key={idx} style={styles.calloutAmenity}>- {amenity}</Text>
                        ))}

                        {/* {marker.note == -1 ? (
                            <StarRatingDisplay
                                starStyle={{ marginVertical: 5 }}
                                rating={marker.note}
                                starSize={24}
                            />
                        ) : (
                            <Text style={styles.calloutNoReviews}>{t('map.no_reviews')}</Text>
                        )} */}


                        {marker.note == -1 ? (
                            <Text style={styles.calloutNoReviews}>{t('map.no_reviews')}</Text>

                        ) : (
                            <StarRatingDisplay
                                starStyle={{ marginVertical: 5 }}
                                rating={marker.note}
                                starSize={24}
                            />
                        )}


                        <Text style={styles.calloutLearnMore}>
                            {t('map.learn_more')}
                        </Text>

                    </View>
                </Callout>
            </Marker>



        </>
    );
};

const styles = StyleSheet.create({
    markerIconContainer: {
        backgroundColor: 'white', // Cercle blanc par défaut
        borderRadius: 20, // Forme circulaire
        padding: 5, // Espacement autour de l'image
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // Ombre
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // Ombre pour Android
    },
    markerIconClicked: {
        backgroundColor: '#e3d2a1', // Couleur temporaire lors du clic
    },
    markerIcon: {
        width: 28,
        height: 28,
    },
    customCallout: {
        width: 300, // Plus spacieux
        // backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,
        // elevation: 3,
    },
    calloutContent: {
        alignItems: 'flex-start', // Alignement du contenu
        marginBottom: 15,

    },
    calloutImage: {
        width: '91%', // Occupe toute la largeur
        height: 130,
        borderRadius: 6,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    calloutDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    calloutDetails: {
        fontSize: 14,
        marginBottom: 5,
    },
    calloutHighlight: {
        fontWeight: 'bold',
        color: '#2196F3',
    },
    calloutAmenitiesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
    },
    calloutAmenity: {
        fontSize: 13,
        color: '#555',
    },
    calloutNoReviews: {
        fontSize: 13,
        color: '#888',
        marginTop: 10,
    },

    calloutLearnMore: {
        fontSize: 14,
        color: '#f0ac4e', // Jaune
        textAlign: 'center', // Centré horizontalement
        marginTop: 10, // Espace au-dessus du texte
        fontWeight: 'bold',
    },

});


export default CustomMarker;
function setAverageNote(note: number) {
    throw new Error('Function not implemented.');
}

