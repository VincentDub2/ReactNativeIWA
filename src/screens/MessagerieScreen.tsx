import axios from "axios";
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

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const userId = 1; // A remplacer par l'ID réel de l'utilisateur connecté
				const response = await axios.get(
					`${process.env.EXPO_PUBLIC_API_URL}/messages/user/${userId}`,
				);
				setConversations(response.data);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des conversations",
					error,
				);
			}
		};
		fetchConversations();
	}, []);

	const handleSelectConversation = async (conversationId: number) => {
		try {
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_API_URL}/messages/conversation/${conversationId}`,
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
			message.append("senderId", "1"); // Remplacez par l'ID réel de l'utilisateur
			message.append("contenu", newMessage);

			try {
				const response = await axios.post(
					`${process.env.EXPO_PUBLIC_API_URL}/messages/send`,
					message,
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
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
				setNewMessage(""); // Réinitialiser le champ de saisie
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
					<Text style={styles.conversationText}>
						Conversation avec user {item.personTwoId}
					</Text>
				</TouchableOpacity>
			)}
		/>
	);

	const renderMessages = () => (
		<View style={styles.messagesContainer}>
			<FlatList
				data={selectedConversation?.messages}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => {
					const isSender = item.senderId === 1; // L'utilisateur connecté
					return (
						<View
							style={[
								styles.messageBubble,
								isSender ? styles.senderBubble : styles.receiverBubble,
							]}
						>
							<Text style={styles.messageText}>{item.content}</Text>
							<Text style={styles.messageDate}>{item.date}</Text>
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
});
