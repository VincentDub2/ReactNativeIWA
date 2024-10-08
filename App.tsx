import { Provider } from 'react-redux';
import {store} from "./src/app/store";
import Main from "./src/Main";
import {NavigationContainer} from "@react-navigation/native";


export default function App() {
  return (
      <Provider store={store}>
          <NavigationContainer>
              <Main/>
          </NavigationContainer>
      </Provider>
  );
}
