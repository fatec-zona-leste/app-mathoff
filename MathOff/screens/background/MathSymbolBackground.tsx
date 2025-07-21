import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

const symbolPool = ['+', '-', '×', '÷', '=', '≠', '%', '√', '^', 'π', '∞', '∑', '∫'];

const SYMBOL_COUNT = 10;

export default function MathSymbolBackground() {
  const [symbols, setSymbols] = useState(generateSymbols());
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSymbols(generateSymbols());
        animate();
      });
    };

    animate();

    return () => {
      opacityAnim.stopAnimation();
    };
  }, []);

  function generateSymbols() {
    return Array.from({ length: SYMBOL_COUNT }, () => {
      const symbol = symbolPool[Math.floor(Math.random() * symbolPool.length)];
      return {
        symbol,
        top: Math.random() * 40,
        left: Math.random() * 140,
        fontSize: 12 + Math.random() * 10,
      };
    });
  }

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: opacityAnim }]}>
        {symbols.map((item, index) => (
          <Text
            key={index}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              fontSize: item.fontSize,
              color: 'rgba(0, 0, 0, 0.08)',
            }}
          >
            {item.symbol}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 10,
  },
});
