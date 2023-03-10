import { StyleSheet } from 'react-native';

const modalStyles = StyleSheet.create({
    container : {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainerG: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
      margin: 30,
      borderColor:'green',
      borderWidth: 3,
      width: '80%',
      height: '15%',
    },
    titleG: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'green',
    },
    modalContainerR: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 20,
      margin: 30,
      borderColor:'red',
      borderWidth: 3,
      width: '80%',
      height: '15%',
    },
    titleR: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'red',
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
      color: '#1C6E8C',
      fontWeight: 'bold',
      fontSize: 30,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      padding:10,
      width:'80%',
      backgroundColor: 'white',
      borderRadius: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    button: {
      marginTop:10,
      marginBottom: -10,
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginVertical: 10,
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      color: '#1E90FF',
      marginBottom: 15,
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    infoModalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    infoModalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 5,
      width: '80%',
    },
    infoModalCloseButton: {
      marginTop: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: '#564256',
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
    infoModalCloseButtonText: {
      color: '#2E282A',
    }, 
    mapCloseButton: {
      position: 'absolute',
      justifyContent: 'center',
      flexDirection: 'row',
      bottom:0, 
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 10,
      width:'100%',
      height:'8%', 
      spaceBetween: 10,
    }
});

export default modalStyles;