import axios from "axios";
import { getToken } from "../utils/auth";
import React, { useState, useEffect } from "react";
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { head } from "axios";

export default function MessagingScreen() {
	const [conversations, setConversations] = useState<
		{
			id: number;
			personOneId: number;
			personTwoId: number;
		}[]
	>([]);
	const [selectedConversation, setSelectedConversation] = useState<{
		id: number;
		messages: {
			id: number;
			senderId: number;
			content: string;
			date: string;
		}[];
	} | null>(null);
	const [newMessage, setNewMessage] = useState("");

	const {
		username,
		email,
		firstname,
		lastname,
		phone,
		reservations,
		isAuthenticated,
		id,
	} = useSelector((state: RootState) => state.users);

	useEffect(() => {
		const fetchConversations = async () => {
			const token = getToken();
			try {
				const userId = id;
				const response = await axios.get(
					`${process.env.EXPO_PUBLIC_API_URL}/messages/user/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
	
				// Précharger les noms d'utilisateurs
				const enrichedConversations = await Promise.all(
					response.data.map(async (conversation: any) => {
						const otherPersonId =
							conversation.personOneId === id
								? conversation.personTwoId
								: conversation.personOneId;
	
						try {
							const userResponse = await axios.get(
								`${process.env.EXPO_PUBLIC_API_URL}/user/${otherPersonId}`,
								{ headers: { Authorization: `Bearer ${token}` } },
							);
							return {
								...conversation,
								username: userResponse.data.username || "Utilisateur inconnu",
							};
						} catch (error) {
							console.error(
								"Erreur lors de la récupération du nom de l'utilisateur",
								error,
							);
							return { ...conversation, username: "Utilisateur inconnu" };
						}
					}),
				);
	
				setConversations(enrichedConversations);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des conversations",
					error,
				);
			}
		};
	
		fetchConversations();
	}, [id]);

	const handleSelectConversation = async (conversationId: number) => {
		try {
			const token = getToken();
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_API_URL}/messages/conversation/${conversationId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			// La réponse est un tableau de messages
			const messages = response.data;

			if (!Array.isArray(messages)) {
				console.warn("Response data is not an array:", messages);
				throw new Error("Invalid response format");
			}

			setSelectedConversation({
				id: conversationId,
				messages: messages.map((msg: any) => ({
					id: msg.id,
					senderId: msg.senderId, // Utilise senderId directement
					content: msg.contenu, // Utilise contenu directement
					date: msg.date, // Utilise date directement
				})),
			});
		} catch (error) {
			console.error("Erreur lors de la récupération des messages", error);
		}
	};

	const handleSendMessage = async () => {
		if (newMessage.trim() !== "" && selectedConversation) {
			const message = new URLSearchParams();
			message.append("conversationId", selectedConversation.id.toString());
			message.append("senderId", id.toString());
			message.append("contenu", newMessage);

			try {
				const token = getToken();
				const response = await axios.post(
					`${process.env.EXPO_PUBLIC_API_URL}/messages/send`,
					message,
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							Authorization: `Bearer ${token}`,
						},
					},
				);

				const newMsg = response.data;
				setSelectedConversation({
					...selectedConversation,
					messages: [
						...selectedConversation.messages,
						{
							id: newMsg.id,
							senderId: newMsg.senderId,
							content: newMsg.contenu,
							date: newMsg.date,
						},
					],
				});
				setNewMessage("");
			} catch (error) {
				console.error("Erreur lors de l'envoi du message", error);
			}
		}
	};

	const renderConversationList = () => (
		<FlatList
			data={conversations}
			keyExtractor={(item) => item.id.toString()}
			renderItem={({ item }) => (
				<TouchableOpacity
					style={styles.conversationItem}
					onPress={() => handleSelectConversation(item.id)}
				>
					<Text style={styles.conversationText}>{item.username}</Text>
				</TouchableOpacity>
			)}
		/>
	);

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${hours}:${minutes}`;
	};

	const formatFullDate = (dateString: string) => {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, "0");
		const month = date.toLocaleString("default", { month: "short" });
		const year = date.getFullYear();
		return `${day} ${month} ${year}`;
	};

	const renderMessages = () => (
		<View style={styles.messagesContainer}>
			<FlatList
				data={selectedConversation?.messages}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item, index}) => {
					const isSender = item.senderId === id; // L'utilisateur connecté
					const currentMessageDate = formatFullDate(item.date);

					// Vérifie si la date précédente est différente
					const previousMessage = selectedConversation?.messages[index - 1];
					const previousMessageDate = previousMessage
						? formatFullDate(previousMessage.date)
						: null;

					const showDate = currentMessageDate !== previousMessageDate;
					return (
						<View>
						{showDate && (
                            <Text style={styles.dateSeparator}>{currentMessageDate}</Text>
                        )}
						<View
							style={[
								styles.messageBubble,
								isSender ? styles.senderBubble : styles.receiverBubble,
							]}
						>
							<Text style={styles.messageText}>{item.content}</Text>
							<Text style={styles.messageDate}>{formatTime(item.date)}</Text>
						</View>
						</View>
					);
				}}
			/>
			<View style={styles.inputContainer}>
				<TextInput
					value={newMessage}
					onChangeText={setNewMessage}
					placeholder="Écrire un message..."
					placeholderTextColor="#999"
					style={styles.messageInput}
				/>
				<TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
					<Text style={styles.sendButtonText}>Envoyer</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			{selectedConversation ? (
				<View style={{ flex: 1 }}>
					<Button
						title="Retour aux conversations"
						color="#d1a165"
						onPress={() => setSelectedConversation(null)}
					/>
					{renderMessages()}
				</View>
			) : (
				renderConversationList()
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#faf3e0", // Fond beige
	},
	conversationItem: {
		padding: 16,
		backgroundColor: "#f0e4c3",
		marginVertical: 4,
		marginHorizontal: 16,
		borderRadius: 12,
	},
	conversationText: {
		fontSize: 18,
		color: "#3e2723",
		fontFamily: "sans-serif-medium", // Adapter si vous avez une police personnalisée
	},
	messagesContainer: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	messageBubble: {
		padding: 12,
		borderRadius: 10,
		marginVertical: 4,
		maxWidth: "80%",
	},
	senderBubble: {
		alignSelf: "flex-end",
		backgroundColor: "#d1f7c4", // Vert pâle pour les messages de l'utilisateur
	},
	receiverBubble: {
		alignSelf: "flex-start",
		backgroundColor: "#f0e4c3", // Beige pour les messages des autres
	},
	messageText: {
		color: "#3e2723",
		fontSize: 16,
	},
	messageDate: {
		fontSize: 12,
		color: "#999",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
	},
	messageInput: {
		flex: 1,
		padding: 10,
		backgroundColor: "#fff",
		borderColor: "#d1a165",
		borderWidth: 1,
		borderRadius: 20,
		marginRight: 8,
		color: "#3e2723",
	},
	sendButton: {
		backgroundColor: "#d1a165",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20,
	},
	sendButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	dateSeparator: {
        textAlign: "center",
        fontSize: 14,
        color: "#666",
        marginVertical: 10,
        fontWeight: "bold",
    },
});
