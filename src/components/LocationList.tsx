import React from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LocationCard from './LocationCard';

interface LocationListProps {
    onItemPress: (location: { name: string; address: string; amenities: string[]; image: any }) => void;
}

const LocationList: React.FC<LocationListProps> = ({ onItemPress }) => {
    const locations = useSelector((state: RootState) => state.locations.locations);

    const renderItem = ({ item }: { item: { name: string; address: string; amenities: string[]; image: any } }) => (
        <LocationCard
            name={item.name}
            address={item.address}
            amenities={item.amenities}
            image={item.image}
            onPress={() => onItemPress(item)} // Appel de la fonction de rappel avec l'élément sélectionné
        />
    );

    return (
        <FlatList
            data={locations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
        />
    );
};

export default LocationList;
