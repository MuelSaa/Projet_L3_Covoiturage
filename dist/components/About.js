import React, { useContext, useState, useEffect } from 'react';
import { Image, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';
import { ThemeContext } from './AppProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getStyles from '../assets/styles/styles';
import logo from '../assets/logo.png';
import { ScrollView } from 'react-native-gesture-handler';
import { InfoModal } from './Modal';
import { TripShowModal } from './Modal';
import { NoteShowModal } from './Modal';
import { API_URL } from "./env";
import {useNavigation} from 'react-navigation-hooks'

const About = () => {
  const { darkMode, toggleDarkMode, GlobalLogin, logout } = useContext(ThemeContext);
  const { navigate } = useNavigation();
  const styles = getStyles(darkMode);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [trips, setTrips] = useState([]);
  const [noteAverage, setNoteAverage] = useState(0);
  const [notes, setNotes] = useState([]);
  
  const icon = darkMode ? 'moon-o' : 'sun-o';
  const text = darkMode ? 'Mode sombre activé' : 'Mode sombre désactivé';

  useEffect(() => {
    fetch(API_URL + '/MNotes/' + GlobalLogin ? GlobalLogin : 'samu', { 
      method: 'GET',
    }).then(response => response.json())
    .then(data => setNoteAverage(data));
  }, []);

  const handleNotes = async () => {
    fetch(API_URL + '/NotesC/Aleen80', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => setNotes(data))
    console.log(notes);
    setNoteModalVisible(true);
  };

  const handleHistory = async () => {
    fetch(API_URL + '/Trajet', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => setTrips(data))
      setListModalVisible(true);
    };

    const handleTiket = () => {
      Linking.openURL('mailto:ataieb3342@gmail.com?subject=Ticket');
    };

    const handleLogout = () => {
      {logout};
      navigate('Login');
    }

    return (
      <ScrollView style={{backgroundColor: darkMode ? 'black' : 'white'}}>
        <View style={[styles.container]}>
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
          </View> 
          <Text style={styles.h1}>Bonjour {GlobalLogin ? GlobalLogin : 'Samuel'} !</Text>
          <View>
            <Text>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                name={i < Math.floor(noteAverage) ? 'star' : 'star-outline'}
                style={[i < Math.floor(noteAverage) ? styles.filledStar : styles.emptyStar, { fontSize: 30 }]}
                key={i}
              />
            ))}
            </Text>
          </View>
          <View style={{marginTop:10, width:'100%', alignItems:'center'}}>
          <TouchableOpacity style={styles.buttonInfo} onPress={handleHistory}>
            <Icon name="history" size={20} color={darkMode ? 'white' : 'black'}/>
            <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>Votre historique des trajets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonInfo} onPress={handleNotes}>
            <Icon name="star" size={20} color={darkMode ? 'white' : 'black'}/>
            <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>Vos notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonInfo} onPress={toggleDarkMode}>
            <Icon name={icon} size={20} color={darkMode ? 'white' : 'black'} />
            <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>{text}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonInfo} onPress={()=>setInfoModalVisible(true)}>
            <Icon name="info" size={20} color={darkMode ? 'white' : 'black'}/>
            <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>Conditions legales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonInfo} onPress={handleTiket}>
            <Icon name="send" size={20} color={darkMode ? 'white' : 'black'}/>
            <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>Envoyer un ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonInfo} onPress={handleLogout}>
            <Icon name="sign-out" size={20} color={darkMode ? 'white' : 'black'}/>
            <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
        </View>
        <InfoModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)} />
        <TripShowModal
            visible={listModalVisible}
            onClose={() => setListModalVisible(false)}
            trips={trips}
            handleTripPress={() => {}}
            text="Historique"
            darkMode={darkMode}/>
        <NoteShowModal
            visible={noteModalVisible}
            onClose={() => setNoteModalVisible(false)}
            notes={notes}
            darkMode={darkMode}/>
      </ScrollView>
    );    
};

export default About;