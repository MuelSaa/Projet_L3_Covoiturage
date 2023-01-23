import { createAppContainer } from 'react-navigation';
import AppNavigator from './AppNavigator';

const AppContainer = createAppContainer(AppNavigator);

const App = () => {
  return <AppContainer />;
}

export default App;