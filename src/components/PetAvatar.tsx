import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PetType } from '../types';

import { FoxPet } from './pets/FoxPet';
import { FishPet } from './pets/FishPet';
import { RabbitPet } from './pets/RabbitPet';
import { ChickPet } from './pets/ChickPet';
import { CatPet } from './pets/CatPet';
import { DogPet } from './pets/DogPet';
import { DuckPet } from './pets/DuckPet';
import { ChickenPet } from './pets/ChickenPet';
import { MonkeyPet } from './pets/MonkeyPet';
import { UnicornPet } from './pets/UnicornPet';

import {
  WizardHat,
  BaseballCap,
  Crown,
  Beret,
  NerdGlasses,
  Sunglasses,
  NerdGlassesProfile,
  SunglassesProfile,
  Bowtie,
} from './pets/PetAccessories';

interface Props {
  type: PetType;
  size?: number;
  isStudying?: boolean;
  equippedHat?: string;
  hatColor?: string;
  equippedGlasses?: string;
  glassesColor?: string;
  equippedAccessory?: string;
  accessoryColor?: string;
}

interface Anatomy {
  hatTop: number;
  hatScale: number;
  hatLeftOffset?: number;   // Yana bakanlar için hafif kaydırma
  glassesTop: number;
  glassesLeftOffset?: number;
  neckTop: number;
  neckScale: number;
  neckLeftOffset?: number;
  isProfile: boolean;       // Yan duran hayvan mı?
}

const ANATOMY_CONFIG: Record<PetType, Anatomy> = {
  FOX: {
    hatTop: 0.02,
    hatScale: 0.90,
    glassesTop: 0.28,
    neckTop: 0.50,
    neckScale: 0.95,
    isProfile: false,
  },
  CAT: {
    hatTop: 0.03,
    hatScale: 0.88,
    glassesTop: 0.29,
    neckTop: 0.50,
    neckScale: 0.95,
    isProfile: false,
  },
  DOG: {
    hatTop: 0.02,
    hatScale: 0.90,
    glassesTop: 0.29,
    neckTop: 0.51,
    neckScale: 0.95,
    isProfile: false,
  },
  RABBIT: {
    hatTop: 0.12,
    hatScale: 0.82,
    glassesTop: 0.35,
    neckTop: 0.56,
    neckScale: 0.90,
    isProfile: false,
  },
  MONKEY: {
    hatTop: 0.02,
    hatScale: 0.88,
    glassesTop: 0.27,
    neckTop: 0.49,
    neckScale: 0.95,
    isProfile: false,
  },
  UNICORN: {
    hatTop: -0.04,       // Boynuzun başladığı alnın üstü
    hatScale: 0.88,
    glassesTop: 0.28,    // İki gözün tam üstü
    neckTop: 0.58,       // Çene altı
    neckScale: 0.95,
    isProfile: false,
  },

  // YAN DURANLAR:
  CHICK: {
    hatTop: -0.04,
    hatScale: 0.82,
    glassesTop: 0.24,
    glassesLeftOffset: 0.06, // Gözün olduğu tarafa doğru
    neckTop: 0.45,
    neckScale: 0.85,
    isProfile: false,
  },
  CHICKEN: {
    hatTop: -0.06,
    hatScale: 0.82,
    glassesTop: 0.24,
    glassesLeftOffset: 0.06,
    neckTop: 0.46,
    neckScale: 0.85,
    isProfile: false,
  },
  DUCK: {
    hatTop: -0.02,       // Geniş kafa tepesi
    hatScale: 0.85,
    glassesTop: 0.24,    // İki gözün tam üstü
    neckTop: 0.54,       // Gaga altı / göğüs birleşimi
    neckScale: 0.85,
    isProfile: false,
  },

  // FANUSLU BALIK (Fanusun içindeki balığa tam oturan koordinatlar):
  FISH: {
    hatTop: 0.20,             // Fanusun içindeki balığın tam kafasına oturur
    hatScale: 0.65,           // Fanus içine sığacak tatlı boy
    hatLeftOffset: -0.04,
    glassesTop: 0.36,         // Balığın tek büyük yan gözüne tam oturur
    glassesLeftOffset: 0.04,
    neckTop: 0.50,            // Balığın gövde/kuyruk kıvrımına oturur
    neckScale: 0.70,
    neckLeftOffset: -0.05,
    isProfile: true,
  },
};

