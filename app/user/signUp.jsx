import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, router } from 'expo-router';

export default function SignUp() {
  const [db, setDb] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    Name: '',
    DOB: '',
    sex: '',
    userName: '',
  });

  const setDatabase = async () => {
    const database = await SQLite.openDatabaseAsync('Fitness.db');
    setDb(database);
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dob TEXT NOT NULL,
        sex TEXT NOT NULL,
        userName TEXT NOT NULL
      );
    `);
  };

  useFocusEffect(
    useCallback(() => {
      setDatabase();
    }, [])
  );

  const handleSave = async () => {

    if (
      !form.Name.trim() ||
      !form.DOB.trim() ||
      !form.sex.trim() ||
      !form.userName.trim()
    ) {
      Alert.alert('Missing info', 'Please fill in all the fields.');
      return;
    }

    try {
      setSaving(true);
      await db.runAsync(
        'INSERT INTO users(name, dob, sex, userName) VALUES (?,?,?,?)',
        [form.Name.trim(), form.DOB.trim(), form.sex.trim(), form.userName.trim()]
      );
      Alert.alert('Success', 'User successfully added into the database.');
      setForm({ Name: '', DOB: '', sex: '', userName: '' });
      router.replace('index');
    } catch (e) {
      Alert.alert('Error', e?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop' }}
      style={styles.bg}
      resizeMode="cover"
      blurRadius={2}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.card}>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>Welcome to your fitness journey 💪</Text>

              <View style={styles.field}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  value={form.Name}
                  onChangeText={(t) => setForm({ ...form, Name: t })}
                  placeholder="e.g., Alex Johnson"
                  placeholderTextColor="#9aa0a6"
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  value={form.DOB}
                  onChangeText={(t) => setForm({ ...form, DOB: t })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9aa0a6"
                  style={styles.input}
                  keyboardType="numbers-and-punctuation"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Sex</Text>
                <View style={styles.pickerWrap}>
                  <Picker
                    selectedValue={form.sex}
                    onValueChange={(v) => setForm({ ...form, sex: v })}
                    style={styles.picker}
                    dropdownIconColor="#e5e7eb"
                  >
                    <Picker.Item label="Select…" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other / Prefer not to say" value="Other" />
                  </Picker>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  value={form.userName}
                  onChangeText={(t) => setForm({ ...form, userName: t })}
                  placeholder="e.g., alex_j"
                  placeholderTextColor="#9aa0a6"
                  style={styles.input}
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                onPress={handleSave}
                style={[styles.btn, (!db || saving) && styles.btnDisabled]}
                activeOpacity={0.85}
                disabled={!db || saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text style={styles.btnText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.replace('index')}
                style={styles.linkBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.linkText}>Back to Home</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footer}>
              By signing up, you agree to the Terms & Privacy Policy.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  scroll: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  card: {
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    borderRadius: 18,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#e5e7eb' },
  subtitle: { fontSize: 14, color: '#cbd5e1', marginTop: -4, marginBottom: 4 },
  field: { marginTop: 6 },
  label: { color: '#cbd5e1', marginBottom: 6, fontSize: 13 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    color: '#e5e7eb',
    fontSize: 16,
  },
  pickerWrap: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: { color: '#e5e7eb', height: 48 },
  btn: {
    marginTop: 12,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#0b1220', fontWeight: '700', fontSize: 16 },
  linkBtn: { paddingVertical: 10, alignItems: 'center' },
  linkText: { color: '#93c5fd', fontSize: 14 },
  footer: { textAlign: 'center', color: '#cbd5e1', fontSize: 12, marginTop: 12 },
});
