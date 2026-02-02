import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

export default function Type() {
  return (
    <ImageBackground
      source={require('../assets/images/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            How do you want to look at your workouts?
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Muscle Type</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Workout Type</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.replace('/upperLower/option')
              }
            >
              <Text style={styles.buttonText}>Upper-Lower</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.replace({
                  pathname: '/filter/[constraint]',
                  params: { constraint: 'warmup' },
                })
              }
            >
              <Text style={styles.buttonText}>Warm-Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.replace({
                  pathname: '/filter/[constraint]',
                  params: { constraint: 'aerobic' },
                })
              }
            >
              <Text style={styles.buttonText}>Aerobic</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace('/user/favourites')}
            >
              <Text style={styles.buttonText}>Favourites</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace('/food/foodSnap')}
            >
              <Text style={styles.buttonText}>Check Nutrition</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.6)', // same dark overlay
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 77, 0, 0.5)', 
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
