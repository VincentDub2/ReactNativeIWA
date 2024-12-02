import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState, useRef } from 'react';
import { Animated, Easing, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { addLocationAsync, updateLocationAsync } from '../features/locations/locationSlice';
import { useModal } from '../ModalProvider';
import CustomButton from './CustomButton';
import GooglePlacesAutocompleteCustom from './GooglePlacesAutocompleteCustom';
import FrAmenitiesSelector from './FrAmenitiesSelector';

const amenitiesList = [
    { id: 'electrical_outlet', icon: 'power', library: 'MaterialIcons', name: 'Prise électrique' },
    { id: 'shower', icon: 'shower', library: 'MaterialCommunityIcons', name: 'Douche' },
    { id: 'drinkable_water', icon: 'local-drink', library: 'MaterialIcons', name: 'Eau potable' },
    { id: 'toilets', icon: 'toilet', library: 'MaterialCommunityIcons', name: 'Toilettes' },
    { id: 'wifi', icon: 'wifi', library: 'MaterialIcons', name: 'Wi-Fi' },
    { id: 'barbecue', icon: 'outdoor-grill', library: 'MaterialIcons', name: 'Barbecue' },
];

interface LocationFormProps {
    onSubmit: () => void;
    initialValues?: {
        idEmplacement?: number; // Optionnel pour la mise à jour
        nom: string;
        adresse: string;
        description: string;
        commodites: string[];
        latitude: number;
        longitude: number;
        image: string | null;
        prixParNuit: number;
        dateDebut: string;
        dateFin: string;
    };
}

const LocationForm: React.FC<LocationFormProps> = ({ onSubmit, initialValues }) => {

    const mapViewRef = useRef(null);

    const [initialRegion, setInitialRegion] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);


    const idHote = useSelector((state: RootState) => state.users.id); // Assurez-vous que l'ID est récupéré depuis le store.

    const [step, setStep] = useState(1);
    const [nom, setNom] = useState(initialValues?.nom || '');
    const [adresse, setAdresse] = useState(initialValues?.adresse || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [prixParNuit, setPrixParNuit] = useState(initialValues?.prixParNuit.toString() || '');
    const [selectedcommodites, setSelectedCommodites] = useState<string[]>(initialValues?.commodites || []);
    const [coordonnées, setCoordonnées] = useState({
        latitude: initialValues?.latitude || 37.78825,
        longitude: initialValues?.longitude || -122.4324,
    });
    console.log(initialValues);
    const [selectedImage, setSelectedImage] = useState<string | null>(
        typeof initialValues?.image === 'string' ? initialValues.image : null
    );
    const [dateDebut, setDateDebut] = useState<Date | null>(
        initialValues?.dateDebut ? new Date(initialValues.dateDebut) : null
    );
    const [dateFin, setDateFin] = useState<Date | null>(
        initialValues?.dateFin ? new Date(initialValues.dateFin) : null
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
            setCoordonnées({
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
                    setCoordonnées({
                        latitude: userLocation.coords.latitude,
                        longitude: userLocation.coords.longitude,
                    });
                } else {
                    showModal("Permissions de localisation non accordées.", "error");
                }
            })();
        }
    }, [initialValues]);

    const togglecommodites = (amenityId: string) => {
        const amenity = amenitiesList.find((item) => item.id === amenityId); // Trouver l'élément dans la liste
        if (!amenity) return; // Si l'ID n'existe pas, ne rien faire
    
        setSelectedCommodites((prev) => {
            if (prev.includes(amenity.name)) {
                // Si le nom est déjà dans la liste, le supprimer
                return prev.filter((item) => item !== amenity.name);
            } else {
                // Sinon, l'ajouter
                return [...prev, amenity.name];
            }
        });
    };
    

    const handleMapPress = (event: MapPressEvent) => {
        setCoordonnées(event.nativeEvent.coordinate);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [2, 3], // Ajuster selon vos besoins
            quality: 0.8, // Réduire légèrement la qualité pour optimiser la taille
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Utilisez l'URI directement
        }
    };

    const handleAddLocation = () => {
        if (nom && adresse && description && selectedImage && prixParNuit && dateDebut && dateFin) {
            const locationData = {
                idHote,
                nom,
                adresse,
                description,
                commodites: selectedcommodites,
                image: selectedImage, // Utilisation de l'URI directement
                latitude: coordonnées.latitude,
                longitude: coordonnées.longitude,
                prixParNuit: parseFloat(prixParNuit),
                dateDebut: dateDebut.toISOString(),
                dateFin: dateFin.toISOString(),
            };

            console.log('[FRONT] Données envoyées :', locationData);

            if (initialValues) {
                dispatch(updateLocationAsync({ ...locationData, idEmplacement: initialValues.idEmplacement }));
                showModal("L'emplacement a été mis à jour.", "success");
            } else {
                dispatch(addLocationAsync(locationData));
                showModal("L'emplacement a été ajouté.", "success");
            }

            onSubmit();
        } else {
            showModal("Veuillez remplir tous les champs requis.", "error");
        }
    };



    const getNextDay = (date: Date | null) => {
        if (!date) return new Date(); // Retourne la date actuelle si dateDebut est null
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1); // Ajoute un jour à la date
        return nextDay;
    };

    const nextStep = () => {
        const missingFields: string[] = [];

        switch (step) {
            case 1:
                if (!nom) missingFields.push("Nom de l'emplacement");
                if (!description) missingFields.push("Description de l'emplacement");
                if (!selectedImage) missingFields.push("Image de l'emplacement");
                break;
            case 2:
                if (!adresse) missingFields.push("Adresse de l'emplacement");
                if (!coordonnées.latitude || !coordonnées.longitude) missingFields.push("Emplacement sur la carte");
                break;
            case 3:
                if (selectedcommodites.length === 0) missingFields.push("Commodités");
                break;
            case 4:
                if (!prixParNuit) missingFields.push("Prix par nuit");
                if (!dateDebut) missingFields.push("Date de début de disponibilité");
                if (!dateFin) missingFields.push("Date de fin de disponibilité");
                if (dateDebut && dateFin && dateFin <= dateDebut) {
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
                            <Text style={styles.label}>Quel sera le nom de votre emplacement ?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom de l'emplacement"
                                value={nom}
                                onChangeText={setNom}
                            />
                            <Text style={styles.label}>Décrivez le.</Text>
                            <TextInput
                                style={styles.input2}
                                placeholder="Description de l'emplacement"
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}       // Permet plusieurs lignes
                                numberOfLines={5}      // Définit la hauteur en lignes, ajuste ce nombre selon tes besoins
                            />

                            <Text style={styles.label}>Choisissez une photo dans votre galerie.</Text>

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
                            <Text style={styles.label}>Entrez l'adresse de votre emplacement :</Text>
                            <GooglePlacesAutocompleteCustom
                                onPlaceSelected={({ address, latitude, longitude }) => {
                                    setAdresse(address); // Mettre à jour l'adresse sélectionnée
                                    setCoordonnées({ latitude, longitude }); // Mettre à jour les coordonnées

                                    // Centrer la carte sur le nouvel emplacement
                                    if (mapViewRef.current) {
                                        mapViewRef.current.animateToRegion({
                                            latitude,
                                            longitude,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        }, 1000);
                                    }
                                }}
                            />

                            <Text style={styles.label}>Ajustez le point sur la carte si nécessaire :</Text>
                            {initialRegion && (
                                <MapView
                                    ref={mapViewRef} // Utilisation de la référence useRef
                                    style={styles.map}
                                    initialRegion={{
                                        ...initialRegion,
                                        latitude: coordonnées.latitude,
                                        longitude: coordonnées.longitude,
                                    }}
                                    onPress={handleMapPress} // Mise à jour manuelle via la carte
                                >
                                    <Marker coordinate={coordonnées} />
                                </MapView>
                            )}
                        </View>
                    )}





                    {step === 3 && (
                        <View>
                            <Text style={styles.label}>Choisissez des commodités :</Text>
                            <FrAmenitiesSelector
                                selectedAmenities={selectedcommodites} // Utiliser les commodités sélectionnées
                                toggleAmenity={(amenity) => togglecommodites(amenity)} // Fonction pour basculer l'état
                            />
                        </View>
                    )}

                    {step === 4 && (
                        <View>
                            <Text style={styles.label}>Quel sera la tarification par nuit ? (€)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Prix par nuit (€)"
                                value={prixParNuit}
                                keyboardType="numeric"
                                onChangeText={setPrixParNuit}
                            />
                            <Text style={styles.label}>Date de début de disponibilité :</Text>
                            <DateTimePicker
                                value={dateDebut || new Date()} // Affiche la date actuelle ou celle choisie
                                mode="date"
                                display="compact"
                                onChange={(event, date) => setDateDebut(date || null)}
                                style={styles.datePicker}
                                minimumDate={new Date()} // Empêche les dates passées
                            />

                            <Text style={styles.label}>Date de fin de disponibilité :</Text>
                            <DateTimePicker
                                value={dateFin || new Date()}
                                mode="date"
                                display="compact"
                                onChange={(event, date) => setDateFin(date || null)}
                                style={styles.datePicker}
                                minimumDate={getNextDay(dateDebut)} // Empêche la sélection avant dateDebut + 1 jour
                            />
                        </View>
                    )}

                </View>
            </ScrollView>

            <View style={styles.stepTitleContainer}>
                {/* <Text style={styles.stepTitle}>{stepTitles[step - 1]}</Text> */}
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
        paddingVertical: 20,
        backgroundColor: '#e3d2a1',
        marginBottom: 80,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000', // Couleur de l'ombre
        // shadowOffset: { width: 0, height: 2 }, // Décalage de l'ombre
        // shadowOpacity: 0.3, // Opacité de l'ombre
        // shadowRadius: 5, // Rayon de flou de l'ombre
        // elevation: 5, // Propriété spécifique à Android pour l'ombre
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
        // fontWeight: 'bold',
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
        height: 70,         // Ajuste la hauteur selon le besoin
        textAlignVertical: 'top', // Pour aligner le texte en haut
    },

    map: {
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    commoditesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    commoditesButton: {
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    commoditesSelected: {
        backgroundColor: '#f0ad4e',
    },
    commoditesUnselected: {
        backgroundColor: '#e0e0e0',
    },
    commoditesText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    imagePlaceholder: {
        width: '100%', // Utilise toute la largeur disponible
        height: 200, // Hauteur fixe pour le conteneur
        backgroundColor: '#e0e0e0',
        justifyContent: 'center', // Centre verticalement
        alignItems: 'center', // Centre horizontalement
        borderRadius: 10,
        marginVertical: 10,
    },
    image: {
        width: '100%', // Prend 90% de la largeur du conteneur
        height: 200, // Prend 90% de la hauteur du conteneur
        borderRadius: 10,
    },
    plusText: {
        fontSize: 40,
        color: '#999',
    },
    progressBarContainer: {
        height: 13,
        width: '100%',
        backgroundColor: '#f2f2f2',
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
        backgroundColor: '#e3d2a1',
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
