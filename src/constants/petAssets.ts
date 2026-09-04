import { PetType } from '../types';

export interface PetMeta {
  source: any;
  hatOffset: { top: number; left: number };
  glassesOffset: { top: number; left: number };
}

export const PET_ASSETS: Record<PetType, PetMeta> = {
  FOX: {
    source: require('../../assets/pets/tilki.jpg'),
    hatOffset: { top: -12, left: 18 },
    glassesOffset: { top: 28, left: 20 },
  },
  UNICORN: {
    source: require('../../assets/pets/unicorn.jpg'),
    hatOffset: { top: -8, left: 14 },
    glassesOffset: { top: 26, left: 24 },
  },
  CHICK: {
    source: require('../../assets/pets/civciv.jpg'),
    hatOffset: { top: -14, left: 22 },
    glassesOffset: { top: 32, left: 24 },
  },
  DOG: {
    source: require('../../assets/pets/kopek.jpg'),
    hatOffset: { top: -10, left: 20 },
    glassesOffset: { top: 26, left: 22 },
  },
  CAT: {
    source: require('../../assets/pets/kedi.jpg'),
    hatOffset: { top: -12, left: 24 },
    glassesOffset: { top: 25, left: 22 },
  },
  MONKEY: {
    source: require('../../assets/pets/maymun.png'),
    hatOffset: { top: -12, left: 22 },
    glassesOffset: { top: 26, left: 22 },
  },
  FISH: {
    source: require('../../assets/pets/balik.jpg'),
    hatOffset: { top: -10, left: 20 },
    glassesOffset: { top: 30, left: 18 },
  },
  DUCK: {
    source: require('../../assets/pets/ordek.png'),
    hatOffset: { top: -15, left: 22 },
    glassesOffset: { top: 24, left: 26 },
  },
  CHICKEN: {
    source: require('../../assets/pets/tavuk.jpg'),
    hatOffset: { top: -14, left: 22 },
    glassesOffset: { top: 26, left: 22 },
  },
  RABBIT: {
    source: require('../../assets/pets/tavsan.png'),
    hatOffset: { top: -16, left: 22 },
    glassesOffset: { top: 30, left: 22 },
  },
};