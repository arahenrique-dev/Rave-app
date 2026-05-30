import * as FileSystem from "expo-file-system/legacy";

// Dossier où sont stockés les enregistrements audio
const RECORDINGS_DIR = FileSystem.documentDirectory + "recordings/";

// Fichier utilisé pour générer des noms uniques (audio1, audio2, etc.)
const COUNTER_FILE = FileSystem.documentDirectory + "counter.txt";

/**
 * Vérifie et crée le dossier des enregistrements si nécessaire
 */
export const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(RECORDINGS_DIR);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(RECORDINGS_DIR, {
      intermediates: true,
    });
  }
};

/**
 * Sauvegarde un enregistrement dans le dossier persistant
 */
export const saveRecording = async (uri: string, name: string) => {
  await ensureDirExists();

  const newPath = RECORDINGS_DIR + name + ".m4a";

  await FileSystem.moveAsync({
    from: uri,
    to: newPath,
  });

  return newPath;
};

/**
 * Charge tous les enregistrements sauvegardés
 */
export const loadRecordings = async () => {
  await ensureDirExists();

  const files = await FileSystem.readDirectoryAsync(RECORDINGS_DIR);

  return files.map((file) => ({
    id: file,
    name: file,
    uri: RECORDINGS_DIR + file,
  }));
};

/**
 * Supprime un fichier audio du stockage local
 */
export const deleteRecordingFile = async (uri: string) => {
  await FileSystem.deleteAsync(uri, { idempotent: true });
};

/**
 * Génère un nom unique du type audio1, audio2, etc.
 */
export const getNextAudioName = async () => {
  try {
    const info = await FileSystem.getInfoAsync(COUNTER_FILE);

    let count = 1;

    // Si le fichier existe, on récupère le dernier compteur
    if (info.exists) {
      const value = await FileSystem.readAsStringAsync(COUNTER_FILE);
      count = parseInt(value) + 1;
    }

    // Mise à jour du compteur
    await FileSystem.writeAsStringAsync(
      COUNTER_FILE,
      String(count)
    );

    return `audio${count}`;
  } catch (e) {
    // Fallback en cas d'erreur
    return `audio${Date.now()}`;
  }
};