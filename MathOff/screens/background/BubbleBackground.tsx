import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const maxBubbleHeight = height * 0.55;

const createBubble = () => ({
  left: Math.random() * width,
  size: Math.random() * 30 + 10,
  delay: Math.random() * 4000,
  duration: Math.random() * 4000 + 4000,
});

const Bubble = ({ left, size, delay, duration }: any) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -maxBubbleHeight,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

export default function BubbleBackground() {
  const bubbles = Array.from({ length: 15 }, createBubble);

  return (
    <View style={StyleSheet.absoluteFill}>
      {bubbles.map((props, index) => (
        <Bubble key={index} {...props} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: 'rgba(173, 216, 230, 0.4)',
  },
});
