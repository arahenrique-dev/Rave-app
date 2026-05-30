import { Audio } from "expo-av";

// Instance globale d'enregistrement (micro)
let recording: Audio.Recording | null = null;

// Instance globale de lecture audio
let sound: Audio.Sound | null = null;

// Démarre l'enregistrement audio avec le micro
export const startRecording = async () => {
  try {
    // Demande de permission micro
    const permission = await Audio.requestPermissionsAsync();

    if (!permission.granted) {
      throw new Error("Permission micro refusée");
    }

    // Configuration audio iOS (important pour lecture en arrière-plan)
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    // Création instance enregistrement
    recording = new Audio.Recording();

    // Préparation enregistrement haute qualité
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    // Démarrage enregistrement
    await recording.startAsync();
  } catch (e) {
    console.log("Erreur startRecording:", e);
  }
};

// Arrête l'enregistrement et retourne le fichier audio
export const stopRecording = async () => {
  try {
    if (!recording) return null;

    // Stop + sauvegarde fichier
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();

    // Reset instance
    recording = null;

    return uri;
  } catch (e) {
    console.log("Erreur stopRecording:", e);
    return null;
  }
};

//Lecture d'un fichier audio
export const playAudio = async (uri: string) => {
  try {
    // Petit délai pour éviter conflits audio (Expo bug fix)
    await new Promise((r) => setTimeout(r, 300));

    // Création du lecteur audio
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });

    sound = newSound;

    // Lecture
    await sound.playAsync();
  } catch (e) {
    console.log("Erreur playAudio:", e);
  }
};

// Arrête et nettoie le lecteur audio
export const stopAudio = async () => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }
  } catch (e) {
    console.log("Erreur stopAudio:", e);
  }
};