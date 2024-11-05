import React from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LocationCard from './LocationCard';
import { Location } from '../../types'; // Assurez-vous d'importer le type Location

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
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 75, paddingTop: 8 }} // Ajoute un espace sous la liste pour le bouton flottant
        />
    );
};

export default LocationList;
