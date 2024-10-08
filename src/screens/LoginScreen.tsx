import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { setName, setEmail, login } from '../features/users/usersSlice';  // Les actions à utiliser
import {useNavigation, useRoute} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {RootStackParamList} from "../../types";
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;


export default function Login() {
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const [name, setNameInput] = useState('');
    const [email, setEmailInput] = useState('');
    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(setName(name));  // Met à jour le nom dans le store
        dispatch(setEmail(email));  // Met à jour l'email dans le store
        dispatch(login());  // Connecte l'utilisateur
    };


    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/icon.png')} // Remplacez par le chemin correct vers votre logo
          style={styles.logo}
        />
        <Text style={styles.title}>Connexion</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          value={name} // Lier l'état à l'input
          onChangeText={setNameInput} // Mettre à jour l'état lors de la saisie
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
        />
        <Button
          title="Connexion"
          onPress={handleLogin} // Appeler handleLogin pour effectuer la connexion
        />
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>
            Pas de compte ? <Text style={styles.signUpLink}>Inscrivez-vous</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  signUpText: {
    marginTop: 16,
    color: '#333',
  },
  signUpLink: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
});