import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import NavigationTab from "./components/NavigationTab";
import { useNavigation } from "@react-navigation/native";

import Login from './screens/LoginScreen';
import Register from './screens/RegisterScreen';
import LocationDetail from './screens/LocationDetail';
import AddLocation from './screens/AddLocation'; // Import du nouvel écran
import { RootState } from './app/store';
import EditLocation from './screens/EditLocation';
import WelcomeScreen from './screens/WelcomeScreen';
import MessagingScreen from "./screens/MessagerieScreen";
import UsersScreen from "./screens/UsersScreen";
import ReservationScreen from "./screens/ReservationScreen";
import EvaluationScreen from "./screens/EvaluationScreen";
import ReservationDetailScreen from "./screens/ReservationDetailScreen";


import "./global.css";
import type { RootStackParamList } from "../types";
import "./i18n";

const Stack = createStackNavigator<RootStackParamList>();

export default function Main() {

    const isAuthenticated = useSelector(
        (state: RootState) => state.users.isAuthenticated
    );
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        if (isAuthenticated) {
            navigation.navigate("NavigationTab");
        } else {
            navigation.navigate("Welcome");
        }
    }, [isAuthenticated, navigation]);

    useEffect(() => {
        // Rediriger vers Login si non authentifié
        if (!isAuthenticated) {
            navigation.navigate("Welcome");
        }
    }, [isAuthenticated]);

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator initialRouteName="Welcome">
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Welcome"
                            component={WelcomeScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={Register}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : ( // Si connecté, affiche la barre de navigation avec onglets (NavigationTab)
                    <>
                        <Stack.Screen
                            name="NavigationTab"
                            component={NavigationTab} // Utilisation correcte de la prop component
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Users"
                            component={UsersScreen}
                            options={{ headerShown: true }}
                        />
                        <Stack.Screen
                            name="Messagerie"
                            component={MessagingScreen}
                            options={{ headerShown: true }}
                        />
                        <Stack.Screen
                            name="ReservationScreen"
                            component={ReservationScreen}
                            options={{ title: "Réservation" }}
                        />
                        <Stack.Screen
                            name="EvaluationScreen"
                            component={EvaluationScreen}
                            options={{ title: "Évaluation" }}
                        />
                        <Stack.Screen
                            name="ReservationDetail"
                            component={ReservationDetailScreen}
                            options={{ title: "Détails de la réservation" }}
                        />
                        <Stack.Screen
                            name="LocationDetail"
                            component={LocationDetail}
                            options={{
                                title: 'Emplacement', // Définir le titre de l'écran
                                headerStyle: {
                                    backgroundColor: '#e3d2a1', // Fond jaune pour l'en-tête
                                },
                                headerTintColor: '#000', // Couleur du texte dans l'en-tête
                                headerTitleStyle: {
                                    fontWeight: 'bold', // Style du texte
                                },
                            }} />
                        <Stack.Screen
                            name="AddLocation"
                            component={AddLocation}
                            options={{
                                title: 'Ajout emplacement', // Définir le titre de l'écran
                                headerStyle: {
                                    backgroundColor: '#e3d2a1', // Fond jaune pour l'en-tête
                                },
                                headerTintColor: '#000', // Couleur du texte dans l'en-tête
                                headerTitleStyle: {
                                    fontWeight: 'bold', // Style du texte
                                },
                            }}
                        />
                        <Stack.Screen
                            name="EditLocation" // Ajout de l'écran AddLocation
                            component={EditLocation}
                            options={{ title: 'Modifier un emplacement' }}
                        />
                    </>
                )
                }
            </Stack.Navigator >
        </View >
    );
}
