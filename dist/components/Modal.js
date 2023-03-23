import React, {useContext} from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Button } from 'react-native';
import { ThemeContext } from './AppProvider';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import getModalStyles from '../assets/styles/modalStyles';
import getStyles from '../assets/styles/styles';
import moment from 'moment';



export const InfoModal = ({ visible, onClose, darkMode}) => {
  const modalStyles = getModalStyles(darkMode);
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

export const AddTripModal = ({ visible, onClose, darkMode }) => {
  const modalStyles = getModalStyles(darkMode);
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

export const AddPassengerModal = ({ visible, onClose, darkMode }) => {
  const modalStyles = getModalStyles(darkMode);
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

export const NoteShowModal = ({ visible, onClose, onPress, darkMode, notes }) => {
  const modalStyles = getModalStyles(darkMode);
  const styles = getStyles(darkMode);
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
      >
        <View style={modalStyles.modalContainer}>
        <Text style={{color:'#1C6E8C', fontWeight:"bold", fontSize:27, marginBottom:30, marginTop:20, fontStyle:"italic", textAlign:'center'}}>Vos notes obtenues</Text>
          <ScrollView style={{marginBottom:55}}>
            {notes.map((note, index) => (
              <TouchableOpacity key={index} style={modalStyles.noteContainer}>
                <Text style={modalStyles.noteText}>{note.noteurLogin}</Text>
                  <View style={modalStyles.ratingContainer}>
                    {[...Array(note.note)].map((_, i) => (
                      <Icon key={i} name="star" style={modalStyles.starIcon} />
                    ))}
                    {[...Array(5 - note.note)].map((_, i) => (
                      <Icon key={i} name="star-o" style={modalStyles.starIcon} />
                    ))}
                  </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={modalStyles.mapCloseButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>  
  );
};


export const TripShowModal = ({ visible, onClose, trips, handleTripPress, text, darkMode}) => {
  const modalStyles = getModalStyles(darkMode);
  const styles = getStyles(darkMode);
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
      >
        <View style={modalStyles.modalContainer}>
        <Text style={{color:'#1C6E8C', fontWeight:"bold", fontSize:27, marginBottom:30, marginTop:20, fontStyle:"italic", textAlign:'center'}}>{text}</Text>
          <ScrollView
          style={{marginBottom:55}}>
            {trips.map((trip, index) => (
              <TouchableOpacity key={index} style={styles.tripTouchable} onPress={() => handleTripPress(trip)}>
                <View style={styles.info}><Text style={styles.label}>Depart : </Text><Text style={styles.tripText} >{trip.departAdresse}</Text></View>
                <View style={styles.info}><Text style={styles.label}>Arrivée : </Text><Text style={styles.tripText} numberOfLines={1} ellipsizeMode="tail">{trip.destinationAdresse}</Text></View>
                <Text style={{fontSize:22, textAlign:'center', color:'#1C6E8C'}}>{moment(trip.departHeure).format('DD/MM/YYYY - HH:mm')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={modalStyles.mapCloseButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>  
  );
};

export const TripDetailModal = ({ visible, onClose, selectedTrip, darkMode}) => {
  const modalStyles = getModalStyles(darkMode);
  const styles = getStyles(darkMode);
  return (
  <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={modalStyles.infoModalContainer}>
          <View style={modalStyles.modalView}>
            <Text style={{fontSize:30, color:'black', paddingBottom:15, fontWeight:'bold', fontStyle:'italic'}}>Votre trajet</Text>
            <View style={styles.info}><Text style={styles.label}>Depart : </Text><Text style={styles.tripText}>{selectedTrip ? selectedTrip.departAdresse : ''}</Text></View>
            <View style={styles.info}><Text style={styles.label}>Arrivée : </Text><Text style={styles.tripText}>{selectedTrip ? selectedTrip.destinationAdresse : ''}</Text></View>
            <Text style={styles.tripText}>{selectedTrip? moment(selectedTrip.departHeure).format('DD/MM/YYYY - HH:mm') : ''}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  );
};

export const MapShowModal = ({ visible, onClose, setCompleteLocation, homeLocation, latitude, longitude, darkMode}) => {
  const modalStyles = getModalStyles(darkMode);
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

export const RemoveTripModal = ({ visible, onClose, darkMode }) => {
  const modalStyles = getModalStyles(darkMode);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
    <View style={modalStyles.infoModalContainer}>
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