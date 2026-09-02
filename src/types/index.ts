export type PetType =
  | 'RABBIT' | 'CHICKEN' | 'DUCK' | 'FISH' | 'MONKEY'
  | 'CAT' | 'DOG' | 'CHICK' | 'UNICORN' | 'FOX';

export interface User {
  id: number;
  username: string;
  email: string;
  coinBalance: number;
}

export interface Pet {
  id: number;
  name: string;
  type: PetType;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedAccessory?: string;
  ownerUsername: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
  coinBalance: number;
  hasSelectedPet: boolean;
  hasRoom: boolean;
  roomCode?: string;
}