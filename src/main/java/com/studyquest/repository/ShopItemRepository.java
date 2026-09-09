package com.studyquest.repository;

import com.studyquest.model.ItemCategory;
import com.studyquest.model.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {
    List<ShopItem> findByIsAvailableTrue();
    List<ShopItem> findByCategoryAndIsAvailableTrue(ItemCategory category);
    Optional<ShopItem> findByItemKey(String itemKey);
}