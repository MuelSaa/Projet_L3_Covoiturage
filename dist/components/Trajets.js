
import React, { useState } from 'react';
import { StyleSheet, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

Geocoder.init("AIzaSyCO9jnug1zEda2f2N4HveqArp4Z4cHH0ww", {language : "fr"});

const Tab = createMaterialTopTabNavigator();

const handleAddTrip = () => {}

function getLocationName(latitude, longitude) {
  // Geocoder.from(latitude, longitude)
  // .then(json => {
  //   var addressComponent = json.results[0].address_components;
  //   if (addressComponent != undefined) {
  //     return 'test';
  //   } else {
  //     return 'Adresse inconnue';
  //   }
  // })
  // .catch(error => { 
  //   console.error(error);
  //   return 'Adresse inconnue';
  // });
  return 'test';
}

const renderTrip =  (trip, index) => {
  const departLocation = getLocationName(trip.departLat, trip.departLon);
  const arriveeLocation = getLocationName(trip.destinationLat, trip.destinationLat);
  return (
    <View key={index} style={styles.tripContainer}>
      <Text>Depart : {departLocation}</Text>
      <Text>Arrivee : {arriveeLocation}</Text>
      <Text>Date : {moment(trip.departHeure).format('DD/MM/YYYY')}</Text>
      <Text>Heure : {moment(trip.departHeure).format('HH:mm')}</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddTrip}>
        <Text style={styles.buttonText}>Se désinscrire</Text>
      </TouchableOpacity>    
    </View>
  );
};

export default function Trajets() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="new" component={NewTrips} />
        <Tab.Screen name="past" component={LastTrips}/>
      </Tab.Navigator>
    );
  }

  export function NewTrips() {
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
      
      
      
      
    if (isFocused) {myTrips()}    

    return (
      <ScrollView>
        <View style={styles.container}>
        {trips.map((trip, index) => renderTrip(trip, index))}
        </View>
      </ScrollView>
    );
  }


export function LastTrips() {
  const [trips, setTrips] = useState([]);
  const isFocused = useIsFocused();
  async function myTrips() {
    const resp = await fetch('https://covoiturage.onrender.com/trajet', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => setTrips(data))
    .catch((error) => {}    );
    }
    if (isFocused) {myTrips()}
  const handleAddTrip = () => {}
    

    return (
      <ScrollView>
        <View style={styles.container}>
        {trips.map((trip, index) => (
        <View key={index} style={styles.tripContainer}>
          <Text>Depart : {trip.departLat}</Text>
          <Text>Arrivee : {trip.departLon}</Text>
          <Text>Date : {moment(trip.departHeure).format('DD/MM/YYYY')}</Text>
          <Text>Heure : {moment(trip.departHeure).format('HH:mm')}</Text>
          <TouchableOpacity style={styles.button} onPress={handleAddTrip}>
            <Text style={styles.buttonText}>Supprimer le trajet</Text>
          </TouchableOpacity>
        </View>
        ))}
        </View>
      </ScrollView>
    );
  }

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 5,
    shadowColor: "#eee",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    margin: 10,
    padding:10,
    position: 'absolute',
    bottom: '20%',
    right: 0,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    margin: 10,
    width:'90%'
  },
  labelRadio: {
    fontSize: 18,
    paddingTop: 10  
  },
  h1: {
    fontSize: 28,
    fontWeight : '800',
    color : 'red',
    textAlign: 'center'

  },
  h2: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 20,
    color : 'red'
  },
  tab: {
    margin:10,
    display: 'flex',
    flexDirection: 'row'
  },
  containers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  date: {
    paddingTop: 15,
    textAlign: 'center',
    fontSize: 18,
    height: 60,
    borderColor: '#26322b',
    borderWidth: 1,
    borderRadius: 20,
    width: '50%',
  },
  input: {
    fontSize: 18,
    paddingLeft: 5,
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    width: '80%',
  },
  btn: {
    margin : 40
  },
  addressContainer: {
    height: 40,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#ddd',
    alignContent: 'center',
    width: '80%',
    marginBottom: 10
  },  
  addressInput: {
    paddingTop:5,
    textAlign: 'center',
    borderColor: '#ddd',
    fontSize: 16,
  },
});