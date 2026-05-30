import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ServerState = {
  ip: string;
  port: string;
  isConnected: boolean;
  models: string[];
  selectedModel: string | null;
};

const initialState: ServerState = {
  ip: "",
  port: "",
  isConnected: false,
  models: [],
  selectedModel: null,
};

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    // Définit l'adresse du serveur (IP + port)
    setServer: (state, action: PayloadAction<{ ip: string; port: string }>) => {
      state.ip = action.payload.ip;
      state.port = action.payload.port;
    },

    // Met à jour l'état de connexion au serveur
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    // Stocke la liste des modèles disponibles sur le serveur
    setModels: (state, action: PayloadAction<string[]>) => {
      state.models = action.payload;
    },

    // Définit le modèle actuellement sélectionné pour le traitement
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
  },
});

export const {
  setServer,
  setConnected,
  setModels,
  setSelectedModel,
} = serverSlice.actions;

export default serverSlice.reducer;