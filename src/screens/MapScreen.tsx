import {Button, Image, StyleSheet, Text, TextInput, View,TouchableOpacity,Alert} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import MapView, {Marker, Callout} from "react-native-maps";
import * as Location from 'expo-location';
import {LocationObject} from "expo-location";
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Slider from '@react-native-community/slider';
import Collapsible from 'react-native-collapsible';
import Geocoder from 'react-native-geocoding';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '');

// Liste des commodités avec les icônes correspondantes
const amenitiesList = [
    { name: 'Prise électrique', icon: 'power', library: 'MaterialIcons' },
    { name: 'Douche', icon: 'shower', library: 'MaterialCommunityIcons' },
    { name: 'Eau potable', icon: 'local-drink', library: 'MaterialIcons' },
    { name: 'Toilettes', icon: 'toilet', library: 'MaterialCommunityIcons' },
    { name: 'Wi-Fi', icon: 'wifi', library: 'MaterialIcons' },
    { name: 'Barbecue', icon: 'outdoor-grill', library: 'MaterialIcons' },
];



export default function MapScreen() {
    const mapRef = useRef<any>();
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<String | null>( null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
    const [cityName, setCityName] = useState('');
    const [searchRadius, setSearchRadius] = useState(10); // Rayon par défaut en km
    const [cityCoordinates, setCityCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [minCapacity, setMinCapacity] = useState<number>(1);

    const toggleAmenity = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
        } else {
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    const increaseCapacity = () => {
        setMinCapacity(prevCapacity => prevCapacity + 1);
    };

    const decreaseCapacity = () => {
        setMinCapacity(prevCapacity => (prevCapacity > 1 ? prevCapacity - 1 : 1));
    };



    const generateRandomPoint = (latitude : number, longitude : number, radiusInKm:number) => {
        const radiusInDegrees = radiusInKm / 111.32; // Approximation du rayon en degrés

        const u = Math.random();
        const v = Math.random();

        const w = radiusInDegrees * Math.sqrt(u);
        const t = 2 * Math.PI * v;

        const deltaLat = w * Math.cos(t);
        const deltaLng = w * Math.sin(t);

        const newLat = latitude + deltaLat;
        const newLng = longitude + deltaLng;

        return { latitude: newLat, longitude: newLng };
    };




    const generateRandomMarkers = (latitude: number, longitude: number, radiusInKm: number) => {
        const randomMarkers = [];
        const amenitiesList = ['Prise électrique', 'Douche', 'Eau potable', 'Toilettes', 'Wi-Fi', 'Barbecue'];

        // Sélectionner des commodités aléatoires
        const markerAmenities = amenitiesList.filter(() => Math.random() < 0.5); // Environ la moitié des commodités

        // Générer une capacité aléatoire entre 1 et 10
        const capacity = Math.floor(Math.random() * 10) + 1;


        for (let i = 0; i < 20; i++) {
            const randomPoint = generateRandomPoint(latitude, longitude, radiusInKm);
            randomMarkers.push({
                latitude: randomPoint.latitude,
                longitude: randomPoint.longitude,
                title: `Emplacement Bivouac ${i + 1}`,
                description: `Description de l'emplacement Bivouac ${i + 1}`,
                prix: Math.floor(Math.random() * 100) + 1,
                rating: Math.floor(Math.random() * 5) + 1,
                amenities: markerAmenities,
                capacity: capacity,
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
            generateRandomMarkers(location.coords.latitude, location.coords.longitude,searchRadius);
        })();
    }, []);

    const geocodeCityName = async (city: any) => {
        try {
            const json = await Geocoder.from(city);
            if (json.results.length > 0) {
                const location = json.results[0].geometry.location;
                console.log(location);
                return {
                    latitude: location.lat,
                    longitude: location.lng,
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    };



    const handleSearch = async () => {
        if (cityName.trim() === '') {
            Alert.alert('Veuillez entrer un nom de ville.');
            return;
        }

        try {
            // Utiliser une API de géocodage pour obtenir les coordonnées de la ville
            const geocodedLocation = await geocodeCityName(cityName);
            if (geocodedLocation) {
                setCityCoordinates(geocodedLocation);
                generateRandomMarkers(geocodedLocation.latitude, geocodedLocation.longitude, searchRadius);
                // Centrer la carte sur la ville
                mapRef.current.animateToRegion({
                    latitude: geocodedLocation.latitude,
                    longitude: geocodedLocation.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });
            } else {
                Alert.alert('Ville non trouvée. Veuillez vérifier le nom de la ville.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Une erreur s'est produite lors de la recherche de la ville.");
        }
    };

    const getIconComponent = (libraryName : String) => {
        switch (libraryName) {
            case 'MaterialIcons':
                return MaterialIcons;
            case 'MaterialCommunityIcons':
                return MaterialCommunityIcons;
            case 'Ionicons':
                return Ionicons;
            default:
                return MaterialIcons; // Bibliothèque par défaut si aucune n'est spécifiée
        }
    };




    return (
        <View className="flex-1 justify-center">
            {/* Conteneur pour les filtres */}
            <View style={styles.accordionContainer}>
                <TouchableOpacity
                    onPress={() => setIsAccordionExpanded(!isAccordionExpanded)}
                    style={styles.accordionHeader}
                >
                    <Text style={styles.accordionHeaderText}>Filtres de recherche</Text>
                </TouchableOpacity>
                <Collapsible collapsed={!isAccordionExpanded}>
                    <View style={styles.accordionContent}>
                        {/* Champ de saisie pour le nom de la ville */}
                        <TextInput
                            style={styles.input}
                            placeholder="Entrez le nom d'une ville"
                            value={cityName}
                            onChangeText={text => setCityName(text)}
                        />
                        {/* Slider pour le rayon de recherche */}
                        <Text>Rayon de recherche : {searchRadius} km</Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={1}
                            maximumValue={50}
                            step={1}
                            value={searchRadius}
                            onValueChange={value => setSearchRadius(value)}
                        />
                        {/* Sélecteurs de commodités */}
                        <Text className="font-bold ">Commodités :</Text>
                        <View style={styles.amenitiesContainer}>
                            {amenitiesList.map((amenity, index) => {
                                const IconComponent = getIconComponent(amenity.library);
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => toggleAmenity(amenity.name)}
                                        style={[
                                            styles.amenityIconContainer,
                                            selectedAmenities.includes(amenity.name) && styles.amenityIconSelected,
                                        ]}
                                    >
                                        <IconComponent
                                            name={amenity.icon as any}
                                            size={24}
                                            color={selectedAmenities.includes(amenity.name) ? 'black' : 'gray'}
                                        />
                                        <Text
                                            style={{
                                                color: selectedAmenities.includes(amenity.name) ? '#000' : '#888',
                                                marginTop: 5,
                                                textAlign: 'center',
                                                fontSize: 12,
                                            }}
                                        >
                                            {amenity.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {/* Filtre de capacité */}
                        <Text className="font-bold">Capacité minimale :</Text>
                        <View style={styles.capacitySelector}>
                            <TouchableOpacity onPress={decreaseCapacity} style={styles.capacityButton}>
                                <Text style={styles.capacityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.capacityValue}>{minCapacity}</Text>
                            <TouchableOpacity onPress={increaseCapacity} style={styles.capacityButton}>
                                <Text style={styles.capacityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Bouton pour lancer la recherche */}
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={handleSearch}
                        >
                            <Text style={styles.searchButtonText}>Rechercher</Text>
                        </TouchableOpacity>
                    </View>
                </Collapsible>
            </View>

            {/* Carte */}
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
        flex: 1,
    },
    accordionContainer: {
        position: 'absolute',
        top: 10,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        zIndex: 1,
    },
    accordionHeader: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    accordionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    accordionContent: {
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    searchButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    amenityIconContainer: {
        width: '30%',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
        borderRadius: 8,
    },
    amenityIconSelected: {
        backgroundColor: '#e0e0e0',
        borderWidth: 1,
        borderColor: '#000',
    },
    capacitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    capacityButton: {
        width: 40,
        height: 40,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    capacityButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    capacityValue: {
        marginHorizontal: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    calloutContainer: {
        padding: 10,
        maxWidth: 200,
    },
    calloutTitle: {
        fontWeight: 'bold',
    },
});
