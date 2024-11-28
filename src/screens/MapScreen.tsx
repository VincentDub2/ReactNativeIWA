import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import SearchFilter from "../components/map/SearchFilter";
import CustomMarker from "../components/map/CustomMarker";
import MapScreenController from "../controllers/MapScreenController";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../app/store";
import {LocationObject} from "expo-location";
import {Emplacement} from "../features/emplacements/emplacementSlice";


Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

const MapScreen = () => {
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const emplacement = useSelector((state: RootState) => state.emplacements.emplacements);
	const myLocation = useSelector((state: RootState) => state.locations.locations);
	const mapRef = useRef<any>();
	const [filteredEmplacements, setFilteredEmplacements] = useState<Emplacement[]>([]);
	const [location, setLocation] = useState<LocationObject | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
	const [cityName, setCityName] = useState("");
	const [searchRadius, setSearchRadius] = useState(10); // Rayon par défaut en km
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [minCapacity, setMinCapacity] = useState<number>(1);

	const controller = new MapScreenController(dispatch);

	useEffect(() => {
		const moveCamera = async () => {
			if (mapRef.current) {
				mapRef.current.animateToRegion({
					latitude: location?.coords?.latitude || 43.61609385259106,
					longitude: location?.coords?.longitude || 3.8512520758997955,
					latitudeDelta: 0.1,
					longitudeDelta: 0.1,
				});
			}
		}

		const loadData = async () => {
			await controller.loadEmplacements();
		};

		const getUserLocation = async () => {
			try {
				const location = await controller.getUserLocation();
				setFilteredEmplacements(emplacement);
				setLocation(location as LocationObject);
				if (mapRef.current) {
					mapRef.current.animateToRegion({
						latitude: location?.coords?.latitude || 43.61609385259106,
						longitude: location?.coords?.longitude || 3.8512520758997955,
						latitudeDelta: 0.1,
						longitudeDelta: 0.1,
					});
				}
			} catch (error) {
				setErrorMsg(t("map.location_error"));
			}
		}

		getUserLocation().catch((error) =>
			console.error("Erreur lors de la récupération de la localisation :", error)
		);

		loadData().then(() => (
			console.log("Données chargées")
		)).catch((error) =>
			console.error("Erreur lors du chargement des données :", error)
		);

	}, [dispatch,myLocation]);


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
				if (selectedAmenities.length > 0) {
					for (const amenityId of selectedAmenities) {
						if (!marker.commodites.includes(amenityId)) {
							console.log(`Exclusion du marker ${marker.nom} (commodité manquante : ${amenityId})`);
							return false;
						}
					}
				}
				return true;
			});

		if (selectedAmenities.length === 0) {
			setFilteredEmplacements(emplacement);
		}else {
			const filtered = filterMarkers();
			console.log("Résultat après filtrage :", filtered);
			setFilteredEmplacements(filtered);
		}
	}, [emplacement,dispatch ,selectedAmenities]);

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
				minCapacity={minCapacity}
				selectedAmenities={selectedAmenities}
				toggleAmenity={(amenityId) =>
					setSelectedAmenities((prev) =>
						prev.includes(amenityId)
							? prev.filter((id) => id !== amenityId)
							: [...prev, amenityId]
					)
				}
				handleSearch={handleSearch}
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
				{filteredEmplacements.map((marker) => (
					<CustomMarker key={marker.idEmplacement} marker={marker} mapRef={mapRef} />
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
