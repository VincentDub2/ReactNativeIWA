import type React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface UserInfoProps {
	name: string;
	profilePicture?: any;
}

const UserInfo: React.FC<UserInfoProps> = ({ profilePicture, name }) => {
	return (
		<View style={styles.container}>
			{profilePicture && (
				<Image source={profilePicture} style={styles.profilePicture} />
			)}
			<Text style={styles.userName}>{name}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	profilePicture: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 20,
	},
	userName: {
		fontSize: 24,
		fontWeight: "bold",
	},
});

export default UserInfo;
