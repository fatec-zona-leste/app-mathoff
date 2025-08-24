import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from "./styles/StyleSingup";
import BubbleBackground from "./background/BubbleBackground";
import MathSymbolBackground from './background/MathSymbolBackground';
import { setUserToken, setUserEmail } from '../authSession';
import { useLanguage } from '../locales/translater';

type RootParamList = {
  Signup: undefined;
  Login: undefined;
  Home: undefined;
};

type AuthNavigationProp = NativeStackNavigationProp<RootParamList>;

const FIREBASE_API_KEY = "AIzaSyBTnPyNYc2IZNGceCLwC9pvkRA6jz5-uxA";

export default function SignupScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Atualiza título da tela dinamicamente conforme idioma
  useLayoutEffect(() => {
    navigation.setOptions({ title: t('signup') });
  }, [navigation, language, t]);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('fill_fields'));
      return;
    }

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let message = t('signup_error');
        if (data?.error?.message) {
          switch (data.error.message) {
            case 'EMAIL_EXISTS':
              message = t('email_exists');
              break;
            case 'INVALID_EMAIL':
              message = t('invalid_email');
              break;
            case 'WEAK_PASSWORD : Password should be at least 6 characters':
              message = t('weak_password');
              break;
          }
        }
        Alert.alert(t('error'), message);
        return;
      }

      await setUserToken(data.idToken);
      await setUserEmail(email);

      Alert.alert(t('success'), t('signup_success'));
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert(t('error'), t('server_error'));
    }
  };

  return (
    <View style={styles.container}>
      <BubbleBackground />
      <Text style={styles.title}>{t('signup')}</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        placeholder={t('email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        placeholder={t('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t('signup')}</Text>
      </TouchableOpacity>
    </View>
  );
}
