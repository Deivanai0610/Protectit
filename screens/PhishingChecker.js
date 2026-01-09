import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyAXZGFe_2aru6DdssjVE96Rz9ksHrEpBpg'; // Replace with your key from https://aistudio.google.com/app/apikey
const API_BASE = 'https://protectit-backend-git-main-devis-projects-d516985b.vercel.app'; // Replace with your Vercel backend URL

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function PhishingChecker() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const checkPhishing = async () => {
    if (!url.trim()) return Alert.alert('Error', 'Please enter a URL');
    setLoading(true);
    setResult(''); // Clear previous result

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Analyze this URL for phishing risk: ${url}. Check for suspicious domains, lack of HTTPS, URL shorteners, or common phishing tactics. Respond with "SAFE" or "PHISHING" on the first line, followed by a 1-2 sentence explanation.`;

      const response = await model.generateContent(prompt);
      const analysis = await response.response.text();
      const lines = analysis.split('\n');
      const status = lines[0].trim() === 'PHISHING' ? 'Phishing Likely' : 'Safe';
      const explanation = lines.slice(1).join(' ').trim();
      setResult(`${status}\n\nExplanation: ${explanation}`);
    } 
    // Save to history (non-blocking if backend fails)
    /* 
    try {
      await axios.post(`${API_BASE}/api/history`, { link: url, result: status });
    } catch (backendError) {
      console.warn('History save failed:', backendError);
    }
    Alert.alert('Success', 'Link analyzed!');
    */
    catch (error) {
      Alert.alert('Error', 'Failed to analyze. Check API key or internet connection.');
      console.error(error);
    }
    setLoading(false);
  };

  const saveToHistory = async (url, result, ai_analysis) => {
    try {
      await fetch('http://localhost:3000/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, result, ai_analysis }),
      });
    } catch (error) {
      console.error('Error saving:', error);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Paste a URL to Check for Phishing</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., https://example.com"
        value={url}
        onChangeText={setUrl}
        multiline
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={checkPhishing}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Analyzing...' : 'Check Link'}</Text>
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
    lineHeight: 22,
    color: '#333',
  },
});
