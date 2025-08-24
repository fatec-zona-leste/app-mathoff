import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet, // ⚡ corrigido
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/StyleGame';
import MathBubblesBackground from '../background/MathBubblesBackground';
import MathSymbolBackground from '../background/MathSymbolBackground';
import { Audio } from 'expo-av';
import { useScore } from '../../context/ScoreContext'; 
import { useLanguage } from '../../locales/translater';

const successSound = require('../../assets/sounds/acerto.mp3');
const errorSound = require('../../assets/sounds/erro.mp3');

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
  if (op === '/') a = a * b;
  const question = `${a} ${op} ${b}`;
  const answer = eval(question);
  return { question, answer };
};

export default function RelaxScreen() {
  const navigation = useNavigation();
  const { addScore } = useScore(); 
  const { t } = useLanguage();

  const level = 2;
  const operationType = 'any';

  const [questionData, setQuestionData] = useState(generateEquation(level, operationType));
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [counter, setCounter] = useState(0);
  const maxQuestions = 10;

  const bgAnim = useRef(new Animated.Value(0)).current;
  const [targetColor, setTargetColor] = useState<'green' | 'red' | null>(null);

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
      console.warn('Erro ao reproduzir som', e);
    }
  };

  const animateBackground = (toValue: number, onEnd?: () => void) => {
    Animated.timing(bgAnim, {
      toValue,
      duration: 1500,
      useNativeDriver: false,
    }).start(() => {
      if (onEnd) onEnd();
    });
  };

  const handleSubmit = () => {
    if (Number(input) === questionData.answer) {
      playSound(successSound);
      setScore(score + 1);
      setFeedback('✅ ' + t('correct'));
      setTargetColor('green');
    } else {
      playSound(errorSound);
      setFeedback(`❌ ${t('wrong')}: ${questionData.answer}`);
      setTargetColor('red');
    }

    setCounter(prev => prev + 1);

    animateBackground(1);
    setTimeout(() => {
      setFeedback(null);
      animateBackground(0, () => setTargetColor(null));
    }, 1500);

    setInput('');
    setQuestionData(generateEquation(level, operationType));
  };

  useEffect(() => {
    if (counter >= maxQuestions) {
      addScore(score, undefined, undefined, t('relax_mode')); 
      if (navigation.canGoBack()) navigation.goBack();
    }
  }, [counter]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange:
      targetColor === 'green'
        ? ['rgba(255,255,255,1)', 'rgba(128, 255, 128, 0.3)']
        : targetColor === 'red'
        ? ['rgba(255,255,255,1)', 'rgba(255, 129, 129, 0.3)']
        : ['rgba(255,255,255,1)', 'rgba(255,255,255,1)'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <MathBubblesBackground style={StyleSheet.absoluteFill} />
      <Text style={styles.title}>{t('relax_mode')}</Text>
      <Text style={styles.question}>{questionData.question}</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSubmit}
        placeholder={t('type_answer')}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t('submit')}</Text>
      </TouchableOpacity>

      <Text style={styles.score}>{t('score')}: {score}</Text>
      {feedback && <Text style={styles.feedback}>{feedback}</Text>}
    </Animated.View>
  );
}
