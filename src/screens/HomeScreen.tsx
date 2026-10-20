import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

type Bus = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  updated_at: string;
};

export default function HomeScreen() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuses = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('buses')
        .select('id, name, latitude, longitude, updated_at')
        .order('updated_at', { ascending: false })
        .limit(100);

      if (fetchError) {
        throw fetchError;
      }

      setBuses(data ?? []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Could not load buses. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchBuses();
  }, [fetchBuses]);

  const signOut = async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
    } catch (signOutError) {
      Alert.alert(
        'Could not sign out',
        signOutError instanceof Error
          ? signOutError.message
          : 'Please try again.',
      );
    }
  };

  const renderBus = ({ item }: { item: Bus }) => (
    <View style={styles.busCard}>
      <View style={styles.busHeading}>
        <Text style={styles.busName}>{item.name}</Text>
        <Text style={styles.updated}>
          {new Date(item.updated_at).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </View>
      <Text style={styles.coordinates}>
        {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
      </Text>
      <Text style={styles.locationLabel}>Last reported location</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Buses</Text>
          <Text style={styles.subtitle}>
            Latest reported locations from your fleet
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => void signOut()}
          style={styles.signOutButton}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.message}>
          <ActivityIndicator size="large" color="#176b55" />
          <Text style={styles.messageText}>Loading buses…</Text>
        </View>
      ) : error ? (
        <View style={styles.message}>
          <Text style={styles.errorTitle}>Buses could not be loaded</Text>
          <Text style={styles.messageText}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void fetchBuses()}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.listHeading}>
            <Text style={styles.count}>
              {buses.length} {buses.length === 1 ? 'bus' : 'buses'}
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={refreshing}
              onPress={() => void fetchBuses(true)}
              style={styles.refreshButton}
            >
              <Text style={styles.refreshText}>
                {refreshing ? 'Refreshing…' : 'Refresh buses'}
              </Text>
            </Pressable>
          </View>
          <FlatList
            contentContainerStyle={
              buses.length === 0 ? styles.emptyList : styles.list
            }
            data={buses}
            keyExtractor={(item) => item.id}
            onRefresh={() => void fetchBuses(true)}
            refreshing={refreshing}
            renderItem={renderBus}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No buses yet</Text>
                <Text style={styles.messageText}>
                  Add bus rows to the buses table in Supabase, then refresh.
                </Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: '#f5f8f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    color: '#17332b',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64736d',
    fontSize: 14,
    marginTop: 4,
  },
  signOutButton: {
    borderColor: '#d5dfdb',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  signOutText: {
    color: '#344b42',
    fontWeight: '600',
  },
  listHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  count: {
    color: '#64736d',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 8,
  },
  refreshText: {
    color: '#176b55',
    fontWeight: '700',
  },
  list: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
  busCard: {
    backgroundColor: '#fff',
    borderColor: '#e4ebe7',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  busHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  busName: {
    color: '#17332b',
    fontSize: 18,
    fontWeight: '700',
  },
  updated: {
    color: '#64736d',
    fontSize: 12,
  },
  coordinates: {
    color: '#344b42',
    fontSize: 16,
    marginTop: 12,
  },
  locationLabel: {
    color: '#829089',
    fontSize: 12,
    marginTop: 4,
  },
  message: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  messageText: {
    color: '#64736d',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  errorTitle: {
    color: '#9b2c2c',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#176b55',
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#17332b',
    fontSize: 20,
    fontWeight: '700',
  },
});
