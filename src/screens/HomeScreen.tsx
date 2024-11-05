import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { Location } from '../../types';  // Importer l'interface Location
import LocationList from '../components/LocationList';
import CustomButton from '../components/CustomButton';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LocationDetail'>;

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleLocationPress = (location: Location) => {
        navigation.navigate('LocationDetail', { location });
    };

    return (
        <View style={styles.container}>
            {/* Liste d’emplacements */}
            <LocationList onItemPress={handleLocationPress} />

            {/* Bouton flottant */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    action={() => navigation.navigate('AddLocation')}
                    color="#f0ad4e"
                    text="Ajouter un emplacement"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        left: 30,
        right: 30,
        zIndex: 10, // Assure que le bouton flotte au-dessus de la liste
    },
});

export default HomeScreen;
