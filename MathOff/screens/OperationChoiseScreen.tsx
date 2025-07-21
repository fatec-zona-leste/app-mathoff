import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./styles/StyleChoise";
import BubbleBackground from "./background/BubbleBackground";
import MathSymbolBackground  from './background/MathSymbolBackground';

type RootStackParamList = {
  OperationChoice: { level: number };
  Game: { level: number; operationType: string };
};

const operations = [
  { label: "Aleatório", value: "any", color: "#6c757d" },
  { label: "Soma (+)", value: "+", color: "#28a745" },
  { label: "Subtração (-)", value: "-", color: "#17a2b8" },
  { label: "Multiplicação (×)", value: "*", color: "#ffc107" },
  { label: "Divisão (÷)", value: "/", color: "#dc3545" },
];

export default function OperationChoiceScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "OperationChoice">
    >();
  const route = useRoute<RouteProp<RootStackParamList, "OperationChoice">>();
  const { level } = route.params;

  if (level === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Erro: nível não especificado.</Text>
      </View>
    );
  }

  const handleSelect = (operationType: string) => {
    navigation.navigate("Game", { level, operationType });
  };

  return (
    <View style={styles.container}>
      <BubbleBackground />
      <Text style={styles.title}>🧮 Operações</Text>
      <Text style={styles.subtitle}>Escolha o tipo de operação:</Text>

      {operations.map((op) => (
        <TouchableOpacity
          key={op.value}
          style={[styles.button, { backgroundColor: op.color }]}
          onPress={() => handleSelect(op.value)}
        >
          <MathSymbolBackground />
          <Text style={styles.buttonText}>{op.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
