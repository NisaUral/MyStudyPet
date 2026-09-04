import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { PetType } from '../types';
import { PET_ASSETS } from '../constants/petAssets';

interface Props {
  type: PetType;
  size?: number;
  isStudying?: boolean;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedAccessory?: string;
}

export const PetAvatar: React.FC<Props> = ({
  type,
  size = 80,
  isStudying = false,
  equippedHat,
  equippedGlasses,
}) => {
  // Animasyon Değerleri
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateVal = useRef(new Animated.Value(0)).current;
  const scaleY = useRef(new Animated.Value(1)).current;

  const meta = PET_ASSETS[type] || PET_ASSETS.CAT;

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation;

    if (isStudying) {
      // 1. Çalışma Animasyonu: Not alma / düşünme temposunda hafif ritmik kafa sallama
      animLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(rotateVal, {
            toValue: 1, // Sağa hafif eğil
            duration: 900,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rotateVal, {
            toValue: -1, // Sola hafif eğil
            duration: 900,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    } else {
      // 2. Bekleme (Idle) Animasyonu: Yumuşak nefes alma ve hafif yükselip alçalma
      rotateVal.setValue(0);
      animLoop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -4,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(scaleY, {
              toValue: 1.03,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(scaleY, {
              toValue: 1,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    }

    animLoop.start();

    return () => animLoop.stop();
  }, [isStudying]);

  // Rotasyon interpolasyonu (-3 derece ile +3 derece arası tatlı bir salınım)
  const spin = rotateVal.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.spriteContainer,
          {
            transform: [{ translateY }, { rotate: spin }, { scaleY }],
          },
        ]}
      >
        {/* Karakterin Kendisi */}
        <Image
          source={meta.source}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />

        {/* Aksesuar Katmanı: Şapka */}
        {equippedHat && (
          <View
            style={[
              styles.accessorySlot,
              {
                top: meta.hatOffset.top,
                left: meta.hatOffset.left,
              },
            ]}
          >
            {/* Şapka ikonu/görseli buraya yerleşir */}
          </View>
        )}

        {/* Aksesuar Katmanı: Gözlük */}
        {equippedGlasses && (
          <View
            style={[
              styles.accessorySlot,
              {
                top: meta.glassesOffset.top,
                left: meta.glassesOffset.left,
              },
            ]}
          >
            {/* Gözlük ikonu/görseli buraya yerleşir */}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spriteContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessorySlot: {
    position: 'absolute',
  },
});