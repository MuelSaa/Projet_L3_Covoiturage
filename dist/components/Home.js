import React, { useState } from 'react';
import { StyleSheet, Modal, Text, TextInput, View, Button, Platform, FlatList} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
export default function Home() {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('empty');
  const [trips, setTrips] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddTrip = (trip) => {
    // ajouter le voyage à la liste de l'user
    console.log(`Trip ${trip.login} added`);
  };
  
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
  

    return (
      <View style={styles.containers}>
        <Text style={styles.h1}>Bienvenue sur l'application de covoiturage de la fac</Text>
        <Text style={styles.h2}>Remplissez ce formulaire afin de rechercher un trajet </Text>
        <Text style={styles.label}>Départ :</Text>
        <TextInput
          onChangeText={(text) => setDepart(text)}
          style={styles.input}
          value={depart}
        />
        <Text style={styles.label}>Arrivée :</Text>
        <TextInput
          onChangeText={(text) => setArrivee(text)}
          style={styles.input}
          value={arrivee}
        />
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
      </Modal>
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