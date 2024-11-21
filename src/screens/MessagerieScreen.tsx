import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	View,
	Text,
	FlatList,
	TextInput,
	Button,
	TouchableOpacity,
	StyleSheet,
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
					`http://162.38.38.87:8090/api/v1/messages/user/${userId}`,
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
				`http://162.38.38.87:8090/api/v1/messages/conversation/${conversationId}`,
			);
			const conversation = response.data;
			setSelectedConversation({
				id: conversationId,
				messages: conversation.messages.map((msg: any) => ({
					id: msg.id,
					senderId: msg.sender_id,
					content: msg.contenu,
					date: msg.date,
				})),
			});
		} catch (error) {
			console.error("Erreur lors de la récupération des messages", error);
		}
	};

	const handleSendMessage = async () => {
		if (newMessage.trim() !== "" && selectedConversation) {
			const message = {
				conversationId: selectedConversation.id,
				senderId: 1, // A remplacer par l'ID de l'utilisateur connecté
				contenu: newMessage,
			};

			try {
				const response = await axios.post(
					"http://162.38.38.87:8090/api/v1/messages/send",
					message,
				);
				const newMsg = response.data;
				setSelectedConversation({
					...selectedConversation,
					messages: [
						...selectedConversation.messages,
						{
							id: newMsg.id,
							senderId: newMsg.sender_id,
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
						Conversation entre {item.personOneId} et {item.personTwoId}
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
