import { Provider } from 'react-redux';
import { store } from "./src/app/store";
import Main from "./src/Main";
import { NavigationContainer } from "@react-navigation/native";
import { ModalProvider } from "./src/ModalProvider"; // Couche pour afficher les fenetres modales

export default function App() {
  return (
    <Provider store={store}>
      <ModalProvider> 
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </ModalProvider>
    </Provider>
  );
}
