import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

const getStyles = (darkmode) =>{
  return StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    marginBottom: 30,
  },
  logo: {
    width: '100%',
    height: '150%',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C6E8C',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 5,
    padding: 15,
  },
  buttonForm: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C6E8C',
    borderRadius: 5,
    borderColor:'black',
    borderWidth:3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
    padding: 15,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonFormText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelRadio: {
    fontSize: 18,
    paddingTop: 20,
  },
  h1: {
    fontSize: 30,
    marginBottom: 10,
    paddingTop: 5,
    color: '#1C6E8C',
    textAlign: 'center',
    fontWeight: 'bold',  },
  tab: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  date: {
    marginTop: 7,
    paddingTop: 13,
    textAlign: 'center',
    fontSize: 18,
    color: '#1C6E8C',
    height: 50,
    borderColor: '#1C6E8C',
    borderWidth: 2,
    borderRadius: 10,
    width: '50%',
    paddingHorizontal: 10,
  },
  addressContainer: {
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#1C6E8C',
    alignContent: 'center',
    width: '80%',
    marginBottom: 10,
    marginTop: 10,
  },
  addressInput: {
    paddingTop: 10,
    textAlign: 'center',
    color: '#1C6E8C',
    borderColor: '#1C6E8C',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  tripTouchable: {
    borderWidth: 2,
    borderRadius: 20,
    margin:5,
    borderColor: '#1C6E8C',
    paddingVertical: 20,
  },
  tripTouchableTrajet: {
    borderBottomWidth: 2,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    borderColor: '#1C6E8C',
    paddingVertical: 20,
  },

  tripText: {
    color : darkmode ? 'white' : 'black',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 26,
    fontWeight: 'bold', 
    },
  closeButton: {
    backgroundColor: '#1C6E8C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: darkmode ? '#00ced1' : 'black',
  },
  activeButtonText: {
    color: '#1C6E8C',
  },
  radioButtonsContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  tabrow: {
    display:'flex',
    justifyContent:'space-between',
    alignSelf:'center',
    alignItems:'center',
    flexDirection:'row',
    marginBottom: 10, 
  },    
  label: {
    fontSize: 20,
    marginRight: 5,
    position: 'relative',
    left:0,
    fontWeight: 'bold',
    color: '#1C6E8C',
  },
  notiflabel: {
    textAlign: 'center',
    fontSize: 20,
    marginRight: 5,
    position: 'relative',
    left:0,
    fontWeight: 'bold',
    color: darkmode ? 'white' : 'black',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberfield: {
    marginRight: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: darkmode ? 'white' : 'black',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 10,
    maxWidth: '76%',
  },
  buttonInfo: {
    justifyContent: 'center',
    width: '80%',
    flexDirection: 'row',
    padding: 10,
    margin: 5,
    borderColor: '#1C6E8C',
    borderWidth: 2,
    borderRadius: 20,
    lineHeight: 26,
  },
  buttonInfoText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 20,
  },
  notifbuttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  notifbutton: {
    backgroundColor: '#1C6E8C',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
  notifmarker: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#1C6E8C',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
  notifbuttonIcon: {
    color: 'white',
    fontSize: 24
  },
  star: {
    color: '#FFD700',
  },
  filledStar: {
    color: '#FFD700',
  },
  emptyStar: {
    color: '#D3D3D3',
  }

  
});
}

export default getStyles;