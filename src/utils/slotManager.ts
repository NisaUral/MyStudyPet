// src/utils/slotManager.ts

export const TOTAL_DESK_COUNT = 4;

/**
 * Mevcut odadaki oda arkadaşlarının tuttukları slotlara bakarak
 * ilk boş olan masa indeksini (0..3) döner.
 * Eğer oda tamamen doluysa -1 döner.
 */
export const findFirstAvailableSlot = (
  occupiedSlots: number[],
  preferredSlot?: number
): number => {
  const occupiedSet = new Set(occupiedSlots);

  // Eğer kullanıcının tercih ettiği slot boşsa onu ver
  if (preferredSlot !== undefined && preferredSlot >= 0 && preferredSlot < TOTAL_DESK_COUNT) {
    if (!occupiedSet.has(preferredSlot)) {
      return preferredSlot;
    }
  }

  // Aksi halde ilk boş slotu bul
  for (let i = 0; i < TOTAL_DESK_COUNT; i++) {
    if (!occupiedSet.has(i)) {
      return i;
    }
  }

  return -1; // Oda dolu
};