import { create } from 'zustand';
import { PlacedFurnitureState } from '../constants/furniture';
import { roomApi, SaveRoomLayoutPayload } from '../api/roomApi';
import api from '../services/api';

export interface AddFurnitureInput {
  furnitureType: string; // veya itemId
  gridX: number;
  gridY: number;
  rotation?: number;
}

interface RoomState {
  roomCode: string | null;
  ownerUsername: string | null;
  isOwner: boolean;
  wallpaperId: string;
  floorId: string;
  furnitures: PlacedFurnitureState[];
  isSaving: boolean;
  isLoading: boolean;

  loadRoom: (roomCode: string) => Promise<void>;
  saveCurrentLayout: () => Promise<void>;
  addOrUpdateFurniture: (item: PlacedFurnitureState) => void;
  removeFurniture: (instanceId: string) => void;
  addFurniture: (item: AddFurnitureInput) => Promise<void>; // <-- Interface'e eklendi
}

export const useRoomStore = create<RoomState>((set, get) => ({
  roomCode: null,
  ownerUsername: null,
  isOwner: false,
  wallpaperId: 'default_wallpaper',
  floorId: 'default_floor',
  furnitures: [],
  isSaving: false,
  isLoading: false,

  loadRoom: async (roomCode: string) => {
    set({ isLoading: true });
    try {
      const data = await roomApi.getRoomDetail(roomCode);
      const mappedFurnitures: PlacedFurnitureState[] = data.furnitures.map((f, idx) => ({
        instanceId: `furn_${f.itemId}_${idx}_${Date.now()}`,
        itemId: f.itemId,
        gridX: f.gridX,
        gridY: f.gridY,
        rotation: f.rotation,
      }));

      set({
        roomCode: data.roomCode,
        ownerUsername: data.ownerUsername,
        isOwner: data.isOwner,
        wallpaperId: data.wallpaperId,
        floorId: data.floorId,
        furnitures: mappedFurnitures,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  saveCurrentLayout: async () => {
    const { wallpaperId, floorId, furnitures, isOwner } = get();
    if (!isOwner) return;

    set({ isSaving: true });
    try {
      const payload: SaveRoomLayoutPayload = {
        wallpaperId,
        floorId,
        furnitures: furnitures.map((f) => ({
          itemId: f.itemId,
          gridX: f.gridX,
          gridY: f.gridY,
          rotation: f.rotation,
        })),
      };

      await roomApi.saveLayout(payload);
      set({ isSaving: false });
    } catch (error) {
      set({ isSaving: false });
      throw error;
    }
  },

  addOrUpdateFurniture: (item: PlacedFurnitureState) => {
    set((state) => {
      const filtered = state.furnitures.filter((f) => f.instanceId !== item.instanceId);
      return { furnitures: [...filtered, item] };
    });
  },

  removeFurniture: (instanceId: string) => {
    set((state) => ({
      furnitures: state.furnitures.filter((f) => f.instanceId !== instanceId),
    }));
  },

  addFurniture: async (input: AddFurnitureInput) => {
    const newPlacedItem: PlacedFurnitureState = {
      instanceId: `furn_${input.furnitureType}_${Date.now()}`,
      itemId: input.furnitureType,
      gridX: input.gridX,
      gridY: input.gridY,
      rotation: input.rotation ?? 0,
    };

    // 1. Ekranın hemen güncellenmesi için yerel listeye ekle
    set((state) => ({
      furnitures: [...state.furnitures, newPlacedItem],
    }));

    // 2. Mevcut oda düzenini kaydet
    try {
      await get().saveCurrentLayout();
    } catch (error) {
      console.warn('Oda düzeni kaydedilirken hata oluştu (yerel state korundu):', error);
    }
  },
}));