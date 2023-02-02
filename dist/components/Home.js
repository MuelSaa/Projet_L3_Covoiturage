import React, { useState } from 'react';
//import axios from 'axios'
import { StyleSheet, Text, TextInput, View, Button, Platform} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"
export default function Home() {
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('empty');
  

  // async function search() {
  //   try{
  //     const resp = await axios.get('http://localhost:8080/Users/samu');
  //     console.log(resp.data);
  //     return resp.data;
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // }
  const search = {};
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS = 'android');
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
      <View style={styles.container}>
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

      </View>
    );
  }

const styles = StyleSheet.create({
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
  container: {
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