import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserName, setEmail, login } from '../features/users/usersSlice';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../../types";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const [username, setUserNameInput] = useState('');
    const [email, setEmailInput] = useState('');
    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(setUserName(username));
        dispatch(setEmail(email));
        dispatch(login());
    };

    return (
      <ImageBackground 
        source={require('../../assets/images/wallpaper-bivouac.png')} // Chemin de l'image de fond
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Connectez-vous sur Biv'Quack !</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUserNameInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpText}>
              Pas de compte ? <Text style={styles.signUpLink}>Inscrivez-vous</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Fond transparent pour foncer l'arrière-plan
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  input: {
    width: '90%',
    height: 50, // Fixe une hauteur pour les champs de saisie
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff', // Fond blanc pour les champs de saisie
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