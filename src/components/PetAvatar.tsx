import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PET_OPTIONS } from '../constants/pets';
import { ACCESSORY_CATALOG } from '../constants/accessories';
import { PetType } from '../types';

interface PetAvatarProps {
  type: PetType;
  size?: number;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedAccessory?: string;
}

export const PetAvatar: React.FC<PetAvatarProps> = ({
  type,
  size = 120,
  equippedHat,
  equippedGlasses,
  equippedAccessory,
}) => {
  const petMeta = PET_OPTIONS.find((p) => p.type === type);
  const hatItem = ACCESSORY_CATALOG.find((a) => a.id === equippedHat && a.id !== 'hat_none');
  const glassesItem = ACCESSORY_CATALOG.find((a) => a.id === equippedGlasses && a.id !== 'glasses_none');
  const accItem = ACCESSORY_CATALOG.find((a) => a.id === equippedAccessory && a.id !== 'acc_none');

  const baseFontSize = size * 0.55;
  const hatFontSize = size * 0.32;
  const glassesFontSize = size * 0.28;
  const accFontSize = size * 0.28;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {/* Katman 1: Ana Gövde */}
      <Text style={[styles.layer, { fontSize: baseFontSize, zIndex: 1 }]}>
        {petMeta?.emoji || '🐱'}
      </Text>

      {/* Katman 2: Şapka (Baş üstü) */}
      {hatItem && (
        <View style={[styles.hatWrapper, { top: size * 0.04, zIndex: 3 }]}>
          <Text style={{ fontSize: hatFontSize }}>{hatItem.emoji}</Text>
        </View>
      )}

      {/* Katman 3: Gözlük (Yüz seviyesi) */}
      {glassesItem && (
        <View style={[styles.glassesWrapper, { top: size * 0.26, zIndex: 2 }]}>
          <Text style={{ fontSize: glassesFontSize }}>{glassesItem.emoji}</Text>
        </View>
      )}

      {/* Katman 4: Boyun/Göğüs Aksesuarı */}
      {accItem && (
        <View style={[styles.accessoryWrapper, { bottom: size * 0.08, zIndex: 4 }]}>
          <Text style={{ fontSize: accFontSize }}>{accItem.emoji}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    textAlign: 'center',
  },
  hatWrapper: {
    position: 'absolute',
    alignSelf: 'center',
  },
  glassesWrapper: {
    position: 'absolute',
    alignSelf: 'center',
  },
  accessoryWrapper: {
    position: 'absolute',
    alignSelf: 'center',
  },
});