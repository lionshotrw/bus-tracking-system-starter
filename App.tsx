import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import { supabase } from './src/lib/supabase';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuthUrl = async (url: string) => {
      const { queryParams } = Linking.parse(url);
      const code = queryParams?.code;
      if (typeof code !== 'string') {
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        Alert.alert('Could not complete sign in', error.message);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setLoading(false);
        }
      },
    );

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) {
        return;
      }
      if (error) {
        Alert.alert('Could not restore sign in', error.message);
      }
      setSession(data.session);
      setLoading(false);
    });

    const urlListener = Linking.addEventListener('url', ({ url }) => {
      void handleAuthUrl(url).catch((error: unknown) => {
        Alert.alert(
          'Could not complete sign in',
          error instanceof Error ? error.message : 'Please try again.',
        );
      });
    });
    void Linking.getInitialURL()
      .then((url) => (url ? handleAuthUrl(url) : undefined))
      .catch((error: unknown) => {
        Alert.alert(
          'Could not complete sign in',
          error instanceof Error ? error.message : 'Please try again.',
        );
      });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
      urlListener.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator style={styles.loading} />
        ) : (
          <Stack.Navigator>
            {session ? (
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Bus tracker' }}
              />
            ) : (
              <Stack.Screen
                name="Auth"
                component={AuthScreen}
                options={{ title: 'Sign in' }}
              />
            )}
          </Stack.Navigator>
        )}
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
  },
});
