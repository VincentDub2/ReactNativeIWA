import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import NavigationTab from "./components/NavigationTab";

import Login from './screens/LoginScreen';
import Register from './screens/RegisterScreen';
import LocationDetail from './screens/LocationDetail';
import AddLocation from './screens/AddLocation'; // Import du nouvel écran
import { RootState } from './app/store';
import EditLocation from './screens/EditLocation';
import WelcomeScreen from './screens/WelcomeScreen';
import MessagingScreen from "./screens/MessagerieScreen";


import "./global.css";
import type { RootStackParamList } from "../types";
import "./i18n";

const Stack = createStackNavigator<RootStackParamList>();

export default function Main() {
    const isAuthenticated = useSelector(
        (state: RootState) => state.users.isAuthenticated,
    ); // Récupère l'état du store
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
                            component={NavigationTab}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="LocationDetail"
                            component={LocationDetail}
                            options={{ title: 'Détail de l\'emplacement' }}
                        />
                        <Stack.Screen
                            name="AddLocation" // Ajout de l'écran AddLocation
                            component={AddLocation}
                            options={{ title: 'Ajouter un emplacement' }}
                        />
                        <Stack.Screen
                            name="EditLocation" // Ajout de l'écran AddLocation
                            component={EditLocation}
                            options={{ title: 'Modifier un emplacement' }}
                        />
                        <Stack.Screen
                            name="Messagerie"
                            component={MessagingScreen}
                            options={{ headerShown: true }}
                        />

                    </>
                )}
            </Stack.Navigator>
        </View>
    );
}
