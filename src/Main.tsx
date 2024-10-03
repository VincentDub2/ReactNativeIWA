import UserInfo from "./components/UserInfo";
import {StatusBar} from "expo-status-bar";
import NameInput from "./components/NameInput";
import {StyleSheet, View} from "react-native";


export default function Main() {
    return (
    <View style={styles.container}>
        <UserInfo/>
        <StatusBar style="auto" />
        <NameInput/>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
