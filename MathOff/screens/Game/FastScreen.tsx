import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import styles from '../styles/StyleGame';
import MathBubblesBackground from "../background/MathBubblesBackground";
import MathSymbolBackground from "../background/MathSymbolBackground";
import { useScore } from "../../context/ScoreContext"; 
import { useLanguage } from "../../locales/translater"; // hook de tradução

const successSound = require('../../assets/sounds/acerto.mp3');
const errorSound = require('../../assets/sounds/erro.mp3');

export default function TurboModeScreen() {
  const navigation = useNavigation();
  const { addScore } = useScore(); 
  const { t } = useLanguage(); // hook de tradução

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 20 + 1);
    const b = Math.floor(Math.random() * 20 + 1);
    const op = ["+", "-", "*"][Math.floor(Math.random() * 3)];
    setQuestion(`${a} ${op} ${b}`);
    setAnswer(eval(`${a} ${op} ${b}`));
  };

  const playSound = async (type: "correct" | "wrong") => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(
        type === "correct" ? successSound : errorSound
      );
      await sound.playAsync();
    } catch (err) {
      console.warn(t('sound_error'), err);
    }
  };

  useEffect(() => {
    generateQuestion();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const handleSubmit = async () => {
    if (Number(input) === answer) {
      setScore((prev) => prev + 1);
      await playSound("correct");
    } else {
      await playSound("wrong");
    }
    setInput("");
    generateQuestion();
  };

  const handleEndGame = () => {
    addScore(score, undefined, undefined, t('turbo_mode')); 
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <MathBubblesBackground style={StyleSheet.absoluteFill} />
      <Text style={styles.timer}>⏱️ {t('time')}: {timeLeft}s</Text>
      <Text style={styles.title}>{t('turbo_mode')} ⚡</Text>
      <Text style={styles.question}>{question}</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSubmit}
        placeholderTextColor="#aaa"
        placeholder={t('type_answer')}
        editable={timeLeft > 0}
      />

      {timeLeft > 0 && (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <MathSymbolBackground />
          <Text style={styles.buttonText}>{t('submit')}</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.score}>{t('score')}: {score}</Text>

      {timeLeft === 0 && (
        <>
          <Text style={styles.finalScore}>🏆 {t('final_score')}: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={handleEndGame}>
            <Text style={styles.buttonText}>{t('end_back')}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
