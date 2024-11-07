import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LocationForm from '../components/LocationForm';

const EditLocation = ({ route }: any) => {
    const { location } = route.params;
    const navigation = useNavigation();

    const handleFormSubmit = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <LocationForm onSubmit={handleFormSubmit} initialValues={location} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


export default EditLocation;
