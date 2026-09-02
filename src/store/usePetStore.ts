import { create } from 'zustand';
import { Pet } from '../types';
import { petApi, UpdateAccessoriesPayload } from '../api/petApi';

interface PetState {
  pet: Pet | null;
  isLoading: boolean;
  setPet: (pet: Pet) => void;
  fetchMyPet: () => Promise<void>;
  updateAccessories: (payload: UpdateAccessoriesPayload) => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  pet: null,
  isLoading: false,

  setPet: (pet: Pet) => set({ pet }),

  fetchMyPet: async () => {
    set({ isLoading: true });
    try {
      const pet = await petApi.getMyPet();
      set({ pet, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateAccessories: async (payload: UpdateAccessoriesPayload) => {
    set({ isLoading: true });
    try {
      const updated = await petApi.updateAccessories(payload);
      set({ pet: updated, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));