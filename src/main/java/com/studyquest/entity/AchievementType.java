package com.studyquest.entity;

public enum AchievementType {
    FIRST_FOCUS("İlk Adım", "İlk odaklanma seansını tamamla", 50),
    STREAK_3("Ateş Başladı", "3 gün üst üste odaklan", 100),
    STREAK_7("Durdurulamaz", "7 günlük seriye ulaş", 250),
    NIGHT_OWL("Gece Kuşu", "Gece 00:00 - 05:00 arasında bir seans tamamla", 100),
    CENTURION("Odaklanma Ustası", "Toplam 100 dakika odaklanmaya ulaş", 200);

    private final String title;
    private final String description;
    private final int bonusCoins;

    AchievementType(String title, String description, int bonusCoins) {
        this.title = title;
        this.description = description;
        this.bonusCoins = bonusCoins;
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getBonusCoins() { return bonusCoins; }
}