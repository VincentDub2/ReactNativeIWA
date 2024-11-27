import {Image, View, TouchableOpacity, StyleSheet, Text, Modal} from "react-native";
import React, {useEffect, useState} from "react";
import { useNavigation } from "@react-navigation/native";
import NotificationsView from "../View/NotificationsView";
import {useDispatch, useSelector} from "react-redux";
import {fetchNotifications} from "../features/notifications/notificationsSlice";
import {AppDispatch, RootState} from "../app/store";

export default function HeadBar() {
	const navigation = useNavigation();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const dispatch = useDispatch<AppDispatch>();
	const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
	const isLoading = useSelector((state: RootState) => state.notifications.loading);
	const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated); // Vérifiez si l'utilisateur est authentifié

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchNotifications());
		}
	}, [dispatch, isAuthenticated]); // Déclenchez uniquement si l'utilisateur est authentifié

	// Fonction pour ouvrir le modal
	const openNotificationsModal = () => {
		setIsModalVisible(true);
	};

	// Fonction pour fermer le modal
	const closeNotificationsModal = () => {
		setIsModalVisible(false);
	};

	return (
		<View className="flex flex-row items-center justify-between px-4 bg-primary pt-8">
			<View style={{ position: "relative" }}>
				{/* Logo avec clic pour ouvrir le modal */}
				<TouchableOpacity onPress={openNotificationsModal}>
					<Image
						className="pl-6 w-20 h-20"
						source={require("../../assets/images/logo.png")}
					/>
					{/* Badge */}
					{unreadCount > 0 && (
						<View style={styles.badge}>
							<Text style={styles.badgeText}>{unreadCount}</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>
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
			{/* Modal pour afficher NotificationsView */}
			<Modal
				visible={isModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={closeNotificationsModal}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<NotificationsView />
						<TouchableOpacity onPress={closeNotificationsModal} className="bg-primary-100 rounded p-2 items-center font-bold">
							<Text className="color-white font-bold text-xl">Fermer</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}


const styles = StyleSheet.create({
	badge: {
		position: "absolute",
		top: 8,
		right: -5,
		backgroundColor: "red",
		width: 20,
		height: 20,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	badgeText: {
		color: "white",
		fontSize: 12,
		fontWeight: "bold",
	},
	modalContainer: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
	},
});
