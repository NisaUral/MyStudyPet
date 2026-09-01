package com.studyquest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "placed_furnitures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacedFurniture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String itemId; // Eşyanın katalog kodu (örn: "sofa_red_01")

    // İzometrik Grid Pozisyonları
    @Column(nullable = false)
    private Integer gridX;

    @Column(nullable = false)
    private Integer gridY;

    @Column(nullable = false)
    private Integer rotation; // 0, 90, 180, 270 derece

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
}