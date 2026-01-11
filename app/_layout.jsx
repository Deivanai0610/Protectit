import { Stack } from 'expo-router/stack';
import { useUser } from '@clerk/clerk-expo';  // Added missing import
import { Redirect } from 'expo-router';  // Added missing import

export default function Layout() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;  // Adjusted path to match your (auth) group
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}