import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setServer, setConnected } from "../../redux/slices/serverSlice";
import { testConnection } from "../../services/api";

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  // Serveur global (persisté Redux)
  const server = useAppSelector((state) => state.server);

  // États locaux formulaire
  const [ip, setIp] = useState(server.ip);
  const [port, setPort] = useState(server.port);
  const [loading, setLoading] = useState(false);

  // Sauvegarde IP + port dans Redux
  const handleSave = () => {
    dispatch(setServer({ ip, port }));
    Alert.alert("OK", "Serveur sauvegardé");
  };

  // Test connexion serveur Flask
  const handleTest = async () => {
    setLoading(true);

    try {
      const res = await testConnection();

      dispatch(setConnected(true));
      Alert.alert("Succès", res);
    } catch (e) {
      dispatch(setConnected(false));
      Alert.alert("Erreur", "Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Titre */}
      <Text style={styles.title}>
        <Ionicons name="server-outline" size={18} /> Connexion serveur
      </Text>

      {/* Card formulaire */}
      <View style={styles.card}>

        {/* IP */}
        <Text style={styles.label}>
          <Ionicons name="globe-outline" size={14} /> Adresse IP
        </Text>
        <TextInput
          placeholder="ex: 192.168.1.10"
          value={ip}
          onChangeText={setIp}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        {/* Port */}
        <Text style={styles.label}>
          <Ionicons name="git-network-outline" size={14} /> Port
        </Text>
        <TextInput
          placeholder="ex: 8000"
          value={port}
          onChangeText={setPort}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        {/* Boutons */}
        <View style={styles.buttonRow}>

          {/* Save */}
          <Pressable style={styles.secondaryButton} onPress={handleSave}>
            <Text style={styles.secondaryText}>Sauvegarder</Text>
          </Pressable>

          {/* Test */}
          <Pressable
            style={styles.primaryButton}
            onPress={handleTest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.primaryText}>Tester</Text>
            )}
          </Pressable>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  card: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
    color: "#374151",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryText: {
    color: "white",
    fontWeight: "700",
  },

  secondaryText: {
    color: "#111827",
    fontWeight: "600",
  },
});