import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import modalStyles from '../assets/styles/modalStyles';
import styles from '../assets/styles/styles';
import moment from 'moment';


export const InfoModal = ({ visible, onClose }) => {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
      >
        <View style={modalStyles.infoModalContainer}>
          <View style={modalStyles.infoModalContent}>
            <Text>Cette application est projet réalisé par des étudiants de L3 Informatique de l'UFR ST.</Text><Text></Text>
            <Text>Les données collectées par cette application ne seront pas utilisées à des fins commerciales.</Text>
            <TouchableOpacity style={modalStyles.infoModalCloseButton} onPress={onClose}>
              <Text style={modalStyles.infoModalCloseButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
};

export const AddTripModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
    <View style={modalStyles.infoModalContainer}>
      <View style={modalStyles.modalContainerG}>
        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
          <Text style={modalStyles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <Text style={modalStyles.titleG}>Trajet ajouté</Text>
        <Text style={modalStyles.message}>Votre trajet a bien été ajouté.</Text>
      </View>
      </View>
    </Modal>
    
  );
};

export const AddPassengerModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
    <View style={modalStyles.infoModalContainer}>
      <View style={modalStyles.modalContainerG}>
        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
          <Text style={modalStyles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <Text style={modalStyles.titleG}>Trajet ajouté</Text>
        <Text style={modalStyles.message}>Vous avez demandé l'inscription à ce trajet.</Text>
      </View>
      </View>
    </Modal>
    
  );
};



export const TripShowModal = ({ visible, onClose, trips, handleTripPress, text}) => {

  return (
    <Modal
        animationType="fade"
        transparent={false}
        visible={visible}
      >
        <View style={styles.modalContainer}>
        <Text style={{color:'#1C6E8C', fontWeight:"bold", fontSize:23, marginBottom:30, fontStyle:"italic", textAlign:'center'}}>{text}</Text>
          <ScrollView>
            {trips.map((trip, index) => (
              <TouchableOpacity key={index} style={styles.tripTouchable} onPress={() => handleTripPress(trip)}>
                <Text style={styles.tripText}>{trip.departAdresse} - {trip.destinationAdresse}</Text>
                <Text style={styles.tripText}>{moment(trip.departHeure).format('DD/MM/YYYY HH:mm')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  );
};

export const MapShowModal = ({ visible, onClose, setCompleteLocation, homeLocation}) => {
  return (
        <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}>

        <MapView
          style={{ flex: 1 }}
          initialRegion={{
          latitude: 47.25,
          longitude: 6.0333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          }}
          onPress={event => {
            setCompleteLocation(event.nativeEvent.coordinate.latitude, event.nativeEvent.coordinate.longitude);
            {onClose}
          }}
        >
        {homeLocation !== "" && (
        <Marker   coordinate={{ latitude, longitude }} pinColor="red" />
        )}
        </MapView>
        <TouchableOpacity
          onPress={onClose}
          style={modalStyles.mapCloseButton}
        >
          <Icon name="reply" size={30} color='#1C6E8C' style={{marginRight:20}}/>
          <Text style={modalStyles.closeButtonText}>Retour</Text>
        </TouchableOpacity>
      </Modal>
  );
};

export const RemoveTripModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
    <View style={modalStyles.centeredView}>
      <View style={modalStyles.modalContainerR}>
        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
          <Text style={modalStyles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <Text style={modalStyles.titleR}>Trajet supprimé</Text>
        <Text style={modalStyles.message}>Votre trajet a bien été supprimé.</Text>
      </View>
      </View>
    </Modal>
    
  );
};