import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';


// Liste des commodités avec les icônes correspondantes
const amenitiesList = [
    { id: 'electrical_outlet', icon: 'power', library: 'MaterialIcons' },
    { id: 'shower', icon: 'shower', library: 'MaterialCommunityIcons' },
    { id: 'drinkable_water', icon: 'local-drink', library: 'MaterialIcons' },
    { id: 'toilets', icon: 'toilet', library: 'MaterialCommunityIcons' },
    { id: 'wifi', icon: 'wifi', library: 'MaterialIcons' },
    { id: 'barbecue', icon: 'outdoor-grill', library: 'MaterialIcons' },
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

const AmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({ selectedAmenities, toggleAmenity }) => {
    const { t } = useTranslation();
    return (
        <View>
            <Text className="text-lg font-bold color-neutral-900">{t('map.amenities_title')} :</Text>
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
                                {t(`map.amenities.${amenity.id}`)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
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

export default AmenitiesSelector;
