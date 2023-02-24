/*import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

const LoginScreen = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useNavigation();

  const handleLogin = async () => {
    //navigate('Menu')
    if (login === '' || password === '') {
      alert('Veuillez remplir tous les champs');
    }
    else if (login === 'admin' && password === 'admin')
      navigate('Menu');
    else
      alert('Identifiants incorrects');

    /*try {
      const response = await post(
        'https://covoiturage.onrender.com/Trajet',
        { login, password }
      );
      const token = response.data.token;
      alert(token);
      navigate('Menu')
    } catch (error) {
      console.error(error);
      alert('Identifiants incorrects');

    }*/
/*};
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


export default LoginScreen;
*/
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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
    fontWeight: '800',
    color: 'red',
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