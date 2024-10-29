import React from 'react';
import { View, StyleSheet } from 'react-native';
import LocationForm from '../components/LocationForm';
import { useNavigation } from '@react-navigation/native';

const AddLocation = () => {
    const navigation = useNavigation();

    const handleFormSubmit = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <LocationForm onSubmit={handleFormSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default AddLocation;
