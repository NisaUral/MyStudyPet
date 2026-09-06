import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

interface PetProps {
  size: number;
  isStudying?: boolean;
}

export const UnicornPet: React.FC<PetProps> = ({ size, isStudying = false }) => {
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
        {/* Arka Yele (Başın arkasındaki pembe/mor kabarık saçlar) */}
        <Circle cx="30" cy="32" r="12" fill="#E84393" opacity={0.85} />
        <Circle cx="70" cy="32" r="12" fill="#9B59B6" opacity={0.85} />

        {/* Kulaklar (İki yanda sivri unicorn kulakları) */}
        {/* Sol Kulak */}
        <Path d="M 28 32 L 20 12 L 38 24 Z" fill="#FFFFFF" stroke="#F1F2F6" strokeWidth="1" />
        <Path d="M 29 28 L 24 16 L 35 24 Z" fill="#FD79A8" />
        {/* Sağ Kulak */}
        <Path d="M 72 32 L 80 12 L 62 24 Z" fill="#FFFFFF" stroke="#F1F2F6" strokeWidth="1" />
        <Path d="M 71 28 L 76 16 L 65 24 Z" fill="#FD79A8" />

        {/* Gövde (Önden beyaz göğüs) */}
        <Ellipse cx="50" cy="68" rx="28" ry="22" fill="#FFFFFF" stroke="#F1F2F6" strokeWidth="1.5" />
        {/* Minik Ön Toynaklar */}
        <Ellipse cx="38" cy="85" rx="7" ry="5" fill="#F1C40F" />
        <Ellipse cx="62" cy="85" rx="7" ry="5" fill="#F1C40F" />

        {/* Kafa (Önden sevimli beyaz kafa) */}
        <Circle cx="50" cy="46" r="26" fill="#FFFFFF" stroke="#F1F2F6" strokeWidth="1" />

        {/* Alındaki Sihirli Boynuz (Tam ortada altın rengi sarmal boynuz) */}
        <Path d="M 50 6 L 44 26 L 56 26 Z" fill="#F1C40F" />
        <Path d="M 46 20 L 54 22" stroke="#E67E22" strokeWidth="1.5" />
        <Path d="M 48 13 L 52 15" stroke="#E67E22" strokeWidth="1.5" />

        {/* Yanak Kızarıklıkları */}
        <Circle cx="30" cy="50" r="4.5" fill="#FD79A8" opacity={0.4} />
        <Circle cx="70" cy="50" r="4.5" fill="#FD79A8" opacity={0.4} />

        {/* Gözler (Öne bakan iri sevimli kirpikli gözler) */}
        {isStudying ? (
          <>
            <Path d="M 33 44 Q 38 48 43 44" stroke="#2D3436" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Path d="M 57 44 Q 62 48 67 44" stroke="#2D3436" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <Circle cx="38" cy="44" r="4.5" fill="#2D3436" />
            <Circle cx="37" cy="42.5" r="1.5" fill="#FFFFFF" />
            <Circle cx="39.5" cy="45.5" r="0.8" fill="#FFFFFF" />

            <Circle cx="62" cy="44" r="4.5" fill="#2D3436" />
            <Circle cx="61" cy="42.5" r="1.5" fill="#FFFFFF" />
            <Circle cx="63.5" cy="45.5" r="0.8" fill="#FFFFFF" />
          </>
        )}

        {/* Ağız & Burun (Önden pembe burunluk) */}
        <Ellipse cx="50" cy="56" rx="10" ry="6" fill="#F8A5C2" />
        <Circle cx="47" cy="55" r="1" fill="#E84393" />
        <Circle cx="53" cy="55" r="1" fill="#E84393" />
        <Path d="M 48 58 Q 50 60 52 58" stroke="#E84393" strokeWidth="1" fill="none" />
      </Svg>
    </Animated.View>
  );
};