import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types';

interface AuthState {
  token: string | null;
  userId: number | null;
  username: string | null;
  coinBalance: number;
  hasSelectedPet: boolean;
  hasRoom: boolean;
  roomCode: string | null;
  isLoading: boolean;

  setAuthData: (data: AuthResponse) => Promise<void>;
  updateCoinBalance: (newBalance: number) => void;
  setPetSelected: (status: boolean) => void;
  setRoomInfo: (roomCode: string) => void;
  logout: () => Promise<void>;
  loadPersistedAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  username: null,
  coinBalance: 0,
  hasSelectedPet: false,
  hasRoom: false,
  roomCode: null,
  isLoading: true,

  setAuthData: async (data: AuthResponse) => {
    await AsyncStorage.setItem('auth_token', data.token);
    set({
      token: data.token,
      userId: data.userId,
      username: data.username,
      coinBalance: data.coinBalance,
      hasSelectedPet: data.hasSelectedPet,
      hasRoom: data.hasRoom,
      roomCode: data.roomCode || null,
      isLoading: false,
    });
  },

  updateCoinBalance: (newBalance: number) => {
    set({ coinBalance: newBalance });
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
      hasSelectedPet: false,
      hasRoom: false,
      roomCode: null,
      isLoading: false,
    });
  },

  loadPersistedAuth: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    set({ token, isLoading: false });
  },
}));