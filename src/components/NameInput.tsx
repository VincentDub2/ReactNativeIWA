import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { setName } from '../features/users/usersSlice'; // Import de l'action setName

const NameInput = () => {
    const [name, setNameInput] = useState('');
    const dispatch = useDispatch();

    const handleSetName = () => {
        dispatch(setName(name)); // Utilisation du dispatch pour mettre à jour l'état dans Redux
    };

    return (
        <View>
            <TextInput
                placeholder="Enter your name"
                value={name}
                onChangeText={(text) => setNameInput(text)}
            />
            <Button title="Set Name" onPress={handleSetName} />
        </View>
    );
};

export default NameInput;
