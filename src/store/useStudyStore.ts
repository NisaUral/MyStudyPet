import { create } from 'zustand';
import { studyApi, StudySessionResponse } from '../api/studyApi';
import { useAuthStore } from './useAuthStore';

export type StudyStatus = 'IDLE' | 'RUNNING' | 'COMPLETED';

interface StudyState {
  status: StudyStatus;
  targetMinutes: number;
  remainingSeconds: number;
  isFocusModeActive: boolean;
  lastReward: StudySessionResponse | null;
  isRewardModalVisible: boolean;

  startSession: (minutes: number) => Promise<void>;
  tick: () => void;
  stopSessionEarly: () => Promise<void>;
  completeSession: () => Promise<void>;
  closeRewardModal: () => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  status: 'IDLE',
  targetMinutes: 0,
  remainingSeconds: 0,
  isFocusModeActive: false,
  lastReward: null,
  isRewardModalVisible: false,

  startSession: async (minutes: number) => {
    try {
      await studyApi.startStudy(minutes);
      set({
        status: 'RUNNING',
        targetMinutes: minutes,
        remainingSeconds: minutes * 60,
        isFocusModeActive: true,
      });
    } catch (error: any) {
      throw error;
    }
  },

  tick: () => {
    const { remainingSeconds, completeSession } = get();
    if (remainingSeconds <= 1) {
      completeSession();
    } else {
      set({ remainingSeconds: remainingSeconds - 1 });
    }
  },

  stopSessionEarly: async () => {
    try {
      const reward = await studyApi.cancelStudy();
      useAuthStore.getState().updateCoinBalance(reward.currentCoinBalance);

      set({
        status: 'IDLE',
        isFocusModeActive: false,
        remainingSeconds: 0,
        lastReward: reward,
        isRewardModalVisible: true,
      });
    } catch (error) {
      set({ status: 'IDLE', isFocusModeActive: false });
    }
  },

  completeSession: async () => {
    try {
      const reward = await studyApi.completeStudy();
      useAuthStore.getState().updateCoinBalance(reward.currentCoinBalance);

      set({
        status: 'COMPLETED',
        isFocusModeActive: false,
        remainingSeconds: 0,
        lastReward: reward,
        isRewardModalVisible: true,
      });
    } catch (error) {
      set({ status: 'IDLE', isFocusModeActive: false });
    }
  },

  closeRewardModal: () => {
    set({
      status: 'IDLE',
      isRewardModalVisible: false,
      lastReward: null,
    });
  },
}));