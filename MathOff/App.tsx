// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import OperationChoice from './screens/OperationChoiseScreen';
import GameScreen from './screens/Game/gameScreen';
import LoginScreen from './screens/loginScreen';
import SignupScreen from './screens/SignupScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import PerfilScreen from './screens/PerfilScreen';
import OthersGames from './screens/OthersGames';
import RelaxScreen from './screens/Game/RelaxScreen';
import HunterScreen from './screens/Game/HunterScreen';
import FastScreen from './screens/Game/FastScreen';

import { ScoreProvider } from './context/ScoreContext';
import { LanguageProvider } from './locales/translater'; 

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#f0f0f5" translucent={false} />
      <ScoreProvider>
        <LanguageProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
              <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Choice" component={OperationChoice} options={{ headerShown: false }} />
              <Stack.Screen name="Games" component={OthersGames} options={{ headerShown: false }} />
              <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Relax" component={RelaxScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Hunter" component={HunterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Fast" component={FastScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, title: 'Entrar' }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false, title: 'Cadastrar' }} />
              <Stack.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false, title: 'Perfil' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </LanguageProvider>
      </ScoreProvider>
    </>
  );
}
