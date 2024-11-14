import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { setUserName, setLastName, setFirstName, setEmail, login } from '../features/users/usersSlice';
import {RootStackParamList} from "../../types";
import {useNavigation} from "@react-navigation/native"; // Les actions à utiliser
import { AppDispatch } from '../app/store';
import { registerAsync } from '../features/users/usersSlice';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export default function Register() {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const [username, setUserNameInput] = useState('');
    const [lastname, setLastNameInput] = useState('');
    const [firstname, setFirstNameInput] = useState('');
    const [email, setEmailInput] = useState('');
    const [password, setPasswordInput] = useState('');
    const [confirmPassword, setConfirmPasswordInput] = useState('');
    const dispatch = useDispatch<AppDispatch>();

    
    const handleRegister = async () => {
      if (password !== confirmPassword) {
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
        return;
      }
      try {
        const resultAction = await dispatch(registerAsync({ email, password, username, lastname, firstname }));
        if (registerAsync.fulfilled.match(resultAction)) {
          navigation.navigate('Login');
        } else {
          Alert.alert('Erreur', 'Erreur lors de l\'inscription');
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription', error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
      }
    };

    return (
      <ImageBackground 
        source={require('../../assets/images/wallpaper-bivouac.png')} // Vérifiez le chemin de l'image
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Créer un compte Biv'Quack</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUserNameInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom de famille"
            value={lastname}
            onChangeText={setLastNameInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={firstname}
            onChangeText={setFirstNameInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmailInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPasswordInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmez le mot de passe"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPasswordInput}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpText}>
              Déjà un compte ? <Text style={styles.signUpLink}>Connectez-vous</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  input: {
    width: '90%',
    height: 50, 
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#d2b48c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '90%', 
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 16,
    color: '#fff',
  },
  signUpLink: {
    color: '#d2b48c',
    fontWeight: 'bold',
  },
});
