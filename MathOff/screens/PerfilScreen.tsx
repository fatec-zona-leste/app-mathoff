import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { clearUserToken, clearUserEmail } from '../authSession';
import { useScore } from '../context/ScoreContext';
import styles from './styles/StylePerfil';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AnimatedGradientBackground from './background/AnimatedGradientBackground';


type RootParamList = {
  Signup: undefined;
  Login: undefined;
  Perfil: undefined;
};

type AuthNavigationProp = NativeStackNavigationProp<RootParamList>;

export default function PerfilScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const {
    scores,
    historico,
    clearScores,
    clearRecentScores
  } = useScore();

  const handleLogout = async () => {
    await clearUserToken();
    await clearUserEmail();
    navigation.replace('Login');
  };

  const totalJogos = historico.length;
  const maiorPontuacao = historico.length > 0 ? Math.max(...historico.map(s => s.pontos)) : 0;

  const confirmClearRecent = () => {
    Alert.alert(
      'Limpar lista de pontuações?',
      'Isso irá remover apenas os cards visíveis. As estatísticas continuarão salvas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', onPress: clearRecentScores, style: 'default' },
      ]
    );
  };

  const confirmClearAll = () => {
    Alert.alert(
      'Apagar tudo?',
      'Isso apagará todos os dados, incluindo estatísticas e histórico.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar tudo', onPress: clearScores, style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedGradientBackground />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>

      <Text style={styles.title}>👤 Perfil</Text>
      <Text style={styles.info}>Você está logado no MathOff.</Text>

      <Text style={styles.subtitle}>Histórico de Pontuação</Text>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.cardsContainer}
      >
        {scores.length === 0 ? (
          <Text style={styles.noScore}>Nenhuma pontuação registrada.</Text>
        ) : (
          scores.map((item, index) => (
            <Animated.View
              entering={FadeInUp.delay(index * 100)}
              key={index}
              style={styles.card}
            >
              <Text style={styles.cardText}>🧠 Jogo {index + 1}</Text>

              {item.modo ? (
                <Text style={styles.cardText}>Modo: {item.modo}</Text>
              ) : (
                <Text style={styles.cardText}>Nível: {item.nivel}</Text>
              )}

              <Text style={styles.cardText}>
                Operação: {item.operacao || '+ | - | * | ÷'}
              </Text>

              <Text style={styles.cardText}>
                Pontuação: {item.pontos} ponto{item.pontos !== 1 ? 's' : ''}
              </Text>
            </Animated.View>
          ))
        )}
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(300)} style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Suas Estatísticas</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{totalJogos}</Text>
            <Text style={styles.statsLabel}>Jogos</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{maiorPontuacao}</Text>
            <Text style={styles.statsLabel}>Maior Pontuação</Text>
          </View>
        </View>
        <Text style={styles.statsMotivation}>
          Obrigado por jogar o MathOff! Continue praticando e se divertindo!
        </Text>
      </Animated.View>

      {scores.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={confirmClearRecent}
          >
            <Text style={styles.clearText}>Limpar pontuações da lista</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} onPress={confirmClearAll}>
            <Text style={styles.dangerText}>Limpar tudo</Text>
          </TouchableOpacity>
        </>
      )}


      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://joaop0102.github.io/MathOff_Politicas/politica.html')}>
          <Text style={styles.linkText}>Política de Privacidade</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL('https://joaop0102.github.io/MathOff_Politicas/exclusao.html')}>
          <Text style={styles.linkText}>Política de Exclusão de Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

}
