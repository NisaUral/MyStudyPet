package com.studyquest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String itemKey;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String category; // FURNITURE, PET_ACCESSORY, WALLPAPER

    @Column(nullable = false)
    private Integer price;

    private String iconUrl;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    // Lombok karmaşasını önlemek için builder'a açık bir isAvailable metodu ekleyelim:
    public static class ShopItemBuilder {
        private Boolean isAvailable = true;

        public ShopItemBuilder isAvailable(Boolean isAvailable) {
            this.isAvailable = isAvailable;
            return this;
        }
    }
}