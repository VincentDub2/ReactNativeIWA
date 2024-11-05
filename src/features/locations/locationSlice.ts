import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
    idLocation: number;
    idHost: number;
    name: string;
    address: string;
    description: string;
    amenities: string[];
    image: any;
    latitude: number;
    longitude: number;
    pricePerNight: number;
}

interface LocationState {
    locations: Location[];
}

const initialState: LocationState = {
    locations: [
        {
            idLocation: 1,
            idHost: 1,
            name: 'La petite cabane dans la forêt',
            address: 'Mas de Couronn Les21Arches, Rd 32, 34380 Argelliers',
            description: 'Une charmante cabane isolée au cœur de la forêt.',
            amenities: ['Parking', 'Douche', 'Elec'],
            image: require('../../../assets/images/biv1.jpg'),
            latitude: 43.7243,
            longitude: 3.6826,
            pricePerNight: 45,
        },
        {
            idLocation: 2,
            idHost: 1,
            name: 'Auberge du grand chêne',
            address: '2 Le Plan, 83690 Sillans-la-Cascade',
            description: 'Auberge située à proximité d\'une cascade avec un grand jardin.',
            amenities: ['Toit', 'Parking'],
            image: require('../../../assets/images/biv2.jpg'),
            latitude: 43.5614,
            longitude: 6.1808,
            pricePerNight: 70,
        },
        {
            idLocation: 3,
            idHost: 1,
            name: 'Maison Clotilde',
            address: '212 Rue de la République, 12300 Livinhac-le-Haut',
            description: 'Maison spacieuse avec vue sur le village, idéale pour les familles.',
            amenities: ['Parking', 'Elec', 'Douche'],
            image: require('../../../assets/images/biv3.jpeg'),
            latitude: 44.5906,
            longitude: 2.1953,
            pricePerNight: 55,
        },
        {
            idLocation: 4,
            idHost: 2,
            name: 'Aire de bivouac',
            address: '87160 Saint-Maixant',
            description: 'Zone de bivouac accessible pour les randonneurs et campeurs.',
            amenities: ['Toit'],
            image: require('../../../assets/images/biv4.jpeg'),
            latitude: 45.8464,
            longitude: 0.9742,
            pricePerNight: 25,
        }
    ],
};

export const locationSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {
        addLocation: (state, action: PayloadAction<Location>) => {
            state.locations.push(action.payload);
        },
    },
});

export const { addLocation } = locationSlice.actions;
export default locationSlice.reducer;
