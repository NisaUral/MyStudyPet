import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';

export interface AccessoryProps {
  size: number;
  color?: string;
}

// 1. ŞAPKALAR (Tüm şapkaların taban çizgisi viewBox y=32-34 seviyesinde eşitlendi)
export const WizardHat: React.FC<AccessoryProps> = ({ size, color = '#6C5CE7' }) => (
  <Svg width={size * 0.56} height={size * 0.52} viewBox="0 0 50 45">
    {/* Şapkanın geniş alt kenarlığı (Kafaya tam basan elips) */}
    <Ellipse cx="25" cy="35" rx="22" ry="5.5" fill="#2D3436" opacity={0.75} />
    {/* Sivri külah gövdesi */}
    <Path d="M 25 5 L 9 34 L 41 34 Z" fill={color} />
    {/* Altın sarısı kuşak */}
    <Path d="M 12 31 Q 25 35 38 31" stroke="#FDCB6E" strokeWidth="3" fill="none" />
    {/* Tepedeki parlak sihirli yıldız/nokta */}
    <Circle cx="25" cy="6" r="2.5" fill="#FFEAA7" />
  </Svg>
);

export const BaseballCap: React.FC<AccessoryProps> = ({ size, color = '#E17055' }) => (
  <Svg width={size * 0.50} height={size * 0.38} viewBox="0 0 50 35">
    <Path d="M 11 25 C 11 9, 39 9, 39 25 Z" fill={color} />
    <Path d="M 26 25 C 34 25, 47 23, 47 28 C 47 31, 33 30, 24 28 Z" fill={color} opacity={0.9} />
    <Circle cx="25" cy="11" r="2" fill="#FFFFFF" />
  </Svg>
);

export const Crown: React.FC<AccessoryProps> = ({ size, color = '#F1C40F' }) => (
  <Svg width={size * 0.46} height={size * 0.34} viewBox="0 0 50 35">
    <Path d="M 8 30 L 6 12 L 18 20 L 25 8 L 32 20 L 44 12 L 42 30 Z" fill={color} />
    <Rect x="8" y="27" width="34" height="4" rx="2" fill="#D4AC0D" />
    <Circle cx="25" cy="8" r="2" fill="#E74C3C" />
    <Circle cx="6" cy="12" r="1.8" fill="#3498DB" />
    <Circle cx="44" cy="12" r="1.8" fill="#2ECC71" />
  </Svg>
);

export const Beret: React.FC<AccessoryProps> = ({ size, color = '#E84393' }) => (
  <Svg width={size * 0.50} height={size * 0.34} viewBox="0 0 50 32">
    <Ellipse cx="25" cy="20" rx="22" ry="9" fill={color} />
    <Ellipse cx="25" cy="22" rx="13" ry="3.5" fill="#2D3436" opacity={0.25} />
    <Path d="M 25 11 L 25 5" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

// 2. GÖZLÜKLER
export const NerdGlasses: React.FC<AccessoryProps> = ({ size, color = '#2D3436' }) => (
  <Svg width={size * 0.54} height={size * 0.28} viewBox="0 0 60 30">
    <Circle cx="18" cy="15" r="11" stroke={color} strokeWidth="3" fill="#FFFFFF" fillOpacity={0.25} />
    <Circle cx="42" cy="15" r="11" stroke={color} strokeWidth="3" fill="#FFFFFF" fillOpacity={0.25} />
    <Path d="M 29 14 Q 30 11 31 14" stroke={color} strokeWidth="3" fill="none" />
    <Path d="M 7 14 L 2 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M 53 14 L 58 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const Sunglasses: React.FC<AccessoryProps> = ({ size, color = '#2C3E50' }) => (
  <Svg width={size * 0.54} height={size * 0.28} viewBox="0 0 60 30">
    <Path d="M 8 10 L 27 10 L 24 22 C 24 22, 14 24, 9 18 Z" fill={color} />
    <Path d="M 33 10 L 52 10 L 51 18 C 46 24, 36 22, 36 22 Z" fill={color} />
    <Path d="M 27 12 L 33 12" stroke={color} strokeWidth="3" />
    <Path d="M 12 12 L 18 20" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
    <Path d="M 37 12 L 43 20" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
  </Svg>
);

// 3. PAPYON
export const Bowtie: React.FC<AccessoryProps> = ({ size, color = '#E74C3C' }) => (
  <Svg width={size * 0.38} height={size * 0.22} viewBox="0 0 44 24">
    <Path d="M 4 4 L 22 12 L 4 20 Z" fill={color} />
    <Path d="M 40 4 L 22 12 L 40 20 Z" fill={color} />
    <Circle cx="22" cy="12" r="4.2" fill={color} />
    <Circle cx="20.5" cy="10.5" r="1.3" fill="#FFFFFF" opacity={0.5} />
  </Svg>
);