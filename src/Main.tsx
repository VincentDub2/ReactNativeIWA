import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "./app/store"; // Ajuste selon ton chemin
import NavigationTab from "./components/NavigationTab";
import { useNavigation } from "@react-navigation/native";

import Login from './screens/LoginScreen';
import Register from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MessagingScreen from "./screens/MessagerieScreen";
import UsersScreen from "./screens/UsersScreen";
import ReservationScreen from "./screens/ReservationScreen";


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
            navigation.navigate("Login");
        }
    }, [isAuthenticated, navigation]);

    useEffect(() => {
        // Rediriger vers Login si non authentifié
        if (!isAuthenticated) {
            navigation.navigate("Login");
        }
    }, [isAuthenticated]);

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator initialRouteName="Welcome">
                {!isAuthenticated ? (
                    // Si l'utilisateur n'est pas connecté, affiche les écrans Login et Register
                    <>
                        <Stack.Screen
                            name="Welcome"
                            component={WelcomeScreen}
                            options={{ headerShown: false }}
                        />
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
                        options={{ title: "Réserver un emplacement" }}
                    />
                    </>
                )}
            </Stack.Navigator>
        </View>
    );
}
