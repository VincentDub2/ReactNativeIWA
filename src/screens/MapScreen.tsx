import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import Geocoder from "react-native-geocoding";
import SearchFilter from "../components/map/SearchFilter";
import CustomMarker from "../components/map/CustomMarker";
import { useTranslation } from "react-i18next";

Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

const MapScreen = () => {
	const { t } = useTranslation();
	const mapRef = useRef<any>();
	const [location, setLocation] = useState<LocationObject | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
	const [cityName, setCityName] = useState("");
	const [searchRadius, setSearchRadius] = useState(10); // Rayon par défaut en km
	const [cityCoordinates, setCityCoordinates] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [minCapacity, setMinCapacity] = useState<number>(1);

	const [markers, setMarkers] = useState<any[]>([]);


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

	const generateRandomPoint = (
		latitude: number,
		longitude: number,
		radiusInKm: number,
	) => {
		const radiusInDegrees = radiusInKm / 111.32; // Approximation du rayon en degrés

		const u = Math.random();
		const v = Math.random();

		const w = radiusInDegrees * Math.sqrt(u);
		const t = 2 * Math.PI * v;

		const deltaLat = w * Math.cos(t);
		const deltaLng = w * Math.sin(t);

		const newLat = latitude + deltaLat;
		const newLng = longitude + deltaLng;

		return { latitude: newLat, longitude: newLng };
	};

	const generateRandomMarkers = (
		latitude: number,
		longitude: number,
		radiusInKm: number,
	) => {
		const randomMarkers = [];

		const amenitiesOptions = [
			t("map.amenities.electrical_outlet"),
			t("map.amenities.shower"),
			t("map.amenities.drinkable_water"),
			t("map.amenities.toilets"),
			t("map.amenities.wifi"),
			t("map.amenities.barbecue"),
		];

		for (let i = 0; i < 20; i++) {
			const randomPoint = generateRandomPoint(latitude, longitude, radiusInKm);

			// Sélectionner des commodités aléatoires
			const markerAmenities = amenitiesOptions.filter(
				() => Math.random() < 0.5,
			);

			// Générer une capacité aléatoire entre 1 et 10
			const capacity = Math.floor(Math.random() * 10) + 1;	
			
			// Générer un id aléatoire pour chaque emplacement
			const id = Math.floor(Math.random() * 100) + 1;
			
			randomMarkers.push({
				id: id,
				latitude: randomPoint.latitude,
				longitude: randomPoint.longitude,
				title: t("map.bivouac_location", { number: i + 1 }),
				description: t("map.bivouac_description", { number: i + 1 }),
				prix: Math.floor(Math.random() * 100) + 1,
				rating: Math.floor(Math.random() * 5) + 1,
				amenities: markerAmenities,
				capacity: capacity,
			});
		}
		setMarkers(randomMarkers);
	};

	useEffect(() => {
		(async () => {
			// Demande d'autorisation pour la localisation
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(t("map.permission_denied"));
				return;
			}

			// Obtenir la localisation actuelle
			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
			generateRandomMarkers(
				location.coords.latitude,
				location.coords.longitude,
				searchRadius,
			);
		})();
	}, []);

	// Mettre à jour les marqueurs lorsque le rayon change
	useEffect(() => {
		if (cityCoordinates) {
			generateRandomMarkers(
				cityCoordinates.latitude,
				cityCoordinates.longitude,
				searchRadius,
			);
		} else if (location) {
			generateRandomMarkers(
				location.coords.latitude,
				location.coords.longitude,
				searchRadius,
			);
		}
	}, [searchRadius, cityCoordinates, location]);

	const geocodeCityName = async (city: string) => {
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
			console.error(error);
			return null;
		}
	};

	const handleSearch = async () => {
		if (cityName.trim() === "") {
			Alert.alert(t("please_enter_city_name"));
			return;
		}

		try {
			// Utiliser une API de géocodage pour obtenir les coordonnées de la ville
			const geocodedLocation = await geocodeCityName(cityName);
			if (geocodedLocation) {
				setCityCoordinates(geocodedLocation);
				generateRandomMarkers(
					geocodedLocation.latitude,
					geocodedLocation.longitude,
					searchRadius,
				);
				// Centrer la carte sur la ville
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
			console.error(error);
			Alert.alert(t("map.error_occurred"));
		}
	};

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
				{markers
					.filter((marker) => {
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
					})
					.map((marker, index) => (
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
