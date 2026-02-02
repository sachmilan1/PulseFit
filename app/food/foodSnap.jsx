// app/food/foodSnap.jsx
import React, { useState } from "react";
import {
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  View,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { getPresignedUpload, analyzeImage } from "../../lib/api";
import { uploadWithProgressXHR } from "../../lib/upload";
import { router } from "expo-router";

export default function FoodSnap() {
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const takePhoto = async () => {
    setAnalysis(null);

    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Camera permission required",
        "Please enable camera access in settings."
      );
      return;
    }

    // Backward + forward compatible ImagePicker API
    const imageOnlyMediaTypes =
      ImagePicker.MediaType?.Images
        ? [ImagePicker.MediaType.Images]
        : ImagePicker.MediaTypeOptions.Images;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: false,
      base64: false,
      exif: false,
      mediaTypes: imageOnlyMediaTypes,
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (!uri) {
      Alert.alert("Error", "Failed to read captured photo.");
      return;
    }

    setPhotoUri(uri);
  };

  const uploadAndAnalyze = async () => {
    if (!photoUri || loading) return;

    setLoading(true);
    setProgress(0);
    setAnalysis(null);

    try {
      // 1️⃣ Get presigned S3 PUT URL (UNCHANGED)
      const { url, bucket, key } = await getPresignedUpload("image/jpeg");

      // 2️⃣ Upload raw bytes to S3 (UNCHANGED)
      await uploadWithProgressXHR(url, photoUri, "image/jpeg", (p) =>
        setProgress(p)
      );

      // Upload done; hide progress while analyzing
      setProgress(null);

      // 3️⃣ Analyze image
      const res = await analyzeImage({ bucket, key });

      // ✅ Normalize server response (your nutrition is in items[0])
      const first = res?.items?.[0];
      const normalized = {
        ...res,
        food_name: first?.name ?? res?.food_name ?? null,
        nutrition_per_100g: first?.nutrition_per_100g ?? res?.nutrition_per_100g ?? null,
      };

      setAnalysis(normalized);

      if (normalized?.ok === true && normalized?.food_detected === false) {
        Alert.alert(
          "No food detected",
          normalized?.message || "No food detected in the picture."
        );
      } else if (normalized?.ok === true && normalized?.food_detected === true) {
        Alert.alert("Food detected", "Nutrition (per 100g) is shown below.");
      } else {
        Alert.alert("Analyze error", normalized?.detail || "Analysis failed.");
      }
    } catch (err) {
      console.error("FoodSnap error:", err);
      Alert.alert("Error", err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const nutrition = analysis?.nutrition_per_100g ?? null;

  return (
    <ImageBackground
      source={require("../../assets/images/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Food Snap</Text>

          {/* Take / retake */}
          <TouchableOpacity
            onPress={takePhoto}
            disabled={loading}
            style={[styles.button, styles.buttonRed, loading && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>
              {photoUri ? "Retake Photo" : "Take Photo"}
            </Text>
          </TouchableOpacity>

          {/* Preview */}
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No photo yet</Text>
            </View>
          )}

          {/* Upload & analyze */}
          <TouchableOpacity
            onPress={uploadAndAnalyze}
            disabled={!photoUri || loading}
            style={[
              styles.button,
              !photoUri ? styles.buttonDisabledGray : styles.buttonRedTransparent,
              loading && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {loading ? "Working…" : "Upload & Analyze"}
            </Text>
          </TouchableOpacity>

          {/* Loading */}
          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" />
              {typeof progress === "number" && (
                <Text style={styles.progress}>{Math.round(progress * 100)}%</Text>
              )}
            </View>
          )}

          {/* Nutrition Card */}
          {analysis?.ok === true && analysis?.food_detected === true ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {analysis?.food_name || "Nutrition"}{" "}
                <Text style={styles.cardSubtitle}>(per 100g)</Text>
              </Text>

              <View style={styles.macroGrid}>
                <Macro label="Calories" value={nutrition?.calories} unit="kcal" />
                <Macro label="Protein" value={nutrition?.protein_g} unit="g" />
                <Macro label="Carbs" value={nutrition?.carbs_g} unit="g" />
                <Macro label="Fat" value={nutrition?.fat_g} unit="g" />
              </View>

              {!nutrition && (
                <Text style={styles.missingText}>
                  Nutrition data wasn’t returned by the server. Ensure your analyze response includes
                  items[0].nutrition_per_100g (calories, protein_g, carbs_g, fat_g).
                </Text>
              )}
            </View>
          ) : null}

          {/* If analysis failed / other message */}
          {analysis?.ok === false ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Result</Text>
              <Text style={styles.resultText}>
                {analysis?.detail || analysis?.message || "Analysis failed."}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
  onPress={() => router.replace('/type')}
  style={styles.backButton}
>
  <Text style={styles.backButtonText}>← Back</Text>
</TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function Macro({ label, value, unit }) {
  const display =
    value === undefined || value === null || Number.isNaN(value) ? "—" : `${value} ${unit}`;

  return (
    <View style={styles.macroPill}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{display}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // dark overlay so content is readable
  },
  container: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },

  // Buttons (red theme)
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonRed: {
    backgroundColor: "#E53935",
  },
  buttonRedTransparent: {
    backgroundColor: "rgba(229, 57, 53, 0.85)", // slightly transparent
  },
  buttonDisabledGray: {
    backgroundColor: "rgba(156, 163, 175, 0.7)",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // Photo
  preview: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  placeholder: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
  },

  // Loading
  loadingBox: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  progress: {
    textAlign: "center",
    fontWeight: "700",
    color: "#fff",
  },

  // Nutrition card
  card: {
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  cardSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "700",
    fontSize: 13,
  },
  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  macroPill: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  macroLabel: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 4,
  },
  macroValue: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
  missingText: {
    marginTop: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    lineHeight: 18,
  },
  resultText: {
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
  },
  backButton: {
  alignSelf: "flex-start",
  marginBottom: 10,
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 10,
  backgroundColor: "rgba(0,0,0,0.5)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.2)",
},
backButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 14,
},
});
