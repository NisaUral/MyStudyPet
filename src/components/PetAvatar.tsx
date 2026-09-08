import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PetType } from '../types';
import { PetState } from '../types/petState';
import { SleepingIndicator } from './pets/SleepingIndicator';

// Hayvan Bileşenleri
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

// Vektör Aksesuarlar
import {
  WizardHat,
  BaseballCap,
  Crown,
  Beret,
  NerdGlasses,
  Sunglasses,
  Bowtie,
} from './pets/PetAccessories';

interface Props {
  type: PetType;
  size?: number;
  isStudying?: boolean;
  petState?: PetState; // 18. Gün Durum Makinesi State'i
  equippedHat?: string;
  hatColor?: string;
  equippedGlasses?: string;
  glassesColor?: string;
  equippedAccessory?: string;
  accessoryColor?: string;
}

interface AnatomyOffset {
  hatTop: number;
  hatScale: number;
  hatLeftOffset?: number;
  glassesTop: number;
  glassesScale: number;
  glassesLeftOffset?: number;
  neckTop: number;
  neckScale: number;
  neckLeftOffset?: number;
}

const ANATOMY_CONFIG: Record<PetType, AnatomyOffset> = {
  CAT: {
    hatTop: 0.05,
    hatScale: 0.85,
    hatLeftOffset: -0.015,
    glassesTop: 0.31,
    glassesScale: 0.84,
    glassesLeftOffset: -0.015,
    neckTop: 0.58,
    neckScale: 0.90,
    neckLeftOffset: -0.015,
  },
  DOG: {
    hatTop: 0.03,
    hatScale: 0.86,
    hatLeftOffset: -0.015,
    glassesTop: 0.30,
    glassesScale: 0.85,
    glassesLeftOffset: -0.015,
    neckTop: 0.58,
    neckScale: 0.90,
    neckLeftOffset: -0.015,
  },
  FOX: {
    hatTop: 0.03,
    hatScale: 0.86,
    hatLeftOffset: -0.015,
    glassesTop: 0.30,
    glassesScale: 0.85,
    glassesLeftOffset: -0.015,
    neckTop: 0.58,
    neckScale: 0.90,
    neckLeftOffset: -0.015,
  },
  CHICKEN: {
    hatTop: 0.02,
    hatScale: 0.84,
    hatLeftOffset: -0.015,
    glassesTop: 0.29,
    glassesScale: 0.84,
    glassesLeftOffset: -0.015,
    neckTop: 0.59,
    neckScale: 0.86,
    neckLeftOffset: -0.015,
  },
  CHICK: {
    hatTop: 0.06,
    hatScale: 0.82,
    hatLeftOffset: 0,
    glassesTop: 0.35,
    glassesScale: 0.82,
    glassesLeftOffset: 0,
    neckTop: 0.55,
    neckScale: 0.82,
    neckLeftOffset: 0,
  },
  MONKEY: {
    hatTop: 0.03,
    hatScale: 0.86,
    hatLeftOffset: -0.015,
    glassesTop: 0.28,
    glassesScale: 0.84,
    glassesLeftOffset: -0.015,
    neckTop: 0.57,
    neckScale: 0.90,
    neckLeftOffset: -0.015,
  },
  RABBIT: {
    hatTop: 0.12,
    hatScale: 0.78,
    hatLeftOffset: 0,
    glassesTop: 0.33,
    glassesScale: 0.82,
    glassesLeftOffset: 0,
    neckTop: 0.58,
    neckScale: 0.85,
    neckLeftOffset: 0,
  },
  // DUCK: 120x120 standardında
  DUCK: {
    hatTop: 0.03,
    hatScale: 0.86,
    hatLeftOffset: -0.015,
    glassesTop: 0.29,
    glassesScale: 0.85,
    glassesLeftOffset: -0.015,
    neckTop: 0.58,
    neckScale: 0.88,
    neckLeftOffset: -0.015,
  },
  UNICORN: {
    hatTop: 0.01,
    hatScale: 0.84,
    hatLeftOffset: 0,
    glassesTop: 0.31,
    glassesScale: 0.85,
    glassesLeftOffset: 0,
    neckTop: 0.59,
    neckScale: 0.90,
    neckLeftOffset: 0,
  },
  // Balık: Fanus cam üst kenarı y=28 seviyesine basar
  FISH: {
    hatTop: -0.10,
    hatScale: 0.86,
    hatLeftOffset: 0,
    glassesTop: 0,
    glassesScale: 0,
    neckTop: 0,
    neckScale: 0,
  },
};

