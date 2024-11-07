import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { Location } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LocationDetail'>;

const LocationDetail = ({ route }: any) => {
    const { location } = route.params;
    const navigation = useNavigation<NavigationProp>();

    const handleEditLocation = () => {
        navigation.navigate('EditLocation', { location });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={typeof location.image === 'string' ? { uri: location.image } : location.image} style={styles.image} />

                {/* Title Section */}
                <Text style={styles.title}>{location.name}</Text>

                {/* Address Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Adresse</Text>
                    <Text style={styles.address}>{location.address}</Text>
                </View>

                {/* Description Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{location.description}</Text>
                </View>

                {/* Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations</Text>
                    <Text style={styles.info}>ID de l'emplacement: {location.idLocation}</Text>
                    <Text style={styles.info}>ID de l'hôte: {location.idHost}</Text>
                    <Text style={styles.coordinates}>Latitude: {location.latitude}</Text>
                    <Text style={styles.coordinates}>Longitude: {location.longitude}</Text>
                </View>

                {/* Pricing Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tarification</Text>
                    <Text style={styles.price}>Prix par nuit: {location.pricePerNight} €</Text>
                </View>

                {/* Amenities Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Commodités</Text>
                    <Text style={styles.amenities}>{location.amenities.join(', ')}</Text>
                </View>
            </ScrollView>

            {/* Bouton "Modifier l'emplacement" en bas de l'écran */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    action={handleEditLocation}
                    color="#f0ad4e"
                    text="Modifier l'emplacement"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 80, // Ajout d'un espace pour éviter que le contenu soit masqué par le bouton
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    section: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#007bff',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
    },
    address: {
        fontSize: 16,
        color: '#555',
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    info: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    coordinates: {
        fontSize: 14,
        color: '#444',
        marginBottom: 5,
    },
    price: {
        fontSize: 18,
        color: '#2a9d8f',
        fontWeight: 'bold',
    },
    amenities: {
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        left: 30,
        right: 30,
    },
});

export default LocationDetail;
