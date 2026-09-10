// src/api/studyApi.ts
export const studyApi = {
  // Seans başlatma (yerel simülasyon)
  startStudy: async (minutes: number) => {
    return Promise.resolve({ success: true, minutes });
  },

  // Seansı erken bitirme / pes etme
  cancelStudy: async () => {
    return Promise.resolve({
      earnedCoins: 10,
      actualDurationMinutes: 5,
      isCompleted: false,
      totalEarnedCoins: 10,
      baseCoins: 10,
      multiplier: 1.0,
      currentStreak: 1,
    });
  },

  // Seansı başarıyla tamamlama
  completeStudy: async () => {
    return Promise.resolve({
      earnedCoins: 50,
      actualDurationMinutes: 25,
      isCompleted: true,
      totalEarnedCoins: 50,
      baseCoins: 40,
      multiplier: 1.25,
      currentStreak: 2,
    });
  },
};