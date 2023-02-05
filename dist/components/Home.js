
import React, { useState } from 'react';
import { StyleSheet, Modal, Text, TextInput, View, Button, TouchableOpacity} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
import MapView, { Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
export default function Home() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('partir maintenant');
  const [trips, setTrips] = useState([]);
  const [checked, setChecked] = React.useState('depart');
  const [listModalVisible, setListModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [homeLocation, setHomeLocation] = useState('');

  
  const search = async () => {
    if(!homeLocation) alert("vous n'avez pas choisi d'emplacement de domicile...");
    else {
      const resp = await fetch('https://covoiturage.onrender.com/trajet', {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => setTrips(data))
      setListModalVisible(true);
    }
  };
      // try {
      //   const response = await fetch('https://covoiturage.onrender.com/', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       universite: checked,
      //       home: homeLocation,
      //       date: date,
      //     })
      //   })
      //   .then(response => response.json())
      //   .then(data => setTrips(data))
      //   setListModalVisible(true);
      // }
      // catch(error) {
      //     console.error(error);
      // }
    
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fTime = tempDate.getHours() + 'h ' + tempDate.getMinutes() + 'm'; 
    setText(fDate + ' ' + fTime);
    setShow (false)
  }

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  }
  
  const handleAddTrip = () => {
    
  };

    return (
      <View style={styles.containers}>
        <Text style={styles.h1}>Bienvenue sur l'application de covoiturage de la fac</Text>
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
          <Button onPress={() => search()} title="Rechercher" />
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
        />
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
                <Text>{trip.depart} - {trip.destination} - {trip.departHeure}</Text>
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
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
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