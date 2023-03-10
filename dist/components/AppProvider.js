import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Création d'un contexte pour stocker les données partagées
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  globalLogin: '',
  token: '',
});

// Composant AppProvider qui va englober les autres composants et permettre de partager les données
const AppProvider = ({ children }) => {
  // Initialisation des variables d'état avec le hook useState
  
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState('')
  const [globalLogin, setGlobalLogin] = useState('');

  const getDarkMode = async () => {
    try {
      const value = await AsyncStorage.getItem('darkMode');
      if (value !== null) {
        setDarkMode(JSON.parse(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        setToken(JSON.parse(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Utilisation du hook useEffect pour récupérer la valeur de darkMode dans AsyncStorage
  useEffect(() => {
    getDarkMode();
    getToken();
  }, []);

  // Fonction pour basculer entre le mode sombre et le mode clair
  const toggleDarkMode = async () => {
    try {
      const value = JSON.stringify(!darkMode);
      await AsyncStorage.setItem('darkMode', value);
      setDarkMode(!darkMode);
    } catch (error) {
      console.log(error);
    }
  };

  // Fonction pour déconnecter l'utilisateur
    const logout = () => {
      console.log('out');
      setGlobalLogin('');
      setToken('');
    }
  // Rendu du composant et partage des données à travers le contexte
  return (
    <ThemeContext.Provider value={{ token, setToken, darkMode, toggleDarkMode, globalLogin, setGlobalLogin, logout }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default AppProvider;
