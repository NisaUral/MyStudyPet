// src/constants/roomSlots.ts
export interface RoomSlot {
  gridX: number;
  gridY: number;
}

// Odanın ferah görünmesi için önceden belirlenmiş 5 misafir slotu
// Ev sahibinin kendi peti varsayılan olarak (4, 4) merkezindedir.
export const GUEST_SLOTS: RoomSlot[] = [
  { gridX: 2, gridY: 3 },
  { gridX: 5, gridY: 2 },
  { gridX: 2, gridY: 5 },
  { gridX: 6, gridY: 4 },
  { gridX: 3, gridY: 6 },
];