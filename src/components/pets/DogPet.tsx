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

export const DogPet: React.FC<PetProps> = ({
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
    // 1. Köpek Kuyruğu Sallama Döngüsü (Neşeli ve kıpır kıpır)
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, {
          toValue: 1,
          duration: isStudying ? 800 : 450,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tailAnim, {
          toValue: -1,
          duration: isStudying ? 800 : 450,
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
    outputRange: ['-16deg', '16deg'],
  });

  const headRotation = headAnim.interpolate({
    inputRange: [-2, 2],
    outputRange: ['-4deg', '4deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 1. KATMAN: Canlı Kuyruk (Gövdenin Sağ Arkasında) */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [
              { translateX: size * 0.2 },
              { translateY: size * 0.28 },
              { rotate: tailRotation },
              { translateX: -size * 0.2 },
              { translateY: -size * 0.28 },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Path
            d="M 76 90 C 92 90, 102 78, 92 68 C 86 64, 82 72, 78 82 Z"
            fill="#EAC590"
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
          {/* Ana Gövde (Açık bal rengi) */}
          <Ellipse cx="58" cy="84" rx="25" ry="21" fill="#F8E5C4" />
          {/* Karın Beyazlığı */}
          <Ellipse cx="58" cy="85" rx="16" ry="14" fill="#FFFDF8" />
          {/* Oturan Ön Patiler */}
          <Ellipse cx="46" cy="98" rx="7" ry="5" fill="#FFFDF8" />
          <Ellipse cx="68" cy="98" rx="7" ry="5" fill="#FFFDF8" />
          <Path d="M 44 98 L 44 102 M 48 98 L 48 102" stroke="#D1B283" strokeWidth="1.2" strokeLinecap="round" />
          <Path d="M 66 98 L 66 102 M 70 98 L 70 102" stroke="#D1B283" strokeWidth="1.2" strokeLinecap="round" />
        </Svg>
      </Animated.View>

      {/* 3. KATMAN: Baş, Kulaklar ve Sevimli Surat */}
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ rotate: headRotation }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120">
          {/* Sol Sarkık Kulak */}
          <Path
            d="M 38 42 C 20 45, 18 68, 30 76 C 38 80, 42 66, 38 42 Z"
            fill="#E0A96D"
          />
          {/* Sağ Sarkık Kulak */}
          <Path
            d="M 78 42 C 96 45, 98 68, 86 76 C 78 80, 74 66, 78 42 Z"
            fill="#E0A96D"
          />

          {/* Kafa Yuvarlağı */}
          <Circle cx="58" cy="52" r="26" fill="#F8E5C4" />

          {/* Beyaz Burun/Ağız Bölgesi (Snout) */}
          <Ellipse cx="58" cy="62" rx="15" ry="11" fill="#FFFDF8" />

          {/* Büyük Işıl Işıl Gözler */}
          <Circle cx="47" cy="50" r="4.2" fill="#241B15" />
          <Circle cx="48.5" cy="48.5" r="1.4" fill="#FFFFFF" />

          <Circle cx="69" cy="50" r="4.2" fill="#241B15" />
          <Circle cx="70.5" cy="48.5" r="1.4" fill="#FFFFFF" />

          {/* Minik Kaşlar */}
          <Path d="M 43 43 C 45 41, 49 41, 51 43" stroke="#B08652" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <Path d="M 65 43 C 67 41, 71 41, 73 43" stroke="#B08652" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Tombul Burun */}
          <Ellipse cx="58" cy="57" rx="4.2" ry="3.2" fill="#241B15" />
          <Circle cx="56.5" cy="56" r="0.8" fill="#FFFFFF" opacity={0.6} />

          {/* Gülümseyen Ağız */}
          <Path
            d="M 52 63 Q 58 68 64 63"
            stroke="#241B15"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Şeftali Allıklar */}
          <Circle cx="39" cy="58" r="4" fill="#FCA387" opacity={0.5} />
          <Circle cx="77" cy="58" r="4" fill="#FCA387" opacity={0.5} />
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