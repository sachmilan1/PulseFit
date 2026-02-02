import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  Alert,
  Pressable,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import { getUserName } from "../../../lib/session";
import allWorkouts from "../../workouts.json";
console.log("RENDERING: upperLower/filter/[constraint].js");


export default function ShowWorkouts() {
  const { constraint } = useLocalSearchParams();
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [userName, setUserName] = useState("");

  const heading =
    typeof constraint === "string" ? constraint.toUpperCase() : "WORKOUTS";

  useFocusEffect(
    useCallback(() => {
      const filtered = allWorkouts.filter((workout) => workout.region === constraint);
      setFilteredWorkouts(filtered);

      const name = getUserName();
      setUserName(name || "");
    }, [constraint])
  );

  const addToFavourites = async (workoutName) => {
    try {
      if (!userName) {
        Alert.alert("Error", "No user logged in.");
        return;
      }

      const database = await SQLite.openDatabaseAsync("Fitness.db");

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS favourites(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          userName TEXT NOT NULL
        );
      `);

      await database.runAsync(
        "INSERT INTO favourites(name, userName) VALUES(?, ?)",
        [workoutName, userName]
      );

      Alert.alert("Success", "Workout added to favourites successfully");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to add to favourites.");
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        {/* FIXED HEADER (stays on top while scrolling) */}
        <View style={styles.fixedHeader}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.replace("/type")}
          >
            <Text style={styles.headerButtonText}>← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.replace("/type")}
          >
            <Text style={styles.headerButtonText}>Home</Text>
          </TouchableOpacity>
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{heading}</Text>

          {filteredWorkouts.length === 0 && (
            <Text style={styles.emptyText}>No workouts found for "{heading}"</Text>
          )}

          {filteredWorkouts.map((item, index) => (
            <Pressable
              key={`${item.name}-${index}`}
              style={styles.card}
              onPress={() =>
                Alert.alert("Select", "Add to favourites?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Add", onPress: () => addToFavourites(item.name) },
                ])
              }
            >
              <Text style={styles.cardTitle}>{item.name}</Text>

              <Text style={styles.rowText}>
                <Text style={styles.label}>Region:</Text> {item.region}
              </Text>

              <Text style={styles.rowText}>
                <Text style={styles.label}>Type:</Text> {item.type}
              </Text>

              <Text style={styles.rowText}>
                <Text style={styles.label}>Muscle:</Text> {item.muscle}
              </Text>

              <Text style={styles.rowText}>
                <Text style={styles.label}>Body Part:</Text> {item.bodyPart}
              </Text>

              <Text style={styles.rowText}>
                <Text style={styles.label}>Tags:</Text>{" "}
                {item.tags?.join(", ") || "None"}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.paragraph}>{item.description}</Text>

              <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
                Instructions
              </Text>
              <Text style={styles.paragraph}>{item.instructions}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const ORANGE = "rgba(255, 140, 0, 0.92)";
const GLOW_BORDER = "rgba(255,255,255,0.28)";

const styles = StyleSheet.create({
  background: { flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  // Fixed header above the scroll view
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },

  headerButton: {
    backgroundColor: ORANGE,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  headerButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  // Padding top so content doesn't hide behind fixed header
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 14,
    textAlign: "center",
  },

  emptyText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },

  // Workout cards with a subtle glowing outline
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: GLOW_BORDER,

    shadowColor: "#ffffff",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },

  rowText: {
    color: "rgba(255,255,255,0.88)",
    marginBottom: 4,
    lineHeight: 20,
  },

  label: {
    fontWeight: "800",
    color: "rgba(255,255,255,0.75)",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 10,
  },

  sectionTitle: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "900",
    marginBottom: 4,
  },

  paragraph: {
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
  },
});
