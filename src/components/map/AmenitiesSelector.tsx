import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Liste des commodités avec noms en français
const amenitiesList = [
    { name: 'Prise électrique', icon: 'power', library: 'MaterialIcons' },
    { name: 'Douche', icon: 'shower', library: 'MaterialCommunityIcons' },
    { name: 'Eau potable', icon: 'local-drink', library: 'MaterialIcons' },
    { name: 'Toilettes', icon: 'toilet', library: 'MaterialCommunityIcons' },
    { name: 'Wi-Fi', icon: 'wifi', library: 'MaterialIcons' },
    { name: 'Barbecue', icon: 'outdoor-grill', library: 'MaterialIcons' },
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
    selectedAmenities: string[]; // Contiendra les noms des commodités
    toggleAmenity: (amenity: string) => void; // Acceptera les noms des commodités
}

const AmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({ selectedAmenities, toggleAmenity }) => {
    return (
        <View>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Commodités :</Text>
            <View style={styles.amenitiesContainer}>
                {amenitiesList.map((amenity, index) => {
                    const IconComponent = getIconComponent(amenity.library);
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => toggleAmenity(amenity.name)} // Utilise `amenity.name`
                            style={[
                                styles.amenityIconContainer,
                                selectedAmenities.includes(amenity.name) && styles.amenityIconSelected, // Vérifie par `name`
                            ]}
                        >
                            <IconComponent
                                name={amenity.icon as any}
                                size={24}
                                color={selectedAmenities.includes(amenity.name) ? 'black' : 'gray'} // Vérifie par `name`
                            />
                            <Text
                                style={{
                                    color: selectedAmenities.includes(amenity.name) ? '#000' : '#888',
                                    marginTop: 5,
                                    textAlign: 'center',
                                    fontSize: 12,
                                }}
                            >
                                {amenity.name} {/* Affiche le nom directement */}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default AmenitiesSelector;
