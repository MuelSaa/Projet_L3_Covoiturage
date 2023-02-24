import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { ThemeContext } from './AppProvider';

exports.postTokenCreateToken = (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  // Partie a modifier pour l'annuaire de la faculté 
  const users = [
    { login: 'Sami', password: 'bidule' },
    { login: 'Adam', password: 'bidule' },
    { login: 'Samuel', password: 'bidule' },
    { login: 'Bastien', password: 'bidule' },
  ];

  // Vérifier si les informations de connexion sont valides en parcourant le tableau d'utilisateurs
  const user = users.find(u => u.login === login && u.password === password);

  if (user) {
    const token = jwt.sign({ user }, 'my_secret_key');
    res.status(200).json({ success: true, Token: token });
  } else {
    res.status(401).json({ success: false, message: 'Identifiants invalides' });
  }
}

const LoginScreen = () => {

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useNavigation();
  const { setGlobalLogin } = useContext(ThemeContext);

  const handleLogin = async () => {
    if (login === '' || password === '') {
      alert('Veuillez remplir tous les champs');
    }
    else if (login === 'admin' && password === 'admin') {
      setGlobalLogin(login);
      navigate('Menu');
    }
    else {
      alert('Identifiants incorrects');
    }
  };

  const InfoModal = ({ visible, onClose }) => {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.infoModalContainer}>
          <View style={styles.infoModalContent}>
            <Text>Cette application est projet réalisé par des étudiants de L3 Informatique de l'UFR ST.</Text><Text></Text>
            <Text>Les données collectées par cette application ne seront pas utilisées à des fins commerciales.</Text>
            <TouchableOpacity style={styles.infoModalCloseButton} onPress={onClose}>
              <Text style={styles.infoModalCloseButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const [infoModalVisible, setInfoModalVisible] = useState(false);

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

      <TouchableOpacity style={styles.infoButton} onPress={() => setInfoModalVisible(true)}>
        <Text style={styles.infoButtonText}>Information sur l'utilisation des données</Text>
        <InfoModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
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