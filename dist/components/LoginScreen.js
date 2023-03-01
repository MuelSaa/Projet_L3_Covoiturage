import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { ThemeContext } from './AppProvider';
import logo from '../assets/logo.png';
import { InfoModal } from './Modal';


const LoginScreen = () => {

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useNavigation();
  const { setGlobalLogin } = useContext(ThemeContext);

  const handleLogin = async () => {

    if (login === '' || password === '') {
      alert('Veuillez remplir tous les champs');
      navigate('Menu');
    }
    else {
      const response = await fetch(`https://servor-sgtr.onrender.com/api/protected`, {
        method: 'POST',
        body: JSON.stringify({ login: login, password: password }),
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const token = data.token;
      /************Faire Affichier le token generé 
      //alert(token);
       Sinon naviguer jusqu'au menu ********************************/
       navigate('Menu');
  };
};

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  return (
    <View style={[styles.container, {backgroundColor: darkMode ? 'black' : 'white'}]}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.h1}>Connectez vous avec vos identifiants de l'université</Text>
      <Text style={{ color: darkMode ? 'white' : 'black' }}>Identifiant de connexion</Text>
      <TextInput
        style={[styles.input, { backgroundColor: darkMode ? 'white' : 'white' }]}
        onChangeText={(text) => setLogin(text)}
        value={login}
      />
      <Text style={{ color: darkMode ? 'white' : 'black' }}>Mot de passe</Text>
      <TextInput
        style={[styles.input, , { backgroundColor: darkMode ? 'white' : 'white' }]}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text>Connexion</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.infoButton} onPress={() => setInfoModalVisible(true)}>
        <Text style={styles.infoButtonText}>Information sur l'utilisation des données</Text>
        <InfoModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({

  header: {
    position: 'absolute',
    top: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  logo: {
    width: '100%',
    height: '150%',
  },

  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C6E8C',
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
    textAlign: 'center',
    borderColor: '#564256',
    borderWidth: 1,
    margin: 10,
  },
  button: {
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#82B2D9',
    color: 'green',
    margin: 10,
  },
  infoButton: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#564256',
    borderRadius: 5,
  },
  infoButtonText: {
    color: '#FF715B',
  },
  infoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  infoModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    width: '80%',
  },
  infoModalCloseButton: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#564256',
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  infoModalCloseButtonText: {
    color: '#2E282A',
  },
});

export default LoginScreen;
