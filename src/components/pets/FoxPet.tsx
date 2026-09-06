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

export const FoxPet: React.FC<PetProps> = ({
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
    // 1. Ritmik Kuyruk Sallama Döngüsü
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tailAnim, {
          toValue: -1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    tailLoop.start();

    // 2. Kafa & Nefes Alma Döngüsü
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
      tailLoop.stop();
      headLoop.stop();
    };
  }, [isStudying]);

  const tailRotation = tailAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-14deg', '14deg'],
  });

  const headRotation = headAnim.interpolate({
    inputRange: [-2, 2],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 1. KATMAN: Canlı Sallanan Kuyruk */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [
              { translateX: size * 0.12 },
              { translateY: size * 0.25 },
              { rotate: tailRotation },
              { translateX: -size * 0.12 },
              { translateY: -size * 0.25 },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path
            d="M 72 88 C 95 85, 115 65, 102 42 C 92 45, 84 62, 70 78 Z"
            fill="#E06C38"
          />
          <Path
            d="M 102 42 C 110 50, 106 60, 96 64 C 92 56, 96 46, 102 42 Z"
            fill="#FDFBF7"
          />
        </Svg>
      </Animated.View>

      {/* 2. KATMAN: Gövde & Patiler (Nefes Alma Yaylanması) */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ scaleY: breatheAnim }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Ellipse cx="58" cy="84" rx="24" ry="20" fill="#E06C38" />
          <Path
            d="M 44 75 C 50 88, 66 88, 72 75 C 68 84, 48 84, 44 75 Z"
            fill="#FDFBF7"
          />
          <Ellipse cx="48" cy="98" rx="6" ry="5" fill="#3D2619" />
          <Ellipse cx="68" cy="98" rx="6" ry="5" fill="#3D2619" />
        </Svg>
      </Animated.View>

      {/* 3. KATMAN: Baş & Kulaklar (Ders Modunda Kafa Sallama) */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ rotate: headRotation }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* Sol Kulak */}
          <Path d="M 32 46 L 38 18 L 52 38 Z" fill="#E06C38" />
          <Path d="M 37 40 L 40 25 L 48 36 Z" fill="#3D2619" />

          {/* Sağ Kulak */}
          <Path d="M 84 46 L 78 18 L 64 38 Z" fill="#E06C38" />
          <Path d="M 79 40 L 76 25 L 68 36 Z" fill="#3D2619" />

          {/* Baş Yuvarlağı */}
          <Circle cx="58" cy="52" r="26" fill="#E06C38" />

          {/* Beyaz Yanak Maskesi */}
          <Path
            d="M 32 54 C 34 68, 48 74, 58 74 C 68 74, 82 68, 84 54 C 84 46, 72 52, 58 52 C 44 52, 32 46, 32 54 Z"
            fill="#FDFBF7"
          />

          {/* Gözler & Işıltılar */}
          <Circle cx="47" cy="50" r="4" fill="#2E231F" />
          <Circle cx="48.5" cy="48.5" r="1.3" fill="#FFFFFF" />

          <Circle cx="69" cy="50" r="4" fill="#2E231F" />
          <Circle cx="70.5" cy="48.5" r="1.3" fill="#FFFFFF" />

          {/* Burun & Ağız */}
          <Ellipse cx="58" cy="58" rx="3" ry="2.2" fill="#2E231F" />
          <Path
            d="M 55 61 Q 58 64 61 61"
            stroke="#2E231F"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Allıklar */}
          <Circle cx="40" cy="58" r="4" fill="#FF8B8B" opacity={0.45} />
          <Circle cx="76" cy="58" r="4" fill="#FF8B8B" opacity={0.45} />
        </Svg>
      </Animated.View>

      {/* 4. KATMAN: Aksesuarlar */}
      {equippedHat && ACCESSORY_ICONS[equippedHat] && (
        <View style={[styles.accessoryAbsolute, { top: -size * 0.08, left: size * 0.35 }]}>
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
