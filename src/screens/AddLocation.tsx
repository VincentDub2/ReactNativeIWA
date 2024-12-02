import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LocationForm from '../components/LocationForm';

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
    },
});


export default AddLocation;
