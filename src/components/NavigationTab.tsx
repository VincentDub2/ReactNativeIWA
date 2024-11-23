import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from "../screens/HomeScreen";
import UsersScreen from "../screens/UsersScreen";
import MapScreen from "../screens/MapScreen";
import { logout } from "../features/users/usersSlice";
import {useDispatch} from "react-redux";
import HeadBar from "./HeadBar";
import { createStackNavigator } from '@react-navigation/stack';
import ReservationScreen from '../screens/ReservationScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MapStack() {
    return (
        <Stack.Navigator
            // Supprimer le `header` ici pour éviter la duplication
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen
                name="ReservationScreen"
                component={ReservationScreen}
                options={{
                    title: "Réserver un emplacement",
                }}
            />
        </Stack.Navigator>
    );
}

export default function MyTabs() {

    const dispatch = useDispatch();  // Utilise pour déclencher des a
    const onLogout = () => {
        // Dispatch l'action logout
        dispatch(logout());
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: "home" | "home-outline" | "person" | "person-outline" | "map" | "map-outline";  // Types valides

                    // Initialisation d'iconName en fonction de la route
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Account') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Map') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else {
                        iconName = 'home';
                    }
                    // Retourne l'icône avec la bonne couleur et taille
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarStyle: {
                    backgroundColor: 'rgba(205, 163, 42, 0.4)',  // Couleur de fond de la barre de navigation
                },
                tabBarLabel : () => {
                    return null;
                },
                tabBarActiveTintColor: '#CDA32A',  // Couleur des icônes actives
                tabBarInactiveTintColor: 'gray',   // Couleur des icônes inactives
            })}
        >
            <Tab.Group
                screenOptions={
                    {
                        header: () => (
                           <HeadBar/>
                        ),
                }}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen 
                    name="MapStack" 
                    component={MapStack} 
                    options={{ title: "Carte" }} 
                />
                <Tab.Screen name="Account" component={UsersScreen}/>
            </Tab.Group>
        </Tab.Navigator>
    );
}
