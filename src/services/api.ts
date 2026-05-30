import { store } from "../redux/store";
import * as FileSystem from "expo-file-system/legacy";

// Construit l'URL de base du serveur à partir du state Redux
const getBaseUrl = () => {
  const state = store.getState().server;
  return `http://${state.ip}:${state.port}`;
};

// Teste la connexion avec le serveur Flask
export const testConnection = async () => {
  try {
    const res = await fetch(`${getBaseUrl()}/`);
    return await res.text();
  } catch (e) {
    throw new Error("Serveur inaccessible");
  }
};

// Récupère la liste des modèles disponibles
export const getModels = async () => {
  const res = await fetch(`${getBaseUrl()}/getmodels`);

  const text = await res.text();

  // Sécurité : fallback si JSON mal formé
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

// Sélection du modèle côté serveur
export const selectModel = async (model: string) => {
  await fetch(`${getBaseUrl()}/selectModel/${model}`);
};

// Upload d'un fichier audio vers le serveur
export const uploadAudio = async (uri: string) => {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: "audio.wav",
    type: "audio/wav",
  } as any);

  const res = await fetch(`${getBaseUrl()}/upload`, {
    method: "POST",
    body: formData,

    // IMPORTANT : permet l'upload multipart
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return await res.text();
};

// Télécharge le fichier audio transformé depuis le serveur
export const downloadProcessed = async () => {
  const fileUri =
    FileSystem.documentDirectory + "processed_output.wav";

  // Téléchargement du fichier distant vers stockage local
  const download = FileSystem.createDownloadResumable(
    `${getBaseUrl()}/download`,
    fileUri
  );

  const result = await download.downloadAsync();

  // Vérification sécurité téléchargement
  if (!result?.uri) {
    throw new Error("Échec du téléchargement");
  }

  const info = await FileSystem.getInfoAsync(result.uri);

  console.log("FILE INFO:", info);

  // Vérifie que le fichier n'est pas vide ou corrompu
  if (!info.exists || info.size === 0) {
    throw new Error("Fichier audio invalide ou corrompu");
  }

  return result.uri;
};