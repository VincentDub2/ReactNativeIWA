import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import SearchFilter from "../components/map/SearchFilter";
import CustomMarker from "../components/map/CustomMarker";
import MapScreenController from "../controllers/MapScreenController";
import { useTranslation } from "react-i18next";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../app/store";


Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

const MapScreen = () => {
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const emplacement = useSelector((state: RootState) => state.emplacements.emplacements);
	const [filteredEmplacements, setFilteredEmplacements] = useState(emplacement);

	const mapRef = useRef<any>();
	const [location, setLocation] = useState<LocationObject | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
	const [cityName, setCityName] = useState("");
	const [searchRadius, setSearchRadius] = useState(10); // Rayon par défaut en km
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [minCapacity, setMinCapacity] = useState<number>(1);

	const controller = new MapScreenController(dispatch);


	useEffect(() => {
		const loadData = async () => {
			await controller.loadEmplacements();
		};

		const getUserLocation = async () => {
			try {
				const location = await controller.getUserLocation();
				setLocation(location as any);
			} catch (error) {
				setErrorMsg(t("map.location_error"));
			}
		}


		getUserLocation().catch((error) =>
			console.error("Erreur lors de la récupération de la localisation :",
				error)
		);

		loadData().catch((error) =>
			console.error("Erreur lors du chargement des données :", error)
		);

	}, [dispatch]);

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


	// Gestion de la recherche
	const handleSearch = async () => {
		if (cityName.trim() === "") {
			Alert.alert(t("please_enter_city_name"));
			return;
		}

		try {
			const geocodedLocation = await controller.geocodeCityName(cityName);
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

	const filterMarkersByAmenities = (markers: Emplacement[]) => {
		if (selectedAmenities.length === 0) {
			return markers; // Si aucune commodité n'est sélectionnée, retourner tous les marqueurs
		}

		console.log("Selected commodités: ", selectedAmenities);

		return markers.filter((marker) =>
			selectedAmenities.every((selectedAmenity) =>
				marker.commodites.includes(selectedAmenity)
			)
		);
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
				toggleAmenity={(amenityId) =>
					setSelectedAmenities((prev) =>
						prev.includes(amenityId)
							? prev.filter((id) => id !== amenityId)
							: [...prev, amenityId]
					)
				}
				handleSearch={handleSearch}
			// minCapacity={minCapacity}
			// increaseCapacity={() => setMinCapacity((prev) => prev + 1)}
			// decreaseCapacity={() => setMinCapacity((prev) => (prev > 1 ? prev - 1 : 1))}
			/>

			{/* Carte */}
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
				{filterMarkersByAmenities(markers).map((marker) => (
					<CustomMarker key={marker.idEmplacement} marker={marker} />
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
