import { create } from 'zustand';

export interface PlacedFurnitureState {
  instanceId: string;
  itemId: number;
  itemKey: string;
  gridX: number;
  gridY: number;
  rotation?: number;
}

interface RoomState {
  furnitures: PlacedFurnitureState[];
  isLoading: boolean;
  loadRoom: (roomCode: string) => Promise<void>;
  placeFurniture: (itemKey: string, gridX: number, gridY: number) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  furnitures: [
    {
      instanceId: 'furniture-1',
      itemId: 1,
      itemKey: 'DESK_WOODEN',
      gridX: 4,
      gridY: 4,
      rotation: 0,
    },
  ],
  isLoading: false,

  loadRoom: async (_roomCode: string) => {
    set({ isLoading: false });
  },

  placeFurniture: (itemKey: string, gridX: number, gridY: number) => {
    const current = get().furnitures;
    const newFurniture: PlacedFurnitureState = {
      instanceId: `furniture-${Date.now()}`,
      itemId: Date.now(),
      itemKey,
      gridX,
      gridY,
      rotation: 0,
    };
    set({ furnitures: [...current, newFurniture] });
  },
}));