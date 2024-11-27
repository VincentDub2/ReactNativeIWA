import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Collapsible from 'react-native-collapsible';
import AmenitiesSelector from './AmenitiesSelector';
import CapacitySelector from './CapacitySelector';
import {useTranslation} from "react-i18next";

interface SearchFilterProps {
    isAccordionExpanded: boolean;
    setIsAccordionExpanded: (expanded: boolean) => void;
    cityName: string;
    setCityName: (cityName: string) => void;
    searchRadius: number;
    setSearchRadius: (radius: number) => void;
    selectedAmenities: string[];
    toggleAmenity: (amenity: string) => void;
    minCapacity: number;
    handleSearch: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
                                                       isAccordionExpanded,
                                                       setIsAccordionExpanded,
                                                       cityName,
                                                       setCityName,
                                                       searchRadius,
                                                       setSearchRadius,
                                                       selectedAmenities,
                                                       toggleAmenity,
                                                       handleSearch,
                                                   }) => {
    const {t} = useTranslation();
    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity
                onPress={() => setIsAccordionExpanded(!isAccordionExpanded)}
                style={styles.accordionHeader}
            >
                <Text style={styles.accordionHeaderText}>{t('map.search_filters')}</Text>
            </TouchableOpacity>
            <Collapsible collapsed={!isAccordionExpanded}>
                <View style={styles.accordionContent}>
                    {/* Champ de saisie pour le nom de la ville */}
                    <TextInput
                        style={styles.input}
                        placeholder={t('map.enter_city_name')}
                        value={cityName}
                        onChangeText={text => setCityName(text)}
                    />
                    {/* Slider pour le rayon de recherche */}
                    <Text>{t('map.search_radius', { radius: searchRadius })}</Text>
                    <Slider
                        style={{ width: '100%', height: 40}}
                        minimumValue={1}
                        maximumValue={50}
                        step={1}
                        thumbTintColor={'#cda32a'}
                        minimumTrackTintColor={'#cda32a'}
                        maximumTrackTintColor={'#404040'}
                        value={searchRadius}
                        onValueChange={value => setSearchRadius(value)}
                    />
                    {/* Sélecteur de commodités */}
                    <AmenitiesSelector
                        selectedAmenities={selectedAmenities}
                        toggleAmenity={toggleAmenity}
                    />
                    {/* Sélecteur de capacité
                    <CapacitySelector
                        minCapacity={minCapacity}
                        increaseCapacity={increaseCapacity}
                        decreaseCapacity={decreaseCapacity}
                    /> */}
                    <TouchableOpacity
                        className="bg-primary p-2 justify-center items-center rounded-full mt-2"
                        onPress={handleSearch}
                    >
                        <Text className="text-lg font-bold color-neutral-900">{t('map.search')}</Text>
                    </TouchableOpacity>
                </View>
            </Collapsible>
        </View>
    );
};

const styles = StyleSheet.create({
    accordionContainer: {
        position: 'absolute',
        top: 10,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        zIndex: 1,
    },
    accordionHeader: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    accordionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    accordionContent: {
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default SearchFilter;
