import React from "react";
import {
	View,
	Text,
	Button,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

type WelcomeScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	"Welcome"
>;

export default function WelcomeScreen() {
	const navigation = useNavigation<WelcomeScreenNavigationProp>();

	return (
		<ImageBackground
			source={require("../../assets/images/quack-with-tent-background.png")} // Remplace par le chemin de ton image
			style={styles.background}
		>
			<View style={styles.container}>
				<Text style={styles.welcomeText}>Bienvenue sur Biv'Quack !</Text>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => navigation.navigate("Login")}
					>
						<Text style={styles.buttonText}>Se connecter</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.buttonOutline}
						onPress={() => navigation.navigate("Register")}
					>
						<Text style={styles.buttonOutlineText}>Créer un compte</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		backgroundColor: "rgba(0,0,0,0.5)", // Légère transparence pour le fond
	},
	welcomeText: {
		fontSize: 28,
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 40,
	},
	buttonContainer: {
		width: "80%",
		justifyContent: "space-between",
		alignItems: "center",
	},
	button: {
		backgroundColor: "#d2b48c", // Couleur de fond pour le bouton principal
		paddingVertical: 15,
		paddingHorizontal: 30,
		borderRadius: 30,
		width: "100%",
		alignItems: "center",
		marginVertical: 10,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	buttonOutline: {
		borderColor: "#d2b48c", // Couleur de bordure pour le bouton outline
		borderWidth: 2,
		paddingVertical: 15,
		paddingHorizontal: 30,
		borderRadius: 30,
		width: "100%",
		alignItems: "center",
		marginVertical: 10,
	},
	buttonOutlineText: {
		color: "#d2b48c",
		fontSize: 18,
		fontWeight: "bold",
	},
});
