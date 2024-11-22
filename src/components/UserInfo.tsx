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
		flex: 1, // Utilisez un ratio normal pour le conteneur
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 20, // Ajoute de l'espace en haut et en bas à l'intérieur du conteneur
		marginVertical: 20, // Ajoute de l'espace autour du conteneur dans son parent
	},
	profilePicture: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 4,
	},
	userName: {
		fontSize: 24,
		fontWeight: "bold",
	},
	userNameInput: {
		fontSize: 18,
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 15,
		width: 200,
		textAlign: "center",
	},
});

export default UserInfo;
