import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface LocationCardProps {
    name: string;
    address: string;
    amenities: string[];
    image: any; // Image peut être une URI ou un import local
    onPress: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ name, address, amenities, image, onPress }) => {
    const [isPressed, setIsPressed] = useState(false);

    // Gestion de l'image, URI ou import local
    const imageSource = typeof image === 'string' ? { uri: image } : image;

    return (
        <TouchableOpacity
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={onPress}
            style={[styles.card, isPressed && styles.cardPressed]}
            activeOpacity={0.6}
        >
            <Image source={imageSource} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.title}>{name}</Text>
                <Text>{address}</Text>
                <Text>Commodités: {amenities.join(', ')}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    cardPressed: {
        backgroundColor: '#f0ad4e', // Fond jaune lors de l’appui
    },
    cardContent: {
        padding: 15, // Padding interne pour le contenu de la carte
    },
    image: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default LocationCard;
