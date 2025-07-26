
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/authContext';

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth();

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

