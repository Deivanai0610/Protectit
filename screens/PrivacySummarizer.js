import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyAXZGFe_2aru6DdssjVE96Rz9ksHrEpBpg';  // Replace with your key from https://aistudio.google.com/app/apikey
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function PrivacySummarizer() {
  const [policy, setPolicy] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const summarizePolicy = async () => {
    if (!policy.trim()) return Alert.alert('Error', 'Please paste a privacy policy');
    setLoading(true);
    setSummary('');
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Summarize this privacy policy into 5-7 concise bullet points. Focus on key points: data collected, usage/sharing, user rights, security, and any risks/red flags. Be neutral and objective.\n\nPolicy: ${policy}`;
      const response = await model.generateContent(prompt);
      const analysis = await response.response.text();
      setSummary(analysis.trim().replace(/\n/g, '\n• '));  // Format as bullets
      Alert.alert('Success', 'Summary generated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to summarize. Check API key or connection.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Paste Privacy Policy for Summary</Text>
      <TextInput
        style={styles.input}
        placeholder="Paste the full privacy policy text here..."
        value={policy}
        onChangeText={setPolicy}
        multiline
        numberOfLines={10}
        editable={!loading}
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.disabled]} 
        onPress={summarizePolicy} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Summarizing...' : 'Get Summary'}</Text>
      </TouchableOpacity>
      {summary ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Key Summary Points:</Text>
          <Text style={styles.summary}>{summary}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007AFF' },
  input: { 
    borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, 
    backgroundColor: '#fff', fontSize: 16, marginBottom: 15, height: 150, 
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 
  },
  button: { 
    backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', 
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 
  },
  disabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  summaryCard: { padding: 15, borderRadius: 10, marginTop: 15, backgroundColor: '#f0f8ff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#007AFF' },
  summary: { fontSize: 16, lineHeight: 22, color: '#333' },
});