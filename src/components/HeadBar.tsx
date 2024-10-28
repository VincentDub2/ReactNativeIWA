import {Image, View} from "react-native";
import React from "react";

export default function HeadBar() {
    return (
        <View className="flex flex-row items-center justify-between px-4 bg-primary pt-8">
            <Image className="pl-6 w-20 h-2O" source={require('../../assets/images/logo.png')} />
            <Image className="w-64 h-20" source={require('../../assets/images/name.png')} />
            <Image  className="w-10 h-10 mr-4 mt-4" source={require('../../assets/images/message_circle.png')} />
        </View>
    );
}
