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
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import allWorkouts from "../workouts.json";
import * as SQLite from "expo-sqlite";
import { getUserName } from "../../lib/session";

export default function Favourites() {
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        try {
          setLoading(true);

          const userName = getUserName();
          if (!userName) {
            if (!cancelled) {
              setFavourites([]);
              setLoading(false);
            }
            return;
          }

          const db = await SQLite.openDatabaseAsync("Fitness.db");

          // Ensure table exists (safe to run every time)
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS favourites(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              userName TEXT NOT NULL
            );
          `);

          const rows = await db.getAllAsync(
            "SELECT name FROM favourites WHERE userName = ? COLLATE NOCASE",
            [userName]
          );

          // Normalize names to avoid case mismatch issues
          const favNameSet = new Set(
            rows.map((r) => String(r.name).trim().toLowerCase())
          );

          const matched = allWorkouts.filter((w) =>
            favNameSet.has(String(w.name).trim().toLowerCase())
          );

          if (!cancelled) {
            setFavourites(matched);
            setLoading(false);
          }
        } catch (e) {
          console.error("Failed to load favourites:", e);
          if (!cancelled) {
            setLoading(false);
            Alert.alert("Error", "Failed to load favourite workouts");
          }
        }
      })();

      // cleanup if screen loses focus before async finishes
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <ImageBackground
      source={require("../../assets/images/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        {/* FIXED HEADER */}
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

        {/* CONTENT */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Favourites</Text>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Loading…</Text>
            </View>
          ) : favourites.length === 0 ? (
            <Text style={styles.emptyText}>
              You don’t have any favourite workouts yet.
            </Text>
          ) : (
            favourites.map((item) => (
              <Pressable key={item.name} style={styles.card}>
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

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.paragraph}>{item.description}</Text>

                <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
                  Instructions
                </Text>
                <Text style={styles.paragraph}>{item.instructions}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const ORANGE = "rgba(255, 140, 0, 0.92)";
const GLOW_BORDER = "rgba(255,255,255,0.28)";

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },

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

  loadingBox: {
    marginTop: 18,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
  },

  emptyText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 22,
  },

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
