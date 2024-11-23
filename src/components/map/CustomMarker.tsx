import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { Image, View, Text, StyleSheet, Alert, Button } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types'; // Adjust the path as necessary
import {useTranslation} from "react-i18next";

interface CustomMarkerProps {
    marker: any;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ marker }) => {
    
    const {t} = useTranslation();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    return (
        <Marker
            coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
            }}
            title={marker.title}
        >
            <Image source={require('../../../assets/images/tente2.png')} style={{ width: 28, height: 28 }} />
            {/* Ajouter un Callout pour afficher plus d'informations */}
            <Callout style={styles.customCallout}>
                <View>
                    <Text className="text-bold text-lg">{marker.title}</Text>
                    <Text>{marker.description}</Text>
                    <Text>{t('map.price')}: {marker.prix} €</Text>
                    <Text>{t('map.capacity')}: {marker.capacity} {t('map.people')}</Text>
                    <Text>{t('map.amenities_title')}:</Text>
                    <Button
                        title="Réserver"
                        onPress={() =>
                            navigation.navigate("ReservationScreen", { marker })
                        }
                    />
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
    }
});

export default CustomMarker;
