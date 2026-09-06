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

export const RabbitPet: React.FC<PetProps> = ({
  size = 100,
  isStudying = false,
  equippedHat,
  equippedGlasses,
  equippedAccessory,
}) => {
  const earAnim = useRef(new Animated.Value(0)).current;
  const headAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Kulakların Seğirme / Salınım Döngüsü
    const earLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(earAnim, {
          toValue: 1,
          duration: isStudying ? 500 : 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(earAnim, {
          toValue: -1,
          duration: isStudying ? 500 : 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    earLoop.start();

    // 2. Kafa & Nefes Alma Döngüsü
    let headLoop: Animated.CompositeAnimation;
    if (isStudying) {
      headLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(headAnim, {
            toValue: 1.5,
            duration: 750,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(headAnim, {
            toValue: -1.5,
            duration: 750,
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
            duration: 1300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 1300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    }
    headLoop.start();

    return () => {
      earLoop.stop();
      headLoop.stop();
    };
  }, [isStudying]);

  const earRotationLeft = earAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-6deg', '6deg'],
  });

  const earRotationRight = earAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['6deg', '-6deg'],
  });

  const headRotation = headAnim.interpolate({
    inputRange: [-2, 2],
    outputRange: ['-4deg', '4deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 1. KATMAN: Gövde & Oturan Pofuduk Patiler */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ scaleY: breatheAnim }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* Ana Gövde (Açık krem) */}
          <Ellipse cx="60" cy="85" rx="26" ry="22" fill="#F4E4D3" />
          {/* Beyaz Göbek */}
          <Ellipse cx="60" cy="86" rx="18" ry="16" fill="#FDFBF7" />

          {/* Oturan Arka Patiler */}
          <Ellipse cx="38" cy="100" rx="9" ry="6" fill="#E8D1BD" />
          <Ellipse cx="82" cy="100" rx="9" ry="6" fill="#E8D1BD" />
          {/* Minik Ön Patiler */}
          <Ellipse cx="53" cy="98" rx="5" ry="4" fill="#FDFBF7" />
          <Ellipse cx="67" cy="98" rx="5" ry="4" fill="#FDFBF7" />
        </Svg>
      </Animated.View>

      {/* 2. KATMAN: Baş, Gözler ve Seğiren Kulaklar */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ rotate: headRotation }],
          },
        ]}
      >
        {/* Sol Kulak */}
        <Animated.View
          style={[
            styles.layer,
            {
              transform: [
                { translateX: -size * 0.12 },
                { translateY: size * 0.1 },
                { rotate: earRotationLeft },
                { translateX: size * 0.12 },
                { translateY: -size * 0.1 },
              ],
            },
          ]}
        >
          <Svg width={size} height={size} viewBox="0 0 120 120">
            <Path
              d="M 46 48 C 36 32, 34 14, 45 10 C 54 8, 56 26, 52 48 Z"
              fill="#E8D1BD"
            />
            {/* Kulak İçi Pembe */}
            <Path
              d="M 45 42 C 40 30, 39 18, 45 14 C 49 14, 50 26, 48 42 Z"
              fill="#F9D4C7"
            />
          </Svg>
        </Animated.View>

        {/* Sağ Kulak */}
        <Animated.View
          style={[
            styles.layer,
            {
              transform: [
                { translateX: size * 0.12 },
                { translateY: size * 0.1 },
                { rotate: earRotationRight },
                { translateX: -size * 0.12 },
                { translateY: -size * 0.1 },
              ],
            },
          ]}
        >
          <Svg width={size} height={size} viewBox="0 0 120 120">
            <Path
              d="M 74 48 C 84 32, 86 14, 75 10 C 66 8, 64 26, 68 48 Z"
              fill="#E8D1BD"
            />
            {/* Kulak İçi Pembe */}
            <Path
              d="M 75 42 C 80 30, 81 18, 75 14 C 71 14, 70 26, 72 42 Z"
              fill="#F9D4C7"
            />
          </Svg>
        </Animated.View>

        {/* Baş Yuvarlağı & Sevimli Yüz */}
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Circle cx="60" cy="56" r="23" fill="#F4E4D3" />
          {/* Yanak Pofudukluğu */}
          <Ellipse cx="45" cy="62" rx="10" ry="8" fill="#FDFBF7" />
          <Ellipse cx="75" cy="62" rx="10" ry="8" fill="#FDFBF7" />

          {/* Gözler */}
          <Circle cx="48" cy="54" r="3.6" fill="#2E231F" />
          <Circle cx="49.2" cy="52.8" r="1.2" fill="#FFFFFF" />

          <Circle cx="72" cy="54" r="3.6" fill="#2E231F" />
          <Circle cx="73.2" cy="52.8" r="1.2" fill="#FFFFFF" />

          {/* Minik Pembe Burun ve Ağız */}
          <Path d="M 58 61 L 62 61 L 60 63 Z" fill="#E58B8B" />
          <Path
            d="M 57 65 Q 60 67 63 65"
            stroke="#2E231F"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Pembe Yanak Allıkları */}
          <Circle cx="42" cy="61" r="4" fill="#FF8B8B" opacity={0.4} />
          <Circle cx="78" cy="61" r="4" fill="#FF8B8B" opacity={0.4} />
        </Svg>
      </Animated.View>

      {/* 3. KATMAN: Aksesuarlar */}
      {equippedHat && ACCESSORY_ICONS[equippedHat] && (
        <View style={[styles.accessoryAbsolute, { top: -size * 0.12, left: size * 0.35 }]}>
          <Text style={{ fontSize: size * 0.36 }}>{ACCESSORY_ICONS[equippedHat]}</Text>
        </View>
      )}

      {equippedGlasses && ACCESSORY_ICONS[equippedGlasses] && (
        <View style={[styles.accessoryAbsolute, { top: size * 0.36, left: size * 0.33 }]}>
          <Text style={{ fontSize: size * 0.3 }}>{ACCESSORY_ICONS[equippedGlasses]}</Text>
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