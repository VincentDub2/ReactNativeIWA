import React from 'react';
import { View } from "react-native";
import NavigationTab from "./components/NavigationTab";
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/LoginScreen';
import Register from './screens/RegisterScreen';
import LocationDetail from './screens/LocationDetail';
import AddLocation from './screens/AddLocation'; // Import du nouvel écran
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import EditLocation from './screens/EditLocation';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    NavigationTab: undefined;
    LocationDetail: { location: { name: string; address: string; amenities: string[]; image: any } };
    AddLocation: undefined;  // Définition du nouvel écran AddLocation
    EditLocation: { location: { name: string; address: string; amenities: string[]; image: any } };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Main() {
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator initialRouteName="Login">
                {!isAuthenticated ? (
                    <>
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
                ) : (
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
                    </>
                )}
            </Stack.Navigator>
        </View>
    );
}
