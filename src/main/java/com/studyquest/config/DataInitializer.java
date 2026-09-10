package com.studyquest.config;

// KESİNLİKLE BU SATIR OLMALI:
import com.studyquest.entity.ShopItem;
import com.studyquest.repository.ShopItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ShopItemRepository shopItemRepository;

    @Override
    public void run(String... args) {
        if (shopItemRepository.count() == 0) {
            log.info("[DATA INIT] Mağaza eşyaları veritabanına yükleniyor...");

            List<ShopItem> items = new ArrayList<>();

            items.add(ShopItem.builder()
                    .itemKey("DESK_WOODEN")
                    .name("Ahşap Çalışma Masası")
                    .description("Odaklanmak için sade ve klasik meşe masa.")
                    .category("FURNITURE")
                    .price(150)
                    .iconUrl("desk_wooden")
                    .isAvailable(true)
                    .build());

            items.add(ShopItem.builder()
                    .itemKey("BOOKSHELF_OAK")
                    .name("Kitaplık")
                    .description("Çalışma kitaplarını ve notları dizebileceğin raf.")
                    .category("FURNITURE")
                    .price(200)
                    .iconUrl("bookshelf_oak")
                    .isAvailable(true)
                    .build());

            items.add(ShopItem.builder()
                    .itemKey("PLANT_MONSTERA")
                    .name("Monstera Bitkisi")
                    .description("Odaya ferahlık katan yeşil yapraklı saksı çiçeği.")
                    .category("FURNITURE")
                    .price(80)
                    .iconUrl("plant_monstera")
                    .isAvailable(true)
                    .build());

            items.add(ShopItem.builder()
                    .itemKey("COZY_LAMP")
                    .name("Sıcak Gece Lambası")
                    .description("Gece çalışmaları için gözü yormayan sarı ışık.")
                    .category("FURNITURE")
                    .price(120)
                    .iconUrl("cozy_lamp")
                    .isAvailable(true)
                    .build());

            items.add(ShopItem.builder()
                    .itemKey("HAT_WIZARD")
                    .name("Büyücü Şapkası")
                    .description("Petine +10 bilgelik katan mor şapka.")
                    .category("PET_ACCESSORY")
                    .price(100)
                    .iconUrl("hat_wizard")
                    .isAvailable(true)
                    .build());

            items.add(ShopItem.builder()
                    .itemKey("GLASSES_STUDIOUS")
                    .name("Ders Çalışma Gözlüğü")
                    .description("Ciddi ve entelektüel bir hava katar.")
                    .category("PET_ACCESSORY")
                    .price(90)
                    .iconUrl("glasses_studious")
                    .isAvailable(true)
                    .build());

            items.add(ShopItem.builder()
                    .itemKey("BOW_RED")
                    .name("Kırmızı Papyon")
                    .description("Önemli sınav günleri için şık bir papyon.")
                    .category("PET_ACCESSORY")
                    .price(60)
                    .iconUrl("bow_red")
                    .isAvailable(true)
                    .build());

            items.add(ShopItem.builder()
                    .itemKey("FLOOR_WOOD_DARK")
                    .name("Koyu Ahşap Parke")
                    .description("Odaya modern bir zemin dokusu kazandırır.")
                    .category("WALLPAPER")
                    .price(250)
                    .iconUrl("floor_wood_dark")
                    .isAvailable(true)
                    .build());

            items.add(ShopItem.builder()
                    .itemKey("WALLPAPER_BRICK")
                    .name("Tuğla Duvar Deseni")
                    .description("Endüstriyel kafe tarzı çalışma ortamı.")
                    .category("WALLPAPER")
                    .price(250)
                    .iconUrl("wallpaper_brick")
                    .isAvailable(true)
                    .build());

            for (ShopItem item : items) {
                shopItemRepository.save(item);
            }

            log.info("[DATA INIT] {} adet mağaza ürünü başarıyla eklendi!", items.size());
        }
    }
}