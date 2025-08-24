import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "./styles/StyleOnboarding";
import MathBubblesBackground from './background/MathBubblesBackground';
import MathSymbolBackground from './background/MathSymbolBackground';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to MathOff!',
    description: 'Challenge your mind with quick calculations and improve your mental agility.',
    image: require('../assets/img1.png'),
  },
  {
    key: '2',
    title: 'Three challenge levels',
    description: 'Choose between easy, medium or hard and advance your logical reasoning!',
    image: require('../assets/img2.png'),
  },
  {
    key: '3',
    title: 'Various operations',
    description: 'Practice addition, subtraction, multiplication or division — you choose!',
    image: require('../assets/img3.png'),
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('onboardingVisto', 'true');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.slide}>
      {item.image && <Image source={item.image} style={styles.image} resizeMode="contain" />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <MathBubblesBackground style={StyleSheet.absoluteFill} />

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={{ flex: 1 }}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: isActive ? 'rgba(173, 216, 230, 0.7)' : '#ccc' },
              ]}
            />
          );
        })}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <MathSymbolBackground />
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Começar' : 'Avançar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
