import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useContext } from 'react';
import { Appearance } from 'react-native';
import { ThemeContext } from './AppProvider';

const About = () => {
  const { darkMode, toggleDarkMode, GlobalLogin } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: darkMode ? 'black' : styles.container.color }]}>
      <Text>{GlobalLogin}</Text>
      <TouchableOpacity onPress={toggleDarkMode}>
        <Text style={{ color: darkMode ? 'white' : 'black' }}>Toggle Dark Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default About;
