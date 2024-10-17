import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const LocationList = () => {
    const locations = useSelector((state: RootState) => state.locations.locations);

    const renderItem = ({ item }: { item: { name: string, address: string, amenities: string[] } }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.address}</Text>
            <Text>Commodités: {item.amenities.join(', ')}</Text>
        </View>
    );

    return (
        <FlatList
            data={locations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default LocationList;
