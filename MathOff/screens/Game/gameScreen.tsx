import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../styles/StyleGame';
import MathBubblesBackground from '../background/MathBubblesBackground';
import MathSymbolBackground from '../background/MathSymbolBackground';
import { useScore } from '../../context/ScoreContext'; 
import { Audio } from 'expo-av';

const successSound = require('../../assets/sounds/acerto.mp3');
const errorSound = require('../../assets/sounds/erro.mp3');

const { width } = Dimensions.get('window');

const generateEquation = (level: number, operationType: string) => {
  let operations: string[];

  if (operationType === 'any') {
    operations = level === 1 ? ['+', '-'] : level === 2 ? ['+', '-', '*'] : ['+', '-', '*', '/'];
  } else {
    operations = [operationType];
  }

  const op = operations[Math.floor(Math.random() * operations.length)];
  let a = Math.floor(Math.random() * (level * 10)) + 1;
  let b = Math.floor(Math.random() * (level * 10)) + 1;

  if (op === '/') {
    a = a * b;
  }

  const question = `${a} ${op} ${b}`;
  const answer = eval(question);
  return { question, answer };
};

export default function GameScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { addScore } = useScore(); 

  const level = route.params.level;
  const operationType = route.params.operationType || 'any';

  const [questionData, setQuestionData] = useState(generateEquation(level, operationType));
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(6000 - (level - 1) * 1000);
  const [gameOverVisible, setGameOverVisible] = useState(false);

  const progress = useRef(new Animated.Value(width)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const barColor = useRef(new Animated.Value(0)).current;

  // Função para tocar som
  const playSound = async (soundFile: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {

    }
  };

  const startTimer = () => {
    progress.setValue(width);
    Animated.timing(progress, {
      toValue: 0,
      duration: timeLeft,
      useNativeDriver: false,
    }).start();

    timeoutRef.current = setTimeout(() => {
      handleWrongAnswer();
    }, timeLeft);
  };

  const newRound = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setInput('');
    setQuestionData(generateEquation(level, operationType));
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [questionData]);

  useEffect(() => {
    if (gameOverVisible && score > 0) {
      addScore(score, level, operationType);
    }
  }, [gameOverVisible]);

  const handleWrongAnswer = () => {
    playSound(errorSound);
    Animated.sequence([
      Animated.timing(barColor, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.timing(barColor, { toValue: 0, duration: 150, useNativeDriver: false }),
      Animated.timing(barColor, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.timing(barColor, { toValue: 0, duration: 150, useNativeDriver: false }),
    ]).start();

    setLives((prev) => {
      const updated = prev - 1;
      if (updated <= 0) {
        setGameOverVisible(true);
      } else {
        newRound();
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    if (Number(input) === questionData.answer) {
      playSound(successSound);
      setScore(score + 1);
      newRound();
    } else {
      handleWrongAnswer();
    }
  };

  const renderLives = () => (
    <View style={styles.livesContainer}>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={[styles.lifeDot, { opacity: index < lives ? 1 : 0.2 }]} />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <MathBubblesBackground style={StyleSheet.absoluteFill} />
      {renderLives()}
      <Text style={styles.title}>Nível {level}</Text>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progress,
            backgroundColor: barColor.interpolate({
              inputRange: [0, 1],
              outputRange: ['#00cc88', 'red'],
            }),
          },
        ]}
      />
      <Text style={styles.question}>{questionData.question}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSubmit}
        placeholderTextColor="#aaa"
        placeholder="Digite a resposta"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>Responder</Text>
      </TouchableOpacity>
      <Text style={styles.score}>Pontuação: {score}</Text>

      <Modal visible={gameOverVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Fim de Jogo!</Text>
            <Text style={styles.modalScore}>Pontuação: {score}</Text>
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Voltar ao menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}