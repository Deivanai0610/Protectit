import { useSignIn } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';  // ← React Navigation
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';

function SignInScreen() {
  const navigation = useNavigation();

  return (
    <View>
      {/* Your sign-in form */}

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={{ color: '#007AFF', textAlign: 'center', marginTop: 20 }}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigation = useNavigation();  // ← For navigating to SignUp

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        // No router — just let the parent App.js handle tab visibility
        // User is now logged in → SignIn/SignUp tabs will disappear if you add the conditional (see below)
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Sign In</Text>

      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email address"
        onChangeText={setEmailAddress}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 }}
        keyboardType="email-address"
      />

      <TextInput
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 8 }}
      />

      <TouchableOpacity
        onPress={onSignInPress}
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}