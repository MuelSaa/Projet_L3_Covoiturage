import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './components/LoginScreen.js';
import Menu from './Menu';

const AppNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false
    },
  },
  Menu: {
    screen: Menu,
    navigationOptions: {
      headerShown: false
    },
  },
},{
  initialRouteName:'Login'
});


export default AppNavigator;