import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


type LoginScreenProps = {
  onLogin: () => void; // Ajout d'une fonction onLogin en prop
};

export default function Login({ onLogin }: LoginScreenProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon.png')} // Remplacez par le chemin correct vers votre logo
        style={styles.logo}
      />
      <Text style={styles.title}>Connexion</Text>
      <TextInput style={styles.input} placeholder="Nom d'utilisateur" />
      <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry />
      <Button
        title="Connexion"
        onPress={() => {
          onLogin(); // Appelle la fonction onLogin pour signaler que l'utilisateur est connecté
        }}
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