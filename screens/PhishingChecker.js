import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useUser, useClerk } from '@clerk/clerk-expo';  // Added useClerk for sign out

const GEMINI_API_KEY = 'AIzaSyAXZGFe_2aru6DdssjVE96Rz9ksHrEpBpg';
const API_BASE = 'https://protectit-backend-devis-projects-d516985b.vercel.app/';  // Fixed

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function PhishingChecker() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();  // For sign out button

  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const checkPhishing = async () => {
    if (!url.trim()) return Alert.alert('Error', 'Please enter a URL');
    setLoading(true);
    setResult('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Analyze this URL for phishing risk: ${url}. Check for suspicious domains, lack of HTTPS, URL shorteners, or common phishing tactics. Respond with "SAFE" or "PHISHING" on the first line, followed by a 1-2 sentence explanation.`;

      const response = await model.generateContent(prompt);
      const analysis = await response.response.text();
      const lines = analysis.split('\n');
      const status = lines[0].trim() === 'PHISHING' ? 'Phishing Likely' : 'Safe';
      const explanation = lines.slice(1).join(' ').trim();
      setResult(`${status}\n\nExplanation: ${explanation}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze. Check internet or API key.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Message */}
      {isLoaded && user && (
        <Text style={styles.welcome}>
          Welcome back, {user.primaryEmailAddress?.emailAddress || 'User'}! 👋
        </Text>
      )}

      <Text style={styles.title}>Paste a URL to Check for Phishing</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g., https://example.com"
        value={url}
        onChangeText={setUrl}
        multiline
        editable={!loading}
        autoCapitalize="none"
        keyboardType="url"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={checkPhishing}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Analyzing...' : 'Check Link'}
        </Text>
      </TouchableOpacity>

      {result ? (
        <View
          style={[
            styles.resultCard,
            { backgroundColor: result.startsWith('Safe') ? '#E8F5E8' : '#FFE8E8' },
          ]}
        >
          <Text style={styles.result}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  signOutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  signOutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  result: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});