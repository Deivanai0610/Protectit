import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Text, TouchableOpacity } from 'react-native';
import { ClerkProvider, useUser, useClerk } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

import PhishingChecker from './screens/PhishingChecker';
import History from './screens/History';
import Quiz from './screens/Quiz';
import PrivacySummarizer from './screens/PrivacySummarizer';
import SignIn from './app/(auth)/sign-in';
import SignUp from './app/(auth)/sign-up';

const Tab = createBottomTabNavigator();

const tokenCache = {
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
};

function Root() {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  return (
    <>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerStyle: { backgroundColor: '#f8f9fa' },
          headerTintColor: '#000',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: 'Protectit',
          tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e0e0e0' },
          headerRight: () =>
            isSignedIn ? (
              <TouchableOpacity onPress={signOut} style={{ marginRight: 16 }}>
                <Text style={{ color: '#FF3B30', fontWeight: 'bold', fontSize: 16 }}>Sign Out</Text>
              </TouchableOpacity>
            ) : null,
        }}
      >
        {!isSignedIn && (
          <>
            <Tab.Screen
              name="SignIn"
              component={SignIn}
              options={{
                title: 'Sign In',
                tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>🔐</Text>,
              }}
            />
            <Tab.Screen
              name="SignUp"
              component={SignUp}
              options={{
                title: 'Sign Up',
                tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>📝</Text>,
              }}
            />
          </>
        )}
        <Tab.Screen
          name="Checker"
          component={PhishingChecker}
          options={{
            title: 'Phishing Checker',
            tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>🔍</Text>,
          }}
        />
        <Tab.Screen
          name="History"
          component={History}
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>📋</Text>,
          }}
        />
        <Tab.Screen
          name="Quiz"
          component={Quiz}
          options={{
            title: 'Phishing Quiz',
            tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>❓</Text>,
          }}
        />
        <Tab.Screen
          name="Privacy"
          component={PrivacySummarizer}
          options={{
            title: 'Privacy Summary',
            tabBarIcon: ({ color, size }) => <Text style={{ color, fontSize: size }}>📄</Text>,
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey="pk_test_c3RpcnJlZC1zaGVlcGRvZy0yLmNsZXJrLmFjY291bnRzLmRldiQ" tokenCache={tokenCache}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </ClerkProvider>
  );
}