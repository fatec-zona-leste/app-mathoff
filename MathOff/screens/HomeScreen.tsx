import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./styles/StyleHome";
import BubbleBackground from "./background/BubbleBackground"; 
import MathSymbolBackground from "./background/MathSymbolBackground"; 
import { getUserToken } from "../authSession";
import { Audio } from "expo-av";

const Somb = require('../assets/sounds/somB.mp3');

type RootStackParamList = {
  Home: undefined;
  Choice: { level: number };
  Relax: undefined;
  Login: undefined;
  Perfil: undefined;
  Games: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(Somb);
    await sound.playAsync();
  };

  const goToOperationChoice = async (level: number) => {
    await playSound();
    navigation.navigate("Choice", { level });
  };

  const goToGames = async () => {
    await playSound();
    navigation.navigate("Games");
  };

  const handleProfilePress = async () => {
    try {
      const token = await getUserToken();
      if (token && token.length > 0) {
        navigation.navigate("Perfil");
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      Alert.alert("Erro", "Não foi possível verificar o estado do usuário.");
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <BubbleBackground />

      <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
        <Feather name="user" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>🧠 MathOff</Text>
      <Text style={styles.subtitle}>Escolha seu nível de desafio:</Text>

      <TouchableOpacity style={styles.button} onPress={goToGames}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Outros Modos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button1} onPress={() => goToOperationChoice(1)}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Nível 1 — Fácil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => goToOperationChoice(2)}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Nível 2 — Médio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button3} onPress={() => goToOperationChoice(3)}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Nível 3 — Difícil</Text>
      </TouchableOpacity>
    </View>
  );
}
