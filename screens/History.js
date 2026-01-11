import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useUser, useAuth, useClerk } from '@clerk/clerk-expo';

const API_BASE = 'https://protectit-backend-devis-projects-d516985b.vercel.app';
`${API_BASE}/api/history`

export default function History() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchHistory();
    }
  }, [isLoaded, isSignedIn]);

  const fetchHistory = async () => {
    if (!isSignedIn) {
      Alert.alert('Error', 'Please log in to view history.');
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication failed. Please log in again.');
        return;
      }

      const { data } = await axios.get(`${API_BASE}/api/history`, {
        headers: {
          Authorization: `Bearer ${token}`,    // <--- This is the key line: send token in Authorization header
        },
      });

      console.log('Fetched history:', data);
      setHistory(data);
    } catch (error) {
      console.error('Fetch error:', error.response || error);
      Alert.alert('Error', 'Failed to load history. Please try again.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory().finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: item.result === 'Safe' ? '#E8F5E8' : '#FFE8E8' }]}>
      <Text style={styles.link}>Link: {item.link}</Text>
      <Text style={[styles.result, { color: item.result === 'Safe' ? '#34C759' : '#FF3B30' }]}>
        Result: {item.result}
      </Text>
      <Text style={styles.timestamp}>
        Checked: {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  if (!isLoaded) {
    return <Text style={styles.empty}>Loading...</Text>;
  }

  if (!isSignedIn) {
    return <Text style={styles.empty}>Please log in to view history</Text>;
  }

  return (
    <View style={styles.container}>
      {isLoaded && user && (
        <Text style={styles.welcome}>
          Welcome back, {user.primaryEmailAddress?.emailAddress || 'User'}! 👋
        </Text>
      )}

      <Text style={styles.title}>Check History</Text>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {history.length === 0 && (
        <Text style={styles.empty}>No history yet. Check some links to get started!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#007AFF', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007AFF' },
  item: { 
    padding: 15, marginBottom: 10, borderRadius: 10, 
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 
  },
  link: { fontSize: 16, fontWeight: '500' },
  result: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  timestamp: { fontSize: 14, color: '#666', marginTop: 5 },
  empty: { textAlign: 'center', fontSize: 16, color: '#8E8E93', marginTop: 50 },
});