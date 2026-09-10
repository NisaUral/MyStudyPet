import { create } from 'zustand';
import { studyApi } from '../api/studyApi';
import { useAuthStore } from './useAuthStore';

export type StudyStatus = 'IDLE' | 'RUNNING' | 'COMPLETED';

export interface UnlockedAchievement {
  type: string;
  title: string;
  description: string;
  bonusCoins: number;
}

export interface StudySessionResponse {
  earnedCoins: number;
  actualDurationMinutes: number;
  isCompleted: boolean;
  currentCoinBalance?: number;
  baseCoins?: number;
  multiplier?: number;
  totalEarnedCoins?: number;
  newTotalCoins?: number;
  currentStreak?: number;
  streakIncreased?: boolean;
  newlyUnlockedAchievements?: UnlockedAchievement[];
}

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
    // 1. ÖNCE state'i anında aktif et (UI ve sayaç gecikmeden başlasın)
    set({
      status: 'RUNNING',
      targetMinutes: minutes,
      remainingSeconds: minutes * 60,
      isFocusModeActive: true,
    });

    // 2. Arka planda backend'e bildir (Başarısız olsa dahi arayüzü durdurma)
    try {
      await studyApi.startStudy(minutes);
      console.log('[StudyStore] Backend seansı başarıyla başlattı.');
    } catch (error: any) {
      console.warn(
        '[StudyStore] Backend isteği başarısız oldu, yerel sayaçla devam ediliyor:',
        error?.message || error
      );
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
    const { targetMinutes, remainingSeconds } = get();
    
    // Geçen süreyi hesapla
    const totalSeconds = targetMinutes * 60;
    const elapsedSeconds = Math.max(0, totalSeconds - remainingSeconds);
    const elapsedMinutes = Math.max(1, Math.floor(elapsedSeconds / 60));

    // 1. ADIM: ARAYÜZÜ VE ODAKLANMA MODUNU ANINDA KAPAT (Bekleme yapma!)
    set({
      status: 'IDLE',
      isFocusModeActive: false,
      remainingSeconds: 0,
      lastReward: {
        earnedCoins: Math.max(5, elapsedMinutes * 2),
        totalEarnedCoins: Math.max(5, elapsedMinutes * 2),
        actualDurationMinutes: elapsedMinutes,
        isCompleted: false,
        baseCoins: Math.max(5, elapsedMinutes * 2),
        multiplier: 1.0,
        currentStreak: 1,
      },
      isRewardModalVisible: true,
    });

    // 2. ADIM: Backend'i arka planda bilgilendir (Kullanıcıyı bekletmez)
    try {
      const serverReward: any = await studyApi.cancelStudy();
      if (serverReward) {
        const newBalance = serverReward.currentCoinBalance ?? serverReward.newTotalCoins;
        if (newBalance !== undefined) {
          useAuthStore.getState().updateCoinBalance(newBalance);
        }
      }
    } catch (error) {
      console.warn('[useStudyStore] Backend iptal bildirimi başarısız oldu, yerel ödül korundu.');
    }
  },

  completeSession: async () => {
    const { targetMinutes } = get();

    let reward: StudySessionResponse = {
      earnedCoins: targetMinutes * 5,
      actualDurationMinutes: targetMinutes,
      isCompleted: true,
      totalEarnedCoins: targetMinutes * 5,
      baseCoins: targetMinutes * 5,
      multiplier: 1.2,
      currentStreak: 2,
    };

    try {
      const serverReward = await studyApi.completeStudy();
      if (serverReward) reward = serverReward;

      const newBalance = reward.currentCoinBalance ?? reward.newTotalCoins;
      if (newBalance !== undefined) {
        useAuthStore.getState().updateCoinBalance(newBalance);
      }
    } catch (error) {
      console.warn('[StudyStore] Backend tamamlama isteği başarısız, yerel ödül hesaplandı.');
    } finally {
      set({
        status: 'COMPLETED',
        isFocusModeActive: false,
        remainingSeconds: 0,
        lastReward: reward,
        isRewardModalVisible: true,
      });
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