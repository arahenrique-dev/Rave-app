import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  getModels,
  selectModel,
  uploadAudio,
  downloadProcessed,
} from "../../services/api";

import { setLoading } from "../../redux/slices/audioSlice";
import { playAudio } from "../../services/audio";
import { setSelectedModel } from "../../redux/slices/serverSlice";

// Default audio asset
const defaultAudio = require("../../../assets/default.wav");

export default function RaveScreen() {
  const dispatch = useAppDispatch();

  const recordings = useAppSelector((state) => state.audio.recordings);

  const selectedModel = useAppSelector(
    (state) => state.server.selectedModel
  );

  const [models, setModels] = useState<string[]>([]);
  const [processedUri, setProcessedUri] = useState<string | null>(null);

  const [sourceTab, setSourceTab] = useState<
    "default" | "recordings" | "files"
  >("recordings");

  const loading = useAppSelector((state) => state.audio.loading);

  useFocusEffect(
    useCallback(() => {
      loadModels();
    }, [])
  );

  const loadModels = async () => {
    const data = await getModels();
    const parsed = data?.models ?? data ?? [];
    setModels(Array.isArray(parsed) ? parsed : []);
  };

  const handleSelectModel = async (model: string) => {
    await selectModel(model);
    dispatch(setSelectedModel(model));
  };

  const pickAudioFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
    });

    if (result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  };

  const resolveUri = async (itemUri?: string) => {
    if (sourceTab === "default") {
      return defaultAudio;
    }

    if (sourceTab === "recordings") {
      return itemUri;
    }

    if (sourceTab === "files") {
      return await pickAudioFile();
    }

    return null;
  };

  const handleProcess = async (itemUri?: string) => {
    try {
      dispatch(setLoading(true));

      const uri = await resolveUri(itemUri);
      if (!uri) return;

      await uploadAudio(uri);

      const fileUri = await downloadProcessed();
      setProcessedUri(fileUri as string);
    } catch (e) {
      console.log("Erreur processing:", e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 10, color: "#6B7280" }}>
          Traitement en cours...
        </Text>
      </View>
    );
  }

  

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>

      {/* ================= MODELS ================= */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="layers" size={18} color="#111827" />
        <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft: 6 }}>
          Modèles
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
        {models.map((model) => {
          const isSelected = selectedModel === model;

          return (
            <Pressable
              key={model}
              onPress={() => handleSelectModel(model)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                marginRight: 10,
                marginBottom: 10,
                borderRadius: 14,
                backgroundColor: isSelected ? "#4F46E5" : "#F3F4F6",
              }}
            >
              <Text style={{ color: isSelected ? "white" : "#111827", fontWeight: "600" }}>
                {model.replace(".onnx", "")}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ================= SOURCE SELECTOR ================= */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 20 }}>
        
        <Pressable onPress={() => setSourceTab("default")} style={{ alignItems: "center" }}>
          <Ionicons name="musical-note" size={22} color={sourceTab === "default" ? "#4F46E5" : "#6B7280"} />
          <Text style={{ color: sourceTab === "default" ? "#4F46E5" : "#6B7280" }}>
            Default
          </Text>
        </Pressable>

        <Pressable onPress={() => setSourceTab("recordings")} style={{ alignItems: "center" }}>
          <Ionicons name="mic" size={22} color={sourceTab === "recordings" ? "#4F46E5" : "#6B7280"} />
          <Text style={{ color: sourceTab === "recordings" ? "#4F46E5" : "#6B7280" }}>
            Record
          </Text>
        </Pressable>

        <Pressable onPress={() => setSourceTab("files")} style={{ alignItems: "center" }}>
          <Ionicons name="folder" size={22} color={sourceTab === "files" ? "#4F46E5" : "#6B7280"} />
          <Text style={{ color: sourceTab === "files" ? "#4F46E5" : "#6B7280" }}>
            Files
          </Text>
        </Pressable>

      </View>

      {/* ================= RECORDINGS ================= */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="musical-notes" size={18} color="#111827" />
        <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft: 6 }}>
          Audios
        </Text>
      </View>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              marginBottom: 12,
              borderRadius: 16,
              backgroundColor: "#F9FAFB",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >

            <Text style={{ fontWeight: "600", marginBottom: 10 }}>
              🎵 {item.name}
            </Text>

            <View style={{ flexDirection: "row", gap: 14 }}>

              <Pressable onPress={() => playAudio(item.uri)}>
                <Text style={{ color: "#2563EB", fontWeight: "600" }}>
                  Original
                </Text>
              </Pressable>

              <Pressable onPress={() => handleProcess(item.uri)}>
                <Text style={{ color: "#16A34A", fontWeight: "600" }}>
                  Transformer
                </Text>
              </Pressable>

              {processedUri && (
                <Pressable onPress={() => playAudio(processedUri)}>
                  <Text style={{ color: "#DC2626", fontWeight: "600" }}>
                    Traité
                  </Text>
                </Pressable>
              )}

            </View>
          </View>
        )}
      />
    </View>
  );
}