import DateTimePicker from "@react-native-community/datetimepicker";
import { type RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	Alert,
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import {useDispatch, useSelector} from "react-redux";
import type { RootStackParamList } from "../../types";
import type { RootState } from "../app/store";
import { ReservationController } from "../controllers/ReservationController";
import type { Emplacement } from "../features/emplacements/emplacementSlice";
import { addReservation } from "../features/users/usersSlice";
import type { ReservationRequest } from "../models/Reservation";

type RouteParams = {
	marker: Emplacement;
};

const ReservationScreen = () => {
	const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
	const { marker } = route.params;
	const [dateDebut, setDateDebut] = useState<Date | null>(null);
	const [dateFin, setDateFin] = useState<Date | null>(null);
	const [showDateDebutPicker, setShowDateDebutPicker] = useState(false);
	const [showDateFinPicker, setShowDateFinPicker] = useState(false);
	const [messageSent, setMessageSent] = useState(false);

	type ReservationScreenNavigationProp = StackNavigationProp<
		RootStackParamList,
		"ReservationScreen"
	>;

	console.log("marker", marker);

	const navigation = useNavigation<ReservationScreenNavigationProp>();
	const dispatch = useDispatch();

	const token = useSelector((state: RootState) => state.users.token);
	const userId = useSelector((state: RootState) => state.users.id);

	const formatDateToLocalDateTime = (date: Date): string => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}T00:00:00`;
	};

	const [evaluations, setEvaluations] = useState([]);

	useEffect(() => {
		const fetchEvaluations = async () => {
			try {
				const response = await axios.get(
					`${process.env.EXPO_PUBLIC_API_URL}/evaluation`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);
				// Filtrer les évaluations par l'ID de l'emplacement
				const filteredEvaluations = response.data.filter(
					(evaluation: any) => evaluation.emplacementId === marker.idEmplacement
				);
				setEvaluations(filteredEvaluations);
			} catch (error) {
				console.error("Erreur lors de la récupération des évaluations :", error);
			}
		};

		fetchEvaluations();
	}, [marker.idEmplacement, token]);


	const generateRandomId = (): string => {
		return (
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)
		);
	};

	const handleContactButton = async (hostId: number) => {
		try {
			let conversationId;
			const responseConversations = await axios.get(
				`${process.env.EXPO_PUBLIC_API_URL}/messages/user/${userId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			const conversations = responseConversations.data;
			const existingConversation = conversations.find(
				(conv: any) =>
					(conv.personOneId === userId && conv.personTwoId === hostId) ||
					(conv.personOneId === hostId && conv.personTwoId === userId),
			);

			if (existingConversation) {
				conversationId = existingConversation.id;
			} else {
				const responseCreateConversation = await axios.post(
					`${process.env.EXPO_PUBLIC_API_URL}/messages/conversation`,
					null,
					{
						params: {
							personOneId: userId,
							personTwoId: hostId,
						},
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
				conversationId = responseCreateConversation.data.id;
			}
			const message = new URLSearchParams();
			message.append("conversationId", conversationId.toString());
			message.append("senderId", userId.toString());
			message.append("contenu", "quack!");
			await axios.post(
				`${process.env.EXPO_PUBLIC_API_URL}/messages/send`,
				message,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Bearer ${token}`,
					},
				},
			);
			console.log("Message envoyé : 'quack !'");
			setMessageSent(true);
		} catch (error) {
			console.error("Erreur lors de la gestion du bouton de contact", error);
			console.log("Une erreur s'est produite lors de l'envoi du message.");
		}
	};

	const handleReservation = async () => {
		if (!token) {
			Alert.alert(
				"Erreur",
				"Vous devez être connecté pour effectuer cette action.",
			);
			return;
		}

		if (!dateDebut || !dateFin) {
			Alert.alert("Erreur", "Veuillez sélectionner les dates.");
			return;
		}
		if (dateFin < dateDebut) {
			Alert.alert(
				"Erreur",
				"La date de départ ne peut pas être inférieure à la date d'arrivée.",
			);
			return;
		}

		const reservationId = generateRandomId();

		const body: ReservationRequest = {
			idEmplacement: marker.idEmplacement,
			idVoyageur: userId,
			dateArrive: formatDateToLocalDateTime(dateDebut),
			dateDepart: formatDateToLocalDateTime(dateFin),
			prix: marker.prixParNuit,
		};
		await ReservationController.makeReservation(body, token);
		dispatch(
			addReservation({
				id: reservationId,
				nom: marker.nom,
				dateDebut: formatDateToLocalDateTime(dateDebut),
				dateFin: formatDateToLocalDateTime(dateFin),
				adresse: marker.adresse,
				idEmplacement: marker.idEmplacement,
				idReservation: undefined,
			}),
		);
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			{/* Image de l'emplacement */}
			<Image
				source={typeof marker.image === "string" ? { uri: marker.image } : null}
				style={styles.image}
			/>
			{/* Nom de l'emplacement */}
			<Text style={styles.title}>{marker.nom}</Text>

			{/* Section Description */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Description</Text>
				<Text style={styles.description}>{marker.description}</Text>
			</View>

			{/* Section Adresse */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Adresse</Text>
				<Text style={styles.address}>{marker.adresse}</Text>
			</View>

			{/* Section Adresse */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Commoditées</Text>
				<View>
					{marker.commodites.map((commodite, index) => (
						<Text key={index} style={styles.address}>
							{" "}
							{commodite}
						</Text>
					))}
				</View>
			</View>

			{/* Section Localisation */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Localisation</Text>
				<MapView
					style={styles.map}
					initialRegion={{
						latitude: marker.latitude,
						longitude: marker.longitude,
						latitudeDelta: 0.08,
						longitudeDelta: 0.08,
					}}
				>
					<Marker
						coordinate={{
							latitude: marker.latitude,
							longitude: marker.longitude,
						}}
						title={marker.nom}
						description={marker.adresse}
					/>
				</MapView>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Contacter l'hôte</Text>
				<TouchableOpacity
					style={styles.hostButton}
					onPress={() => {
						if (!messageSent) handleContactButton(marker.idHote);
					}}
				>
					<Text style={styles.confirmButtonText}>
						{messageSent ? "Message envoyé" : "Envoyer un message"}
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Moyenne des avis</Text>
				<View className="items-center">
					<StarRatingDisplay rating={marker.note || 0} />
				</View>
				
			</View>

			<View style={styles.section}>
					<Text style={styles.sectionTitle}>Derniers avis</Text>
					{evaluations.length > 0 ? (
						evaluations.map((evaluation, index) => (
							<View key={index} style={{ marginBottom: 10 }}>
								<Text style={styles.description}>{evaluation.commentaire}</Text>
								<StarRatingDisplay rating={evaluation.note} />
							</View>
						))
					) : (
						<Text style={styles.description}>Aucun avis pour le moment</Text>
					)}
				</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Réserver</Text>

				{/* Bouton pour choisir la date d'arrivée */}
				<TouchableOpacity
					style={styles.hostButton2}
					onPress={() => setShowDateDebutPicker(true)}
				>
					<Text style={styles.buttonText}>Choisir ma date d'arrivée</Text>
				</TouchableOpacity>
				{dateDebut && (
					<Text style={styles.dateText}>
						Date d'arrivée : {dateDebut.toLocaleDateString()}
					</Text>
				)}
				{showDateDebutPicker && (
					<DateTimePicker
						value={dateDebut || new Date()}
						mode="date"
						display={Platform.OS === "ios" ? "inline" : "default"}
						onChange={(event, selectedDate) => {
							setShowDateDebutPicker(false);
							if (selectedDate) setDateDebut(selectedDate);
						}}
					/>
				)}

				{/* Bouton pour choisir la date de départ */}
				<TouchableOpacity
					style={styles.hostButton2}
					onPress={() => setShowDateFinPicker(true)}
				>
					<Text style={styles.buttonText}>Choisir ma date de départ</Text>
				</TouchableOpacity>
				{dateFin && (
					<Text style={styles.dateText}>
						Date de départ : {dateFin.toLocaleDateString()}
					</Text>
				)}
				{showDateFinPicker && (
					<DateTimePicker
						value={dateFin || new Date()}
						mode="date"
						display={Platform.OS === "ios" ? "inline" : "default"}
						onChange={(event, selectedDate) => {
							setShowDateFinPicker(false);
							if (selectedDate) setDateFin(selectedDate);
						}}
					/>
				)}

				{/* Bouton de confirmation */}
				<TouchableOpacity style={styles.hostButton} onPress={handleReservation}>
					<Text style={styles.confirmButtonText}>Confirmer la réservation</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		padding: 16,
	},
	container: {
		flex: 1,
		padding: 20,
		alignItems: "center",
		backgroundColor: "#fff",
	},
	mainTitle: {
		fontSize: 26,
		fontWeight: "bold",

		color: "#333",
		marginBottom: 15,
	},
	emplacementName: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#8B4513",
		marginBottom: 10,
		textAlign: "center",
	},
	emplacementDescription: {
		fontSize: 16,
		color: "#666",
		marginBottom: 20,
	},
	dateText: {
		marginTop: 10,
		fontSize: 16,
		color: "#333",
	},
	button: {
		backgroundColor: "#cccccc", // Couleur des boutons principaux
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginVertical: 10,
		alignItems: "center",
		width: "80%",
	},
	buttonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
	},
	confirmButton: {
		backgroundColor: "#f0ac4e", // Couleur du bouton de confirmation
		paddingVertical: 15,
		paddingHorizontal: 30,
		borderRadius: 9,
		marginTop: 20,
		width: "80%",
		alignItems: "center",
	},
	confirmButtonText: {
		color: "#fff",
		fontSize: 15,
		fontWeight: "bold",
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 10,
		marginBottom: 20,
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 15,
		textAlign: "center",
	},
	section: {
		marginBottom: 20,
		padding: 10,
		backgroundColor: "#fff",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "black",
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
		paddingBottom: 5,
	},
	description: {
		fontSize: 16,
		color: "#666",
		lineHeight: 22,
	},
	address: {
		fontSize: 16,
		color: "#555",
	},
	map: {
		height: 200,
		borderRadius: 10,
	},
	hostButton: {
		backgroundColor: "#f0ac4e", // Couleur du bouton
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		marginVertical: 10,
		width: "80%",
		alignSelf: "center",
	},
	hostButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	hostButton2: {
		backgroundColor: "#e3d2a1", // Couleur du bouton
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		marginVertical: 10,
		width: "80%",
		alignSelf: "center",
	},
});

export default ReservationScreen;
