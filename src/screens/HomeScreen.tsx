import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import LocationList from '../components/LocationList';
import CustomButton from '../components/CustomButton';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LocationDetail'>;

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleLocationPress = (location: { name: string; address: string; amenities: string[]; image: any }) => {
        navigation.navigate('LocationDetail', { location });
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <LocationList onItemPress={handleLocationPress} />
            <CustomButton
                action={() => navigation.navigate('AddLocation')}
                color="#f0ad4e"
                text="Ajouter un emplacement"
            />
        </View>
    );
};

export default HomeScreen;
