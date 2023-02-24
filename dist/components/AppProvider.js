import React, { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => { },
  GlobalLogin: '',
});

const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [GlobalLogin, setGlobalLogin] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, GlobalLogin, setGlobalLogin }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default AppProvider;