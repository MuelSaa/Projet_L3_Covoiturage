import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity, Animated } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemeContext } from './AppProvider';

import Config from 'react-native-config';
const apiUrl = Config.API_URL;
const apiKey = Config.API_KEY;
Geocoder.init(apiKey, {language : "fr"});

import { API_URL } from "./env";

const Tab = createMaterialTopTabNavigator();

const handleRemoveTrip = async (id) => { 
    try {
        const resp = await fetch(API_URL + "/Trajet/" + id, {
            method: 'DELETE'
        });
        const data = await resp.json();
        // Recharge la page si la suppression a réussi
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
}


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
    console.log("URL"+API_URL);
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [trips, setTrips] = useState([]);
    const isFocused = useIsFocused();
    async function myTrips() {
        try {
            const resp = await fetch(API_URL + "/Trajet", {
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
        const departLocation = trip.departAdresse;
        const arriveeLocation = trip.destinationAdresse;

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
                <TouchableOpacity style={styles.button} onPress={() => handleRemoveTrip(trip.trajetID)}>
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







export function PassengerTrips() {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [trips, setTrips] = useState([]);
    const isFocused = useIsFocused();
    async function myTrips() {
        const resp = await fetch(API_URL + "/Trajet", {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => setTrips(data))
            .catch((error) => { });
    }
    if (isFocused) { myTrips() }

    const handleDeleteTrip = () => { }
    const [animation, setAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const renderTrip = (trip, index) => {
        const departLocation = trip.departAdresse;
        const arriveeLocation = trip.destinationAdresse;

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
                <TouchableOpacity style={styles.button} onPress={handleDeleteTrip}>
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
        backgroundColor: '#1C6E8C',
        borderRadius: 5,
        shadowColor: '#1C6E8C',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        margin: 10,
        padding: 10,
        position: 'absolute',
        bottom: 0,
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
        color: '#1C6E8C',
        margin: 10,
    },
});