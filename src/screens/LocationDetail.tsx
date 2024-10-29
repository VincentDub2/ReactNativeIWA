import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const LocationDetail = ({ route }: any) => {
    const { location } = route.params;

    return (
        <View style={styles.container}>
            <Image source={location.image} style={styles.image} />
            <Text style={styles.title}>{location.name}</Text>
            <Text style={styles.address}>{location.address}</Text>
            <Text style={styles.amenities}>Commodités: {location.amenities.join(', ')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    address: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
    },
    amenities: {
        fontSize: 16,
        color: '#333',
    },
});

export default LocationDetail;
