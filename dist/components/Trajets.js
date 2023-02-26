import React, { useState, useEffect, useContext } from 'react';
import { Alert, StyleSheet, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemeContext } from './AppProvider';
import styles from '../styles';


import { API_URL } from "./env";
import { API_KEY } from "./env";
Geocoder.init(API_KEY, {language : "fr"});

const user = "samu";
const Tab = createMaterialTopTabNavigator();
const handleTripPressDriver = (trip) => {
    Alert.alert(
        'Que souhaitez-vous faire ?',
        '',
        [
            {
                text: 'Information sur le trajet',
                onPress: () => {
                    // afficher des informations sur le trajet
                    console.log(trip);
                },
                style: 'default',
            },
            {
                text: 'Supprimer le trajet',
                onPress: () => {
                    handleRemoveTrip(trip.trajetID)
                    console.log(`Supprimer le trajet ${trip.trajetID}`);
                },
                style: 'destructive',
            },
            {
                text: 'Annuler',
                onPress: () => {},
                style: 'cancel',
            },
        ],
    );
};

const handleTripPressPassenger = (trip) => {
    Alert.alert(
        'Que souhaitez-vous faire ?',
        '',
        [
            {
                text: 'Information sur le trajet',
                onPress: () => {
                    // afficher des informations sur le trajet
                    console.log(trip);
                },
                style: 'default',
            },
            {
                text: 'Se retirer des passagers',
                onPress: () => {
                    handleUnscribeTrip(trip.trajetID)
                    console.log(`Supprimer le trajet ${trip.trajetID}`);
                },
                style: 'destructive',
            },
            {
                text: 'Annuler',
                onPress: () => {},
                style: 'cancel',
            },
        ],
    );
};

const handleRemoveTrip = async (id) => { 
    try {
        const resp = await fetch(API_URL + "/Trajet/" + id, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error(error);
    }
}

const handleUnscribeTrip = async (id) => { 
    try {
        const resp = await fetch(API_URL + "/Passager/" + id + '/' + user,{
            method: 'DELETE'
        });
    } catch (error) {
        console.error(error);
    }
}

export default function Trajets() {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: darkMode ? 'white' : 'black',
                tabBarInactiveTintColor: darkMode ? 'gray' : 'lightgray',
                tabBarStyle: {backgroundColor: darkMode ? 'black' : 'white'},
            }}>
            <Tab.Screen name="Conducteur" component={DriverTrips} />
            <Tab.Screen name="Passager" component={PassengerTrips} />
        </Tab.Navigator>
    );
}
export function DriverTrips() {
    const [trips, setTrips] = useState([]);
    const { darkMode } = useContext(ThemeContext);
    const [refreshing, setRefreshing] = useState(false);
  
    const fetchTrips = async () => {
        try {
          const resp = await fetch(API_URL + '/Trajet', { method: 'GET' });
          const data = await resp.json();
          console.log(data);
          setTrips(data);
        } catch (error) {
          console.error(error);
        }
      };
  
    useEffect(() => {
        fetchTrips();
      }, []);

    const onRefresh = () => {
       setRefreshing(true);
       fetchTrips();
       setRefreshing(false);
    };
  
    return (
        <ScrollView
            refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkMode ? 'white' : 'black'}
          />
        }
      >
        {trips.map((trip, index) => (
          <TouchableOpacity key={index} style={styles.tripTouchableTrajet} onPress={() => handleTripPressDriver(trip)}>
            <View style={styles.info}><Text style={styles.label}>Depart :     </Text><Text style={styles.tripText}>{trip.departAdresse}</Text></View>
            <View style={styles.info}><Text style={styles.label}>Destination :     </Text><Text style={styles.tripText}>{trip.destinationAdresse}</Text></View>
            <Text style={styles.tripText}>{moment(trip.departHeure).format('DD/MM/YYYY - HH:mm')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
  

export function PassengerTrips() {};