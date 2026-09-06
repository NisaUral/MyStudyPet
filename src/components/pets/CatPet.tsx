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

export const CatPet: React.FC<PetProps> = ({
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
    // 1. Kedi Kuyruğu Salınım Döngüsü
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, {
          toValue: 1,
          duration: isStudying ? 700 : 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tailAnim, {
          toValue: -1,
          duration: isStudying ? 700 : 1000,
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
      tailLoop.stop();
      headLoop.stop();
    };
  }, [isStudying]);

  const tailRotation = tailAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-12deg', '12deg'],
  });

  const headRotation = headAnim.interpolate({
    inputRange: [-2, 2],
    outputRange: ['-4deg', '4deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 1. KATMAN: Kıvrımlı Kuyruk (Gövdenin Sağında) */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [
              { translateX: size * 0.22 },
              { translateY: size * 0.28 },
              { rotate: tailRotation },
              { translateX: -size * 0.22 },
              { translateY: -size * 0.28 },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path
            d="M 76 90 C 95 86, 102 65, 88 50 C 82 45, 80 52, 85 58 C 92 68, 86 80, 72 82 Z"
            fill="#E07A2B"
          />
        </Svg>
      </Animated.View>

      {/* 2. KATMAN: Gövde & Oturan Patiler */}
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
          <Ellipse cx="58" cy="84" rx="23" ry="20" fill="#E07A2B" />
          {/* Sırt Tekir Çizgileri */}
          <Path d="M 68 76 L 76 78 M 66 83 L 75 86" stroke="#B85510" strokeWidth="2" strokeLinecap="round" />
          {/* Göğüs Beyazlığı */}
          <Path
            d="M 46 76 C 52 86, 64 86, 70 76 C 66 84, 50 84, 46 76 Z"
            fill="#FFF9F2"
          />
          {/* Oturan Ön Patiler */}
          <Ellipse cx="48" cy="98" rx="6" ry="4" fill="#FFF9F2" />
          <Ellipse cx="66" cy="98" rx="6" ry="4" fill="#FFF9F2" />
        </Svg>
      </Animated.View>

      {/* 3. KATMAN: Kafa, Kulaklar ve Yüz */}
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
          <Path d="M 34 46 L 36 20 L 52 38 Z" fill="#E07A2B" />
          <Path d="M 38 42 L 39 26 L 48 37 Z" fill="#F8B195" />

          {/* Sağ Kulak */}
          <Path d="M 82 46 L 80 20 L 64 38 Z" fill="#E07A2B" />
          <Path d="M 78 42 L 77 26 L 68 37 Z" fill="#F8B195" />

          {/* Kafa Yuvarlağı */}
          <Circle cx="58" cy="54" r="25" fill="#E07A2B" />

          {/* Alın Tekir Çizgileri */}
          <Path d="M 58 35 L 58 41 M 54 37 L 55 42 M 62 37 L 61 42" stroke="#B85510" strokeWidth="1.8" strokeLinecap="round" />

          {/* Beyaz Yanak & Çene Alanı */}
          <Path
            d="M 38 56 C 40 68, 50 74, 58 74 C 66 74, 76 68, 78 56 C 78 48, 68 54, 58 54 C 48 54, 38 48, 38 56 Z"
            fill="#FFF9F2"
          />

          {/* İri Mavi Gözler */}
          <Circle cx="47" cy="52" r="4.2" fill="#2B5B84" />
          <Circle cx="46" cy="50" r="1.4" fill="#FFFFFF" />

          <Circle cx="69" cy="52" r="4.2" fill="#2B5B84" />
          <Circle cx="68" cy="50" r="1.4" fill="#FFFFFF" />

          {/* Pembe Minik Burun & Ağız */}
          <Path d="M 56 59 L 60 59 L 58 61 Z" fill="#F8B195" />
          <Path
            d="M 54 62 Q 58 65 62 62"
            stroke="#4A2E18"
            strokeWidth="1.1"
            fill="none"
          />

          {/* Bıyıklar */}
          <Path d="M 33 58 L 42 60 M 34 64 L 43 63" stroke="#4A2E18" strokeWidth="0.8" strokeLinecap="round" />
          <Path d="M 83 58 L 74 60 M 82 64 L 73 63" stroke="#4A2E18" strokeWidth="0.8" strokeLinecap="round" />

          {/* Pembe Yanak Allığı */}
          <Circle cx="40" cy="60" r="3.5" fill="#FF8B8B" opacity={0.4} />
          <Circle cx="76" cy="60" r="3.5" fill="#FF8B8B" opacity={0.4} />
        </Svg>
      </Animated.View>

      {/* 4. KATMAN: Aksesuarlar */}
      {equippedHat && ACCESSORY_ICONS[equippedHat] && (
        <View style={[styles.accessoryAbsolute, { top: -size * 0.08, left: size * 0.35 }]}>
          <Text style={{ fontSize: size * 0.36 }}>{ACCESSORY_ICONS[equippedHat]}</Text>
        </View>
      )}

      {equippedGlasses && ACCESSORY_ICONS[equippedGlasses] && (
        <View style={[styles.accessoryAbsolute, { top: size * 0.34, left: size * 0.32 }]}>
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