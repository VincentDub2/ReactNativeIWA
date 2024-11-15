import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Location } from '../../types'; // Assurez-vous d'importer le type Location
import { RootState } from '../app/store';
import LocationCard from './LocationCard';

interface LocationListProps {
    onItemPress: (location: Location) => void; // Utiliser directement Location comme type
}

const LocationList: React.FC<LocationListProps> = ({ onItemPress }) => {
    const locations = useSelector((state: RootState) => state.locations.locations);

    // Filtrer pour ne garder que les emplacements ayant idHost = 1
    const filteredLocations = locations.filter(location => location.idHost === 1);

    const renderItem = ({ item }: { item: Location }) => (
        <LocationCard
            name={item.name}
            address={item.address}
            amenities={item.amenities}
            image={item.image}
            onPress={() => onItemPress(item)} // Utiliser le type Location directement
        />
    );

    return (
        <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.idLocation.toString()} // Utilisation de idLocation comme clé
            renderItem={renderItem}
            contentContainerStyle={[
                styles.listContainer,
                { flexGrow: filteredLocations.length === 0 ? 1 : undefined },
            ]}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Vous n'avez pas encore proposé d'emplacement à la location pour le moment.</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: 75,
        paddingTop: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
    },
});

export default LocationList;
