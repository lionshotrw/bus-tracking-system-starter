cat > src/screens/HomeScreen.tsx <<'HS' import React, { useEffect, useState } from 'react'; import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'; import { supabase } from '../lib/supabase';

type Bus = { id: string; name: string; latitude: number; longitude: number; updated_at: string; };

export default function HomeScreen() { const [buses, setBuses] = useState<Bus[]>([]); const [loading, setLoading] = useState(true);

useEffect(() => { fetchBuses(); }, []);

const fetchBuses = async () => { setLoading(true); const { data, error } = await supabase .from('buses') .select('*') .order('updated_at', { ascending: false }) .limit(100);
                                };

if (loading) { return <ActivityIndicator style={{ flex: 1 }} />; }

return ( <View style={styles.container}> <Text style={styles.header}>Nearby buses</Text> <FlatList data={buses} keyExtractor={(item) => item.id} renderItem={({ item }) => ( <View style={styles.item}> <Text style={styles.title}>{item.name}</Text> <Text style={styles.meta}>Lat: {item.latitude.toFixed(5)} · Lng: {item.longitude.toFixed(5)}</Text> <Text style={styles.meta}>Updated: {new Date(item.updated_at).toLocaleString()}</Text> </View> )} ListEmptyComponent={<Text style={styles.empty}>No buses yet. Add data in Supabase.</Text>} /> </View> ); }

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, header: { fontSize: 22, fontWeight: '700', marginBottom: 12 }, item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }, title: { fontWeight: '600', fontSize: 16 }, meta: { color: '#4b5563' }, empty: { marginTop: 20, color: '#6b7280' } }); HS
