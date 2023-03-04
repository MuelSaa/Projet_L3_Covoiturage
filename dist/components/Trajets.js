import React, { useState, useEffect, useContext } from 'react';
import { FlatList, Alert, StyleSheet, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import moment from 'moment';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemeContext } from './AppProvider';
import modalStyles from '../assets/styles/modalStyles';
import styles from '../assets/styles/styles';
import { RemoveTripModal } from './Modal';

import { API_URL } from "./env";
import { API_KEY } from "./env";
Geocoder.init(API_KEY, {language : "fr"});
const user = "samu";
const Tab = createMaterialTopTabNavigator();

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
                tabBarActiveTintColor: '#1C6E8C',
                tabBarInactiveTintColor: 'gray',
                tabBarPressColor: '#1C6E8C',
                borderColor: '#1C6E8C',
                tabBarIndicatorStyle: {backgroundColor: '#1C6E8C'},
            }}>
            <Tab.Screen name="Conducteur" component={DriverTrips}/>
            <Tab.Screen name="Passager" component={PassengerTrips} />
            
        </Tab.Navigator>
    );
}
export function DriverTrips() {

    const [trips, setTrips] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const { darkMode } = useContext(ThemeContext);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showRemoveTripModal, setShowRemoveTripModal] = useState(false);


    const handleTripPressDriver = (trip) => {
        Alert.alert(
            'Que souhaitez-vous faire ?',
            '',
            [
                {
                    text: 'Information sur le trajet',
                    onPress: async () => {
                        setModalVisible(true);
                            try {
                              const resp = await fetch(API_URL + '/Passager/' + trip.trajetID, { method: 'GET' });
                              const data = await resp.json();
                              console.log(data);
                              if(data != undefined)
                              setPassengers(data);
                            } catch (error) {
                              console.error(error);
                            }
                        // afficher des informations sur le trajet
                    },
                    style: 'default',
                },
                {
                    text: 'Supprimer le trajet',
                    onPress: () => {
                        setShowRemoveTripModal(true);
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
            <View style={styles.info}><Text style={styles.label}>Depart : </Text><Text style={styles.tripText}>{trip.departAdresse}</Text></View>
            <View style={styles.info}><Text style={styles.label}>Destination : </Text><Text style={styles.tripText}>{trip.destinationAdresse}</Text></View>
            <View style={styles.info}><Text style={styles.label}>Date : </Text><Text style={styles.tripText}>{moment(trip.departHeure).format('DD/MM/YYYY - HH:mm')}</Text></View>
            <View style={styles.info}><Text style={styles.label}>Places restantes : </Text><Text style={styles.tripText}>{trip.placeDisponible}</Text></View>
          </TouchableOpacity>
        ))}
        <RemoveTripModal visible={showRemoveTripModal} onClose={() => setShowRemoveTripModal(false)} />
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}>
        <View style={modalStyles.infoModalContainer}>
            <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>Passagers inscrits :</Text>
            {passengers.map((pass, index) => (
                <Text style={styles.tripText}>{pass.passagerID}</Text>
            ))}
            <TouchableOpacity
                style={[modalStyles.button, modalStyles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={modalStyles.textStyle}>Fermer</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
      </ScrollView>
      
    );
  }
  

export function PassengerTrips() {
    const [trips, setTrips] = useState([]);
    const { darkMode } = useContext(ThemeContext);
    const [refreshing, setRefreshing] = useState(false);
    const [showRemoveTripModal, setShowRemoveTripModal] = useState(false);

  
    const fetchTrips = async () => {
        try {
          const resp = await fetch(API_URL + '/PassagerID/' + user, { method: 'GET' });
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
                  setShowRemoveTripModal(true);
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
          <TouchableOpacity key={index} style={styles.tripTouchableTrajet} onPress={() => handleTripPressPassenger(trip)}>
            <View style={styles.info}><Text style={styles.label}>Depart : </Text><Text style={styles.tripText}>{trip.departAdresse}</Text></View>
            <View style={styles.info}><Text style={styles.label}>Destination : </Text><Text style={styles.tripText}>{trip.destinationAdresse}</Text></View>
            <Text style={styles.tripText}>{moment(trip.departHeure).format('DD/MM/YYYY - HH:mm')}</Text>
          </TouchableOpacity>
        ))}
        <RemoveTripModal visible={showRemoveTripModal} onClose={() => setShowRemoveTripModal(false)} />
      </ScrollView>
    );
  };