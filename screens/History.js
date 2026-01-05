import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';  // Added for auth

const API_BASE = ' https://protectit-backend-devis-projects-d516985b.vercel.app/'


export default function History() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { getToken } = useAuth();  // Added to get auth token

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await getToken();  // Get the JWT token
      const { data } = await axios.get(`${API_BASE}/api/history`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Send token in header
        },
      });
      console.log('Fetched data:', data);
      setHistory(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load history. Please log in.');
      console.error('Fetch error:', error.response);  // More details for debugging
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory().finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: item.result === 'Safe' ? '#E8F5E8' : '#FFE8E8' }]}>
      <Text style={styles.link}>Link: {item.link}</Text>
      <Text style={[styles.result, { color: item.result === 'Safe' ? '#34C759' : '#FF3B30' }]}>Result: {item.result}</Text>
      <Text style={styles.timestamp}>Checked: {new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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