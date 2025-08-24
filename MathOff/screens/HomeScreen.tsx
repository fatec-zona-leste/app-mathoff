// HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "./styles/StyleHome";
import BubbleBackground from "./background/BubbleBackground";
import MathSymbolBackground from "./background/MathSymbolBackground";
import { getUserToken } from "../authSession";
import { Audio } from "expo-av";
import { useLanguage } from "../locales/translater"; 
import { useTranslator } from "../locales/src/hooks/useTranslator";  

const Somb = require("../assets/sounds/somB.mp3");

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
  const { t, language, setLanguage } = useLanguage();
  const { translate } = useTranslator();
  const [dynamicHint, setDynamicHint] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const tr = await translate("Have fun!", language as "pt" | "en");
        if (mounted) setDynamicHint(tr);
      } catch (e) {
        console.warn("Erro ao traduzir dinamicamente:", e);
      }
    })();
    return () => { mounted = false; };
  }, [language, translate]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(Somb);
    try { await sound.playAsync(); } catch (e) { console.warn("Erro ao tocar som:", e); }
    finally { try { await sound.unloadAsync(); } catch {} }
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
      if (token && token.length > 0) navigation.navigate("Perfil");
      else navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      Alert.alert(t("error"), t("login_error"));
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <BubbleBackground />

      {/* Botão de tradução no canto superior esquerdo */}
      <View style={topStyles.languageContainer}>
        <TouchableOpacity
          accessibilityLabel={language === "pt" ? "Mudar para inglês" : "Switch to Portuguese"}
          onPress={() => setLanguage(language === "pt" ? "en" : "pt")}
          style={topStyles.languageButton}
        >
          <Text style={topStyles.languageEmoji}>
            {language === "pt" ? "🇺🇸" : "🇧🇷"}
          </Text>
          <Text style={topStyles.languageText}>
            {language === "pt" ? "English" : "Português"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão de perfil no canto superior direito */}
      <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
        <Feather name="user" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>🧠 MathOff</Text>
      <Text style={styles.subtitle}>{t("choose_your_level")}</Text>

      {dynamicHint ? <Text style={styles.hint}>{dynamicHint}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={goToGames}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t("other_modes")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button1} onPress={() => goToOperationChoice(1)}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t("level1")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => goToOperationChoice(2)}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t("level2")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button3} onPress={() => goToOperationChoice(3)}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t("level3")}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos para o botão de tradução
const topStyles = StyleSheet.create({
  languageContainer: {
    position: "absolute",
    top: 40,
    left: 20, // agora fica à esquerda
    zIndex: 10,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  languageEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
