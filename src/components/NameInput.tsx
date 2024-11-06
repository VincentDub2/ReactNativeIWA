import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserName, setEmail, setPhone, addReservation, removeReservation } from '../features/users/usersSlice'; // Import de l'action setName

const NameInput = () => {
    const [name, setNameInput] = useState('');
    const [email, setEmailInput] = useState('');
    const [phone, setPhoneInput] = useState('');
    const [reservationName, setReservationName] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [adresse, setAdresse] = useState('');
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

    const handleSetReservation = () => {
        const reservation = {
            nom: reservationName,
            dateDebut: dateDebut,
            dateFin: dateFin,
            adresse: adresse
        };
        dispatch(addReservation(reservation));

        // Optionnel : Réinitialiser les champs après l'ajout
        setReservationName('');
        setDateDebut('');
        setDateFin('');
        setAdresse('');
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

            <Text style={{ fontSize: 20, marginTop: 20 }}>Reservations</Text>

            <TextInput
                placeholder="Nom"
                value={reservationName}
                onChangeText={(text) => setReservationName(text)}
                style={{ marginTop: 10 }}
            />

            <TextInput
                placeholder="Date de début"
                value={dateDebut}
                onChangeText={(text) => setDateDebut(text)}
                style={{ marginTop: 10 }}
            />

            <TextInput
                placeholder="Date de fin"
                value={dateFin}
                onChangeText={(text) => setDateFin(text)}
                style={{ marginTop: 10 }}
            />

            <TextInput
                placeholder="Adresse"
                value={adresse}
                onChangeText={(text) => setAdresse(text)}
                style={{ marginTop: 10 }}
            />

            <Button title="Ajouter la réservation" onPress={handleSetReservation} />
        </View>
    );
};

export default NameInput;
