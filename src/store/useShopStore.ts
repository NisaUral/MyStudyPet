import { create } from 'zustand';
import api from '../services/api';
import { ShopCategory, ShopItem, PurchaseResponse } from '../types/shop';

interface ShopState {
  items: ShopItem[];
  selectedCategory: ShopCategory;
  userCoins: number;
  isLoading: boolean;
  isPurchasing: boolean;
  errorMessage: string | null;

  // Eylemler
  setSelectedCategory: (category: ShopCategory) => void;
  setUserCoins: (coins: number) => void;
  fetchUserCoins: () => Promise<void>;
  fetchShopItems: (category?: ShopCategory) => Promise<void>;
  purchaseItem: (itemId: number) => Promise<{ success: boolean; message: string }>;
  resetError: () => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  items: [],
  selectedCategory: 'PET_ACCESSORY',
  userCoins: 0,
  isLoading: false,
  isPurchasing: false,
  errorMessage: null,

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().fetchShopItems(category);
  },

  setUserCoins: (coins) => set({ userCoins: coins }),

  resetError: () => set({ errorMessage: null }),

  // Kullanıcının güncel bakiyesini sunucudan çeker
  fetchUserCoins: async () => {
    try {
      const response = await api.get<{ coins: number }>('/users/me'); // veya bakiyeyi dönen profil endpoint'in
      if (response.data && typeof response.data.coins === 'number') {
        set({ userCoins: response.data.coins });
      }
    } catch {
      // Profil endpoint'i yoksa veya hata verirse akışı bozmaz
    }
  },

  fetchShopItems: async (category) => {
    const activeCat = category || get().selectedCategory;
    set({ isLoading: true, errorMessage: null });

    try {
      const response = await api.get<ShopItem[]>('/shop/items', {
        params: { category: activeCat },
      });
      set({ items: response.data, isLoading: false });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Mağaza ürünleri yüklenemedi.';
      set({ errorMessage: msg, isLoading: false });
    }
  },

  purchaseItem: async (itemId: number) => {
    set({ isPurchasing: true, errorMessage: null });

    try {
      const response = await api.post<PurchaseResponse>(`/shop/purchase/${itemId}`);
      const data = response.data;

      // Kalan bakiyeyi ve satın alınan eşyayı mağaza state'ine işle
      set((state) => {
        const updatedItems = state.items.map((item) =>
          item.id === itemId ? { ...item, isOwned: true } : item
        );

        return {
          items: updatedItems,
          userCoins: data.remainingCoins,
          isPurchasing: false,
        };
      });

      return { success: true, message: data.message };
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        'Satın alma işlemi tamamlanamadı.';
      set({ errorMessage: msg, isPurchasing: false });
      return { success: false, message: msg };
    }
  },
}));