import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { colors, commonStyles as styles } from '../styles/commonStyles';

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
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      const { data } = await axios.get(`${API_BASE}/api/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory().finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        item.result === 'Safe' ? { borderLeftColor: colors.safeGreen } : { borderLeftColor: colors.alertRed },
        { borderLeftWidth: 6 },
      ]}
    >
      <Text style={styles.linkText}>{item.link}</Text>
      <Text style={[styles.resultText, item.result === 'Safe' ? styles.safeText : styles.unsafeText]}>{item.result}</Text>
      <Text style={styles.timestampText}>{new Date(item.created_at).toLocaleString()}</Text>
    </View>
  );

  if (!isLoaded) return <Text style={styles.emptyText}>Loading...</Text>;
  if (!isSignedIn) return <Text style={styles.emptyText}>Please log in to view history</Text>;

  return (
    <FlatList
      style={styles.container}
      data={history}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={<Text style={styles.emptyText}>No history yet. Check some links!</Text>}
    />
  );
}