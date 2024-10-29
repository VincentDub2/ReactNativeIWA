import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
    name: string;
    address: string;
    amenities: string[];
    image: any;
}

interface LocationState {
    locations: Location[];
}

const initialState: LocationState = {
    locations: [
        {
            name: 'La petite cabane dans la forêt',
            address: 'Mas de Couronn Les21Arches, Rd 32, 34380 Argelliers',
            amenities: ['Parking', 'Douche', 'Elec'],
            image: require('../../../assets/images/biv1.jpg'), // Chemin vers une image locale
        },
        {
            name: 'Auberge du grand chêne',
            address: '2 Le Plan, 83690 Sillans-la-Cascade',
            amenities: ['Toit', 'Parking'],
            image: require('../../../assets/images/biv2.jpg'), // Chemin vers une image locale
        },
        {
            name: 'Maison Clotilde',
            address: '212 Rue de la République, 12300 Livinhac-le-Haut',
            amenities: ['Parking', 'Elec', 'Douche'],
            image: require('../../../assets/images/biv3.jpeg'), // Chemin vers une image locale
        },
        {
            name: 'Aire de bivouac',
            address: '87160 Saint-Maixant',
            amenities: ['Toit'],
            image: require('../../../assets/images/biv4.jpeg'), // Chemin vers une image locale
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
