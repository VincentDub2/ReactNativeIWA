import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { setName, setEmail, login } from '../features/users/usersSlice'; // Les actions à utiliser

type RegisterScreenProps = {
    onRegister: () => void; // Fonction onRegister pour la redirection après l'inscription
  };

export default function Register({ onRegister }: RegisterScreenProps) {
    const [name, setNameInput] = useState('');
    const [email, setEmailInput] = useState('');
    const dispatch = useDispatch();
  
    const handleRegister = () => {
      dispatch(setName(name));  // Met à jour le nom dans le store
      dispatch(setEmail(email));  // Met à jour l'email dans le store
      dispatch(login());  // Connecte l'utilisateur
      onRegister();  // Appelle la fonction onRegister pour gérer la redirection
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Créer un Compte</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          value={name}
          onChangeText={setNameInput} // Mettre à jour l'état de name
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmailInput} // Mettre à jour l'état de email
        />
        <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirmez le mot de passe" secureTextEntry />
  
        {/* Bouton S'inscrire avec la redirection */}
        <Button
          title="S'inscrire"
          onPress={handleRegister}  // Appelle handleRegister pour mettre à jour Redux et rediriger
        />
  
        <TouchableOpacity onPress={onRegister}>
          <Text style={styles.signUpText}>
            Déjà un compte ? <Text style={styles.signUpLink}>Connectez-vous</Text>
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