import React, { useState, useContext } from 'react';
import { StyleSheet, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import TripAddedModal from './TripAddedModal';
import logo from '../assets/logo.png';
import { DarkTheme } from '@react-navigation/native';
import { ThemeContext } from './AppProvider';

import Config from 'react-native-config';
const apiUrl = Config.API_URL;
const apiKey = Config.API_KEY;
Geocoder.init(apiKey, {language : "fr"});

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
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [champ1, setchamp1] = useState('');
  const [champ2, setchamp2] = useState('');
  const [champ3, setchamp3] = useState('');
  const [champ4, setchamp4] = useState('');
  const [champ5, setchamp5] = useState('');
  const [champ6, setchamp6] = useState('');

  function showTripAddedModal() {
    setAddModalVisible(true);
  }

  const hideTripAddedModal = () => {
    setAddModalVisible(false);
  }

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
    if (newAddress.length > 10) {
      Geocoder.from(newAddress)
        .then(json => {
          var location = json.results[0].geometry.location;
          setCompleteLocation(location.lat, location.lng);
        })
        .catch(error => console.log(error));
    }
  };

  const add = async () => {
    if (!homeLocation) alert("vous n'avez pas choisi d'emplacement de domicile...");
    else {
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
      showTripAddedModal();
      try {
        const response = await fetch(apiUrl + '/Trajet', {
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.h1}>Ajoutez un trajet </Text>
        <TripAddedModal
          visible={addModalVisible}
          onClose={hideTripAddedModal}
        />
        <View style={styles.addressContainer}>
          <TextInput
            style={[styles.addressInput,{backgroundColor: darkMode ? 'white': styles.addressInput.color}]}
            value={address}
            onChangeText={handleAddressChange}
            placeholder={addHolder}
          />
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <TouchableOpacity style={styles.button}>
            <Button title="Afficher carte" onPress={() => setMapModalVisible(true)} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Button title="Utiliser localisation" onPress={getCurrentLocation} />
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 10, fontSize: 18, color: darkMode ? 'white' : 'black' }}>Université de sciences : </Text>
        <View style={styles.tab}>
          <Text style={[styles.labelRadio,{color: darkMode ? 'white' : styles.labelRadio.color}]}>Départ</Text>
          <TouchableOpacity style={styles.button}>
            <RadioButton
              value="depart"
              status={checked === 'depart' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('depart')}
            />
          </TouchableOpacity>
          <Text style={[styles.labelRadio,{color: darkMode ? 'white' : styles.labelRadio.color}]}>Arrivée</Text>
          <TouchableOpacity style={styles.button}>
            <RadioButton
              value="arrivee"
              status={checked === 'arrivee' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('arrivee')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tab}>
          <Text style={[styles.date,{color: darkMode ? 'white' : styles.date.color,borderColor: darkMode ? '#D2C6D0' : styles.date.borderColor }]}>{text}</Text>
          <TouchableOpacity style={styles.button}>
            <Button
              style={styles.btn} title="Date" onPress={() => showMode('date')}
            />
            <Button
              style={styles.btn} title="Time" onPress={() => showMode('time')}
            />
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
        <View style={styles.tab}>
          <Text style={[styles.label,{color: darkMode ? 'white' : styles.label.color}]}>Nombre de places : </Text>
          <Text style={[styles.numberfield,{color: darkMode ? 'white' : styles.numberfield.color}]}>{passengers}</Text>
          <TouchableOpacity style={styles.button}>
            <Button title="  +  " onPress={() => incrementPassengers()} />
            <Button title="  -  " onPress={() => decrementPassengers()} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button}>
          <Button onPress={() => add()} title="Creer le trajet" />
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
              <Marker coordinate={{ latitude, longitude }} pinColor="red" />
            )}
          </MapView>
          <Button
            title="Fermer"
            onPress={() => setMapModalVisible(false)}
            style={{ position: 'absolute', top: 20, right: 20 }}
          />
        </Modal>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    marginBottom: 30,
  },
  logo: {
    width: '100%',
    height: '150%',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333'
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
  },
  labelRadio: {
    fontSize: 18,
    paddingTop: 20,
  },
  h1: {
    paddingBottom: 20,
    fontSize: 28,
    fontWeight: '800',
    color: '#1C6E8C',
    textAlign: 'center'
  },
  h2: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 20,
    color: 'red'
  },
  tab: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  containers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    paddingTop: 10,
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
    margin: 40
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
    paddingTop: 7,
    textAlign: 'center',
    borderColor: '#ddd',
    fontSize: 16,
  },
  numberfield: {
    borderRadius: 5,
    alignContent: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 7,
    paddingLeft: 5,
    height: 35,
    width: 30,
    borderColor: 'grey',
    borderWidth: 1,
  }
});