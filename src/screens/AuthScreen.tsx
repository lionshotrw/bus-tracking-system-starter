cat > src/screens/AuthScreen.tsx <<'AS' import React, { useState } from 'react'; import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'; import type { NativeStackScreenProps } from '@react-navigation/native-stack'; import { RootStackParamList } from '../../App'; import { supabase } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) { const [email, setEmail] = useState(''); const [loading, setLoading] = useState(false);

const signIn = async () => { setLoading(true); try { const { error } = await supabase.auth.signInWithOtp({ email }); if (error) throw error; Alert.alert('Check your inbox', 'A sign-in link has been sent to your email.'); navigation.replace('Home'); } catch (error: any) { Alert.alert('Error', error.message || 'Could not sign in'); } finally { setLoading(false); } };

return ( <View style={styles.container}> <Text style={styles.title}>Bus Tracking System</Text> <Text style={styles.subtitle}>Sign in with your email</Text> <TextInput placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" style={styles.input} value={email} onChangeText={setEmail} /> <Button title={loading ? 'Sending...' : 'Send magic link'} onPress={signIn} disabled={!email || loading} /> </View> ); }

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', padding: 16 }, title: { fontSize: 28, textAlign: 'center', marginBottom: 8, fontWeight: '700' }, subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 16, color: '#555' }, input: { borderWidth: 1, borderColor: '#cfcfcf', borderRadius: 8, padding: 12, marginBottom: 16 } }); AS
