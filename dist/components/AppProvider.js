import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Création d'un contexte pour stocker les données partagées
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  globalLogin: '',
});

// Composant AppProvider qui va englober les autres composants et permettre de partager les données
const AppProvider = ({ children }) => {
  // Initialisation des variables d'état avec le hook useState
  const [darkMode, setDarkMode] = useState(false);
  const [globalLogin, setGlobalLogin] = useState('');

  // Utilisation du hook useEffect pour récupérer la valeur de darkMode dans AsyncStorage
  useEffect(() => {
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
    getDarkMode();
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
    setGlobalLogin('');
    };

  // Rendu du composant et partage des données à travers le contexte
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, globalLogin, setGlobalLogin, logout }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default AppProvider;
