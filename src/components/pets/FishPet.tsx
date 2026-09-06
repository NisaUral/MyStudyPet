import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing, Text } from 'react-native';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';

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

export const FishPet: React.FC<PetProps> = ({
  size = 100,
  isStudying = false,
  equippedHat,
  equippedGlasses,
  equippedAccessory,
}) => {
  const swimAnimX = useRef(new Animated.Value(0)).current;
  const swimAnimY = useRef(new Animated.Value(0)).current;
  const finAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Sağa Sola Yüzme Hareketi
    const swimX = Animated.loop(
      Animated.sequence([
        Animated.timing(swimAnimX, {
          toValue: 6,
          duration: isStudying ? 1400 : 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swimAnimX, {
          toValue: -6,
          duration: isStudying ? 1400 : 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Hafif Dikey Salınım (Su üstü/altı)
    const swimY = Animated.loop(
      Animated.sequence([
        Animated.timing(swimAnimY, {
          toValue: -4,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swimAnimY, {
          toValue: 3,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Kuyruk Yüzgeci Çırpınışı
    const finLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(finAnim, {
          toValue: 1,
          duration: isStudying ? 300 : 550,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(finAnim, {
          toValue: -1,
          duration: isStudying ? 300 : 550,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 4. Kabarcıkların Yükselmesi
    const bubbles = Animated.loop(
      Animated.timing(bubbleAnim, {
        toValue: -20,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    swimX.start();
    swimY.start();
    finLoop.start();
    bubbles.start();

    return () => {
      swimX.stop();
      swimY.stop();
      finLoop.stop();
      bubbles.stop();
    };
  }, [isStudying]);

  const finRotation = finAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-18deg', '18deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 1. KATMAN: Fanus ve Su Arka Planı (Sabit) */}
      <View style={styles.layer}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* Su Gövdesi (Kare akvaryum camı) */}
          <Rect
            x="20"
            y="30"
            width="80"
            height="75"
            rx="14"
            fill="#1E5268"
            opacity={0.85}
          />
          {/* Su Yüzeyi Çizgisi */}
          <Path
            d="M 22 42 Q 40 38 60 42 T 98 42"
            stroke="#4ED0E4"
            strokeWidth="2"
            fill="none"
            opacity={0.7}
          />
          {/* Dipteki Çakıl Taşları / Kum */}
          <Ellipse cx="60" cy="100" rx="36" ry="4" fill="#143442" />
        </Svg>
      </View>

      {/* 2. KATMAN: Su Kabarcıkları */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ translateY: bubbleAnim }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Circle cx="40" cy="85" r="2" fill="#A8ECF8" opacity={0.6} />
          <Circle cx="45" cy="72" r="1.5" fill="#A8ECF8" opacity={0.7} />
          <Circle cx="78" cy="80" r="2.5" fill="#A8ECF8" opacity={0.5} />
        </Svg>
      </Animated.View>

      {/* 3. KATMAN: Yüzen Balık Gövdesi ve Kuyruğu */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [
              { translateX: swimAnimX },
              { translateY: swimAnimY },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* Balık Gövdesi (Turuncu Japon Balığı) */}
          <Ellipse cx="56" cy="66" rx="16" ry="12" fill="#FF7A33" />
          {/* Beyaz Göbek / Alt Yüzey */}
          <Ellipse cx="54" cy="71" rx="10" ry="5" fill="#FFA96B" />

          {/* Sırt Yüzgeci */}
          <Path d="M 52 54 C 55 48, 62 48, 66 54 Z" fill="#FF5E24" />

          {/* Gözler ve Işıltı */}
          <Circle cx="48" cy="64" r="3.5" fill="#1A1B26" />
          <Circle cx="47" cy="63" r="1.2" fill="#FFFFFF" />

          {/* Minik Ağız */}
          <Circle cx="40" cy="68" r="1.8" fill="#FF5E24" />
        </Svg>

        {/* Canlı Çırpınan Kuyruk Yüzgeci */}
        <Animated.View
          style={[
            styles.layer,
            {
              transform: [
                { translateX: size * 0.16 },
                { translateY: size * 0.08 },
                { rotate: finRotation },
                { translateX: -size * 0.16 },
                { translateY: -size * 0.08 },
              ],
            },
          ]}
        >
          <Svg width={size} height={size} viewBox="0 0 120 120">
            <Path
              d="M 68 66 C 78 54, 88 56, 84 66 C 88 76, 78 78, 68 66 Z"
              fill="#FF5E24"
            />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* 4. KATMAN: Fanus Camının Dış Çerçevesi ve Parlaması */}
      <View style={styles.layer} pointerEvents="none">
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* Cam Kenar Çizgisi */}
          <Rect
            x="19"
            y="28"
            width="82"
            height="78"
            rx="15"
            stroke="#7AA2F7"
            strokeWidth="3"
            fill="none"
            opacity={0.7}
          />
          {/* Cam Üstü Beyaz Yansıma Parlaması */}
          <Path
            d="M 28 36 L 28 65"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={0.4}
          />
        </Svg>
      </View>

      {/* 5. KATMAN: Fanus Üstü Aksesuarlar */}
      {equippedHat && ACCESSORY_ICONS[equippedHat] && (
        <View style={[styles.accessoryAbsolute, { top: -size * 0.05, left: size * 0.35 }]}>
          <Text style={{ fontSize: size * 0.36 }}>{ACCESSORY_ICONS[equippedHat]}</Text>
        </View>
      )}

      {equippedGlasses && ACCESSORY_ICONS[equippedGlasses] && (
        <View style={[styles.accessoryAbsolute, { top: size * 0.36, left: size * 0.3 }]}>
          <Text style={{ fontSize: size * 0.3 }}>{ACCESSORY_ICONS[equippedGlasses]}</Text>
        </View>
      )}

      {equippedAccessory && ACCESSORY_ICONS[equippedAccessory] && (
        <View style={[styles.accessoryAbsolute, { bottom: -size * 0.05, alignSelf: 'center' }]}>
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