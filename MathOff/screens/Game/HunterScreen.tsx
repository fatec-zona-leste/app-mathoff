import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/StyleGame';
import MathSymbolBackground from "../background/MathSymbolBackground"; 
import LupaBackGround from "../background/LupaBackground"; 
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useScore } from '../../context/ScoreContext'; 
import { useLanguage } from '../../locales/translater';

const successSound = require('../../assets/sounds/acerto.mp3');
const errorSound = require('../../assets/sounds/erro.mp3');

const generateEquationWithError = (level: number) => {
  const operations = ['+', '-', '*', '/'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let a = Math.floor(Math.random() * (level * 10)) + 1;
  let b = Math.floor(Math.random() * (level * 10)) + 1;
  if (op === '/') a = a * b;
  const correctAnswer = eval(`${a} ${op} ${b}`);
  const hasError = Math.random() < 0.5;
  let displayedAnswer = correctAnswer;
  if (hasError) {
    const delta = Math.floor(Math.random() * 2) + 1;
    displayedAnswer = Math.random() < 0.5 ? correctAnswer + delta : correctAnswer - delta;
  }
  const question = `${a} ${op} ${b} = ${displayedAnswer}`;
  return { question, correctAnswer, displayedAnswer, hasError };
};

export default function ErrorHuntMode() {
  const navigation = useNavigation();
  const { addScore } = useScore(); 
  const { t } = useLanguage();

  const [level] = useState(2);
  const [data, setData] = useState(generateEquationWithError(level));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const maxQuestions = 10;

  const playSound = async (soundFile: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) {}
  };

  const handleAnswer = (userSaysError: boolean) => {
    if (userSaysError === data.hasError) {
      playSound(successSound);
      setFeedback('✅ ' + t('correct'));
      setScore(prev => prev + 1);
    } else {
      playSound(errorSound);
      setFeedback('❌ ' + t('wrong'));
    }
    setQuestionsAnswered(prev => prev + 1);
    setTimeout(() => {
      setFeedback(null);
      setData(generateEquationWithError(level));
    }, 1000);
  };

  useEffect(() => {
    if (questionsAnswered >= maxQuestions) {
      addScore(score, undefined, undefined, t('error_hunt'));
      navigation.goBack();
    }
  }, [questionsAnswered]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('error_hunt')}</Text>
      <LupaBackGround />
      <Text style={styles.question}>{data.question}</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleAnswer(false)}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t('correct')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleAnswer(true)}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>{t('is_wrong')}</Text>
      </TouchableOpacity>

      <Text style={styles.score}>{t('score')}: {score}</Text>
      {feedback && <Text style={styles.feedback}>{feedback}</Text>}
    </View>
  );
}
