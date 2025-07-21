import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './styles/StyleLogin';
import BubbleBackground from "./background/BubbleBackground";
import MathSymbolBackground from './background/MathSymbolBackground';
import { setUserToken } from '../authSession';
import { setUserEmail } from '../authSession'; 

type RootParamList = {
  Signup: undefined;
  Login: undefined;
  Home: undefined;
  ResetPassword: undefined;
};

const FIREBASE_API_KEY = "AIzaSyBTnPyNYc2IZNGceCLwC9pvkRA6jz5-uxA";

type AuthNavigationProp = NativeStackNavigationProp<RootParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
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
        let message = 'Erro ao fazer login.';
        if (data?.error?.message) {
          switch (data.error.message) {
            case 'EMAIL_NOT_FOUND':
              message = 'E-mail não encontrado.';
              break;
            case 'INVALID_PASSWORD':
              message = 'Senha incorreta.';
              break;
            case 'USER_DISABLED':
              message = 'Usuário desativado.';
              break;
          }
        }
        Alert.alert('Erro', message);
        return;
      }

      await setUserToken(data.idToken); // SALVA O TOKEN AQUI
      await setUserEmail(email); // <- salve o email

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.replace('Home');
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Erro', 'Informe seu e-mail para redefinir a senha.');
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
        let message = 'Erro ao solicitar redefinição.';
        if (data?.error?.message === 'EMAIL_NOT_FOUND') {
          message = 'E-mail não encontrado.';
        }
        Alert.alert('Erro', message);
        return;
      }

      Alert.alert('Sucesso', 'Email de redefinição enviado!');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    }
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <BubbleBackground />
      <Text style={styles.title}>Entrar</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
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
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
      />

      <TouchableOpacity onPress={handlePasswordReset}>
        <Text style={styles.link}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToSignup}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
