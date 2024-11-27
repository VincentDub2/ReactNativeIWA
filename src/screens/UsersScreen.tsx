import React, { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import type { AppDispatch, RootState } from "../app/store";
import { setUserName, setEmail, setPhone, logout, setFirstName, setLastName, updateUserAsync, fetchUserReservationsAsync } from "../features/users/usersSlice";
import CustomButton from "../components/CustomButton";
import UserInfo from "../components/UserInfo";
import isAuthenticated from "../features/users/usersSlice";
import { fetchUserByIdAsync } from "../features/users/usersSlice";
import i18n from "../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {changeLanguageAsync} from "../features/setting/languageSlice";
import {useTranslation} from "react-i18next";

export default function UsersScreen() {
	const navigation = useNavigation<any>();
	const dispatch = useDispatch<AppDispatch>();

	const { t, i18n } = useTranslation();
	const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

	useEffect(() => {
		console.log("Langue sélectionnée :", i18n.language);
		setSelectedLanguage(i18n.language);
	}, [i18n.language]);

	// Récupérer les informations de l'utilisateur via Redux
	const { username, email, firstname, lastname, phone, reservations, isAuthenticated, id } = useSelector((state: RootState) => state.users);

	// Local state to manage edit mode and form inputs
	const [isEditing, setIsEditing] = useState(false);
	const [newUsername, setNewUsername] = useState(username);
	const [newEmail, setNewEmail] = useState(email);
	const [newFirstName, setNewFirstName] = useState(firstname);
	const [newLastName, setNewLastName] = useState(lastname);
	const [newPhone, setNewPhone] = useState(phone);

	// Synchronize local state with Redux state
	useEffect(() => {
		if (!isEditing) {
			setNewUsername(username);
			setNewEmail(email);
			setNewFirstName(firstname);
			setNewLastName(lastname);
			setNewPhone(phone);
		}
	}, [username, email, firstname, lastname, phone, isEditing]);


	const changeLanguage = async () => {
		const newLanguage = i18n.language === "en" ? "fr" : "en";
		console.log("Changement de langue en :", newLanguage);
		await AsyncStorage.setItem("language", newLanguage);
		i18n.changeLanguage(newLanguage);
	};

	useEffect(() => {
		if (isAuthenticated && id !== undefined) {
			// Fonction pour actualiser les données utilisateur
			const refreshUserData = () => {
				//console.log('Rafraîchissement des données utilisateur...');
				dispatch(fetchUserByIdAsync(id));
				dispatch(fetchUserReservationsAsync());
			};

			// Définir un intervalle
			const interval = setInterval(() => {
				refreshUserData();
			}, 5000); // Actualise toutes les 5 secondes

			// Rafraîchir immédiatement une première fois
			refreshUserData();

			// Nettoyage de l’intervalle
			return () => clearInterval(interval);
		}
	}, [isAuthenticated, id, dispatch]);

	useEffect(() => {
		if (isAuthenticated && id) {
			dispatch(fetchUserReservationsAsync());
		}
	}, [isAuthenticated, id, dispatch]);

	// Functions for handling the Edit and Save actions
	const onEdit = () => setIsEditing(true);

	const onSave = () => {
		dispatch(setUserName(newUsername));
		dispatch(setEmail(newEmail));
		dispatch(setFirstName(newFirstName));
		dispatch(setLastName(newLastName));
		dispatch(setPhone(newPhone));
		setIsEditing(false);

		const updatedUser = {
			id, // Récupérez l'ID de l'utilisateur depuis Redux
			username: newUsername,
			email: newEmail,
			firstname: newFirstName,
			lastname: newLastName,
			phone: newPhone,
		};

		// Envoyez les données à l'API
		dispatch(updateUserAsync(updatedUser))
			.then(() => {
				//console.log('Mise à jour réussie.');
				setIsEditing(false);
			})
			.catch((error) => {
				//console.error('Erreur lors de la mise à jour :', error);
			});
	};

	const onCancel = () => {
		setNewUsername(username);
		setNewEmail(email);
		setNewFirstName(firstname);
		setNewLastName(lastname);
		setNewPhone(phone);
		setIsEditing(false);
	};

	useEffect(() => {
        // Redirige vers Login si l'utilisateur est déconnecté
        if (!isAuthenticated) {
            navigation.navigate("Login");
        }
    }, [isAuthenticated, navigation]);

	const handleLogout = () => {
		dispatch(logout()); // Déclenche la déconnexion et met à jour isAuthenticated à false dans le store Redux
		// La redirection se fait automatiquement via useEffect lorsque isAuthenticated passe à false
	};




	return (
		<View style={styles.container}>
			<View style={styles.topBar}>
				{/* Bouton pour changer la langue */}
				<TouchableOpacity onPress={() => changeLanguage()} style={styles.languageButton}>
					<Text style={styles.languageButtonText}>{selectedLanguage === "en" ? "EN" : "FR"}</Text>
				</TouchableOpacity>

				{/* Bouton Logout */}
				<TouchableOpacity onPress={handleLogout} style={styles.logoutButtonContainer}>
					<Text style={styles.logoutButtonText}>Logout</Text>
				</TouchableOpacity>
			</View>

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
							value={newFirstName}
							onChangeText={setNewFirstName}
							placeholder="Enter new first name"
						/>
						<TextInput
							style={styles.input}
							value={newLastName}
							onChangeText={setNewLastName}
							placeholder="Enter new last name"
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
						{email ? (
							<View style={styles.row}>
								<Text style={styles.label}>Email :</Text>
								<Text style={styles.email}>{email}</Text>
							</View>
						) : null}

						{firstname ? (
							<View style={styles.row}>
								<Text style={styles.label}>First name :</Text>
								<Text style={styles.email}>{firstname}</Text>
							</View>
						) : null}

						{lastname ? (
							<View style={styles.row}>
								<Text style={styles.label}>Last name :</Text>
								<Text style={styles.email}>{lastname}</Text>
							</View>
						) : null}

						{phone ? (
							<View style={styles.row}>
								<Text style={styles.label}>Phone :</Text>
								<Text style={styles.phone}>{phone}</Text>
							</View>
						) : null}
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

			{reservations.length > 0 ? (
				<>
					<Text style={styles.reservationsTitle}>Mes réservations</Text>

					<ScrollView style={styles.reservationsContainer} contentContainerStyle={{ paddingBottom: 20 }}>
					{reservations
						.slice() // Crée une copie pour éviter de modifier l'original
						.sort((a, b) => {
							const dateA = a.dateFin ? new Date(a.dateFin).getTime() : 0;
							const dateB = b.dateFin ? new Date(b.dateFin).getTime() : 0;
							return dateA - dateB; // Classement par ordre croissant
						})
						.map((reservation, index) => {
							const isPastReservation =
								reservation.dateFin && new Date(reservation.dateFin) < new Date();

							return (
								<TouchableOpacity
									key={index}
									style={styles.reservationBox}
									onPress={() => {
										if (isPastReservation) {
											navigation.navigate("EvaluationScreen", {
												reservation: reservation,
											});
											//console.log("Évaluation de la réservation :", reservation);
										}
									}}
								>
									<Text style={styles.reservationTitle}>{reservation.nom}</Text>
									<Text>
										Date d'arrivée :{" "}
										{reservation.dateDebut
											? new Date(reservation.dateDebut).toLocaleDateString()
											: "Non définie"}
									</Text>
									<Text>
										Date de départ :{" "}
										{reservation.dateFin
											? new Date(reservation.dateFin).toLocaleDateString()
											: "Non définie"}
									</Text>
									<Text style={styles.reservationAddress}>{reservation.adresse}</Text>
									{isPastReservation && (
										<Text style={styles.pastReservationText}>
											Cliquez pour évaluer cette réservation
										</Text>
									)}
								</TouchableOpacity>
							);
						})}
					</ScrollView>
				</>
			) : (
				<Text style={styles.noReservations}>
					Vous n'avez aucune réservation pour le moment.
				</Text>
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
	row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10,
    },
	separator: {
		height: 2,
		width: "80%",
		backgroundColor: "#ccc",
		marginTop: 30, // Control space between name and separator
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
		maxHeight: 200,
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
	pastReservationText: {
		marginTop: 5,
		fontSize: 14,
		color: "#FF4500", // Rouge ou couleur d'avertissement
		fontStyle: "italic",
	},
	logoutButtonContainer: {
        alignSelf: 'flex-end',
        marginRight: 15,
        marginTop: 10,
        backgroundColor: "#E9D69F", // Couleur de fond
        borderRadius: 25, // Pour rendre le bouton circulaire, il doit être la moitié de la largeur et de la hauteur
        width: 80,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    logoutButtonText: {
        color: "#fff", // Couleur du texte
        fontSize: 16,
        fontWeight: "bold",
    },
	noReservations: {
		marginTop: 20,
		fontSize: 16,
		color: "#555",
		textAlign: "center",
	},
	topBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 15,
		marginTop: 10,
	},
	languageButton: {
		backgroundColor: "#E9D69F",
		borderRadius: 25,
		width: 80,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},

	languageButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},

});
