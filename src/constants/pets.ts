import { PetType } from '../types';

export interface PetOption {
  type: PetType;
  label: string;
  emoji: string;
  description: string;
}

export const PET_OPTIONS: PetOption[] = [
  { type: 'RABBIT', label: 'Tavşan', emoji: '🐰', description: 'Enerjik ve dikkatli' },
  { type: 'CHICKEN', label: 'Tavuk', emoji: '🐔', description: 'Erkenci ve çalışkan' },
  { type: 'DUCK', label: 'Ördek', emoji: '🦆', description: 'Sakin ve odaklı' },
  { type: 'FISH', label: 'Fanus Balığı', emoji: '🐟', description: 'Dingin ve huzurlu' },
  { type: 'MONKEY', label: 'Maymun', emoji: '🐵', description: 'Meraklı ve oyuncu' },
  { type: 'CAT', label: 'Kedi', emoji: '🐱', description: 'Rahat ve bağımsız' },
  { type: 'DOG', label: 'Köpek', emoji: '🐶', description: 'Sadık bir çalışma arkadaşı' },
  { type: 'CHICK', label: 'Civciv', emoji: '🐤', description: 'Neşeli ve sevimli' },
  { type: 'UNICORN', label: 'Unicorn', emoji: '🦄', description: 'Sihirli ve yaratıcı' },
  { type: 'FOX', label: 'Tilki', emoji: '🦊', description: 'Zeki ve stratejik' },
];