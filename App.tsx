//Henrique PIRES ARAGÃO - 21304445
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./src/redux/store";
import RootTabs from "./src/navigation/RootTabs";

import { Audio } from "expo-av";

//Configuration globale du comportement audio de l'application
//(micro + lecture simultanée, mode silencieux iOS, etc.)
Audio.setAudioModeAsync({
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
});

export default function App() {
  return (
    <Provider store={store}>
      {/* PersistGate attend que le state Redux soit restauré depuis AsyncStorage */}
      <PersistGate loading={null} persistor={persistor}>
        <RootTabs />
      </PersistGate>
    </Provider>
  );
}