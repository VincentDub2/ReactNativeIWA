import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface LocationCardProps {
    name: string;
    address: string;
    amenities: string[];
    image: any;
    onPress: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ name, address, amenities, image, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.card}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title}>{name}</Text>
        <Text>{address}</Text>
        <Text>Commodités: {amenities.join(', ')}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default LocationCard;