export const PetAvatar: React.FC<Props> = ({
  type,
  size = 105,
  isStudying = false,
  petState = 'IDLE',
  equippedHat,
  hatColor = '#6C5CE7',
  equippedGlasses,
  glassesColor = '#2D3436',
  equippedAccessory,
  accessoryColor = '#E74C3C',
}) => {
  const isFish = type === 'FISH';
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Durum Makinesine (PetState) göre animasyon davranışı
  useEffect(() => {
    // Balık fanusu, ders çalışma anı veya uyku anında zıplama durdurulur
    if (isFish || isStudying || petState === 'STUDYING' || petState === 'SLEEPING') {
      bounceAnim.setValue(0);
      return;
    }

    let toVal = -3.5;
    let dur = 650;

    // PLAYING: Oyun ve neşe anında iki kat seri ve yüksek yaylanma
    if (petState === 'PLAYING') {
      toVal = -7;
      dur = 380;
    }

    const animLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: toVal,
          duration: dur,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: dur,
          useNativeDriver: true,
        }),
      ])
    );

    animLoop.start();
    return () => animLoop.stop();
  }, [isStudying, isFish, petState]);

  const config = ANATOMY_CONFIG[type] || ANATOMY_CONFIG.FOX;

  const hatSize = size * config.hatScale;
  const glassesSize = size * config.glassesScale;
  const neckSize = size * config.neckScale;

  // Büyücü şapkası külah yapısına özel mikro ofset
  const isWizardHat = equippedHat === 'WIZARD_HAT';
  const computedHatTop = size * (config.hatTop + (isWizardHat ? -0.04 : 0));

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
    if (isFish) return null;
    switch (equippedGlasses) {
      case 'NERD_GLASSES': return <NerdGlasses size={glassesSize} color={glassesColor} />;
      case 'SUNGLASSES': return <Sunglasses size={glassesSize} color={glassesColor} />;
      default: return null;
    }
  };

  const renderNeck = () => {
    if (isFish) return null;
    switch (equippedAccessory) {
      case 'BOWTIE': return <Bowtie size={neckSize} color={accessoryColor} />;
      default: return null;
    }
  };

  const renderPetBody = () => {
    // Uyku modunda da gözlerin kapalı/sakin durması için isStudying bayrağı iç katmana iletilir
    const isResting = isStudying || petState === 'SLEEPING' || petState === 'STUDYING';
    const commonProps = { size, isStudying: isResting };

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
    <Animated.View
      style={[
        styles.avatarWrapper,
        {
          width: size,
          height: size,
          transform: [
            {
              translateY:
                isFish || isStudying || petState === 'SLEEPING' ? 0 : bounceAnim,
            },
            // Uyku modunda pet başını hafif yana yatırır (balık hariç)
            {
              rotate: petState === 'SLEEPING' && !isFish ? '3deg' : '0deg',
            },
          ],
        },
      ]}
    >
      {/* 0. Katman: Uyku Göstergesi (Zzz Baloncuğu) */}
      {petState === 'SLEEPING' && !isFish && <SleepingIndicator />}

      {/* 1. Katman: Hayvan / Fanus Gövdesi */}
      {renderPetBody()}

      {/* 2. Katman: Şapka */}
      {equippedHat && equippedHat !== 'NONE' && (
        <View
          pointerEvents="none"
          style={[
            styles.slot,
            {
              top: computedHatTop,
              left: (config.hatLeftOffset || 0) * size,
              zIndex: 998,
            },
          ]}
        >
          {renderHat()}
        </View>
      )}

      {/* 3. Katman: Gözlük (Balık hariç) */}
      {!isFish && equippedGlasses && equippedGlasses !== 'NONE' && (
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

      {/* 4. Katman: Papyon (Balık hariç) */}
      {!isFish && equippedAccessory && equippedAccessory !== 'NONE' && (
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
    </Animated.View>
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