export type FurnitureCategory = 'floor_decor' | 'furniture' | 'pet_toy';

export interface FurnitureItemMeta {
  id: string;
  name: string;
  category: FurnitureCategory;
  width: number;  // Grid genişliği (x ekseni)
  length: number; // Grid uzunluğu (y ekseni)
  emoji: string;
  isWalkable: boolean; // Pet üzerinden geçebilir mi? (Halı: true, Masa: false)
}

export interface PlacedFurnitureState {
  instanceId: string;
  itemId: string;
  gridX: number;
  gridY: number;
  rotation: number;
}

export const FURNITURE_CATALOG: FurnitureItemMeta[] = [
  // Halılar & Zemin
  { id: 'rug_boho', name: 'Bohem Halı', category: 'floor_decor', width: 2, length: 2, emoji: '🧶', isWalkable: true },
  { id: 'rug_round', name: 'Yuvarlak Halı', category: 'floor_decor', width: 2, length: 2, emoji: '🟤', isWalkable: true },

  // Mobilyalar
  { id: 'desk_wood', name: 'Çalışma Masası', category: 'furniture', width: 2, length: 1, emoji: '🪵', isWalkable: false },
  { id: 'chair_study', name: 'Çalışma Koltuğu', category: 'furniture', width: 1, length: 1, emoji: '🪑', isWalkable: false },
  { id: 'bookshelf', name: 'Kitaplık', category: 'furniture', width: 2, length: 1, emoji: '📚', isWalkable: false },
  { id: 'lamp_floor', name: 'Lambader', category: 'furniture', width: 1, length: 1, emoji: '💡', isWalkable: false },

  // Pet Oyuncakları
  { id: 'toy_ball', name: 'Oyun Topu', category: 'pet_toy', width: 1, length: 1, emoji: '⚽', isWalkable: true },
  { id: 'toy_mouse', name: 'Kurmalı Fare', category: 'pet_toy', width: 1, length: 1, emoji: '🐁', isWalkable: true },
];