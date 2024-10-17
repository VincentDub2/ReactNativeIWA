import type React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
	action?: () => void;
	color?: string;
	text?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
	action,
	color = "#007BFF",
	text = "Button",
}) => {
	return (
		<TouchableOpacity
			style={[styles.button, { backgroundColor: color }]}
			onPress={action}
		>
			<Text style={styles.buttonText}>{text}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		marginVertical: 10,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default CustomButton;
