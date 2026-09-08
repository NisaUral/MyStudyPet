import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing, Text } from 'react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

interface PetProps {
  size?: number;
  isStudying?: boolean;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedAccessory?: string;
}

const ACCESSORY_ICONS: Record<string, string> = {
  WIZARD_HAT: '🧙‍♂️',
  BASEBALL_CAP: '🧢',
  PARTY_HAT: '🎉',
  CROWN: '👑',
  BERET: '🎨',
  NERD_GLASSES: '👓',
  SUNGLASSES: '🕶️',
  MONOCLE: '🧐',
  BOWTIE: '🎀',
  SCARF: '🧣',
  MEDAL: '🏅',
};

export const ChickPet: React.FC<PetProps> = ({
  size = 100,
  isStudying = false,
  equippedHat,
  equippedGlasses,
  equippedAccessory,
}) => {
  const wingAnim = useRef(new Animated.Value(0)).current;
  const headAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Minik Kanat Çırpınma Döngüsü
    const wingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(wingAnim, {
          toValue: 1,
          duration: isStudying ? 450 : 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(wingAnim, {
          toValue: -1,
          duration: isStudying ? 450 : 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    wingLoop.start();

    // 2. Kafa ve Çalışma / Nefes Salınımı
    let headLoop: Animated.CompositeAnimation;
    if (isStudying) {
      headLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(headAnim, {
            toValue: 1.5,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(headAnim, {
            toValue: -1.5,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    } else {
      headAnim.setValue(0);
      headLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1.05,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    }
    headLoop.start();

    return () => {
      wingLoop.stop();
      headLoop.stop();
    };
  }, [isStudying]);

  const wingRotationLeft = wingAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-14deg', '14deg'],
  });

  const wingRotationRight = wingAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['14deg', '-14deg'],
  });

  const headRotation = headAnim.interpolate({
    inputRange: [-2, 2],
    outputRange: ['-4deg', '4deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 1. KATMAN: Turuncu Ayaklar (Sabit Zemin) */}
      <View style={styles.layer}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path d="M 45 96 L 41 104 M 45 96 L 45 105 M 45 96 L 49 104" stroke="#E66A2C" strokeWidth="2.4" strokeLinecap="round" />
          <Path d="M 75 96 L 71 104 M 75 96 L 75 105 M 75 96 L 79 104" stroke="#E66A2C" strokeWidth="2.4" strokeLinecap="round" />
        </Svg>
      </View>

      {/* 2. KATMAN: Kanatlar (Gövdenin Yanında Bağımsız Çırpınma) */}
      {/* Sol Kanat */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [
              { translateX: -size * 0.18 },
              { translateY: size * 0.08 },
              { rotate: wingRotationLeft },
              { translateX: size * 0.18 },
              { translateY: -size * 0.08 },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path
            d="M 36 68 C 24 64, 20 74, 30 82 C 34 85, 38 78, 36 68 Z"
            fill="#FEE440"
            stroke="#E0B624"
            strokeWidth="1.2"
          />
        </Svg>
      </Animated.View>

      {/* Sağ Kanat */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [
              { translateX: size * 0.18 },
              { translateY: size * 0.08 },
              { rotate: wingRotationRight },
              { translateX: -size * 0.18 },
              { translateY: -size * 0.08 },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path
            d="M 84 68 C 96 64, 100 74, 90 82 C 86 85, 82 78, 84 68 Z"
            fill="#FEE440"
            stroke="#E0B624"
            strokeWidth="1.2"
          />
        </Svg>
      </Animated.View>

      {/* 3. KATMAN: Yuvarlak Pofuduk Gövde (Nefes Alma Yaylanması) */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ scaleY: breatheAnim }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Circle cx="60" cy="72" r="30" fill="#FFF275" />
          {/* Göbek Işıltısı */}
          <Ellipse cx="60" cy="78" rx="20" ry="16" fill="#FFF8B5" />
        </Svg>
      </Animated.View>

      {/* 4. KATMAN: Kafa, Tepe Tüyü, Gaga ve Yanaklar */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ rotate: headRotation }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* Tepedeki Minik Kalp/Tüy Çıkıntısı */}
          <Path
            d="M 57 32 C 55 24, 60 22, 60 27 C 60 22, 65 24, 63 32 Z"
            fill="#FEE440"
            stroke="#E0B624"
            strokeWidth="1"
          />

          {/* İri Parlak Gözler */}
          <Circle cx="48" cy="56" r="3.8" fill="#1F1B18" />
          <Circle cx="49.5" cy="54.5" r="1.3" fill="#FFFFFF" />

          <Circle cx="72" cy="56" r="3.8" fill="#1F1B18" />
          <Circle cx="73.5" cy="54.5" r="1.3" fill="#FFFFFF" />

          {/* Turuncu Minik Gaga */}
          <Path d="M 55 62 L 65 62 L 60 69 Z" fill="#FF7B25" />
          <Path d="M 57 62 L 63 62 L 60 60 Z" fill="#E66A2C" />

          {/* Pastel Pembe Yanaklar */}
          <Circle cx="41" cy="64" r="4.5" fill="#FF8BA7" opacity={0.5} />
          <Circle cx="79" cy="64" r="4.5" fill="#FF8BA7" opacity={0.5} />
        </Svg>
      </Animated.View>

      

      {equippedGlasses && ACCESSORY_ICONS[equippedGlasses] && (
        <View style={[styles.accessoryAbsolute, { top: size * 0.34, left: size * 0.32 }]}>
          <Text style={{ fontSize: size * 0.32 }}>{ACCESSORY_ICONS[equippedGlasses]}</Text>
        </View>
      )}

      {equippedAccessory && ACCESSORY_ICONS[equippedAccessory] && (
        <View style={[styles.accessoryAbsolute, { top: size * 0.7, alignSelf: 'center' }]}>
          <Text style={{ fontSize: size * 0.28 }}>{ACCESSORY_ICONS[equippedAccessory]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessoryAbsolute: {
    position: 'absolute',
    zIndex: 10,
  },
});