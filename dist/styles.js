import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
    margin: 10,
    padding: 15,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
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
    fontSize: 28,
    paddingBottom: 10,
    color: '#1C6E8C',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: '#1C6E8C',
    marginBottom:20,
  },
  tab: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  date: {
    marginTop: 5,
    paddingTop: 20,
    textAlign: 'center',
    fontSize: 18,
    height: 60,
    borderColor: '#1C6E8C',
    borderWidth: 2,
    borderRadius: 20,
    width: '50%',
    paddingHorizontal: 10,
  },
  addressContainer: {
    height: 40,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#1C6E8C',
    alignContent: 'center',
    width: '80%',
    marginBottom: 10
  },
  addressInput: {
    paddingTop: 5,
    textAlign: 'center',
    borderColor: '#1C6E8C',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  tripTouchable: {
    borderTopWidth: 2,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
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
    alignSelf: 'center',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: 'bold',  },
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
    backgroundColor: '#2C7E9E',
    borderColor: 'black',
    borderWidth:2,
  },
  activeButtonText: {
    color: 'black',
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
    position: 'relative',
    left:0,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1C6E8C',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberfield: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C6E8C',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 20,
  }
});

export default styles;