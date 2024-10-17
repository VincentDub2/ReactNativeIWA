import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addLocation } from '../features/locations/locationSlice';
// Importation du fichier JSON
import amenitiesData from '../data/amenities.json';

const LocationForm = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const dispatch = useDispatch();

    // Gestion de la sélection/dé-sélection des commodités
    const toggleAmenity = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
        } else {
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    const handleAddLocation = () => {
        if (name && address && selectedAmenities.length > 0) {
            dispatch(addLocation({ name, address, amenities: selectedAmenities }));
            setName('');
            setAddress('');
            setSelectedAmenities([]);
        }
    };

    return (
        <View style={styles.form}>
            <Text style={styles.label}>Nom :</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom de l'emplacement"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.label}>Adresse :</Text>
            <TextInput
                style={styles.input}
                placeholder="Adresse"
                value={address}
                onChangeText={setAddress}
            />
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
            <Button title="Valider" onPress={handleAddLocation} />
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
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
});

export default LocationForm;
