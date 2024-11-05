import type React from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface UserInfoProps {
	name: string;
	profilePicture?: any;
	isEditing: boolean;
	newUsername: string;
	setNewUsername: (text: string) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ profilePicture, isEditing, newUsername, setNewUsername }) => {
	return (
		<View style={styles.container}>
			{profilePicture && (
				<Image source={profilePicture} style={styles.profilePicture} />
			)}
			{isEditing ? (
				<TextInput
					style={styles.userNameInput}
					value={newUsername}
					onChangeText={setNewUsername}
					placeholder="Enter new username"
				/>
			) : (
				<Text style={styles.userName}>{newUsername}</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30,
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
	userNameInput: {
		fontSize: 24,
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 5,
		width: 200,
		textAlign: "center",
	},
});

export default UserInfo;
