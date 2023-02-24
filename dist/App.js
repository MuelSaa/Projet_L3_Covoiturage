import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { createAppContainer } from 'react-navigation';
import AppNavigator from './AppNavigator';
import AppProvider from './components/AppProvider';
import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './components/AppProvider';
import { StatusBar } from 'react-native';

const AppContainer = createAppContainer(AppNavigator);

const App = () => {
  const { darkMode } = useContext(ThemeContext);
  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setBackgroundColor('black');
    StatusBar.setBarStyle('light-content');
  }, [darkMode]);

  return (
    <AppProvider><AppContainer /></AppProvider>
  );
}

export default App;
