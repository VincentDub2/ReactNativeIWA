import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import {RootState} from "../app/store";

const UserInfo = () => {
    const name = useSelector((state : RootState) => state.users.name); // Accéder au nom dans Redux

    return (
        <View>
            <Text>User Name: {name}</Text>
        </View>
    );
};

export default UserInfo;
