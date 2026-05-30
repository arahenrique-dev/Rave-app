import { configureStore, combineReducers } from "@reduxjs/toolkit";
import serverReducer from "./slices/serverSlice";
import audioReducer from "./slices/audioSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";

// Configuration de redux-persist (stockage local)
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["server", "audio"], // états persistés entre redémarrages
};

// Combinaison de tous les reducers de l'application
const rootReducer = combineReducers({
  server: serverReducer,
  audio: audioReducer,
});

// Reducer persisté (sauvegarde automatique du state)
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store Redux principal
export const store = configureStore({
  reducer: persistedReducer,

  // Désactive les warnings liés à redux-persist (non sérialisable)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistance du store (rechargement automatique au démarrage)
export const persistor = persistStore(store);

// Types globaux pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;