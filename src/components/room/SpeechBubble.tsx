import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string;
}

export const SpeechBubble: React.FC<Props> = ({ message }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        {
          transform: [{ scale }, { translateY }],
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.bubble}>
        <Text style={styles.bubbleText} numberOfLines={2}>
          {message}
        </Text>
      </View>
      {/* Baloncuğun sivri ucu */}
      <View style={styles.tail} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'absolute',
    top: -45,
    alignItems: 'center',
    zIndex: 1050,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#6C5CE7',
    maxWidth: 130,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  bubbleText: {
    fontSize: 11,
    color: '#2D3436',
    fontWeight: '600',
    textAlign: 'center',
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#6C5CE7',
    marginTop: -0.5,
  },
});