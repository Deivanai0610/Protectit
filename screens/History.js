import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useUser, useAuth, useClerk } from '@clerk/clerk-expo';

const API_BASE = 'https://protectit-backend-devis-projects-d516985b.vercel.app';

export default function History() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchHistory();
  }, [isLoaded, isSignedIn]);

  const fetchHistory = async () => {
    if (!isSignedIn) {
      Alert.alert('Please log in to view history.');
      return;
    }
    try {
      const token = await getToken();
      const { data } = await axios.get(`${API_BASE}/api/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(data);
    } catch (error) {
      Alert.alert('Failed to load history. Please try again.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory().finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.result === 'Safe' ? styles.safeCard : styles.unsafeCard]}>
      <Text style={styles.linkText}>Link: {item.link}</Text>
      <Text style={[styles.resultText, item.result === 'Safe' ? styles.safeText : styles.unsafeText]}>
        Result: {item.result}
      </Text>
      <Text style={styles.timestampText}>
        Checked: {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  if (!isLoaded) return <Text style={styles.emptyText}>Loading...</Text>;
  if (!isSignedIn) return <Text style={styles.emptyText}>Please log in to view history</Text>;

  return (
    <FlatList
      style={styles.container}
      data={history}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<Text style={styles.emptyText}>No history yet. Check some links!</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  safeCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#34C759',
  },
  unsafeCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#FF3B30',
  },
  linkText: { fontWeight: '600', fontSize: 16 },
  resultText: { fontWeight: '700', fontSize: 16, marginTop: 6 },
  safeText: { color: '#34C759' },
  unsafeText: { color: '#FF3B30' },
  timestampText: { fontSize: 14, color: '#666', marginTop: 6 },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 50,
  },
});