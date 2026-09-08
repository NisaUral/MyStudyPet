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

export const MonkeyPet: React.FC<PetProps> = ({
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
    // 1. Spiral Kuyruk Salınımı
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, {
          toValue: 1,
          duration: isStudying ? 600 : 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tailAnim, {
          toValue: -1,
          duration: isStudying ? 600 : 900,
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
    outputRange: ['-12deg', '12deg'],
  });

  const headRotation = headAnim.interpolate({
    inputRange: [-2, 2],
    outputRange: ['-4deg', '4deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 1. KATMAN: Kıvrık Spiral Kuyruk (Gövdenin Sağında) */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [
              { translateX: size * 0.22 },
              { translateY: size * 0.25 },
              { rotate: tailRotation },
              { translateX: -size * 0.22 },
              { translateY: -size * 0.25 },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path
            d="M 68 88 C 82 86, 96 82, 92 68 C 88 56, 75 58, 77 66 C 79 72, 86 70, 84 66"
            stroke="#965D34"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* 2. KATMAN: Gövde, Karın & Oturan Ayaklar */}
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
          <Ellipse cx="58" cy="85" rx="22" ry="19" fill="#965D34" />
          {/* Açık Renk Karın */}
          <Ellipse cx="58" cy="86" rx="14" ry="14" fill="#F4D3B0" />

          {/* Oturan Arka Bacaklar / Patiler */}
          <Ellipse cx="40" cy="98" rx="8" ry="5" fill="#824E28" />
          <Ellipse cx="76" cy="98" rx="8" ry="5" fill="#824E28" />

          {/* Minik Ön Patiler */}
          <Ellipse cx="51" cy="95" rx="5" ry="4" fill="#F4D3B0" />
          <Ellipse cx="65" cy="95" rx="5" ry="4" fill="#F4D3B0" />
        </Svg>
      </Animated.View>

      {/* 3. KATMAN: Kafa, Büyük Kulaklar ve Yüz Detayları */}
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
          <Circle cx="32" cy="52" r="13" fill="#965D34" />
          <Circle cx="33" cy="52" r="8" fill="#F4D3B0" />

          {/* Sağ Kulak */}
          <Circle cx="84" cy="52" r="13" fill="#965D34" />
          <Circle cx="83" cy="52" r="8" fill="#F4D3B0" />

          {/* Kafa Yuvarlağı */}
          <Circle cx="58" cy="52" r="25" fill="#965D34" />

          {/* Açık Renk Kalp Biçimli Yüz Maskesi */}
          <Path
            d="M 42 42 C 40 34, 52 34, 58 41 C 64 34, 76 34, 74 42 C 78 52, 74 68, 58 70 C 42 68, 38 52, 42 42 Z"
            fill="#F4D3B0"
          />

          {/* Parlak Gözler */}
          <Circle cx="49" cy="49" r="3.6" fill="#2D1C13" />
          <Circle cx="50" cy="47.5" r="1.2" fill="#FFFFFF" />

          <Circle cx="67" cy="49" r="3.6" fill="#2D1C13" />
          <Circle cx="68" cy="47.5" r="1.2" fill="#FFFFFF" />

          {/* Minik Burun Delikleri */}
          <Circle cx="55" cy="55" r="1" fill="#824E28" />
          <Circle cx="61" cy="55" r="1" fill="#824E28" />

          {/* Gülümseyen Ağız */}
          <Path
            d="M 51 59 Q 58 65 65 59"
            stroke="#2D1C13"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Şeftali Allıklar */}
          <Circle cx="42" cy="56" r="3.5" fill="#FFA585" opacity={0.5} />
          <Circle cx="74" cy="56" r="3.5" fill="#FFA585" opacity={0.5} />
        </Svg>
      </Animated.View>

      

      {equippedGlasses && ACCESSORY_ICONS[equippedGlasses] && (
        <View style={[styles.accessoryAbsolute, { top: size * 0.3, left: size * 0.32 }]}>
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