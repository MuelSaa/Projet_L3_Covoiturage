import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => { },
  GlobalLogin: '',
});

const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [GlobalLogin, setGlobalLogin] = useState('');

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

  const toggleDarkMode = async () => {
    try {
      const value = JSON.stringify(!darkMode);
      await AsyncStorage.setItem('darkMode', value);
      setDarkMode(!darkMode);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, GlobalLogin, setGlobalLogin }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default AppProvider;