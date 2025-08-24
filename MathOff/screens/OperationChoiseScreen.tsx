import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./styles/StyleChoise";
import BubbleBackground from "./background/BubbleBackground";
import MathSymbolBackground from './background/MathSymbolBackground';
import { useLanguage } from "../locales/translater";

type RootStackParamList = {
  OperationChoice: { level: number };
  Game: { level: number; operationType: string };
};

export default function OperationChoiceScreen() {
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList, "OperationChoice">
  >();
  const route = useRoute<RouteProp<RootStackParamList, "OperationChoice">>();
  const { level } = route.params;

  const { t } = useLanguage();

  if (level === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t("level_not_specified")}</Text>
      </View>
    );
  }

  const operations = [
    { label: t("random"), value: "any", color: "#6c757d" },
    { label: t("addition"), value: "+", color: "#28a745" },
    { label: t("subtraction"), value: "-", color: "#17a2b8" },
    { label: t("multiplication"), value: "*", color: "#ffc107" },
    { label: t("division"), value: "/", color: "#dc3545" },
  ];

  const handleSelect = (operationType: string) => {
    navigation.navigate("Game", { level, operationType });
  };

  return (
    <View style={styles.container}>
      <BubbleBackground />
      <Text style={styles.title}>🧮 {t("operations")}</Text>
      <Text style={styles.subtitle}>{t("choose_operation_type")}</Text>

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
