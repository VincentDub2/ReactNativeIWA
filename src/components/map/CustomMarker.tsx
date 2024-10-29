import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { Image, View, Text, StyleSheet } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

interface CustomMarkerProps {
    marker: any;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ marker }) => {
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
                    <Text>Prix: {marker.prix} €</Text>
                    <Text>Capacité : {marker.capacity} personnes</Text>
                    <Text>Commodités :</Text>
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
