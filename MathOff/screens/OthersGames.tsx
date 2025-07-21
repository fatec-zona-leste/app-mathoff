import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./styles/StyleChoise";
import BubbleBackground from "./background/BubbleBackground";
import MathSymbolBackground from "./background/MathSymbolBackground";
import { RootStackParamList } from "../types"; 

export default function OthersGames() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <BubbleBackground />

      <Text style={styles.title}>Outros Modos</Text>
      <Text style={styles.subtitle}>Escolha uma forma diferente de jogar:</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]}
        onPress={() => navigation.navigate("Relax")}
      >
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Relax</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ffc107" }]}
        onPress={() => navigation.navigate("Hunter")}
      >
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Caça</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#dc3545" }]}
        onPress={() => navigation.navigate("Fast")}
      >
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Turbo</Text>
      </TouchableOpacity>
    </View>
  );
}
