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
      <Svg width={size} height={size} viewBox="0 0 120 120">
        {/* Ayaklar (120x120 standardında zemin hizası y=96-102) */}
        <Ellipse cx="44" cy="98" rx="11" ry="5" fill="#E67E22" />
        <Ellipse cx="72" cy="98" rx="11" ry="5" fill="#E67E22" />

        {/* Gövde (Tombik sarı göğüs) */}
        <Ellipse cx="58" cy="80" rx="30" ry="22" fill="#F9E79F" />

        {/* İki Yandaki Kanatlar */}
        <Ellipse cx="26" cy="78" rx="7" ry="14" fill="#F39C12" />
        <Ellipse cx="90" cy="78" rx="7" ry="14" fill="#F39C12" />

        {/* Kafa (Kedi/Köpek gibi x=58, y=52 merkezli) */}
        <Circle cx="58" cy="52" r="25" fill="#F7DC6F" />

        {/* Başındaki Tatlı Tüy */}
        <Path d="M 58 27 Q 53 17 58 15 Q 63 17 58 27" fill="#F39C12" />

        {/* Yanak Kızarıklıkları */}
        <Circle cx="38" cy="56" r="4.5" fill="#FF7675" opacity={0.4} />
        <Circle cx="78" cy="56" r="4.5" fill="#FF7675" opacity={0.4} />

        {/* Gözler (Diğer hayvanlarla aynı y=50-52 göz hizası) */}
        {isStudying ? (
          <>
            <Path d="M 43 49 Q 47 53 51 49" stroke="#2D3436" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <Path d="M 65 49 Q 69 53 73 49" stroke="#2D3436" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <Circle cx="47" cy="49" r="4.2" fill="#2D3436" />
            <Circle cx="46" cy="47.5" r="1.4" fill="#FFFFFF" />
            <Circle cx="69" cy="49" r="4.2" fill="#2D3436" />
            <Circle cx="68" cy="47.5" r="1.4" fill="#FFFFFF" />
          </>
        )}

        {/* Geniş Ördek Gagası (Önden simetrik kavis) */}
        <Ellipse cx="58" cy="60" rx="14" ry="7" fill="#E67E22" />
        <Circle cx="54" cy="59" r="1" fill="#BA4A00" />
        <Circle cx="62" cy="59" r="1" fill="#BA4A00" />
      </Svg>
    </Animated.View>
  );
};