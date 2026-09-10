import { create } from 'zustand';

export interface PetData {
  id: string;
  name: string;
  type: 'CAT' | 'DOG' | 'FISH';
  equippedHat?: string | null;
  equippedGlasses?: string | null;
  equippedAccessory?: string | null;
}

interface PetState {
  pet: PetData | null;
  isLoading: boolean;
  fetchMyPet: () => Promise<void>;
  updateAccessories: (payload: any) => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  pet: {
    id: 'pet-1',
    name: 'Pamuk',
    type: 'CAT',
    equippedHat: null,
    equippedGlasses: null,
    equippedAccessory: null,
  },
  isLoading: false,

  fetchMyPet: async () => {
    // Network Error vermemesi için backend isteğini kaldırdık:
    set({ isLoading: false });
  },

  updateAccessories: async (payload: any) => {
    const currentPet = get().pet;
    if (currentPet) {
      set({
        pet: {
          ...currentPet,
          ...payload,
        },
      });
    }
    return Promise.resolve();
  },
}));