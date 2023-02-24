import React, { useState, useContext } from 'react';
import { Appearance } from 'react-native';
import About from "./components/About";
import Home from "./components/Home";
import Add from "./components/Add";
import Notifs from "./components/Notifs";
import { ThemeContext } from "./components/AppProvider";
import Trajets from "./components/Trajets";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const Menu = () => {
  const [colorScheme, setColorScheme] = React.useState(Appearance.getColorScheme());
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);


  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Rechercher') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Notifications') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            }
            else if (route.name === 'Ajouter') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }
            else if (route.name === 'Mes trajets') {
              iconName = focused ? 'car-sport' : 'car-sport-outline';
            }
            else if (route.name === 'A propos') {
              iconName = focused ? 'list' : 'list-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerTintColor: darkMode ? 'white' : 'black',
          headerStyle: {backgroundColor: darkMode ? 'black' : 'white'},
          tabBarActiveTintColor: darkMode ? 'gray' : 'tomato',
          tabBarInactiveTintColor: darkMode ? 'tomato' : 'gray',
          tabBarStyle: { backgroundColor: darkMode ? 'black' : 'white'},
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIconStyle: { marginBottom: -3 },
        })}
      >
        <Tab.Screen name="Rechercher" component={Home} />
        <Tab.Screen name="Notifications" component={Notifs} />
        <Tab.Screen name="Ajouter" component={Add}/>
        <Tab.Screen name="Mes trajets" component={Trajets} />
        <Tab.Screen name="A propos" component={About} />
      </Tab.Navigator>
    </NavigationContainer>

    
  );
}

export default Menu;