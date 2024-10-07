import { View} from "react-native";
import NavigationTab from "./components/NavigationTab";
import "./global.css";


export default function Main() {
    return (
        <View className='h-full flex'>
            <NavigationTab/>
        </View>
    );
}


