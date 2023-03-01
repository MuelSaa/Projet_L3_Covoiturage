import React, { useContext, useState } from 'react';
import { Image, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';
import { ThemeContext } from './AppProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../assets/styles/styles';
import logo from '../assets/logo.png';
import { ScrollView } from 'react-native-gesture-handler';
import { InfoModal } from './Modal';
import { TripShowModal } from './Modal';
import { API_URL } from "./env";

const About = () => {
  const { darkMode, toggleDarkMode, GlobalLogin, logout } = useContext(ThemeContext);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [trips, setTrips] = useState([]);
  
  const icon = darkMode ? 'moon-o' : 'sun-o';
  const text = darkMode ? 'Mode sombre activé' : 'Mode sombre désactivé';

  const handleTripPress = (trip) => {
    Alert.alert(
        'Que souhaitez-vous faire ?',
        '',
        [
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

  const handleHistory = async () => {
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
    };

    const handleTiket = () => {
      Linking.openURL('mailto:ataieb3342@gmail.com?subject=Ticket');
    };

  return (
    <ScrollView style={{backgroundColor: darkMode ? 'black' : 'white'}}>
      <View style={[styles.container]}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View> 
        <Text style={styles.h1}>Bonjour {GlobalLogin} !</Text>
        <TouchableOpacity style={styles.buttonInfo} onPress={handleHistory}>
          <Icon name="history" size={20} color={darkMode ? 'white' : 'black'}/>
          <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>Votre historique des trajets</Text>
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
        <TouchableOpacity style={styles.buttonInfo} onPress={logout}>
          <Icon name="sign-out" size={20} color={darkMode ? 'white' : 'black'}/>
          <Text style={[styles.buttonInfoText, { color: darkMode ? 'white' : 'black' }]}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
      <InfoModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)} />
      <TripShowModal
          visible={listModalVisible}
          onClose={() => setListModalVisible(false)}
          trips={trips}
          handleTripPress={handleTripPress}
          text="Historique"/>
    </ScrollView>
  );
};

export default About;