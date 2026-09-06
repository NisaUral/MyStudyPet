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

export const ChickenPet: React.FC<PetProps> = ({
  size = 100,
  isStudying = false,
  equippedHat,
  equippedGlasses,
  equippedAccessory,
}) => {
  const tailAnim = useRef(new Animated.Value(0)).current;
  const headAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Minik Kuyruk Salınımı
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, {
          toValue: 1,
          duration: isStudying ? 500 : 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tailAnim, {
          toValue: -1,
          duration: isStudying ? 500 : 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    tailLoop.start();

    // 2. Kafa Sallama & Nefes Alma Döngüsü
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
            toValue: 1.04,
            duration: 1250,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 1250,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    }
    headLoop.start();

    return () => {
      tailLoop.stop();
      headLoop.stop();
    };
  }, [isStudying]);

  const tailRotation = tailAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-8deg', '8deg'],
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
          <Path
            d="M 46 95 L 42 104 M 46 95 L 46 105 M 46 95 L 50 104"
            stroke="#E66A2C"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <Path
            d="M 72 95 L 68 104 M 72 95 L 72 105 M 72 95 L 76 104"
            stroke="#E66A2C"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {/* 2. KATMAN: Kuyruk Tüyleri (Gövdenin Sağ Arkasında) */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [
              { translateX: size * 0.28 },
              { translateY: size * 0.18 },
              { rotate: tailRotation },
              { translateX: -size * 0.28 },
              { translateY: -size * 0.18 },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path
            d="M 82 72 C 96 66, 102 75, 96 84 C 92 89, 84 86, 82 80 Z"
            fill="#8B5A2B"
          />
          <Path
            d="M 85 70 C 95 62, 100 68, 95 76"
            stroke="#6E441F"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* 3. KATMAN: Tombik Gövde (Nefes Alma Yaylanması) */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ scaleY: breatheAnim }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* Ana Gövde */}
          <Ellipse cx="58" cy="80" rx="28" ry="24" fill="#FFF8E7" stroke="#E6D3B3" strokeWidth="1" />
          {/* Kanat Çizgisi Kıvrımı */}
          <Path
            d="M 72 74 C 76 78, 76 86, 68 88"
            stroke="#C49A6C"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* 4. KATMAN: Kafa, Kırmızı İbik, Sakal, Gaga ve Gülen Gözler */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ rotate: headRotation }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* Üstteki Kırmızı İbik */}
          <Path
            d="M 48 34 C 44 24, 52 20, 56 26 C 58 18, 68 18, 68 26 C 72 20, 80 24, 76 34 Z"
            fill="#E63946"
          />

          {/* Kafa Yuvarlağı */}
          <Circle cx="58" cy="52" r="25" fill="#FFF8E7" stroke="#E6D3B3" strokeWidth="1" />

          {/* Gülen/Mutlu Kapalı Gözler */}
          <Path
            d="M 43 51 C 45 46, 51 46, 53 51"
            stroke="#2B2D42"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 65 51 C 67 46, 73 46, 75 51"
            stroke="#2B2D42"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Turuncu Gaga */}
          <Path d="M 52 56 L 66 56 L 59 64 Z" fill="#F4A261" />
          <Path d="M 54 56 L 64 56 L 59 54 Z" fill="#E76F51" />

          {/* Gaganın Altındaki Kırmızı Sakal (Wattle) */}
          <Path
            d="M 54 64 C 50 68, 52 74, 58 74 C 60 74, 60 68, 58 64 Z"
            fill="#E63946"
          />
          <Path
            d="M 64 64 C 68 68, 66 74, 60 74 C 58 74, 58 68, 60 64 Z"
            fill="#D62828"
          />

          {/* Sevimli Pembe Allıklar */}
          <Circle cx="39" cy="58" r="4.5" fill="#FF8BA7" opacity={0.55} />
          <Circle cx="79" cy="58" r="4.5" fill="#FF8BA7" opacity={0.55} />
        </Svg>
      </Animated.View>

      {/* 5. KATMAN: Aksesuarlar */}
      {equippedHat && ACCESSORY_ICONS[equippedHat] && (
        <View style={[styles.accessoryAbsolute, { top: -size * 0.1, left: size * 0.35 }]}>
          <Text style={{ fontSize: size * 0.36 }}>{ACCESSORY_ICONS[equippedHat]}</Text>
        </View>
      )}

      {equippedGlasses && ACCESSORY_ICONS[equippedGlasses] && (
        <View style={[styles.accessoryAbsolute, { top: size * 0.32, left: size * 0.32 }]}>
          <Text style={{ fontSize: size * 0.32 }}>{ACCESSORY_ICONS[equippedGlasses]}</Text>
        </View>
      )}

      {equippedAccessory && ACCESSORY_ICONS[equippedAccessory] && (
        <View style={[styles.accessoryAbsolute, { top: size * 0.68, alignSelf: 'center' }]}>
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