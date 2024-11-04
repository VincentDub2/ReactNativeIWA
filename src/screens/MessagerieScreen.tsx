import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	TextInput,
	Button,
	TouchableOpacity,
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
				<TouchableOpacity onPress={() => handleSelectConversation(item.id)}>
					<Text style={{ padding: 16, fontSize: 18, borderBottomWidth: 1 }}>
						Conversation {item.id}
					</Text>
				</TouchableOpacity>
			)}
		/>
	);

	const renderMessages = () => (
		<View style={{ flex: 1 }}>
			<FlatList
				data={selectedConversation.messages}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => {
					const isSender = item.senderId === 1; // Simuler l'utilisateur connecté avec l'id 1
					return (
						<View
							style={{
								padding: 8,
								alignSelf: isSender ? "flex-end" : "flex-start",
								backgroundColor: isSender ? "#d1f7c4" : "#f0f0f0",
								borderRadius: 8,
								marginVertical: 4,
							}}
						>
							<Text>{item.content}</Text>
						</View>
					);
				}}
			/>
			<TextInput
				value={newMessage}
				onChangeText={setNewMessage}
				placeholder="Écrire un message..."
				style={{
					borderColor: "gray",
					borderWidth: 1,
					padding: 8,
					margin: 8,
					borderRadius: 8,
				}}
			/>
			<Button title="Envoyer" onPress={handleSendMessage} />
		</View>
	);

	return (
		<View style={{ flex: 1, paddingTop: 16 }}>
			{selectedConversation ? (
				<View style={{ flex: 1 }}>
					<Button
						title="Retour aux conversations"
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
