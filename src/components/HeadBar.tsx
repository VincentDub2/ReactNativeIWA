import { Image, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function HeadBar() {
	const navigation = useNavigation();

	return (
		<View className="flex flex-row items-center justify-between px-4 bg-primary pt-8">
			<Image
				className="pl-6 w-20 h-20"
				source={require("../../assets/images/logo.png")}
			/>
			<Image
				className="w-64 h-20"
				source={require("../../assets/images/name.png")}
			/>
			<TouchableOpacity
				onPress={() => navigation.navigate("Messagerie")}
				className="w-10 h-10 mr-4 mt-4"
			>
				<Image
					source={require("../../assets/images/message_circle.png")}
					style={{ width: 40, height: 40 }}
				/>
			</TouchableOpacity>
		</View>
	);
}
