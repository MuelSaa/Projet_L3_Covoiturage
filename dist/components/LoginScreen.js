import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

const LoginScreen = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useNavigation();

  const handleLogin = () => {
    if(login==='' || password==='') {
      alert('Veuillez remplir tous les champs');
    }
    else if(login === 'admin' && password === 'admin')
      navigate('Menu');
    else
      alert('Identifiants incorrects');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Connectez vous avec vos identifiants de l'université</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight : '800',
    color : 'red',
    textAlign: 'center',
    paddingBottom: '20%',
  },
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
