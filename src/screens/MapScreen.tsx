import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import SearchFilter from "../components/map/SearchFilter";
import CustomMarker from "../components/map/CustomMarker";

import { Emplacement } from "../models/Emplacement";
import MapScreenController from "../controllers/MapScreenController";
import { useTranslation } from "react-i18next";

Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

const MapScreen = () => {
	const { t } = useTranslation();

	const mapRef = useRef<any>();
	const [location, setLocation] = useState<Location.LocationObject | null>(null);
	const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
	const [cityName, setCityName] = useState("");
	const [searchRadius, setSearchRadius] = useState(10); // Rayon par défaut en km
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [minCapacity, setMinCapacity] = useState<number>(1);
	const [markers, setMarkers] = useState<Emplacement[]>([]);

	// Charger tous les emplacements
	useEffect(() => {
		const loadMarkers = async () => {
			try {
				const loadedMarkers = await MapScreenController.loadEmplacements();
				setMarkers(loadedMarkers);
				console.log("Emplacements chargés :", loadedMarkers);
			} catch (error) {
				Alert.alert(t("map.error_loading_data"));
			}
		};
		loadMarkers();
	}, [t]);

	// Récupérer la localisation de l'utilisateur
	useEffect(() => {
		const fetchLocation = async () => {
			try {
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== "granted") {
					setLocation(null);
					Alert.alert(t("map.permission_denied"));
					return;
				}
				const userLocation = await Location.getCurrentPositionAsync({});
				setLocation(userLocation);
				if (mapRef.current) {
					mapRef.current.animateToRegion({
						latitude: userLocation.coords.latitude,
						longitude: userLocation.coords.longitude,
						latitudeDelta: 0.1,
						longitudeDelta: 0.1,
					});
				}
			} catch (error) {
				Alert.alert(t("map.error_occurred"));
			}
		};
		fetchLocation();
	}, [t]);

	return (
		<View style={{ flex: 1 }}>
			<SearchFilter
				isAccordionExpanded={isAccordionExpanded}
				setIsAccordionExpanded={setIsAccordionExpanded}
				cityName={cityName}
				setCityName={setCityName}
				searchRadius={searchRadius}
				setSearchRadius={setSearchRadius}
				selectedAmenities={selectedAmenities}
				toggleAmenity={(amenityId) =>
					setSelectedAmenities((prev) =>
						prev.includes(amenityId)
							? prev.filter((id) => id !== amenityId)
							: [...prev, amenityId]
					)
				}
				minCapacity={minCapacity}
				increaseCapacity={() => setMinCapacity((prev) => prev + 1)}
				decreaseCapacity={() => setMinCapacity((prev) => (prev > 1 ? prev - 1 : 1))}
			/>
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={{
					latitude: location?.coords?.latitude || 43.61609385259106,
					longitude: location?.coords?.longitude || 3.8512520758997955,
					latitudeDelta: 0.2,
					longitudeDelta: 0.2,
				}}
				showsUserLocation={true}
			>
				{/* Afficher tous les marqueurs */}
				{markers.map((marker) => (
					<CustomMarker
						key={marker.idEmplacement}
						marker={marker}
					/>
				))}
			</MapView>
		</View>
	);
};

const styles = StyleSheet.create({
	map: {
		flex: 1,
	},
});

export default MapScreen;
