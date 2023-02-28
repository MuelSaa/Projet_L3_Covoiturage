import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ThemeContext } from './AppProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';
import logo from '../assets/logo.png';
import { ScrollView } from 'react-native-gesture-handler';

const About = () => {
  const { darkMode, toggleDarkMode, GlobalLogin, logout } = useContext(ThemeContext);

  const icon = darkMode ? 'moon-o' : 'sun-o';
  const text = darkMode ? 'Mode sombre activé' : 'Mode sombre désactivé';

  return (
    <ScrollView style={{backgroundColor: darkMode ? 'black' : 'white'}}>
      <View style={[styles.container]}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View> 
        <Text style={styles.h1}>Bonjour {GlobalLogin} !</Text>
        <TouchableOpacity style={styles.buttonInfo}>
          <Icon name="history" size={20} color={darkMode ? 'white' : 'black'}/>
          <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>Votre historique des trajets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonInfo} onPress={toggleDarkMode}>
          <Icon name={icon} size={20} color={darkMode ? 'white' : 'black'} />
          <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>{text}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonInfo}>
          <Icon name="info" size={20} color={darkMode ? 'white' : 'black'}/>
          <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>Conditions legales</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default About;
