import React, { useState, useContext, useRef } from 'react';
import { Alert, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity, Image} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import logo from '../assets/logo.png';
import { ThemeContext } from './AppProvider';
import moment from 'moment';
import styles from '../styles';
import modalStyles from '../modalStyles';

import { API_URL } from "./env";
import { API_KEY } from "./env";
Geocoder.init(API_KEY, {language : "fr"});

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('choisir une date');
  const [trips, setTrips] = useState([]);
  const [checked, setChecked] = useState('depart');
  const [listModalVisible, setListModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [homeLocation, setHomeLocation] = useState('');
  const [latitude, setMarkerlat] = useState('');
  const [longitude, setMarkerlon] = useState('');
  const [address, setAddress] = useState('');
  const [dateFormat, setDateFormat] = useState('');
  const [addHolder, setHolder] = useState('choisir une adresse');
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
          <Text style={modalStyles.message}>Vous avez demandé l'inscription à ce trajet.</Text>
        </View>
        </View>
      </Modal>
      
    );
  };
  
  function setCompleteLocation(lat, long) {
    setMarkerlat(lat);
    setMarkerlon(long);
    setHomeLocation([lat,long]);
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

  const handleAddTrip = async (id) => { 
    console.log(id);
    try {
        const body = JSON.stringify({
            login: "samu",
            trajetID: id,
        });

        const resp = await fetch(API_URL + "/Passager", {
            method: 'POST',
            body,
            headers: {
              'Content-Type': 'application/json'
            }
        });
        const data = await resp.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
  }

  const search = async () => {
    if(!dateFormat) alert("vous n'avez pas choisi de date...");
    if(!homeLocation) alert("vous n'avez pas choisi d'emplacement de domicile...");
    if(addHolder == 'adresse inconnue') alert("vous n'avez pas choisi une adresse valide...");
    else {
      console.log(dateFormat);
      const resp = await fetch(API_URL + '/Trajet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify({
        //   departLat:,
        //   departLon:,
        //   arriverLat:,
        //   arriverLon:,
        //   date:,
        //   heure:,
        // })
      })
      .then(response => response.json())
      .then(data => setTrips(data))
      setListModalVisible(true);
    }
  };
    
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fTime = tempDate.getHours() + 'h ' + tempDate.getMinutes() + 'm';
    setDateFormat(tempDate.getFullYear()+'-'+(tempDate.getMonth() + 1)+"-"+tempDate.getDate()+' '+tempDate.getHours()+':'+tempDate.getMinutes()+':'+tempDate.getSeconds()+'+00');
    setText(fDate + ' ' + fTime);
    setShow (false)
  }
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }
  const { darkMode } = useContext(ThemeContext);

  const [modalVisible, setModalVisible] = useState(false);

  const handleTripPress = (trip) => {
    Alert.alert(
        'Que souhaitez-vous faire ?',
        '',
        [
            {
                text: 'Ajouter ce trajet',
                onPress: async () => {
                    setShowAddTripModal(true);
                    handleAddTrip(trip.trajetID);
                },
                style: 'default',
            },
            {
                text: 'Information sur le trajet',
                onPress: () => {
                },
                style: 'default',
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
      <ScrollView style={{backgroundColor: darkMode ? 'black' : 'white'}}>
      <View style={[styles.container]}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View> 
        <Text style={styles.h1}>Recherchez un trajet</Text>
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

        <View style={styles.tab}>

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
        <TouchableOpacity style={styles.button} onPress={() => search()}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
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
      <Modal
        animationType="fade"
        transparent={false}
        visible={listModalVisible}
      >
        <View style={styles.modalContainer}>
        <Text style={{color:'#1C6E8C', fontWeight:"bold", fontSize:23, marginBottom:30, fontStyle:"italic" }}>Cliquez sur un trajet pour l'ajouter</Text>
          <ScrollView>
            {trips.map((trip, index) => (
              <TouchableOpacity key={index} style={styles.tripTouchable} onPress={() => handleTripPress(trip)}>
                <Text style={styles.tripText}>{trip.departAdresse} - {trip.destinationAdresse}</Text>
                <Text style={styles.tripText}>{moment(trip.departHeure).format('DD/MM/YYYY HH:mm')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={() => setListModalVisible(false)}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </View>
      <AddTripModal visible={showAddTripModal} onClose={() => setShowAddTripModal(false)} />
      </ScrollView>
    );
  }

;