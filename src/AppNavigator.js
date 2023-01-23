import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './components /LoginScreen';
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
  initialRouteName:'Menu'
});

export default AppNavigator;
