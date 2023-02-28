import { StyleSheet } from 'react-native';

const modalStyles = StyleSheet.create({
    container : {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
      margin: 30,
      borderColor:'green',
      borderWidth: 3,
      width: '80%',
      height: '15%',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'green',
    },
    message: {
      fontSize: 16,
      color: 'black',
      textAlign: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 10,
    },
    closeButtonText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 30,
    },
});

export default modalStyles;