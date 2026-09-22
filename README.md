# MyStudyPet

> ⚠️ **Durum: Geliştirme aşamasında (yarım kalmış proje).** Veritabanı entegrasyonu ve kullanıcı girişi henüz tamamlanmadı. Bu README, projenin hedeflediği vizyonu ve şu ana kadar kurulan altyapıyı anlatıyor.

Çalışma motivasyonunu artırmak için tasarlanmış, sosyal ve oyunlaştırılmış (gamified) bir "çalışma odası" mobil uygulaması. Kullanıcılar kendi sanal odalarını süsleyip bir evcil hayvan besliyor, arkadaşlarını kendi odalarına davet ederek birlikte ders çalışabiliyor.

## Vizyon / Hedeflenen Özellikler

- **Evcil hayvan seçimi:** Kullanıcı 10 farklı evcil hayvandan birini seçip ona isim veriyor
- **Oda süsleme:** Çalışarak kazanılan (planlanan) para ile kişisel çalışma odası özelleştiriliyor
- **Sosyal çalışma:** Bir kullanıcı, arkadaşının oda koduyla onun odasına girip birlikte (paralel) çalışabiliyor
- **Canlı evcil hayvan animasyonları:** Kullanıcı çalışırken evcil hayvan oyun oynuyor ya da uyuyor
- **Anlık mesajlaşma:** Aynı odadaki kullanıcılar arasında animasyonlu mesajlaşma

## Şu Ana Kadar Kurulan Altyapı

- **Frontend:** React Native (Expo) + TypeScript (`App.tsx`)
- **Backend:** Java, Maven ile yapılandırılmış (`pom.xml`) — muhtemelen Spring Boot
- **Docker Compose:** Backend ve ileride eklenecek veritabanı servislerini birlikte ayağa kaldırmak için yapılandırılıyor

## Eksik / Devam Eden Kısımlar

- Veritabanı entegrasyonu henüz yapılmadı
- Kullanıcı kimlik doğrulama (giriş/kayıt) henüz eklenmedi
- Sosyal oda ve mesajlaşma özellikleri planlandı, henüz tam uygulanmadı

## Kurulum (mevcut haliyle)

```bash
npm install
npx expo start
```

Backend için:
```bash
docker-compose up
```
