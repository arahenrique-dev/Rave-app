import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Représente un fichier audio enregistré dans l'application
type AudioItem = {
  id: string;
  name: string;
  uri: string;
};

//État global audio (Redux)
type AudioState = {
  recordings: AudioItem[]; // Liste des enregistrements
  processedUri: string | null; // Audio transformé par le serveur
  loading: boolean; // État de chargement (upload / processing)
  selectedAudio: AudioItem | null; // Audio sélectionné pour traitement
};

const initialState: AudioState = {
  recordings: [],
  processedUri: null,
  loading: false,
  selectedAudio: null,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    // Ajouter un nouvel enregistrement
    addRecording(state, action: PayloadAction<AudioItem>) {
      state.recordings.push(action.payload);
    },

    // Supprimer un enregistrement par son id
    deleteRecording(state, action: PayloadAction<string>) {
      state.recordings = state.recordings.filter(
        (r) => r.id !== action.payload
      );
    },

    // Stocker l'audio transformé retourné par le serveur
    setProcessedUri(state, action: PayloadAction<string | null>) {
      state.processedUri = action.payload;
    },

    // Gérer l'état de chargement (upload / traitement)
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Définir l'audio sélectionné pour traitement
    setSelectedAudio(state, action: PayloadAction<AudioItem | null>) {
      state.selectedAudio = action.payload;
    },

    // Remplacer toute la liste des enregistrements (chargement initial)
    loadRecordingsToStore(state, action: PayloadAction<AudioItem[]>) {
      state.recordings = action.payload;
    },
  },
});

export const {
  addRecording,
  deleteRecording,
  setProcessedUri,
  setLoading,
  setSelectedAudio,
  loadRecordingsToStore,
} = audioSlice.actions;

export default audioSlice.reducer;