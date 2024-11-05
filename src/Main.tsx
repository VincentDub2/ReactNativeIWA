import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./app/store"; // Ajuste selon ton chemin
import NavigationTab from "./components/NavigationTab";
import Login from "./screens/LoginScreen";
import MessagingScreen from "./screens/MessagerieScreen";
import Register from "./screens/RegisterScreen";
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
					// Si connecté, affiche la barre de navigation avec onglets
					<>
						<Stack.Screen
							name="NavigationTab"
							component={NavigationTab} // Utilisation correcte de la prop component
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Messagerie"
							component={MessagingScreen}
							options={{ headerShown: false }}
						/>
					</>
				)}
			</Stack.Navigator>
		</View>
	);
}
