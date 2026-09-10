import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types';

interface AuthState {
  token: string | null;
  userId: number | null;
  username: string | null;
  coinBalance: number;
  inventory: string[]; // Satın alınan itemKey'ler (örn: ['DESK_WOODEN', 'HAT_WIZARD'])
  hasSelectedPet: boolean;
  hasRoom: boolean;
  roomCode: string | null;
  isLoading: boolean;

  // Diğer ekranların user?.coins veya user?.inventory okuyabilmesi için getter/alan:
  user: {
    username: string;
    coins: number;
    inventory: string[];
  } | null;

  setAuthData: (data: AuthResponse) => Promise<void>;
  updateCoinBalance: (newBalance: number) => void;
  buyItem: (itemKey: string, price: number) => boolean;
  setPetSelected: (status: boolean) => void;
  setRoomInfo: (roomCode: string) => void;
  logout: () => Promise<void>;
  loadPersistedAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  userId: null,
  username: 'Misafir',
  coinBalance: 500, // Test edebilmen için varsayılan 500 coin
  inventory: [],
  hasSelectedPet: false,
  hasRoom: false,
  roomCode: null,
  isLoading: true,

  user: {
    username: 'Misafir',
    coins: 500,
    inventory: [],
  },

  setAuthData: async (data: AuthResponse) => {
    await AsyncStorage.setItem('auth_token', data.token);
    const balance = data.coinBalance ?? 500;
    const name = data.username ?? 'Misafir';

    set({
      token: data.token,
      userId: data.userId,
      username: name,
      coinBalance: balance,
      hasSelectedPet: data.hasSelectedPet,
      hasRoom: data.hasRoom,
      roomCode: data.roomCode || null,
      isLoading: false,
      user: {
        username: name,
        coins: balance,
        inventory: get().inventory,
      },
    });
  },

  // Coin güncelleme (Çalışma bitince veya harcama olunca)
  updateCoinBalance: (newBalance: number) => {
    set((state) => ({
      coinBalance: newBalance,
      user: state.user ? { ...state.user, coins: newBalance } : null,
    }));
  },

  // Satın Alma: Coin yeterliyse düşer, envantere ekler ve true döner
  buyItem: (itemKey: string, price: number) => {
    const { coinBalance, inventory, username } = get();

    if (coinBalance < price) {
      return false; // Yetersiz bakiye
    }

    if (inventory.includes(itemKey)) {
      return true; // Zaten sahip
    }

    const nextBalance = coinBalance - price;
    const nextInventory = [...inventory, itemKey];

    set({
      coinBalance: nextBalance,
      inventory: nextInventory,
      user: {
        username: username || 'Misafir',
        coins: nextBalance,
        inventory: nextInventory,
      },
    });

    return true;
  },

  setPetSelected: (status: boolean) => {
    set({ hasSelectedPet: status });
  },

  setRoomInfo: (roomCode: string) => {
    set({ hasRoom: true, roomCode });
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    set({
      token: null,
      userId: null,
      username: null,
      coinBalance: 0,
      inventory: [],
      hasSelectedPet: false,
      hasRoom: false,
      roomCode: null,
      isLoading: false,
      user: null,
    });
  },

  loadPersistedAuth: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    set({ token, isLoading: false });
  },
}));