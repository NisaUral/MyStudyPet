package com.studyquest.entity;

import com.studyquest.entity.enums.PetType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PetType type;

    // Seçilen kozmetik donanımların referans ID'leri (veya slug)
    private String equippedHat;
    private String equippedGlasses;
    private String equippedAccessory;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
}