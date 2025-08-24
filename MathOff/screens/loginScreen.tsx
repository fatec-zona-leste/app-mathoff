import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './styles/StyleLogin';
import BubbleBackground from "./background/BubbleBackground";
import MathSymbolBackground from './background/MathSymbolBackground';
import { setUserToken, setUserEmail } from '../authSession';
import { useLanguage } from '../locales/translater';

type RootParamList = {
  Signup: undefined;
  Login: undefined;
  Home: undefined;
  ResetPassword: undefined;
};

type AuthNavigationProp = NativeStackNavigationProp<RootParamList>;

const FIREBASE_API_KEY = "AIzaSyBTnPyNYc2IZNGceCLwC9pvkRA6jz5-uxA";

export default function LoginScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Atualiza título da tela conforme idioma
  useLayoutEffect(() => {
    navigation.setOptions({ title: t('login') });
  }, [navigation, language, t]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('fill_fields'));
      return;
    }

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let message = t('login_error');
        if (data?.error?.message) {
          switch (data.error.message) {
            case 'EMAIL_NOT_FOUND':
              message = t('email_not_found');
              break;
            case 'INVALID_PASSWORD':
              message = t('wrong_password');
              break;
            case 'USER_DISABLED':
              message = t('user_disabled');
              break;
          }
        }
        Alert.alert(t('error'), message);
        return;
      }

      await setUserToken(data.idToken);
      await setUserEmail(email);

      Alert.alert(t('success'), t('login_success'));
      navigation.replace('Home');
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert(t('error'), t('server_error'));
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert(t('error'), t('provide_email_reset'));
      return;
    }

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestType: 'PASSWORD_RESET',
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let message = t('reset_error');
        if (data?.error?.message === 'EMAIL_NOT_FOUND') {
          message = t('email_not_found');
        }
        Alert.alert(t('error'), message);
        return;
      }

      Alert.alert(t('success'), t('reset_success'));
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      Alert.alert(t('error'), t('server_error'));
    }
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <BubbleBackground />
      <Text style={styles.title}>{t('login')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('email')}
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />

      <TextInput
        style={styles.input}
        placeholder={t('password')}
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
      />

      <TouchableOpacity onPress={handlePasswordReset}>
        <Text style={styles.link}>{t('forgot_password')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToSignup}>
        <Text style={styles.link}>{t('no_account')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t('login')}</Text>
      </TouchableOpacity>
    </View>
  );
}