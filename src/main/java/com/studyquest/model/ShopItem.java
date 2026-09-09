package com.studyquest.model;

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
    private String itemKey; // Örn: WIZARD_HAT, MODERN_DESK, VINTAGE_RUG

    @Column(nullable = false)
    private String name; // Görünen ad

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCategory category;

    @Column(nullable = false)
    private Integer price; // Coin cinsinden fiyat

    private String iconUrl; // Veya frontend asset referansı

    @Builder.Default
    private Boolean isAvailable = true;
}