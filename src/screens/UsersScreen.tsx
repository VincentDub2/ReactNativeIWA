import React from "react";
import {Text, View, Button, StyleSheet } from "react-native";

export default function UsersScreen( { onLogout }: { onLogout: () => void } ) {
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