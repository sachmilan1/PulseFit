import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

export default function Option() {
  return (
    <ImageBackground
      source={require("../../assets/images/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          {/* ORANGE BACK BUTTON */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/type")}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* RED BUTTONS */}
          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: "/upperLower/filter/[constraint]",
                params: { constraint: "upper" },
              })
            }
            style={styles.button}
          >
            <Text style={styles.buttonText}>Upper</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: "/upperLower/filter/[constraint]",
                params: { constraint: "lower" },
              })
            }
            style={styles.button}
          >
            <Text style={styles.buttonText}>Lower</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 14,
  },

  // Orange back button
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 140, 0, 0.9)", // orange
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  // Red action buttons
  button: {
    backgroundColor: "rgba(229, 57, 53, 0.85)", // red, slightly transparent
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
