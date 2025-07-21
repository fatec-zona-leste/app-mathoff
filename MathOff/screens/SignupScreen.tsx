import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from "./styles/StyleSingup";
import BubbleBackground from "./background/BubbleBackground";
import MathSymbolBackground from './background/MathSymbolBackground';
import { setUserToken } from '../authSession';
import { setUserEmail } from '../authSession';

type RootParamList = {
  Signup: undefined;
  Login: undefined;
  Home: undefined;
};

type AuthNavigationProp = NativeStackNavigationProp<RootParamList>;

const FIREBASE_API_KEY = "AIzaSyBTnPyNYc2IZNGceCLwC9pvkRA6jz5-uxA";

export default function SignupScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
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
        let message = 'Erro ao cadastrar usuário.';
        if (data?.error?.message) {
          switch (data.error.message) {
            case 'EMAIL_EXISTS':
              message = 'Este e-mail já está em uso.';
              break;
            case 'INVALID_EMAIL':
              message = 'E-mail inválido.';
              break;
            case 'WEAK_PASSWORD : Password should be at least 6 characters':
              message = 'A senha deve ter pelo menos 6 caracteres.';
              break;
          }
        }
        Alert.alert('Erro', message);
        return;
      }

      await setUserToken(data.idToken); 
      await setUserEmail(email);

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <BubbleBackground />
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
