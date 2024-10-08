import React from "react";
import {Text, View, Button, StyleSheet } from "react-native";
import {useDispatch} from "react-redux";
import {logout} from "../features/users/usersSlice";

export default function UsersScreen(  ) {
    const dispatch = useDispatch();

    const onLogout = () => {
        // Déconnexion de l'utilisateur
        dispatch(logout());
    }
    return (
        <View >
            <Text>Users Screen</Text>
            <Button title="Déconnexion" onPress={onLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
