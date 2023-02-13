
import React, { useState,useContext } from 'react';
import { ThemeContext } from './AppProvider';
import TripAddedModal from './TripAddedModal';
import { StyleSheet, Modal, Text, TextInput, View, Button, TouchableOpacity} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';
import * as Location from 'expo-location';
import TripAddedModal from './TripAddedModal';

Geocoder.init("AIzaSyCO9jnug1zEda2f2N4HveqArp4Z4cHH0ww", {language : "fr"});

export default function Add() {
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
  const [dateFormat2, setDateFormat2] = useState('');
  const [addHolder, setHolder] = useState('choisir une adresse');
  const [passengers, setPassengers] = useState(1);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [champ1, setchamp1] = useState('');
  const [champ2, setchamp2] = useState('');
  const [champ3, setchamp3] = useState('');
  const [champ4, setchamp4] = useState('');

  const handlePassengerCountChange = (value) => {
    setPassengerCount(value);
  };
  
  function showTripAddedModal(){
    setAddModalVisible(true);
  }

  const hideTripAddedModal = () => {
    setAddModalVisible(false);
  }
  
  const add = async () => {
    if (!homeLocation) alert("vous n'avez pas choisi d'emplacement de domicile...");
    else {
      if(checked==='depart'){
        setchamp1(47.244505);
        setchamp2(5.987401);
        setchamp3(latitude);
        setchamp4(longitude);
      }
      else {
        setchamp1(latitude);
        setchamp2(longitude);
        setchamp3(47.244505);
        setchamp4(5.987401);
      }
      showTripAddedModal();
      try {
        const response = await fetch('https://covoiturage.onrender.com/Trajet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conducteur: 'samu',
            //token: '',
            departLat: champ1,
            departLon: champ2,
            destinationLat : champ3,
            destinationLon : champ4,
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
    setText(fDate + ' ' + fTime);
    setShow(false)
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }
  
  const handleAddTrip = () => {};

    return (
      <View style={styles.containers}>
        <Text style={styles.h1}>Remplissez ce formulaire afin d'ajouter un trajet : </Text>
        <TripAddedModal
          visible={addModalVisible}
          onClose={hideTripAddedModal}
        />
        <Text style={styles.h2}>-------------------</Text>
        {homeLocation ? (
        <TouchableOpacity style={styles.button} onPress={() => setMapModalVisible(true)}>
        <Button
        title="Modifier emplacement domicile"
        onPress={() => setMapModalVisible(true)}
        />
      </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setMapModalVisible(true)}>
          <Button
        title="Choisir emplacement domicile"
        onPress={() => setMapModalVisible(true)}
        />
        </TouchableOpacity>
      )}
        
        <Text style={styles.label}>Université de sciences : </Text>
        <View style={styles.tab}>
          <Text style={styles.labelRadio}>Départ</Text>
          <RadioButton
            label="depart"
            value="depart"
            status={ checked === 'depart' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('depart')}
          />
          <Text style={styles.labelRadio}>Arrivée</Text>
          <RadioButton
            value="arrivee"
            status={ checked === 'arrivee' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('arrivee')}
          />
        </View>
        <View style={styles.tab}>
          <Text style={styles.date}>{text}</Text>
          <Button
            style={styles.btn} title = "Date" onPress = { () => showMode('date')}
          />
          <Button
            style={styles.btn} title = "Time" onPress = { () => showMode('time')}
          />
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
        <View style={styles.btn}>
          <Button onPress={() => add()} title="Creer le trajet" />
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
            setHomeLocation([
              event.nativeEvent.coordinate.latitude,
              event.nativeEvent.coordinate.longitude,
            ]);setMapModalVisible(false);
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
          animationType="slide"
          transparent={false}
          visible={listModalVisible}
        >
          <View style={styles.modalContainer}>
            {trips.map((trip, index) => (
              <View key={index} style={styles.tripContainer}>
                <Text>{trip.nom} - {trip.prenom} - {trip.login}</Text>
                <Button title="Ajouter ce trajet" onPress={handleAddTrip(trip)} />
              </View>
            ))}
            <Button title="Masquer" onPress={() => setListModalVisible(false)} />
          </View>
      </Modal>
      </View>
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
    alignContent:'center',
    paddingTop: 5,
  },
  h1: {
    paddingBottom: 20,
    fontSize: 28,
    fontWeight: '800',
    color: 'red',
    textAlign: 'center'

  },
  h2: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 20,
    color: 'red'
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
  }
});