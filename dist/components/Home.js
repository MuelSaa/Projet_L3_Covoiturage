import React, { useState, useContext } from 'react';
import { ThemeContext } from './AppProvider';
import { StyleSheet, Modal, Text, TextInput, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';

Geocoder.init("AIzaSyCO9jnug1zEda2f2N4HveqArp4Z4cHH0ww", { language: "fr" });

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

  const handleAddTrip = () => { }

  const search = async () => {
    if (!dateFormat) alert("vous n'avez pas choisi de date...");
    if (!homeLocation) alert("vous n'avez pas choisi d'emplacement de domicile...");
    else {
      console.log(dateFormat);
      const resp = await fetch('https://covoiturage.onrender.com/trajet', {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => setTrips(data))
      setListModalVisible(true);
    }
  };

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fTime = tempDate.getHours() + 'h ' + tempDate.getMinutes() + 'm';
    setDateFormat(tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + "-" + tempDate.getDate() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds() + '+00');
    setText(fDate + ' ' + fTime);
    setShow(false)
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }

  return (
    <ScrollView style={{ backgroundColor: darkMode ? 'black' : 'white' }}>
      <View style={[styles.containers, { backgroundColor: darkMode ? 'black' : 'white' }]}>
        <Text style={[styles.h1, { marginBottom: 50 }]}>Bienvenue</Text>
        <View style={[styles.addressContainer, { backgroundColor: darkMode ? 'white' : 'white', marginBottom: 10 }]}>
          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={handleAddressChange}
            placeholder={addHolder}
          />
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 40 }}>
          <TouchableOpacity style={styles.button}>
            <Button title="Afficher carte" onPress={() => setMapModalVisible(true)} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Button title="Utiliser localisation" onPress={getCurrentLocation} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 18, color: darkMode ? 'white' : 'black' }}>Université de sciences : </Text>
        <View style={[styles.tab, { marginBottom: 30 }]}>
          <Text style={[styles.labelRadio, { color: darkMode ? 'white' : 'black' }]}>Départ</Text>
          <RadioButton
            label="depart"
            value="depart"
            status={checked === 'depart' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('depart')}
          />
          <Text style={[styles.labelRadio, { color: darkMode ? 'white' : 'black' }]}>Arrivée</Text>
          <RadioButton
            value="arrivee"
            status={checked === 'arrivee' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('arrivee')}
          />
        </View>
        <View style={[styles.tab, { marginBottom: 40 }]}>
          <Text style={[styles.date, { color: darkMode ? 'white' : 'black'}]}>{text}</Text>
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
        <TouchableOpacity style={styles.button}>
          <Button onPress={() => search()} title="Rechercher" />
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
        <Modal
          animationType="slide"
          transparent={false}
          visible={listModalVisible}
        >
          <View style={styles.modalContainer}>
            <ScrollView>
              {trips.map((trip, index) => (
                <View key={index} style={styles.tripContainer}>
                  <Text>{trip.depart} - {trip.destination} - {trip.departHeure}</Text>
                  <Button title="Ajouter ce trajet" onPress={handleAddTrip(trip)} />
                </View>
              ))}
              <Button style={{ position: 'absolute', top: 20, right: 20 }} title="Masquer" onPress={() => setListModalVisible(false)} />
            </ScrollView>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    color: '#333333',
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
    paddingTop: 10,
  },
  h1: {
    marginTop: 50,
    fontSize: 38,
    fontWeight: '800',
    color: '#1C6E8C',
    textAlign: 'center',
  },
  tab: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
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
    borderColor: '#D2C6D0',
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
    borderColor: '#D2C6D0',
    alignContent: 'center',
    width: '80%',
    marginBottom: 10
  },
  addressInput: {
    paddingTop: 5,
    textAlign: 'center',
    borderColor: '#92778E',
    fontSize: 16,
  },
});