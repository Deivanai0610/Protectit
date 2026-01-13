import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useUser } from '@clerk/clerk-expo';
import { colors, commonStyles as styles } from '../mobile/styles/commonStyles';

const GEMINI_API_KEY = 'AIzaSyAXZGFe_2aru6DdssjVE96Rz9ksHrEpBpg';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function PhishingChecker() {
  const { isLoaded, user } = useUser();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const checkPhishing = async () => {
    if (!url.trim()) return Alert.alert('Error', 'Please enter a URL');
    setLoading(true);
    setResult('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Analyze this URL for phishing risk: ${url}. Respond with "SAFE" or "PHISHING" on the first line, followed by a short explanation.`;

      const response = await model.generateContent(prompt);
      const analysis = await response.response.text();
      const lines = analysis.split('\n');
      const status = lines[0].trim() === 'PHISHING' ? 'Phishing Likely' : 'Safe';
      const explanation = lines.slice(1).join(' ').trim();
      setResult(`${status}\n\nExplanation: ${explanation}`);
    } catch {
      Alert.alert('Error', 'Failed to analyze. Check internet or API key.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {isLoaded && user && <Text style={styles.welcome}>Welcome back, {user.primaryEmailAddress?.emailAddress || 'User'}! 👋</Text>}

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

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={checkPhishing} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Analyzing...' : 'Check Link'}</Text>
      </TouchableOpacity>

      {result ? (
        <View style={[styles.card, result.startsWith('Safe') ? { borderLeftColor: colors.safeGreen } : { borderLeftColor: colors.alertRed }, { borderLeftWidth: 6 }]}>
          <Text style={[styles.resultText, result.startsWith('Safe') ? styles.safeText : styles.unsafeText]}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}