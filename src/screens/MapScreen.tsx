import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import Geocoder from "react-native-geocoding";
import SearchFilter from "../components/map/SearchFilter";
import CustomMarker from "../components/map/CustomMarker";
import { useTranslation } from "react-i18next";
import { Emplacement } from "../models/Emplacement";
import MapScreenController from "../controllers/MapScreenController";


Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

const MapScreen = () => {
	const { t } = useTranslation();
	const mapRef = useRef<any>();
	const [location, setLocation] = useState<LocationObject | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [markers, setMarkers] = useState<any[]>([]);
	const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
	const [cityName, setCityName] = useState("");
	const [searchRadius, setSearchRadius] = useState(10); // Rayon par défaut en km
	const [cityCoordinates, setCityCoordinates] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [minCapacity, setMinCapacity] = useState<number>(1);

	const toggleAmenity = (amenityId: string) => {
		if (selectedAmenities.includes(amenityId)) {
			setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
		} else {
			setSelectedAmenities([...selectedAmenities, amenityId]);
		}
	};

	const increaseCapacity = () => {
		setMinCapacity((prevCapacity) => prevCapacity + 1);
	};

	const decreaseCapacity = () => {
		setMinCapacity((prevCapacity) => (prevCapacity > 1 ? prevCapacity - 1 : 1));
	};


	// Charger les emplacements
	useEffect(() => {
		const loadMarkers = async () => {
			try {
				const loadedMarkers = await MapScreenController.loadEmplacements();
				setMarkers(loadedMarkers);
			} catch (error) {
				Alert.alert(t("map.error_loading_data"));
			}
		};
		loadMarkers();
	}, []);

	// Récupérer la localisation de l'utilisateur
	useEffect(() => {
		const fetchLocation = async () => {
			try {
				const userLocation = await MapScreenController.getUserLocation();
				setLocation(userLocation);
			} catch (error) {
				Alert.alert(t("map.permission_denied"));
			}
		};
		fetchLocation();
	}, []);

	// Gestion de la recherche
	const handleSearch = async () => {
		if (cityName.trim() === "") {
			Alert.alert(t("please_enter_city_name"));
			return;
		}

		try {
			const geocodedLocation = await MapScreenController.geocodeCityName(cityName);
			if (geocodedLocation) {
				mapRef.current.animateToRegion({
					latitude: geocodedLocation.latitude,
					longitude: geocodedLocation.longitude,
					latitudeDelta: 0.1,
					longitudeDelta: 0.1,
				});
				setIsAccordionExpanded(false);
			} else {
				Alert.alert(t("map.city_not_found"));
			}
		} catch (error) {
			Alert.alert(t("map.error_occurred"));
		}
	};

	// Filtrer les marqueurs
	const filterMarkers = () =>
		markers.filter((marker) => {
			// Filtrer par commodités
			if (selectedAmenities.length > 0) {
				for (const amenityId of selectedAmenities) {
					if (!marker.amenities.includes(amenityId)) {
						return false;
					}
				}
			}
			// Filtrer par capacité
			return marker.capacity >= minCapacity;
		});

	return (
		<View style={{ flex: 1 }}>
			{/* Filtre de recherche */}
			<SearchFilter
				isAccordionExpanded={isAccordionExpanded}
				setIsAccordionExpanded={setIsAccordionExpanded}
				cityName={cityName}
				setCityName={setCityName}
				searchRadius={searchRadius}
				setSearchRadius={setSearchRadius}
				selectedAmenities={selectedAmenities}
				toggleAmenity={toggleAmenity}
				minCapacity={minCapacity}
				increaseCapacity={increaseCapacity}
				decreaseCapacity={decreaseCapacity}
				handleSearch={handleSearch}
			/>

			{/* Carte */}
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={{
					latitude: location?.coords?.latitude || 37.78825,
					longitude: location?.coords?.longitude || -122.4324,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				showsUserLocation={true}
			>
				{/* Afficher les marqueurs filtrés */}
				{filterMarkers().map((marker, index) => (
					<CustomMarker key={index} marker={marker} />
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
