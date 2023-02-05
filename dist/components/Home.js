`<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCO9jnug1zEda2f2N4HveqArp4Z4cHH0ww
&callback=initMap" async defer></script>`

import React, { useState } from 'react';
import { StyleSheet, Modal, Text, TextInput, View, Button, TouchableOpacity} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { RadioButton } from 'react-native-paper';
export default function Home() {
  const [selectedField, setSelectedField] = useState("");
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('empty');
  const [trips, setTrips] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [checked, setChecked] = React.useState('first');
  const [modalVisible, setModalVisible] = useState(false);
  const [homeLocation, setHomeLocation] = useState({});


  
  const search = () => {
    fetch('https://covoiturage.onrender.com/users', {
      method : 'GET',
        mode : 'no-cors',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded',
        },
    })
      .then(response => response.json())
      .then(data => setTrips(data))
      .catch(error => {
        console.error(error);
      });
      setModalVisible(true);
  }
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fTime = tempDate.getHours() + 'h ' + tempDate.getMinutes() + 'm'; 
    setText(fDate + ' ' + fTime);
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }
  
  function choice(text) {
    setSelectedField(text);
    {selectedField === "depart" ? setDepart("Université de sciences") : setDepart("")}
    {selectedField === "arrivee" ? setArrivee("Université de sciences") : setArrivee("")}
  }

    return (
      <View style={styles.containers}>
        <Text style={styles.h1}>Bienvenue sur l'application de covoiturage de la fac</Text>
        <Text style={styles.h2}>-------------------</Text>
        <Button
        title="Choisir emplacement domicile"
        onPress={() => setModalVisible(true)}
        />
        <Text style={styles.label}>Université de sciences : </Text>
        <View style={styles.tab}>
          <Text style={styles.labelRadio}>Départ</Text>
          <RadioButton
            label="first"
            value="first"
            status={ checked === 'first' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('first')}
          />
          <Text style={styles.labelRadio}>Arrivée</Text>
          <RadioButton
            value="second"
            status={ checked === 'second' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('second')}
          />
        </View>
    {/* {isMapOpen && (
      <MapView style={{ flex: 1 }}
        onPress={event => {
        if (selectedField === "depart") {
          setDepart(`${event.nativeEvent.coordinate.latitude}, ${event.nativeEvent.coordinate.longitude}`);
        } else if (selectedField === "arrivee") {
          setArrivee(`${event.nativeEvent.coordinate.latitude}, ${event.nativeEvent.coordinate.longitude}`);
        }
      }}>
      <Button title="Close Map" onPress={setIsMapOpen(false)} />
      </MapView>
      )} */}
        <Text style={styles.label}> Date : </Text>
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
          <Button onPress={() => search()} title="Rechercher" />
        </View>
        <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={event => {
            setHomeLocation({
              latitude: event.nativeEvent.coordinate.latitude,
              longitude: event.nativeEvent.coordinate.longitude,
            });
          }}
        />
        <Button
          title="Fermer"
          onPress={() => setModalVisible(false)}
          style={{ position: 'absolute', top: 20, right: 20 }}
        />
      </Modal>
        {/* <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
        >
          <View style={styles.modalContainer}>
            {trips.map((trip, index) => (
              <View key={index} style={styles.tripContainer}>
                <Text>{trip.nom} - {trip.prenom} - {trip.login}</Text>
                <Button title="Ajouter ce trajet" onPress={handleAddTrip(trip)} />
              </View>
            ))}
            <Button title="Masquer" onPress={() => setModalVisible(false)} />
          </View>
      </Modal> */}
      </View>
    );
  }

const styles = StyleSheet.create({
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
    textAlignVertical: 'center',
    fontSize: 18,
    textAlign: 'center',
    paddingLeft: 5,
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
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