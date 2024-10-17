import React, { useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LocationForm from '../components/LocationForm';
import LocationList from '../components/LocationList';

export default function HomeScreen() {
    const slideAnim = useRef(new Animated.Value(500)).current; // Valeur de départ pour l'animation du panneau
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Fonction pour afficher le panneau en glissant vers le haut
    const slideUp = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setIsFormVisible(true);
    };

    // Fonction pour cacher le panneau en glissant vers le bas
    const slideDown = () => {
        Animated.timing(slideAnim, {
            toValue: 500,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsFormVisible(false));
    };

    return (
        <View style={styles.container}>
            <LocationList />
            <TouchableOpacity style={styles.addButton} onPress={slideUp}>
                <Text style={styles.addButtonText}>Ajouter un emplacement</Text>
            </TouchableOpacity>

            {/* Panneau slideout pour ajouter un emplacement */}
            {isFormVisible && (
                <Animated.View style={[styles.slideout, { transform: [{ translateY: slideAnim }] }]}>
                    <LocationForm />
                    <Button title="Fermer" onPress={slideDown} />
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    addButton: {
        backgroundColor: '#f0ad4e',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    slideout: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
});
