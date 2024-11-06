import React, { useState } from 'react';
import { View, TextInput, Button, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { setUserName, setEmail, setPhone, addReservation, removeReservation } from '../features/users/usersSlice'; // Import de l'action setName

const NameInput = () => {
    const [name, setNameInput] = useState('');
    const [email, setEmailInput] = useState('');
    const [phone, setPhoneInput] = useState('');
    const [reservationName, setReservationName] = useState('');
    const [dateDebut, setDateDebut] = useState<Date | null>(null);
    const [dateFin, setDateFin] = useState<Date | null>(null);
    const [adresse, setAdresse] = useState('');
    const [showDateDebutPicker, setShowDateDebutPicker] = useState(false);
    const [showDateFinPicker, setShowDateFinPicker] = useState(false);
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
            dateDebut: dateDebut ? dateDebut.toISOString() : null, 
            dateFin: dateFin ? dateFin.toISOString() : null,   
            adresse: adresse
        };
        dispatch(addReservation(reservation));
    
        setReservationName('');
        setDateDebut(null);
        setDateFin(null);
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

            <Button title="Date de début" onPress={() => setShowDateDebutPicker(true)} />
            {dateDebut && <Text>Date de début: {dateDebut.toLocaleDateString()}</Text>}
            {showDateDebutPicker && (
                <DateTimePicker
                    value={dateDebut || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDateDebutPicker(false);
                        if (selectedDate) setDateDebut(selectedDate);
                    }}
                />
            )}

            <Button title="Date de fin" onPress={() => setShowDateFinPicker(true)} />
            {dateFin && <Text>Date de fin: {dateFin.toLocaleDateString()}</Text>}
            {showDateFinPicker && (
                <DateTimePicker
                    value={dateFin || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDateFinPicker(false);
                        if (selectedDate) setDateFin(selectedDate);
                    }}
                />
            )}

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
