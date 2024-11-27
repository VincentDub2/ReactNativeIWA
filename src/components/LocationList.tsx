import React, { useEffect } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../app/store';
import LocationCard from './LocationCard';
import { fetchLocationsAsync } from '../features/locations/locationSlice';
import { Location } from '../../types';

const LocationList: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const locations = useSelector((state: RootState) => state.locations.locations);
    const userId = useSelector((state: RootState) => state.users.id);
    const status = useSelector((state: RootState) => state.locations.status);

    useEffect(() => {
        if (userId) {
            dispatch(fetchLocationsAsync(userId));
        }
    }, [dispatch, userId]);

    const renderItem = ({ item }: { item: Location }) => (
        <LocationCard
            name={item.nom}
            address={item.adresse}
            amenities={item.commodites}
            image={item.image}
            onPress={() => navigation.navigate('LocationDetail', { idEmplacement: item.idEmplacement })}
        />
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Mes emplacements</Text>
        </View>
    );

    if (status === 'loading') {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Chargement des emplacements...</Text>
            </View>
        );
    }

    if (locations.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    Vous n'avez pas encore proposé d'emplacement à la location pour le moment.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={locations}
            keyExtractor={(item) => item.idEmplacement.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderHeader} // Ajout du titre
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: 75,
        paddingTop: 8,
    },
    headerContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 12,
        alignItems: 'center', // Ajout pour centrer horizontalement
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#5c5c5c',
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
