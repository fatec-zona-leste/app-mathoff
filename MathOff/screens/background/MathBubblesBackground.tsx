import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

const MathBubblesBackground = () => {
  const bubbles = useRef(
    [...Array(20)].map(() => ({
      x: Math.random() * width, 
      y: new Animated.Value(height + 50),
      delay: Math.random() * 3000,
      duration: 4000 + Math.random() * 3000, 
      symbol: ['+', '-', '*', '/'][Math.floor(Math.random() * 4)],
      size: 18 + Math.random() * 12,       
      opacity: 0.3 + Math.random() * 0.7,
    }))
  ).current;

  useEffect(() => {
    bubbles.forEach((bubble) => {
      const animate = () => {
        bubble.y.setValue(height + 50);
        Animated.timing(bubble.y, {
          toValue: height / 2 + Math.random() * (height / 4),
          duration: bubble.duration,
          delay: bubble.delay,
          useNativeDriver: true,
        }).start(() => animate());
      };
      animate();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      {bubbles.map((bubble, i) => (
        <Animated.Text
          key={i}
          style={{
            position: 'absolute',
            left: bubble.x,
            fontSize: bubble.size,
            color: 'rgba(173, 216, 230, 0.7)',
            opacity: bubble.opacity,
            transform: [{ translateY: bubble.y }],
          }}
        >
          {bubble.symbol}
        </Animated.Text>
      ))}
    </View>
  );
};

export default MathBubblesBackground;
