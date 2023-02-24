import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ThemeContext } from './AppProvider';
import Icon from 'react-native-vector-icons/FontAwesome';

const About = () => {
  const { darkMode, toggleDarkMode, GlobalLogin, logout } = useContext(ThemeContext);

  const icon = darkMode ? 'moon-o' : 'sun-o';
  const text = darkMode ? 'Mode sombre activé' : 'Mode sombre désactivé';

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? 'black' : 'white' }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bonjour {GlobalLogin} !</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="sign-out" size={20} color="red" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.darkModeButton} onPress={toggleDarkMode}>
        <Icon name={icon} size={20} color={darkMode ? 'white' : 'black'} />
        <Text style={[styles.darkModeText, { color: darkMode ? 'white' : 'black' }]}>{text}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 10,
  },
  headerText: {
    color: '#82B2D9',
    fontSize: 18,
  },
  logoutButton: {
    marginLeft: 10,
  },
  darkModeButton: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    marginTop: 50,
  },
  darkModeText: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default About;
