import type React from "react";
import { StyleSheet, View } from "react-native";

const Spacer: React.FC = () => {
	return <View style={styles.separator} />;
};

export default Spacer;

const styles = StyleSheet.create({
	separator: {
		height: 1,
		width: "90%",
		backgroundColor: "#ccc",
	},
});
