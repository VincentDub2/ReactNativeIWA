import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Easing } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import amenitiesData from '../data/amenities.json';
import { addLocation, updateLocation } from '../features/locations/locationSlice';
import CustomButton from './CustomButton';
import { useModal } from '../ModalProvider';
import DateTimePicker from '@react-native-community/datetimepicker';


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
        image: any;
        pricePerNight: number;
        dispo: {
            startDate: string; // Doit être de type string
            endDate: string;    // Doit être de type string
        };
    };
}




const LocationForm: React.FC<LocationFormProps> = ({ onSubmit, initialValues }) => {

    const [initialRegion, setInitialRegion] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);


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
    const [selectedImage, setSelectedImage] = useState<string | null>(
        typeof initialValues?.image === 'string' ? initialValues.image : null
    );
    const [startDate, setStartDate] = useState<Date | null>(
        initialValues?.dispo?.startDate ? new Date(initialValues.dispo.startDate) : null
    );
    const [endDate, setEndDate] = useState<Date | null>(
        initialValues?.dispo?.endDate ? new Date(initialValues.dispo.endDate) : null
    );


    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { showModal } = useModal();

    const progressAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const progress = (step - 1) / 3;
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [step]);

    useEffect(() => {
        if (initialValues) {
            // Utiliser les coordonnées initiales si elles existent
            setInitialRegion({
                latitude: initialValues.latitude,
                longitude: initialValues.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setCoordinate({
                latitude: initialValues.latitude,
                longitude: initialValues.longitude,
            });
        } else {
            // Sinon, demander la localisation actuelle de l'utilisateur
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
                } else {
                    showModal("Permissions de localisation non accordées.", "error");
                }
            })();
        }
    }, [initialValues]);


    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
        );
    };

    const handleMapPress = (event: MapPressEvent) => {
        setCoordinate(event.nativeEvent.coordinate);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [2, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleAddLocation = () => {
        if (name && address && description && selectedImage && pricePerNight && startDate && endDate) {
            const locationData = {
                idLocation: initialValues?.idLocation || Math.floor(Math.random() * 10000),
                idHost: 1,
                name,
                address,
                description,
                amenities: selectedAmenities,
                image: selectedImage,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                pricePerNight: parseFloat(pricePerNight),
                dispo: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                },
            };

            if (initialValues) {
                dispatch(updateLocation(locationData));
                showModal("L'emplacement a été mis à jour avec succès !", "success");
            } else {
                dispatch(addLocation(locationData));
                showModal("L'emplacement a été ajouté avec succès !", "success");
            }

            onSubmit();
        } else {
            showModal("Veuillez remplir tous les champs requis.", "error");
        }
    };


    const getNextDay = (date: Date | null) => {
        if (!date) return new Date(); // Retourne la date actuelle si startDate est null
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1); // Ajoute un jour à la date
        return nextDay;
    };




    const nextStep = () => {
        const missingFields: string[] = [];

        switch (step) {
            case 1:
                if (!name) missingFields.push("Nom de l'emplacement");
                if (!description) missingFields.push("Description de l'emplacement");
                if (!selectedImage) missingFields.push("Image de l'emplacement");
                break;
            case 2:
                if (!address) missingFields.push("Adresse de l'emplacement");
                if (!coordinate.latitude || !coordinate.longitude) missingFields.push("Emplacement sur la carte");
                break;
            case 3:
                if (selectedAmenities.length === 0) missingFields.push("Commodités");
                break;
            case 4:
                if (!pricePerNight) missingFields.push("Prix par nuit");
                if (!startDate) missingFields.push("Date de début de disponibilité");
                if (!endDate) missingFields.push("Date de fin de disponibilité");
                if (startDate && endDate && endDate <= startDate) {
                    missingFields.push("La date de fin doit être postérieure à la date de début");
                }
                break;
        }

        if (missingFields.length > 0) {
            showModal("Veuillez remplir tous les champs requis avant de passer à l'étape suivante.", "error");
        } else {
            setStep((prev) => prev + 1);
        }
    };

    const previousStep = () => setStep((prev) => prev - 1);
    const cancelForm = () => navigation.goBack();

    const stepTitles = ["1 - Informations générales", "2 - Adresse", "3 - Commodités", "4 - Tarification"];

    return (
        <View style={{ flex: 1 }}>


            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.form}>
                    {step === 1 && (
                        <View>
                            <Text style={styles.label}>Nom de l'emplacement :</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom de l'emplacement"
                                value={name}
                                onChangeText={setName}
                            />
                            <Text style={styles.label}>Description :</Text>
                            <TextInput
                                style={styles.input2}
                                placeholder="Description de l'emplacement"
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}       // Permet plusieurs lignes
                                numberOfLines={5}      // Définit la hauteur en lignes, ajuste ce nombre selon tes besoins
                            />

                            <Text style={styles.label}>Photo :</Text>

                            <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
                                {selectedImage ? (
                                    <Image source={{ uri: selectedImage }} style={styles.image} />
                                ) : (
                                    <Text style={styles.plusText}>+</Text>
                                )}
                            </TouchableOpacity>
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
                            <Text style={styles.label}>Date de début de disponibilité :</Text>
                            <DateTimePicker
                                value={startDate || new Date()} // Affiche la date actuelle ou celle choisie
                                mode="date"
                                display="compact"
                                onChange={(event, date) => setStartDate(date || null)}
                                style={styles.datePicker}
                                minimumDate={new Date()} // Empêche les dates passées
                            />

                            <Text style={styles.label}>Date de fin de disponibilité :</Text>
                            <DateTimePicker
                                value={endDate || new Date()}
                                mode="date"
                                display="compact"
                                onChange={(event, date) => setEndDate(date || null)}
                                style={styles.datePicker}
                                minimumDate={getNextDay(startDate)} // Empêche la sélection avant startDate + 1 jour
                            />
                        </View>
                    )}

                </View>
            </ScrollView>

            <View style={styles.stepTitleContainer}>
                <Text style={styles.stepTitle}>{stepTitles[step - 1]}</Text>
            </View>

            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, {
                    width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['10%', '90%']
                    })
                }]} />
            </View>

            <View style={styles.navigationButtons}>
                <View style={styles.leftButtons}>
                    {step > 1 ? (
                        <CustomButton action={previousStep} color="#b4b4b4" text="Précédent" />
                    ) : (
                        <CustomButton action={cancelForm} color="#b4b4b4" text="Annuler" />
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
        </View>
    );
};

const styles = StyleSheet.create({
    stepTitleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginBottom: 90,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000', // Couleur de l'ombre
        shadowOffset: { width: 0, height: 2 }, // Décalage de l'ombre
        shadowOpacity: 0.3, // Opacité de l'ombre
        shadowRadius: 5, // Rayon de flou de l'ombre
        elevation: 5, // Propriété spécifique à Android pour l'ombre
    },

    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContainer: {
        paddingBottom: 160,
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
    input2: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        height: 100,         // Ajuste la hauteur selon le besoin
        textAlignVertical: 'top', // Pour aligner le texte en haut
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
    imagePlaceholder: {
        width: 300,
        height: 200,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 10,
    },
    plusText: {
        fontSize: 40,
        color: '#999',
    },
    image: {
        width: 300,
        height: 200,
        borderRadius: 10,
    },
    progressBarContainer: {
        height: 10,
        width: '100%',
        backgroundColor: '#e0e0e0',
        position: 'absolute',
        bottom: 80,
        left: 0,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#f0ad4e',
    },
    navigationButtons: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
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
    datePicker: {
        width: '100%',
        marginBottom: 10,
    },
});

export default LocationForm;