export const PetAvatar: React.FC<Props> = ({
  type,
  size = 105,
  isStudying = false,
  equippedHat,
  hatColor = '#6C5CE7',
  equippedGlasses,
  glassesColor = '#2D3436',
  equippedAccessory,
  accessoryColor = '#E74C3C',
}) => {
  const config = ANATOMY_CONFIG[type] || ANATOMY_CONFIG.FOX;
  const hatSize = size * config.hatScale;
  const neckSize = size * config.neckScale;

  const renderHat = () => {
    switch (equippedHat) {
      case 'WIZARD_HAT': return <WizardHat size={hatSize} color={hatColor} />;
      case 'BASEBALL_CAP': return <BaseballCap size={hatSize} color={hatColor} />;
      case 'CROWN': return <Crown size={hatSize} color={hatColor} />;
      case 'BERET': return <Beret size={hatSize} color={hatColor} />;
      default: return null;
    }
  };

  const renderGlasses = () => {
    if (config.isProfile) {
      // Yan duranlar için profil gözlüğü
      switch (equippedGlasses) {
        case 'NERD_GLASSES': return <NerdGlassesProfile size={size * 0.75} color={glassesColor} />;
        case 'SUNGLASSES': return <SunglassesProfile size={size * 0.75} color={glassesColor} />;
        default: return null;
      }
    } else {
      // Düz duranlar için çift camlı gözlük
      switch (equippedGlasses) {
        case 'NERD_GLASSES': return <NerdGlasses size={size * 0.90} color={glassesColor} />;
        case 'SUNGLASSES': return <Sunglasses size={size * 0.90} color={glassesColor} />;
        default: return null;
      }
    }
  };

  const renderNeck = () => {
    switch (equippedAccessory) {
      case 'BOWTIE': return <Bowtie size={neckSize} color={accessoryColor} />;
      default: return null;
    }
  };

  const renderPetBody = () => {
    const commonProps = { size, isStudying };
    switch (type) {
      case 'FOX': return <FoxPet {...commonProps} />;
      case 'FISH': return <FishPet {...commonProps} />;
      case 'RABBIT': return <RabbitPet {...commonProps} />;
      case 'CHICK': return <ChickPet {...commonProps} />;
      case 'CAT': return <CatPet {...commonProps} />;
      case 'DOG': return <DogPet {...commonProps} />;
      case 'DUCK': return <DuckPet {...commonProps} />;
      case 'CHICKEN': return <ChickenPet {...commonProps} />;
      case 'MONKEY': return <MonkeyPet {...commonProps} />;
      case 'UNICORN': return <UnicornPet {...commonProps} />;
      default: return <FoxPet {...commonProps} />;
    }
  };

  return (
    <View style={[styles.avatarWrapper, { width: size, height: size }]}>
      {/* 1. Hayvan / Fanus */}
      {renderPetBody()}

      {/* 2. Şapka */}
      {equippedHat && equippedHat !== 'NONE' && (
        <View
          pointerEvents="none"
          style={[
            styles.slot,
            {
              top: size * config.hatTop,
              left: (config.hatLeftOffset || 0) * size,
              zIndex: 998,
            },
          ]}
        >
          {renderHat()}
        </View>
      )}

      {/* 3. Gözlük (Yan veya Ön) */}
      {equippedGlasses && equippedGlasses !== 'NONE' && (
        <View
          pointerEvents="none"
          style={[
            styles.slot,
            {
              top: size * config.glassesTop,
              left: (config.glassesLeftOffset || 0) * size,
              zIndex: 1000,
            },
          ]}
        >
          {renderGlasses()}
        </View>
      )}

      {/* 4. Papyon */}
      {equippedAccessory && equippedAccessory !== 'NONE' && (
        <View
          pointerEvents="none"
          style={[
            styles.slot,
            {
              top: size * config.neckTop,
              left: (config.neckLeftOffset || 0) * size,
              zIndex: 999,
            },
          ]}
        >
          {renderNeck()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  slot: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});