import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';

const TripAddedModal = ({ visible, onClose }) => (
  <Modal animationType="slide" transparent={true} visible={visible}>
    <View style={styles.modalContainer}>
      <View style={styles.modalInnerContainer}>
        <Image
          style={styles.checkIcon}
          source={require("../assets/checkicon.png")}
        />
        <Text style={styles.message}>Le trajet a bien été ajouté</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalInnerContainer: {
    width: 300,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 50,
    height: 50
  },
  message: {
    fontSize: 20,
    marginTop: 20,
    color: '#4CAF50',
  },
  closeButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TripAddedModal;
