
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/authContext';

type AuthUser = {
  email: string;
  // add other properties if needed
};

export default function HomeScreen() {
  const auth = useAuth() as { user: AuthUser | null; loading: boolean } | null;
  const { user, loading: authLoading } = auth ?? { user: null, loading: true };

  if (authLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Getting things ready...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to TeamPad, {user.email}</Text>
    </View>
  );
}

