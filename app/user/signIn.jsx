import {
    Text,
    TextInput,
    View,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ImageBackground,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Modal,
  } from 'react-native';
  import * as SQLite from 'expo-sqlite';
  import { useFocusEffect, router } from 'expo-router';
  import { useCallback, useState } from 'react';
  import { setName } from '../../lib/session';

  export default function SignIn() {
  const [db, setDb] = useState(null);
  const [userName, setUserName] = useState("");

  const initiateDatabase = async () => {
    const database = await SQLite.openDatabaseAsync('Fitness.db');
    setDb(database);
  };

  const logIn = async () => {
    const uName = userName.trim();

    if (!uName) {
      Alert.alert('Error', 'Please enter your user name');
      return;
    }

    const row = await db.getFirstAsync(
      'SELECT COUNT(*) AS c FROM users WHERE userName = ?',
      [uName]
    );

    if (row.c !== 0) {
      setName(uName);
      Alert.alert('Success', `Welcome ${uName}`);
      router.replace('../type');
    } else {
      Alert.alert('Error', 'Error signing in, please check your user name');
    }
  };

  useFocusEffect(
    useCallback(() => {
      initiateDatabase();
    }, [])
  );

  return (
  <ImageBackground
    source={require('../../assets/images/Background.png')}
    style={styles.background}
    resizeMode="cover"
  >
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* CONTENT */}
        <View style={styles.centerContent}>
          <Text style={styles.title}>PULSE FIT</Text>

          <TextInput
            style={styles.input}
            placeholder="User Name"
            placeholderTextColor="#aaa"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={logIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('./signUp')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </ImageBackground>
);
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // dark overlay for readability
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#E53935',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
