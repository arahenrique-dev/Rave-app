import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useAppDispatch } from "../../redux/hooks";

import { playAudio, startRecording, stopRecording } from "../../services/audio";
import {
  saveRecording,
  loadRecordings,
  deleteRecordingFile,
  getNextAudioName,
} from "../../services/fileSystem";

import {
  addRecording,
  deleteRecording,
  loadRecordingsToStore,
} from "../../redux/slices/audioSlice";

// Type d’un fichier audio enregistré
type RecordingItem = {
  id: string;
  name: string;
  uri: string;
};

export default function RecordScreen() {
  const dispatch = useAppDispatch();

  // Liste locale des enregistrements
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);

  // État d'enregistrement
  const [isRecording, setIsRecording] = useState(false);

  // Chargement initial
  useEffect(() => {
    load();
  }, []);

  // Charge les fichiers depuis le stockage local
  const load = async () => {
    const data = await loadRecordings();

    setRecordings(data);

    // Sync Redux pour la vue RAVE
    dispatch(loadRecordingsToStore(data));
  };

  // Start / Stop recording
  const handleRecord = async () => {
    if (!isRecording) {
      await startRecording();
      setIsRecording(true);
    } else {
      const uri = await stopRecording();
      setIsRecording(false);

      if (uri) {
        const name = await getNextAudioName();
        const newPath = await saveRecording(uri, name);

        // Ajout dans Redux
        dispatch(
          addRecording({
            id: name,
            name,
            uri: newPath,
          })
        );

        load();
      }
    }
  };

  // Suppression d’un fichier
  const handleDelete = async (uri: string) => {
    await deleteRecordingFile(uri);

    dispatch(deleteRecording(uri));

    load();
  };

  return (
    <View style={styles.container}>

      {/* Titre */}
      <Text style={styles.title}>
        <Ionicons name="mic-outline" size={18} /> Enregistrement audio
      </Text>

      {/* Bouton record central */}
      <View style={styles.recordContainer}>
        <Pressable
          onPress={handleRecord}
          style={[
            styles.recordButton,
            isRecording && styles.recordingActive,
          ]}
        >
          <Ionicons
            name={isRecording ? "stop-outline" : "mic-outline"}
            size={28}
            color="white"
          />
        </Pressable>

        <Text style={styles.recordStatus}>
          {isRecording ? "Enregistrement..." : "Appuyez pour enregistrer"}
        </Text>
      </View>

      {/* Liste des audios */}
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.item}>

            {/* Play */}
            <TouchableOpacity onPress={() => playAudio(item.uri)}>
              <Ionicons name="play-outline" size={18} color="#4F46E5" />
            </TouchableOpacity>

            {/* Nom */}
            <Text style={styles.name}>{item.name}</Text>

            {/* Delete */}
            <TouchableOpacity onPress={() => handleDelete(item.uri)}>
              <Ionicons name="trash-outline" size={18} color="#DC2626" />
            </TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  recordContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  recordingActive: {
    backgroundColor: "#DC2626",
  },

  recordStatus: {
    marginTop: 10,
    color: "#6B7280",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },

  name: {
    flex: 1,
    textAlign: "center",
  },
});