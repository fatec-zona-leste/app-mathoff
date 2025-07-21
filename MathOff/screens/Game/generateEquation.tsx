import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../styles/StyleGame';

const { width } = Dimensions.get('window');

const generateEquation = (level: number, operationType: string) => {
  let operations: string[];
  if (operationType === 'any') {
    operations = level === 1 ? ['+', '-'] : level === 2 ? ['+', '-', '*'] : ['+', '-', '*', '/'];
  } else {
    operations = [operationType];
  }

  const op = operations[Math.floor(Math.random() * operations.length)];

  let a: number, b: number;

  if (level === 1 && (op === '*' || op === '/')) {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;

    if (op === '/') {
      b = Math.floor(Math.random() * 10) + 1;
      const result = Math.floor(Math.random() * 10) + 1;
      a = b * result;
    }

  } else {
    a = Math.floor(Math.random() * (level * 10)) + 1;
    b = Math.floor(Math.random() * (level * 10)) + 1;

    if (op === '/') {
      a = a * b;
    }
  }

  const question = `${a} ${op} ${b}`;
  const answer = eval(question);
  return { question, answer };
};

export default function GameScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
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

  const handleWrongAnswer = () => {
    setLives((prev) => {
      const updated = prev - 1;
      if (updated <= 0) {
        setGameOverVisible(true);
      } else {
        newRound();
      }
      return updated;
    });

    Animated.sequence([
      Animated.timing(barColor, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.timing(barColor, { toValue: 0, duration: 150, useNativeDriver: false }),
      Animated.timing(barColor, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.timing(barColor, { toValue: 0, duration: 150, useNativeDriver: false }),
    ]).start();
  };

  const handleSubmit = () => {
    if (Number(input) === questionData.answer) {
      setScore(score + 1);
      newRound();
    } else {
      handleWrongAnswer();
    }
  };

  const renderLives = () => {
    return (
      <View style={styles.livesContainer}>
        {[...Array(3)].map((_, index) => (
          <View
            key={index}
            style={[styles.lifeDot, { opacity: index < lives ? 1 : 0.2 }]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        placeholder="Digite a resposta"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
