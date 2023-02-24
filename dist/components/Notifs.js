import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './AppProvider';
import { StyleSheet, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity, Animated } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

Geocoder.init("AIzaSyCO9jnug1zEda2f2N4HveqArp4Z4cHH0ww", { language: "fr" });
const Tab = createMaterialTopTabNavigator();
const handleAddTrip = () => { }

function getLocationName(latitude, longitude) {
  // Geocoder.from(latitude, longitude)
  // .then(json => {
  //   if (json.results && json.results[0].address_components) {
  //     var addressComponent = json.results[0].address_components;
  //     if (addressComponent[1]) {
  //       return addressComponent[1].long_name + ' ' + addressComponent[2].long_name;
  //     } else {
  //       return 'Composant d\'adresse inconnu';
  //     }
  //   } else {
  //     return 'Résultat de géolocalisatio$n inconnu';
  //   }
  // })
  // .catch(error => { 
  //   console.error(error);
  //   return 'Adresse inconnue';
  // });
  return 'test';
}

export default function Notifs() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: darkMode ? 'white' : 'black',
        inactiveTintColor: darkMode ? 'gray' : 'lightgray',
        style: {
          backgroundColor: darkMode ? 'black' : 'white',
        },
      }}>
      <Tab.Screen name="Non lue" component={NewTrips} />
      <Tab.Screen name="Lue" component={LastTrips} />
    </Tab.Navigator>
  );
}

export function NewTrips() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [trips, setTrips] = useState([]);
  const isFocused = useIsFocused();
  async function myTrips() {
    try {
      const resp = await fetch("https://covoiturage.onrender.com/trajet", {
        method: 'GET'
      });
      const data = await resp.json();
      setTrips(data);
    } catch (error) {
      console.error(error);
    }
  }
  if (isFocused) { myTrips() }

  const [animation, setAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  const renderTrip = (trip, index) => {
    const departLocation = getLocationName(trip.departLat, trip.departLon);
    const arriveeLocation = getLocationName(trip.destinationLat, trip.destinationLat);
    return (
      <Animated.View
        key={index}
        style={[
          styles.tripContainer, {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ], backgroundColor: darkMode ? 'black' : styles.tripContainer.color
          },
        ]}
      >
        <Text style={[styles.text, { color: darkMode ? 'white' : styles.text.color }]}>Depart : {departLocation}</Text>
        <Text style={[styles.text, { color: darkMode ? 'white' : styles.text.color }]}>Arrivee : {arriveeLocation}</Text>
        <Text style={[styles.text, { color: darkMode ? 'white' : styles.text.color }]}>
          Date : {moment(trip.departHeure).format('DD/MM/YYYY')}
        </Text>
        <Text style={[styles.text, , { color: darkMode ? 'white' : styles.text.color }]}>
          Heure : {moment(trip.departHeure).format('HH:mm')}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleAddTrip}>
          <Text style={styles.buttonText}>Se désinscrire</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: darkMode ? 'black' : styles.container.color }]}>
        {trips.map((trip, index) => renderTrip(trip, index))}
      </View>
    </ScrollView>
  );
}


export function LastTrips() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [trips, setTrips] = useState([]);
  const isFocused = useIsFocused();
  async function myTrips() {
    const resp = await fetch('https://covoiturage.onrender.com/trajet', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => setTrips(data))
      .catch((error) => { });
  }
  if (isFocused) { myTrips() }

  const handleAddTrip = () => { }
  const [animation, setAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderTrip = (trip, index) => {
    const departLocation = getLocationName(trip.departLat, trip.departLon);
    const arriveeLocation = getLocationName(trip.destinationLat, trip.destinationLat);

    return (
      <Animated.View
        key={index}
        style={[
          styles.tripContainer,
          {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ], backgroundColor: darkMode ? 'black' : styles.tripContainer.color
          },
        ]}
      >
        <Text style={[styles.text, { color: darkMode ? 'white' : styles.text.color }]}>Depart : {departLocation}</Text>
        <Text style={[styles.text, { color: darkMode ? 'white' : styles.text.color }]}>Arrivee : {arriveeLocation}</Text>
        <Text style={[styles.text, { color: darkMode ? 'white' : styles.text.color }]}>
          Date : {moment(trip.departHeure).format('DD/MM/YYYY')}
        </Text>
        <Text style={[styles.text, { color: darkMode ? 'white' : styles.text.color }]}>
          Heure : {moment(trip.departHeure).format('HH:mm')}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleAddTrip}>
          <Text style={styles.buttonText}>Se désinscrire</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: darkMode ? 'black' : styles.container.color }]}>
        {trips.map((trip, index) => renderTrip(trip, index))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B3B98',
    borderRadius: 5,
    shadowColor: '#3B3B98',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    margin: 10,
    padding: 10,
    position: 'absolute',
    bottom: '30%',
    right: 0,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#3B3B98',
    borderRadius: 5,
    margin: 10,
    width: '95%',
    alignSelf: 'stretch',
    backgroundColor: '#F0F0F5',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B3B98',
    margin: 10,
  },
});