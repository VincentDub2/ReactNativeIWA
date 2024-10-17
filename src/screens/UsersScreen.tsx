import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import UserInfo from "../components/UserInfo";
import { logout } from "../features/users/usersSlice";
import { RootState } from "../app/store";

interface UsersScreenProps {
	name: string;
	profilePicture: string;
}

export default function UsersScreen() {
	const dispatch = useDispatch();

	const onLogout = () => {
		// Déconnexion de l'utilisateur
		dispatch(logout());
	};
	return (
		<View style={styles.container}>
			<UserInfo
				name={useSelector((state: RootState) => state.users.name)}
				profilePicture={require("../../assets/images/quack-with-tent-background.png")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
