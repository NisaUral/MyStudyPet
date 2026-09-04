import apiClient from './client';

export interface StudySessionResponse {
  sessionId: number;
  targetDurationMinutes: number;
  actualDurationMinutes: number;
  earnedCoins: number;
  isCompleted: boolean;
  startedAt: string;
  endedAt?: string;
  currentCoinBalance: number;
}

export const studyApi = {
  // Seansı sunucuda başlat
  startStudy: async (targetDurationMinutes: number): Promise<StudySessionResponse> => {
    const res = await apiClient.post<StudySessionResponse>('/study/start', {
      targetDurationMinutes,
    });
    return res.data;
  },

  // Süre bittiğinde oturumu tamamla
  completeStudy: async (): Promise<StudySessionResponse> => {
    const res = await apiClient.post<StudySessionResponse>('/study/complete');
    return res.data;
  },

  // Erken sonlandır
  cancelStudy: async (): Promise<StudySessionResponse> => {
    const res = await apiClient.post<StudySessionResponse>('/study/cancel');
    return res.data;
  },

  // Uygulama açılışında yarım kalan seans kontrolü
  getActiveSession: async (): Promise<StudySessionResponse | null> => {
    const res = await apiClient.get<StudySessionResponse | null>('/study/active');
    return res.data;
  },
};