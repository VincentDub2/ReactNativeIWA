import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView from "react-native-maps";
import { LocationObject } from "expo-location";
import Geocoder from "react-native-geocoding";
import SearchFilter from "../components/map/SearchFilter";
import CustomMarker from "../components/map/CustomMarker";
import MapScreenController from "../controllers/MapScreenController";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../app/store";


Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

const MapScreen = () => {
	const { t, i18n } = useTranslation(); // Utiliser le hook i18n

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

	useEffect(() => {
		const filterMarkers = () =>
			emplacement.filter((marker) => {
				console.log("Vérification du marker :", marker);

				// Filtrer par commodités
				if (selectedAmenities.length > 0) {
					for (const amenityId of selectedAmenities) {
						if (!marker.commodites.includes(amenityId)) {
							console.log(`Exclusion du marker ${marker.nom} (commodité manquante : ${amenityId})`);
							return false;
						}
					}
				}

				// Filtrer par capacité
				if (marker.capacity < minCapacity) {
					console.log(`Exclusion du marker ${marker.nom} (capacité insuffisante)`);
					return false;
				}

				return true;
			});

		console.log("Filtrage des emplacements...");
		const filtered = filterMarkers();
		console.log("Résultat après filtrage :", filtered);
		setFilteredEmplacements(filtered);
	}, [emplacement, selectedAmenities, minCapacity]);

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
				{filteredEmplacements.map((marker, index) => (
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
