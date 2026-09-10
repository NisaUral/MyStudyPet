package com.studyquest.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.studyquest.entity.ShopItem;

@Entity
@Table(
    name = "user_inventories",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "shop_item_id"})
    },
    indexes = {
        @Index(name = "idx_user_inventory_user_id", columnList = "user_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_item_id", nullable = false)
    private ShopItem shopItem;

    @Column(nullable = false)
    private Instant purchasedAt;
}