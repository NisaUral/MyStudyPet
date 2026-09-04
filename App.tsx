import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from './src/store/useAuthStore';
import { SelectPetScreen } from './src/screens/onboarding/SelectPetScreen';
import { WardrobeScreen } from './src/screens/wardrobe/WardrobeScreen';
import { DashboardScreen } from './src/screens/dashboard/DashboardScreen';
import { StudyRoomScreen } from './src/screens/room/StudyRoomScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { loadPersistedAuth, hasSelectedPet } = useAuthStore();

  useEffect(() => {
    loadPersistedAuth();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#1A1B26" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1A1B26' },
        }}
        // Eğer pet seçildiyse doğrudan Dashboard'a, seçilmediyse seçim ekranına açılır
        initialRouteName={hasSelectedPet ? 'DashboardScreen' : 'SelectPetScreen'}
      >
        <Stack.Screen name="SelectPetScreen" component={SelectPetScreen} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="WardrobeScreen" component={WardrobeScreen} />
        <Stack.Screen name="StudyRoomScreen" component={StudyRoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}