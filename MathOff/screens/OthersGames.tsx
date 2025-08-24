import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./styles/StyleChoise";
import BubbleBackground from "./background/BubbleBackground";
import MathSymbolBackground from "./background/MathSymbolBackground";
import { RootStackParamList } from "../types";
import { useLanguage } from "../locales/translater";

export default function OthersGames() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <BubbleBackground />

      <Text style={styles.title}>{t("other_modes")}</Text>
      <Text style={styles.subtitle}>{t("choose_different_mode")}</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#28a745" }]}
        onPress={() => navigation.navigate("Relax")}
      >
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t("relax")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ffc107" }]}
        onPress={() => navigation.navigate("Hunter")}
      >
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t("hunt")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#dc3545" }]}
        onPress={() => navigation.navigate("Fast")}
      >
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t("turbo")}</Text>
      </TouchableOpacity>
    </View>
  );
}
