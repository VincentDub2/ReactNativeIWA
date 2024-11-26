import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Liste des commodités avec les icônes correspondantes et noms en français
const amenitiesList = [
    { id: 'electrical_outlet', icon: 'power', library: 'MaterialIcons', name: 'Prise électrique' },
    { id: 'shower', icon: 'shower', library: 'MaterialCommunityIcons', name: 'Douche' },
    { id: 'drinkable_water', icon: 'local-drink', library: 'MaterialIcons', name: 'Eau potable' },
    { id: 'toilets', icon: 'toilet', library: 'MaterialCommunityIcons', name: 'Toilettes' },
    { id: 'wifi', icon: 'wifi', library: 'MaterialIcons', name: 'Wi-Fi' },
    { id: 'barbecue', icon: 'outdoor-grill', library: 'MaterialIcons', name: 'Barbecue' },
];

const getIconComponent = (libraryName: string) => {
    switch (libraryName) {
        case 'MaterialIcons':
            return MaterialIcons;
        case 'MaterialCommunityIcons':
            return MaterialCommunityIcons;
        case 'Ionicons':
            return Ionicons;
        default:
            return MaterialIcons;
    }
};

interface AmenitiesSelectorProps {
    selectedAmenities: string[];
    toggleAmenity: (amenity: string) => void;
}

const FrAmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({ selectedAmenities, toggleAmenity }) => {
    return (
        <View>
            <View style={styles.amenitiesContainer}>
                {amenitiesList.map((amenity, index) => {
                    const IconComponent = getIconComponent(amenity.library);
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => toggleAmenity(amenity.id)}
                            style={[
                                styles.amenityIconContainer,
                                selectedAmenities.includes(amenity.id) && styles.amenityIconSelected,
                            ]}
                        >
                            <IconComponent
                                name={amenity.icon as any}
                                size={24}
                                color={selectedAmenities.includes(amenity.id) ? 'black' : 'gray'}
                            />
                            <Text
                                style={{
                                    color: selectedAmenities.includes(amenity.id) ? '#000' : '#888',
                                    marginTop: 5,
                                    textAlign: 'center',
                                    fontSize: 12,
                                }}
                            >
                                {amenity.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    amenityIconContainer: {
        width: '30%',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
        borderRadius: 8,
    },
    amenityIconSelected: {
        backgroundColor: '#e0e0e0',
        borderWidth: 1,
        borderColor: '#000',
    },
});

export default FrAmenitiesSelector;
