import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	TextInput,
	Button,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import conversationsData from "../../assets/data/conversation.json";

export default function MessagingScreen() {
	const [conversations, setConversations] = useState<
		{
			id: number;
			messages: {
				id: number;
				senderId: number;
				receiverId: number;
				content: string;
			}[];
		}[]
	>([]);
	const [selectedConversation, setSelectedConversation] = useState<{
		id: number;
		messages: {
			id: number;
			senderId: number;
			receiverId: number;
			content: string;
		}[];
	} | null>(null);
	const [newMessage, setNewMessage] = useState("");

	useEffect(() => {
		// Charge les conversations depuis le fichier JSON
		setConversations(conversationsData.conversations);
	}, []);

	const handleSelectConversation = (conversationId: number) => {
		const conversation = conversations.find(
			(conv) => conv.id === conversationId,
		);
		if (conversation) {
			setSelectedConversation(conversation);
		}
	};

	const handleSendMessage = () => {
		if (newMessage.trim() !== "" && selectedConversation) {
			const message = {
				id: selectedConversation.messages.length + 1,
				senderId: 1, // Simuler l'utilisateur connecté avec l'id 1
				receiverId: 2, // À adapter selon la conversation
				content: newMessage,
			};

			// Mettre à jour les messages dans la conversation
			setSelectedConversation({
				...selectedConversation,
				messages: [...selectedConversation.messages, message],
			});
			setNewMessage("");
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
					<Text style={styles.conversationText}>Conversation {item.id}</Text>
				</TouchableOpacity>
			)}
		/>
	);

	const renderMessages = () => (
		<View style={styles.messagesContainer}>
			<FlatList
				data={selectedConversation.messages}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => {
					const isSender = item.senderId === 1; // Simuler l'utilisateur connecté avec l'id 1
					return (
						<View
							style={[
								styles.messageBubble,
								isSender ? styles.senderBubble : styles.receiverBubble,
							]}
						>
							<Text style={styles.messageText}>{item.content}</Text>
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
