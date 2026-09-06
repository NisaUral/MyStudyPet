import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

interface PetProps {
  size: number;
  isStudying?: boolean;
}

export const DuckPet: React.FC<PetProps> = ({ size, isStudying = false }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -3, duration: 650, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 650, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: isStudying ? 0 : bounceAnim }] }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Ayaklar (Simetrik palet ayaklar) */}
        <Ellipse cx="36" cy="88" rx="10" ry="4.5" fill="#E67E22" />
        <Ellipse cx="64" cy="88" rx="10" ry="4.5" fill="#E67E22" />

        {/* Gövde (Tombik sarı göğüs) */}
        <Ellipse cx="50" cy="64" rx="34" ry="26" fill="#F9E79F" />

        {/* İki Yandaki Kanatlar */}
        <Ellipse cx="18" cy="64" rx="7" ry="14" fill="#F39C12" />
        <Ellipse cx="82" cy="64" rx="7" ry="14" fill="#F39C12" />

        {/* Kafa (Tam ortada yuvarlak) */}
        <Circle cx="50" cy="40" r="26" fill="#F7DC6F" />

        {/* Başındaki Tatlı Tüy */}
        <Path d="M 50 14 Q 45 4 50 2 Q 55 4 50 14" fill="#F39C12" />

        {/* Yanak Kızarıklıkları */}
        <Circle cx="30" cy="44" r="5" fill="#FF7675" opacity={0.4} />
        <Circle cx="70" cy="44" r="5" fill="#FF7675" opacity={0.4} />

        {/* Gözler (Tam öne bakan simetrik gözler) */}
        {isStudying ? (
          <>
            <Path d="M 34 38 Q 39 42 44 38" stroke="#2D3436" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Path d="M 56 38 Q 61 42 66 38" stroke="#2D3436" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <Circle cx="38" cy="38" r="4.5" fill="#2D3436" />
            <Circle cx="37" cy="36.5" r="1.5" fill="#FFFFFF" />
            <Circle cx="62" cy="38" r="4.5" fill="#2D3436" />
            <Circle cx="61" cy="36.5" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {/* Geniş Ördek Gagası (Önden simetrik kavis) */}
        <Ellipse cx="50" cy="49" rx="15" ry="7.5" fill="#E67E22" />
        <Circle cx="46" cy="48" r="1" fill="#BA4A00" />
        <Circle cx="54" cy="48" r="1" fill="#BA4A00" />
      </Svg>
    </Animated.View>
  );
};