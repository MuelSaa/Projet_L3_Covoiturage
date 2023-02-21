import { createAppContainer } from 'react-navigation';
import AppNavigator from './AppNavigator';
import AppProvider from './components/AppProvider';

const AppContainer = createAppContainer(AppNavigator);

const App = () => {


  return (
    <AppProvider><AppContainer /></AppProvider>
  );
}


export default App;



