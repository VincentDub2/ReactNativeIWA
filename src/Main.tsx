import React, { useState } from 'react';
import { View } from "react-native";
import NavigationTab from "./components/NavigationTab";
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/LoginScreen';
import Register from './screens/RegisterScreen';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';  // Ajuste selon ton chemin
import "./global.css";
import { RootStackParamList } from "../types";
import './i18n';

const Stack = createStackNavigator<RootStackParamList>();

export default function Main() {
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);  // Récupère l'état du store


    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator initialRouteName="Login">
                {!isAuthenticated ? (
                    // Si l'utilisateur n'est pas connecté, affiche les écrans Login et Register
                    <>
                        <Stack.Screen
                            name="Login"
                            component={Login} // Utilisation correcte de la prop component
                            options={{ headerShown: false }} // Facultatif, pour ne pas afficher de header
                        />
                        <Stack.Screen
                            name="Register"
                            component={Register} // Utilisation correcte de la prop component
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    // Si connecté, affiche la barre de navigation avec onglets (NavigationTab)
                    <Stack.Screen
                        name="NavigationTab"
                        component={NavigationTab} // Utilisation correcte de la prop component
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </View>
    );
}
