import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity } from 'react-native';
import { ClerkProvider, useUser, useClerk } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import PhishingChecker from './mobile/screens/PhishingChecker';
import History from './mobile/screens/History';
import Quiz from './mobile/screens/Quiz';
import PrivacySummarizer from './mobile/screens/PrivacySummarizer';
import SignIn from './mobile/app/(auth)/sign-in';
import SignUp from './mobile/app/(auth)/sign-up';

const Tab = createBottomTabNavigator();

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
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
          // Add Sign Out button in top-right corner of header
          headerRight: () => {
            if (!isSignedIn) return null;
            return (
              <TouchableOpacity
                onPress={() => signOut()}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: '#FF3B30', fontWeight: 'bold', fontSize: 16 }}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            );
          },
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