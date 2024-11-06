import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, MapEvent } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import amenitiesData from '../data/amenities.json';
import { addLocation } from '../features/locations/locationSlice';
import CustomButton from './CustomButton';

interface LocationFormProps {
    onSubmit: () => void;
    initialValues?: {
        idLocation: number;
        name: string;
        address: string;
        description: string;
        amenities: string[];
        latitude: number;
        longitude: number;
        pricePerNight: number;
    };
}

const LocationForm: React.FC<LocationFormProps> = ({ onSubmit, initialValues }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState(initialValues?.name || '');
    const [address, setAddress] = useState(initialValues?.address || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [pricePerNight, setPricePerNight] = useState(initialValues?.pricePerNight.toString() || '');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialValues?.amenities || []);
    const [coordinate, setCoordinate] = useState({
        latitude: initialValues?.latitude || 37.78825,
        longitude: initialValues?.longitude || -122.4324,
    });
    const [initialRegion, setInitialRegion] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const userLocation = await Location.getCurrentPositionAsync({});
                setInitialRegion({
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                setCoordinate({
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                });
            }
        })();
    }, []);

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
        );
    };

    const handleMapPress = (event: MapEvent) => {
        setCoordinate(event.nativeEvent.coordinate);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleAddLocation = () => {
        if (name && address && description && pricePerNight && selectedAmenities.length > 0) {
            dispatch(addLocation({
                idLocation: initialValues?.idLocation || Math.floor(Math.random() * 10000),
                idHost: 1,
                name,
                address,
                description,
                amenities: selectedAmenities,
                image: selectedImage || require('../../assets/images/biv2.jpg'),
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                pricePerNight: parseFloat(pricePerNight),
            }));
            onSubmit();
        }
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const previousStep = () => setStep((prev) => prev - 1);
    const cancelForm = () => navigation.navigate('Home'); // Retour à la page d'accueil

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.form}>
                {step === 1 && (
                    <View>
                        <Text style={styles.label}>Nom :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom de l'emplacement"
                            value={name}
                            onChangeText={setName}
                        />
                        <Text style={styles.label}>Description :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Description de l'emplacement"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <CustomButton action={pickImage} color="#ccc" text="Choisir une image" />
                        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <Text style={styles.label}>Adresse :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Adresse"
                            value={address}
                            onChangeText={setAddress}
                        />
                        <Text style={styles.label}>Emplacement sur la carte :</Text>
                        {initialRegion && (
                            <MapView
                                style={styles.map}
                                initialRegion={initialRegion}
                                onPress={handleMapPress}
                            >
                                <Marker coordinate={coordinate} />
                            </MapView>
                        )}
                    </View>
                )}

                {step === 3 && (
                    <View>
                        <Text style={styles.label}>Commodités :</Text>
                        <View style={styles.amenitiesContainer}>
                            {amenitiesData.map((amenity) => (
                                <TouchableOpacity
                                    key={amenity.id}
                                    style={[
                                        styles.amenityButton,
                                        selectedAmenities.includes(amenity.name) ? styles.amenitySelected : styles.amenityUnselected
                                    ]}
                                    onPress={() => toggleAmenity(amenity.name)}
                                >
                                    <Text style={styles.amenityText}>{amenity.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {step === 4 && (
                    <View>
                        <Text style={styles.label}>Prix par nuit :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Prix par nuit (€)"
                            value={pricePerNight}
                            keyboardType="numeric"
                            onChangeText={setPricePerNight}
                        />
                    </View>
                )}
            </View>

            {/* Boutons de navigation en bas */}
            <View style={styles.navigationButtons}>
                <View style={styles.leftButtons}>
                    {step > 1 ? (
                        <CustomButton action={previousStep} color="#ccc" text="Précédent" />
                    ) : (
                        <CustomButton action={cancelForm} color="#ccc" text="Annuler" />
                    )}
                </View>
                <View style={styles.rightButtons}>
                    {step < 4 ? (
                        <CustomButton action={nextStep} color="#f0ad4e" text="Suivant" />
                    ) : (
                        <CustomButton action={handleAddLocation} color="#f0ad4e" text="Valider" />
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 20,
    },
    form: {
        padding: 20,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    map: {
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    amenityButton: {
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    amenitySelected: {
        backgroundColor: '#f0ad4e',
    },
    amenityUnselected: {
        backgroundColor: '#e0e0e0',
    },
    amenityText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    navigationButtons: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftButtons: {
        flex: 1,
        alignItems: 'flex-start',
    },
    rightButtons: {
        flex: 1,
        alignItems: 'flex-end',
    },
});

export default LocationForm;
