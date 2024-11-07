import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { setUserName, setEmail, setPhone } from "../features/users/usersSlice";
import CustomButton from "../components/CustomButton";
import UserInfo from "../components/UserInfo";

export default function UsersScreen() {
	const dispatch = useDispatch();
	// Récupérer les informations de l'utilisateur via Redux
	const { username, email, phone, reservations } = useSelector((state: RootState) => state.users);

	// Local state to manage edit mode and form inputs
	const [isEditing, setIsEditing] = useState(false);
	const [newUsername, setNewUsername] = useState(username);
	const [newEmail, setNewEmail] = useState(email);
	const [newPhone, setNewPhone] = useState(phone);

	// Functions for handling the Edit and Save actions
	const onEdit = () => setIsEditing(true);

	const onSave = () => {
		dispatch(setUserName(newUsername));
		dispatch(setEmail(newEmail));
		dispatch(setPhone(newPhone));
		setIsEditing(false);
	};

	const onCancel = () => {
		setNewUsername(username);
		setNewEmail(email);
		setNewPhone(phone);
		setIsEditing(false);
	};

	return (
		<View style={styles.container}>
			<UserInfo
				name={username}
				profilePicture={require("../../assets/images/quack-with-tent-background.png")}
				isEditing={isEditing}
				newUsername={newUsername}
				setNewUsername={setNewUsername}
			/>

			<View style={styles.separator} />

			<View style={styles.infoContainer}>
				{isEditing ? (
					<View>
						<TextInput
							style={styles.input}
							value={newEmail}
							onChangeText={setNewEmail}
							placeholder="Enter new email"
						/>
						<TextInput
							style={styles.input}
							value={newPhone}
							onChangeText={setNewPhone}
							placeholder="Enter new phone"
						/>
					</View>
				) : (
					<View>
						<Text style={styles.email}>{email}</Text>
						<Text style={styles.phone}>{phone}</Text>
					</View>
				)}
			</View>

			<View style={styles.buttonRow}>
				{isEditing ? (
					<>
						<View style={styles.buttonSpacing}>
							<CustomButton action={onSave} color="#4CAF50" text="Save" />
						</View>
						<View style={styles.buttonSpacing}>
							<CustomButton action={onCancel} color="#FF0000" text="Cancel" />
						</View>
					</>
				) : (
					<View style={styles.singleButtonContainer}>
						<CustomButton action={onEdit} color="#E9D69F" text="Edit" />
					</View>
				)}
			</View>

			<View style={styles.separator} />

			{reservations.length > 0 && (
				<>
					<Text style={styles.reservationsTitle}>Mes réservations</Text>

					<ScrollView style={styles.reservationsContainer} contentContainerStyle={{ paddingBottom: 20 }}>
						{reservations.map((reservation, index) => (
							<View key={index} style={styles.reservationBox}>
								<Text style={styles.reservationTitle}>{reservation.nom}</Text>
								<Text>
									{reservation.dateDebut ? new Date(reservation.dateDebut).toLocaleDateString() : 'Date de début non définie'}
								</Text>
								<Text>
									{reservation.dateFin ? new Date(reservation.dateFin).toLocaleDateString() : 'Date de fin non définie'}
								</Text>
								<Text style={styles.reservationAddress}>{reservation.adresse}</Text>
							</View>
						))}
					</ScrollView>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
	infoContainer: {
		alignItems: "center",
		marginTop: 20,
	},
	separator: {
		height: 2,
		width: "80%",
		backgroundColor: "#ccc",
		marginTop: 10, // Control space between name and separator
		marginBottom: -10, // Control space between separator and email
	},
	email: {
		fontSize: 18,
		color: "#333",
		marginBottom: 5,
	},
	phone: {
		fontSize: 18,
		color: "#333",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		marginVertical: 5,
		width: 200,
		fontSize: 18,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "center",
		width: "60%",
		marginTop: 20,
	},
	buttonSpacing: {
		marginHorizontal: 10, // Adjust the spacing as needed
	},
	singleButtonContainer: {
		width: "50%",
		alignItems: "center",
	},
	reservationsTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginTop: 20,
		color: "#333",
	},
	reservationsContainer: {
		width: "100%",
		marginTop: 10,
		maxHeight: 300,
	},
	reservationBox: {
		backgroundColor: "#E9D69F",
		padding: 10,
		marginVertical: 5,
		marginHorizontal: 15,
		borderRadius: 8,
	},
	reservationTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	reservationDates: {
		fontSize: 14,
		color: "#555",
		marginTop: 5,
	},
	reservationAddress: {
		fontSize: 14,
		color: "#555",
		marginTop: 5,
	},
});