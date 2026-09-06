import { PetType } from '../types';

export interface PetMeta {
  source: any;
  hatOffset: { top: number; left: number };
  glassesOffset: { top: number; left: number };
}

export const PET_ASSETS: Record<PetType, PetMeta> = {
  FOX: {
    source: require('../../assets/pets/fox.png'),
    hatOffset: { top: 6, left: 24 },
    glassesOffset: { top: 42, left: 24 },
  },
  RABBIT: {
    source: require('../../assets/pets/rabbit.png'),
    hatOffset: { top: 2, left: 24 },
    glassesOffset: { top: 44, left: 24 },
  },
  CHICKEN: {
    source: require('../../assets/pets/chicken.png'),
    hatOffset: { top: 8, left: 24 },
    glassesOffset: { top: 40, left: 24 },
  },
  DUCK: {
    source: require('../../assets/pets/duck.png'),
    hatOffset: { top: 12, left: 26 },
    glassesOffset: { top: 40, left: 26 },
  },
  MONKEY: {
    source: require('../../assets/pets/monkey.png'),
    hatOffset: { top: 8, left: 24 },
    glassesOffset: { top: 38, left: 24 },
  },
  CAT: {
    source: require('../../assets/pets/cat.png'),
    hatOffset: { top: 4, left: 24 },
    glassesOffset: { top: 38, left: 24 },
  },
  DOG: {
    source: require('../../assets/pets/dog.png'),
    hatOffset: { top: 8, left: 24 },
    glassesOffset: { top: 38, left: 24 },
  },
  CHICK: {
    source: require('../../assets/pets/chick.png'),
    hatOffset: { top: 10, left: 24 },
    glassesOffset: { top: 42, left: 24 },
  },
  FISH: {
    source: require('../../assets/pets/fish.png'),
    hatOffset: { top: 4, left: 24 },
    glassesOffset: { top: 36, left: 22 },
  },
  UNICORN: {
    source: require('../../assets/pets/unicorn.png'),
    hatOffset: { top: 6, left: 20 },
    glassesOffset: { top: 38, left: 24 },
  },
};