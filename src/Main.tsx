import UserInfo from "./components/UserInfo";
import {StatusBar} from "expo-status-bar";
import NameInput from "./components/NameInput";
import {StyleSheet, View} from "react-native";
import NavigationTab from "./components/NavigationTab";


export default function Main() {
    return (
    <View style={styles.container}>
        <UserInfo/>
        <StatusBar style="auto" />
        <NameInput/>
        <NavigationTab/>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});
