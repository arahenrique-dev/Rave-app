import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import HomeScreen from "../screens/Home/HomeScreen";
import RecordScreen from "../screens/Record/RecordScreen";
import RaveScreen from "../screens/Rave/RaveScreen";

// Création du navigateur
const Tab = createMaterialTopTabNavigator();

/**
 * Gère les 3 écrans principaux de l'application :
 * - Home (connexion serveur)
 * - Record (enregistrement audio)
 * - RAVE (traitement audio)
 */
export default function RootTabs() {
  return (
    <NavigationContainer>
      {/* Navigation par onglets horizontaux */}
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: "#4F46E5",
          },
          tabBarStyle: {
            paddingTop: 40,  
            height: 92,     
          },
          tabBarLabelStyle: {
            fontWeight: "600",
            textTransform: "none",
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Record" component={RecordScreen} />
        <Tab.Screen name="RAVE" component={RaveScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}