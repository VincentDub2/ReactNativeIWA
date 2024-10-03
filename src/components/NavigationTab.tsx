import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from "../screens/HomeScreen";
import UsersScreen from "../screens/UsersScreen";



const Tab = createBottomTabNavigator();

export default function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: "home" | "home-outline" | "person" | "person-outline";  // Types valides

                    // Initialisation d'iconName en fonction de la route
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Account') {
                        iconName = focused ? 'person' : 'person-outline';
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
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Account" component={UsersScreen} />
        </Tab.Navigator>
    );
}
