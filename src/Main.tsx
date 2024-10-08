import React, { useState } from 'react';
import { View} from "react-native";
import NavigationTab from "./components/NavigationTab";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/LoginScreen';
import Register from './screens/RegisterScreen';
import "./global.css";

const Stack = createStackNavigator();

export default function Main() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Gère l'authentification

  return (
    <View style={{ flex: 1 }}>
        <Stack.Navigator>
          {!isAuthenticated ? (
            // Si l'utilisateur n'est pas connecté, affiche les écrans Login et Register
            <>
              <Stack.Screen name="Login">
                {props => <Login {...props} onLogin={() => setIsAuthenticated(true)} />}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {props => <Register {...props} onRegister={() => setIsAuthenticated(true)} />}
              </Stack.Screen>
            </>
          ) : (
            // Si connecté, affiche la barre de navigation avec onglets (NavigationTab)
            <Stack.Screen name="Home">
              {props => <NavigationTab {...props} onLogout={() => setIsAuthenticated(false)} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
    </View>
  );
}