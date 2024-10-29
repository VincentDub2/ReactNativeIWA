import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fr from "../locales/fr.json";
import en from "../locales/en.json";


const resources = {
    "en-US": { translation: en },
    "fr-FR": { translation: fr },
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem("language");

    if (!savedLanguage) {
        savedLanguage = Localization.getLocales()[0].languageCode;
    }

    i18n.use(initReactI18next).init({
        compatibilityJSON: "v3",
        resources,
        lng: savedLanguage?.startsWith('fr') ? 'fr' : 'en',
        fallbackLng: "en-US",
        interpolation: {
            escapeValue: false,
        },
    });
};

initI18n().then(r => console.log("i18n initialized"));

export default i18n;
