import React, { useState, useContext, useRef } from 'react';
import { Alert, StyleSheet, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import logo from '../assets/logo.png';
import { DarkTheme } from '@react-navigation/native';
import { ThemeContext } from './AppProvider';
import styles from '../styles';


import { API_URL } from "./env";
import { API_KEY } from "./env";
Geocoder.init(API_KEY, {language : "fr"});


export default function Add() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('choisir une date');
  const [checked, setChecked] = useState('depart');
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [homeLocation, setHomeLocation] = useState('');
  const [latitude, setMarkerlat] = useState('');
  const [longitude, setMarkerlon] = useState('');
  const [address, setAddress] = useState('');
  const [dateFormat, setDateFormat] = useState('');
  const [dateFormat2, setDateFormat2] = useState('');
  const [addHolder, setHolder] = useState('choisir une adresse');
  const [passengers, setPassengers] = useState(1);
  const [champ1, setchamp1] = useState('');
  const [champ2, setchamp2] = useState('');
  const [champ3, setchamp3] = useState('');
  const [champ4, setchamp4] = useState('');
  const [champ5, setchamp5] = useState('');
  const [champ6, setchamp6] = useState('');
  const timeoutRef = useRef(null);
  const [showAddTripModal, setShowAddTripModal] = useState(false);

  const AddTripModal = ({ visible, onClose }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
      <View style={modalStyles.container}>
        <View style={modalStyles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <Text style={modalStyles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={modalStyles.title}>Trajet ajouté</Text>
          <Text style={modalStyles.message}>Votre trajet a bien été ajouté.</Text>
        </View>
        </View>
      </Modal>
      
    );
  };


const modalStyles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    margin: 30,
    borderColor:'green',
    borderWidth: 3,
    width: '80%',
    height: '15%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  message: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
  },
});

  const incrementPassengers = () => {
    if (passengers < 8) {
      setPassengers(passengers + 1);
    }
  };
  const decrementPassengers = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
    }
  };

  function setCompleteLocation(lat, long) {
    setMarkerlat(lat);
    setMarkerlon(long);
    setHomeLocation([lat, long]);
    Geocoder.from(latitude, longitude)
      .then(json => {
        var addressComponent = json.results[0].address_components;
        setAddress("");
        setHolder(addressComponent[0].long_name + ' ' + addressComponent[1].long_name + ' ' + addressComponent[2].long_name)
      })
      .catch(error => setHolder('adresse inconnue'));
  }

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log(location.coords.latitude, location.coords.longitude);
    setCompleteLocation(location.coords.latitude, location.coords.longitude);
  }

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      Geocoder.from(newAddress)
        .then(json => {
          var location = json.results[0].geometry.location;
          setCompleteLocation(location.lat, location.lng);
        })
        .catch(error => console.log(error));
    }, 2000);
  };

  const add = async () => {
    if(!dateFormat) alert("vous n'avez pas choisi de date..."); 
    if (!homeLocation) alert("vous n'avez pas choisi d'emplacement de domicile...");
    if(addHolder == 'adresse inconnue') alert("vous n'avez pas choisi une adresse valide...");
    else {
      setShowAddTripModal(true);
      if (checked === 'depart') {
        setchamp1(47.244505);
        setchamp2(5.987401);
        setchamp3(latitude);
        setchamp4(longitude);
        setchamp5('universite');
        setchamp6(addHolder);
      }
      else {
        setchamp1(latitude);
        setchamp2(longitude);
        setchamp3(47.244505);
        setchamp4(5.987401);
        setchamp5(addHolder);
        setchamp6('universite');
      }
      try {
        const response = await fetch(API_URL + '/Trajet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conducteur: 'samu',
            //token: '',
            departAdresse:champ5,
            destinationAdresse:champ6,
            departLat: champ1,
            departLon: champ2,
            destinationLat: champ3,
            destinationLon: champ4,
            departHeure: dateFormat,
            arriverHeure: dateFormat2,
            placeDisponible: passengers,
            //recurrence:0,
          })
        });
      }
      catch (error) {
        console.error(error);
      }
    }
  }
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fTime = tempDate.getHours() + 'h ' + tempDate.getMinutes() + 'm';
    setDateFormat(tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + "-" + tempDate.getDate() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds() + '+00');
    setDateFormat2(tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + "-" + tempDate.getDate() + ' ' + (tempDate.getHours() + 1) + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds() + '+00');
    setText(fDate + ' ' + fTime);
    setShow(false)
  }
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }
  const { darkMode } = useContext(ThemeContext);
  return (
    <ScrollView style={{backgroundColor: darkMode ? 'black' : 'white'}}>
      <View style={[styles.container]}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View> 
        <Text style={styles.h1}>Ajoutez un trajet</Text>
        <View style={styles.addressContainer}>
          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={handleAddressChange}
            placeholder={addHolder}
          />
        </View>
        <View style={styles.tabrow}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#1C6E8C' }]} onPress={() => setMapModalVisible(true)}>
          <Text style={styles.buttonText}>Afficher carte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#1C6E8C' }]} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>Utiliser localisation</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.radioButtonsContainer}>
          <TouchableOpacity 
            style={[styles.button, checked === 'depart' ? styles.activeButton : null]} 
            onPress={() => setChecked('depart')}
          >
            <Text style={[styles.buttonText, checked === 'depart' ? styles.activeButtonText : null]}>Université de Sciences - Départ</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, checked === 'arrivee' ? styles.activeButton : null]} 
            onPress={() => setChecked('arrivee')}
          >
            <Text style={[styles.buttonText, checked === 'arrivee' ? styles.activeButtonText : null]}>Université de Sciences - Arrivée</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabrow}>

          <Text style={styles.date}>{text}</Text>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#1C6E8C' }]} onPress = { () => showMode('date')}>
            <Text style={styles.buttonText}>Date</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#1C6E8C' }]} onPress = { () => showMode('time')}>
            <Text style={styles.buttonText}>Time</Text>
          </TouchableOpacity>

        </View>
        {show && (
          <DateTimePicker
          testID='dateTimePicker'
          value={date}
          mode={mode}
          is24Hour={true}
          display='default'
          onChange={onChangeDate}
          />
        )}

        <View style={styles.tabrow}>
          <Text style={styles.label}>place(s) disponible(s) : </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => incrementPassengers()}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.numberfield}>{passengers}</Text>
            <TouchableOpacity style={styles.button} onPress={() => decrementPassengers()}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={() => add()}>
            <Text style={styles.buttonText}>Creer le trajet</Text>
          </TouchableOpacity>
        </View>

        <Modal
        animationType="slide"
        transparent={false}
        visible={mapModalVisible}
        onRequestClose={() => {
          setMapModalVisible(false);
        }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
          latitude: 47.25,
          longitude: 6.0333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          }}
          onPress={event => {
            console.log(event.nativeEvent.coordinate.latitude, event.nativeEvent.coordinate.longitude);
            setCompleteLocation(event.nativeEvent.coordinate.latitude, event.nativeEvent.coordinate.longitude);
            setMapModalVisible(false);
          }}
        >
        {homeLocation !== "" && (
        <Marker   coordinate={{ latitude, longitude }} pinColor="red" />
        )}
        </MapView>
        <Button
          title="Fermer"
          onPress={() => setMapModalVisible(false)}
          style={{ position: 'absolute', top: 20, right: 20 }}
        />
      </Modal>
      <AddTripModal visible={showAddTripModal} onClose={() => setShowAddTripModal(false)} />
      </View>
    </ScrollView>
  );
};