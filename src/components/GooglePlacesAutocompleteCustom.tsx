import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

const GooglePlacesAutocompleteCustom = ({ onPlaceSelected }) => {
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const fetchPlaces = async (input) => {
        if (input.length < 3) {
            setSuggestions([]); // Vide les suggestions si la saisie est insuffisante
            return;
        }

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
                {
                    params: {
                        input,
                        key: GOOGLE_MAPS_API_KEY,
                        language: 'fr',
                        components: 'country:fr',
                    },
                }
            );
            setSuggestions(response.data.predictions);
        } catch (error) {
            console.error('Erreur lors de la récupération des suggestions :', error);
        }
    };

    const handleSelectPlace = async (placeId, description) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json`,
                {
                    params: {
                        place_id: placeId,
                        key: GOOGLE_MAPS_API_KEY,
                    },
                }
            );

            const { lat, lng } = response.data.result.geometry.location;

            // Mettre à jour le texte dans le champ avec l'adresse sélectionnée
            setSearchText(description);
            setSuggestions([]); // Vider les suggestions après la sélection

            // Appeler la fonction de sélection avec les détails
            onPlaceSelected({
                address: response.data.result.formatted_address,
                latitude: lat,
                longitude: lng,
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de lieu :', error);
        }
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder="Entrez une adresse"
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text);
                    fetchPlaces(text); // Mettre à jour les suggestions
                }}
            />
            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => handleSelectPlace(item.place_id, item.description)}
                        >
                            <Text
                                style={[
                                    styles.suggestion,
                                    index === suggestions.length - 1 && styles.lastSuggestion, // Pas de bordure pour le dernier élément
                                ]}
                            >
                                {item.description}
                            </Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionsList}
                />

            )}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    lastSuggestion: {
        borderBottomWidth: 0, // Pas de bordure inférieure
    },
    suggestionsList: {
        backgroundColor: '#e1e3e1', // Fond gris clair
        borderRadius: 5,           // Coins arrondis pour correspondre au champ de saisie
        paddingVertical: 5,        // Espacement vertical pour les suggestions
        marginBottom: 20,
    },

});

export default GooglePlacesAutocompleteCustom;
