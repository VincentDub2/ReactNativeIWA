import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import EmplacementController from "./EmplacementController";
import {Emplacement} from "../models/Emplacement";

Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

export default class MapScreenController {
    // Récupérer la localisation de l'utilisateur
    static async getUserLocation() : Promise<Location.LocationObject> {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                throw new Error("Permission denied");
            }
            return await Location.getCurrentPositionAsync({});
        } catch (error) {
            console.error("Erreur lors de la récupération de la localisation :", error);
            throw error;
        }
    }

    // Charger les emplacements depuis l'API
    static async loadEmplacements() : Promise<Emplacement[]> {
        try {
            const emplacements = await EmplacementController.fetchAllEmplacements();
            //console.log("emplacements", emplacements);
            return emplacements;
        } catch (error) {
            console.error("Erreur lors du chargement des emplacements :", error);
            throw error;
        }
    }

    // Géocoder un nom de ville pour obtenir ses coordonnées
    static async geocodeCityName(city: string) {
        try {
            const json = await Geocoder.from(city);
            if (json.results.length > 0) {
                const location = json.results[0].geometry.location;
                return {
                    latitude: location.lat,
                    longitude: location.lng,
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Erreur lors du géocodage :", error);
            throw error;
        }
    }
}