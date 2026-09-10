package com.studyquest.repository;

import com.studyquest.entity.ShopItem;
import com.studyquest.model.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {

    Optional<ShopItem> findByItemKey(String itemKey);

    List<ShopItem> findByCategoryAndIsAvailableTrue(String category);

    // Enum ile gelen çağrılar için JPQL sorgusu:
    @Query("SELECT s FROM ShopItem s WHERE s.category = :#{#category.name()} AND s.isAvailable = true")
    List<ShopItem> findByCategoryAndIsAvailableTrue(@Param("category") ItemCategory category);

    List<ShopItem> findByIsAvailableTrue();
}