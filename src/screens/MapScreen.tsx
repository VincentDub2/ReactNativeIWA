import {Button, Image, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import MapView, {Marker, Callout} from "react-native-maps";
import * as Location from 'expo-location';
import {LocationObject} from "expo-location";
import { StarRatingDisplay } from 'react-native-star-rating-widget';

export default function MapScreen() {
    const mapRef = useRef<any>();
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<String | null>( null);
    const [markers, setMarkers] = useState<any[]>([]);


    // Fonction pour générer des marqueurs aléatoires autour de la localisation actuelle
    const generateRandomMarkers = (latitude: number, longitude: number) => {
        const randomMarkers = [];
        for (let i = 0; i < 20; i++) {
            const latOffset = (Math.random() - 0.4) * 0.1; // Variation légère en latitude
            const lonOffset = (Math.random() - 0.4) * 0.1; // Variation légère en longitude
            randomMarkers.push({
                latitude: latitude + latOffset,
                longitude: longitude + lonOffset,
                title: `Emplacement Bivouac ${i + 1}`,
                description: `Description de l'emplacement Bivouac ${i + 1}`,
                prix: Math.floor(Math.random() * 100) + 1, // Génération d'un prix aléatoire entre 1 et 100
                rating: Math.floor(Math.random() * 5) + 1, // Génération d'une note aléatoire entre 1 et 5
            });
        }
        setMarkers(randomMarkers);
    };

    useEffect(() => {
        (async () => {
            // Demande d'autorisation pour la localisation
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Obtenir la localisation actuelle
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            generateRandomMarkers(location.coords.latitude, location.coords.longitude);
        })();
    }, []);


    return (
        <View className="flex justify-center">
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: location?.coords?.latitude || 37.78825,
                    longitude: location?.coords?.longitude || -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
            >
                {/* Afficher les marqueurs aléatoires */}
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }}
                        title={marker.title}
                   >
                        <Image source={require('../../assets/images/tente2.png')} style={{ width: 28, height: 28 }} />
                        {/* Ajouter un Callout pour afficher plus d'informations */}
                        <Callout>
                            <View className="flex p-2 max-h-48 space-y-6">
                                <Text className="font-bold">{marker.title}</Text>
                                <Text>{marker.description}</Text>
                                <Text>Prix: {marker.prix} €</Text>
                                <StarRatingDisplay
                                    starStyle={{margin: 0, padding: 0, marginRight: 0,marginLeft: 0}}
                                    rating={marker.rating}
                                    starSize={24}
                                />
                                </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}



const styles = StyleSheet.create({

    map: {
        height: '100%',
        width: '100%',
    },
});
