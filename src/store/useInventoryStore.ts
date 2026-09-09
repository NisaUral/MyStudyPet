import { create } from 'zustand';
import api from '../services/api';
import { ShopItem, ShopCategory } from '../types/shop';

interface InventoryState {
  inventoryItems: ShopItem[];
  isLoading: boolean;
  fetchInventory: () => Promise<void>;
  getOwnedAccessories: () => ShopItem[];
  getOwnedFurnitures: () => ShopItem[];
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventoryItems: [],
  isLoading: false,

  fetchInventory: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<ShopItem[]>('/shop/inventory');
      set({ inventoryItems: response.data, isLoading: false });
    } catch (error) {
      console.error('Envanter çekilemedi:', error);
      set({ isLoading: false });
    }
  },

  getOwnedAccessories: () => {
    return get().inventoryItems.filter((i) => i.category === 'PET_ACCESSORY');
  },

  getOwnedFurnitures: () => {
    return get().inventoryItems.filter((i) => i.category === 'FURNITURE');
  },
}));