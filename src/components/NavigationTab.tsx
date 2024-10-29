import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from "../screens/HomeScreen";
import UsersScreen from "../screens/UsersScreen";
import MapScreen from "../screens/MapScreen";
import { logout } from "../features/users/usersSlice";
import {useDispatch} from "react-redux";

const Tab = createBottomTabNavigator();

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
                tabBarActiveTintColor: 'tomato',  // Couleur des icônes actives
                tabBarInactiveTintColor: 'gray',   // Couleur des icônes inactives
            })}
        >
            <Tab.Screen name="Mes emplacements" component={HomeScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Account" component={UsersScreen}/>
        </Tab.Navigator>
    );
}
