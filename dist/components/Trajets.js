import React, { useState, useEffect, useContext } from 'react';
import {Alert, Modal, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import Geocoder from 'react-native-geocoding';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ThemeContext } from './AppProvider';
import getModalStyles from '../assets/styles/modalStyles';
import getStyles from '../assets/styles/styles';
import { RemoveTripModal } from './Modal';

import { API_URL } from "./env";
import { API_KEY } from "./env";
Geocoder.init(API_KEY, {language : "fr"});

const Tab = createMaterialTopTabNavigator();


const Trajets = () => {
  const [tripsDriver, setTripsDriver] = useState([]);
  const [tripsPassenger, setTripsPassenger] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const { darkMode, globalLogin, token } = useContext(ThemeContext);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showRemoveTripModal, setShowRemoveTripModal] = useState(false);
  const styles = getStyles(darkMode);
  const modalStyles = getModalStyles(darkMode);
  const user = globalLogin ? globalLogin : 'samu';

  useEffect(() => {
    fetchTrips();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
    setRefreshing(false);
  };


  const handleRemoveTrip = async (id) => { 
    try {
        const resp = await fetch(API_URL + "/Trajet/" + id, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error(error);
    }
    fetchTrips();
  }

  const handleUnscribeTrip = async (id) => { 
    try {
        const resp = await fetch(API_URL + "/Passager/" + id + '/' + user,{
          method: 'DELETE'
       });
    } catch (error) {
         console.error(error);
    }
    fetchTrips();
  }

  const fetchTrips = async () => {
    try {
      const resp = await fetch(API_URL + '/Trajet', { method: 'GET' });
      const data = await resp.json();
      setTripsDriver(data);
    } catch (error) {
      console.error(error);
    }
    try {
      const resp = await fetch(API_URL + '/PassagerID/' + user, { method: 'GET' });
      const data = await resp.json();
      setTripsPassenger(data);
    } catch (error) {
      console.error(error);
    }
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
                  fetchTrips();
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
                      fetchTrips();
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

  const displayTrips = (trips, boolean) => {
    return (
    <ScrollView
      style={{backgroundColor: darkMode ? 'black' : 'white'}}
      refreshControl={
      <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
      {trips.map((trip, index) => (
        <TouchableOpacity key={index} style={styles.tripTouchableTrajet} onPress={boolean ? () => handleTripPressDriver(trip) : () => handleTripPressPassenger(trip)}>
          <View style={styles.info}><Text style={styles.label}>Depart : </Text><Text style={styles.tripText}>{trip.departAdresse}</Text></View>
          <View style={styles.info}><Text style={styles.label}>Destination : </Text><Text style={styles.tripText}>{trip.destinationAdresse}</Text></View>
          <View style={styles.info}><Text style={styles.label}>Date : </Text><Text style={styles.tripText}>{moment(trip.departHeure).format('DD/MM/YYYY - HH:mm')}</Text></View>
          {boolean === true && (<View style={styles.info}><Text style={styles.label}>Places restantes : </Text><Text style={styles.tripText}>{trip.placeDisponible}</Text></View>)}
        </TouchableOpacity>
      ))}
      <RemoveTripModal visible={showRemoveTripModal} onClose={() => setShowRemoveTripModal(false)} darkMode={darkMode}/>
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
  };



  const DriverTrips = () => {
    return displayTrips(tripsDriver, true);
  };

  const PassengerTrips = () => {
    return displayTrips(tripsPassenger, false);
  };


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
};

export default Trajets