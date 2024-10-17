import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import CustomButton from "../components/CustomButton"; // Import du bouton réutilisable
import Spacer from "../components/Spacer";
import UserInfo from "../components/UserInfo";

export default function UsersScreen() {
	// Récupérer les informations de l'utilisateur via Redux
	const { name, email } = useSelector((state: RootState) => state.users);

	// Fonctions pour les boutons
	const onEdit = () => {
		console.log("Edit button pressed");
	};

	const onDelete = () => {
		console.log("Delete button pressed");
	};

	return (
		<View style={styles.container}>
			<UserInfo
				name={name}
				profilePicture={require("../../assets/images/quack-with-tent-background.png")}
			/>
			<Spacer />
			<Text style={styles.email}>{email}</Text>

			<Spacer />

			<View style={styles.buttonRow}>
				<CustomButton action={onEdit} color="#E9D69F" text="Edit" />
				<CustomButton action={onDelete} color="#FF0000" text="Delete" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#f5f5f5", // Couleur de fond pour rendre la page plus agréable
	},
	email: {
		fontSize: 18,
		color: "#333",
		marginVertical: 10,
	},
	buttonRow: {
		flexDirection: "row", // Affiche les boutons côte à côte
		justifyContent: "space-between", // Espace entre les boutons
		width: "60%", // Largeur pour contenir les deux boutons
	},
});
