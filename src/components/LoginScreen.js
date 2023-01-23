import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Envoi des informations de connexion au backend
    // Vérifie si les informations sont correctes
    // Si les informations sont correctes, autoriser l'utilisateur à utiliser l'application
    // Sinon, afficher une erreur
  };

  const handleRegistration = () => {
    // Rediriger vers la page d'inscription
  };

  return (
    <View style={styles.container}>
      <Text>Identifiant de connexion</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setLogin(text)}
        value={login}
      />
      <Text>Mot de passe</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text>Connexion</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text>Inscription</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
  },
  button: {
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    margin: 10,
  },
});

export default LoginScreen;
