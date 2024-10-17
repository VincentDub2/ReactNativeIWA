import { View} from "react-native";
import React from "react";
import UserInfo from "../components/UserInfo";
import {StatusBar} from "expo-status-bar";
import NameInput from "../components/NameInput";


export default function MapScreen() {
    return (
        <View >
            <UserInfo/>
            <StatusBar style="auto" />
            <NameInput/>
        </View>
    );
}

