import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import {AppDispatch} from "../app/store";
import {fetchEmplacementsAsync} from "../features/emplacements/emplacementSlice";


Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

export default class MapScreenController {
    private readonly dispatch: AppDispatch;

    constructor(dispatch: AppDispatch) {
        this.dispatch = dispatch;
    }

    // Récupérer la localisation de l'utilisateur
    async getUserLocation() : Promise<Location.LocationObject> {
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


    /**
     * Charge les notifications pour l'utilisateur actuel.
     */
    async loadEmplacements(): Promise<void> {
        try {
            console.log("Chargement des emplacements...");
            await this.dispatch(fetchEmplacementsAsync()).unwrap();
        } catch (error) {
            console.error('Erreur lors du chargement des notifications :', error);
        }
    }

    // Géocoder un nom de ville pour obtenir ses coordonnées
    async geocodeCityName(city: string) {
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
