import React, { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: Linking.createURL('auth/callback'),
        },
      });
      if (error) {
        throw error;
      }
      Alert.alert(
        'Check your inbox',
        'Open the sign-in link on this device to finish signing in.',
      );
    } catch (error) {
      Alert.alert(
        'Could not sign in',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Tracking System</Text>
      <Text style={styles.subtitle}>Sign in with your email</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="you@example.com"
        style={styles.input}
        value={email}
      />
      <Button
        disabled={!email.trim() || loading}
        onPress={() => void signIn()}
        title={loading ? 'Sending…' : 'Send magic link'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#555',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderColor: '#cfcfcf',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
});
