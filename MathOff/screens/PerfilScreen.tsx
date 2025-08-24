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
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useScore } from '../context/ScoreContext';
import styles from './styles/StylePerfil';
import AnimatedGradientBackground from './background/AnimatedGradientBackground';
import { useLanguage } from '../locales/translater';

type RootParamList = {
  Signup: undefined;
  Login: undefined;
  Perfil: undefined;
};

type AuthNavigationProp = NativeStackNavigationProp<RootParamList>;

export default function PerfilScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { t } = useLanguage();

  const { scores, clearScores, clearRecentScores } = useScore();

  const handleLogout = async () => {
    // aqui você pode chamar funções para limpar token/email
    navigation.replace('Login');
  };

  const totalJogos = scores.length;
  const maiorPontuacao =
    scores.length > 0 ? Math.max(...scores.map((s) => s.pontos)) : 0;

  const confirmClearRecent = () => {
    Alert.alert(
      t('clear_list_title'),
      t('clear_list_message'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('clear'), onPress: clearRecentScores },
      ]
    );
  };

  const confirmClearAll = () => {
    Alert.alert(
      t('clear_all_title'),
      t('clear_all_message'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('clear_all'), onPress: clearScores, style: 'destructive' },
      ]
    );
  };

  const renderPoints = (pontos: number) => {
    // se quiser suportar plurais
    return pontos === 1
      ? t('points_singular', { count: pontos })
      : t('points_plural', { count: pontos });
  };

  return (
    <View style={styles.container}>
      <AnimatedGradientBackground />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>{t('logout')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>👤 {t('profile')}</Text>
      <Text style={styles.info}>{t('logged_in_info')}</Text>

      <Text style={styles.subtitle}>{t('score_history')}</Text>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.cardsContainer}
      >
        {scores.length === 0 ? (
          <Text style={styles.noScore}>{t('no_scores')}</Text>
        ) : (
          scores.map((item, index) => (
            <Animated.View
              entering={FadeInUp.delay(index * 100)}
              key={index}
              style={styles.card}
            >
              <Text style={styles.cardText}>
                🧠 {t('game')} {index + 1}
              </Text>

              {item.modo ? (
                <Text style={styles.cardText}>
                  {t('mode')}: {item.modo}
                </Text>
              ) : (
                <Text style={styles.cardText}>
                  {t('level')}: {item.nivel}
                </Text>
              )}

              <Text style={styles.cardText}>
                {t('operation')}: {item.operacao || '+ | - | * | ÷'}
              </Text>

              <Text style={styles.cardText}>
                {t('points')}: {renderPoints(item.pontos)}
              </Text>
            </Animated.View>
          ))
        )}
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(300)} style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 {t('your_stats')}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{totalJogos}</Text>
            <Text style={styles.statsLabel}>{t('games')}</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{maiorPontuacao}</Text>
            <Text style={styles.statsLabel}>{t('highest_score')}</Text>
          </View>
        </View>
        <Text style={styles.statsMotivation}>{t('profile_motivation')}</Text>
      </Animated.View>

      {scores.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={confirmClearRecent}
          >
            <Text style={styles.clearText}>{t('clear_list')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} onPress={confirmClearAll}>
            <Text style={styles.dangerText}>{t('clear_all')}</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.linksContainer}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://joaop0102.github.io/MathOff_Politicas/politica.html'
            )
          }
        >
          <Text style={styles.linkText}>{t('privacy_policy')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://joaop0102.github.io/MathOff_Politicas/exclusao.html'
            )
          }
        >
          <Text style={styles.linkText}>{t('account_deletion_policy')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
