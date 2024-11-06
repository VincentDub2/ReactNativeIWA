import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserName, setEmail, setPhone } from '../features/users/usersSlice'; // Import de l'action setName
import { Text } from 'react-native-svg';

const NameInput = () => {
    const [name, setNameInput] = useState('');
    const [email, setEmailInput] = useState('');
    const [phone, setPhoneInput] = useState('');
    const dispatch = useDispatch();

    const handleSetName = () => {
        dispatch(setUserName(name)); // Utilisation du dispatch pour mettre à jour l'état dans Redux
    };

    const handleSetEmail = () => {
        dispatch(setEmail(email)); // Utilisation du dispatch pour mettre à jour l'état dans Redux
    };

    const handleSetPhone = () => {
        dispatch(setPhone(phone)); // Utilisation du dispatch pour mettre à jour l'état dans Redux
    };

    return (
        <View>
            <TextInput
                placeholder="Enter your name"
                value={name}
                onChangeText={(text) => setNameInput(text)}
            />
            <Button title="Set Name" onPress={handleSetName} />
            <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => setEmailInput(text)}
            />
            <Button title="Set Email" onPress={handleSetEmail} />
            <TextInput
                placeholder="Enter your phone"
                value={phone}
                onChangeText={(text) => setPhoneInput(text)}
            />  
            <Button title="Set Phone" onPress={handleSetPhone} />
        </View>
    );
};

export default NameInput;
