import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useUser } from '@clerk/clerk-expo';
import { colors, commonStyles as styles } from '../styles/commonStyles';

const GEMINI_API_KEY = 'AIzaSyAXZGFe_2aru6DdssjVE96Rz9ksHrEpBpg';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function PrivacySummarizer() {
  const { isLoaded, user } = useUser();
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
      setSummary('• ' + analysis.trim().replace(/\n/g, '\n• '));
      Alert.alert('Success', 'Summary generated!');
    } catch {
      Alert.alert('Error', 'Failed to summarize. Check internet or API key.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {isLoaded && user && <Text style={styles.welcome}>Welcome back, {user.primaryEmailAddress?.emailAddress || 'User'}! 👋</Text>}

      <Text style={styles.title}>Paste Privacy Policy for Summary</Text>

      <TextInput
        style={[styles.input, { height: 150 }]}
        placeholder="Paste the full privacy policy text here..."
        value={policy}
        onChangeText={setPolicy}
        multiline
        editable={!loading}
      />

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={summarizePolicy} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Summarizing...' : 'Get Summary'}</Text>
      </TouchableOpacity>

      {summary ? (
        <View style={styles.card}>
          <Text style={styles.title}>Key Summary Points:</Text>
          <Text style={styles.resultText}>{summary}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}