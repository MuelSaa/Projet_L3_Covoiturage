import React, { useState, useContext, useRef } from 'react';
import { Alert, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity, Image} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import logo from '../assets/logo.png';
import { ThemeContext } from './AppProvider';
import getStyles from '../assets/styles/styles';
import { AddPassengerModal } from './Modal';
import { TripShowModal } from './Modal';
import { MapShowModal } from './Modal';

import { API_URL } from "./env";
import { API_KEY } from "./env";
Geocoder.init(API_KEY, {language : "fr"});

export default function Home() {

  const { darkMode, toggleDarkMode, GlobalLogin, logout } = useContext(ThemeContext);
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
  const [showAddPassengerModal, setShowAddPassengerModal] = useState(false);
  const styles = getStyles(darkMode);


  /**********************************************************************************************************
   * 3 fonctions pour gérer la localisation de l'utilisateur :
   * 
   * getCurrentLocation : récupère la localisation de l'utilisateur
   * setCompleteLocation : met à jour les variables latitude, longitude, homeLocation et address
   * handleAdressChange : récupère le nom de la localisation de l'utilisateur en fonction de l'adresse entrée
   * 
   *********************************************************************************************************/

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
    }, 1000);
  };

  /**********************************************************************************************************
   * 2 fonctions pour gérer l'ajout d'un passager à la base de données :
   * 
   * handleTripPress : affiche une alerte avec 3 boutons : ajouter ce trajet, information sur le trajet et annuler
   * handleAddTrip : ajoute le passager à la base de données
   * 
   **********************************************************************************************************/

  const handleTripPress = (trip) => {
    Alert.alert(
        'Que souhaitez-vous faire ?',
        '',
        [
            {
                text: 'Ajouter ce trajet',
                onPress: async () => {
                    setShowAddPassengerModal(true);
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


  /**********************************************************************************************************
   * 3 fonctions pour gérer la recherche de trajet :
   * 
   * search : récupère les trajets correspondant aux critères de recherche
   * onChange : met à jour la variable dateFormat
   * showMode : affiche le calendrier
   * 
   **********************************************************************************************************/

  const search = async () => {
    if(!dateFormat) alert("vous n'avez pas choisi de date...");
    else if(!homeLocation) alert("vous n'avez pas choisi d'emplacement de domicile...");
    else if(addHolder == 'adresse inconnue') alert("vous n'avez pas choisi une adresse valide...");
    else {
      console.log(dateFormat);
      console.log(`${API_URL}/FindTrajetDepart?departLat=${checked === 'depart' ? 47.244505 : latitude}&departLon=${checked === 'depart' ? 5.987401 : longitude}&arriverLat=${checked === 'depart' ? latitude : 47.244505}&arriverLon=${checked === 'depart' ? longitude : 5.987401}&date=${dateFormat}`);
      const resp = await fetch(`${API_URL}/FindTrajetDepart?departLat=${checked === 'depart' ? 47.244505 : latitude}&departLon=${checked === 'depart' ? 5.987401 : longitude}&arriverLat=${checked === 'depart' ? latitude : 47.244505}&arriverLon=${checked === 'depart' ? longitude : 5.987401}&heure=${dateFormat}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      console.log(response)
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

  /************************* AFFICHAGE DU FORMULAIRE **********************************************************/
    return (
      <ScrollView style={{backgroundColor: darkMode ? 'black' : 'white'}}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View> 
        <View style={styles.addressContainer}>
          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={handleAddressChange}
            placeholder={addHolder}
            placeholderTextColor='#1C6E8C'
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
        <TouchableOpacity style={styles.buttonForm} onPress={() => search()}>
          <Text style={styles.buttonFormText}>Rechercher</Text>
        </TouchableOpacity>

        <MapShowModal visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        setCompleteLocation={setCompleteLocation}
        homeLocation={homeLocation}
        latitude={latitude}
        longitude={longitude}/>

        <TripShowModal
          visible={listModalVisible}
          onClose={() => setListModalVisible(false)}
          trips={trips}
          handleTripPress={handleTripPress}
          text="Cliquez sur un trajet pour l'ajouter"/>
      </View>
      <AddPassengerModal visible={showAddPassengerModal} onClose={() => setShowAddPassengerModal(false)} />
      </ScrollView>
    );
  }

;