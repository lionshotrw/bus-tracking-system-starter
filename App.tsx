cat > App.tsx <<'AT' import React from 'react'; import { NavigationContainer } from '@react-navigation/native'; import { createNativeStackNavigator } from '@react-navigation/native-stack'; import { SafeAreaView, StyleSheet } from 'react-native'; import AuthScreen from './src/screens/AuthScreen'; import HomeScreen from './src/screens/HomeScreen';

export type RootStackParamList = { Auth: undefined; Home: undefined; };

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() { return ( <NavigationContainer> <SafeAreaView style={styles.container}> <Stack.Navigator initialRouteName="Auth"> <Stack.Screen name="Auth" component={AuthScreen} /> <Stack.Screen name="Home" component={HomeScreen} /> </Stack.Navigator> </SafeAreaView> </NavigationContainer> ); }

const styles = StyleSheet.create({ container: { flex: 1 } }); AT

