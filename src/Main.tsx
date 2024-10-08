import React, { useState } from 'react';
import { View} from "react-native";
import NavigationTab from "./components/NavigationTab";
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/LoginScreen';
import Register from './screens/RegisterScreen';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';  // Ajuste selon ton chemin
import { login, logout } from './features/users/usersSlice';  // Les actions login/logout
import "./global.css";

const Stack = createStackNavigator();

export default function Main() {
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);  // Récupère l'état du store
    const dispatch = useDispatch();  // Utilise pour déclencher des actions
  

  return (
    <View style={{ flex: 1 }}>
        <Stack.Navigator>
          {!isAuthenticated ? (
            // Si l'utilisateur n'est pas connecté, affiche les écrans Login et Register
            <>
              <Stack.Screen name="Login">
                {props => <Login {...props} onLogin={() => dispatch(login())} />}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {props => <Register {...props} onRegister={() => dispatch(login())} />} 
              </Stack.Screen>
            </>
          ) : (
            // Si connecté, affiche la barre de navigation avec onglets (NavigationTab)
            <Stack.Screen name="Home">
              {props => <NavigationTab {...props} onLogout={() => dispatch(logout())} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
    </View>
  );
}