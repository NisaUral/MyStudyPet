package com.studyquest.repository;

import com.studyquest.entity.UserInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInventoryRepository extends JpaRepository<UserInventory, Long> {

    @Query("SELECT ui FROM UserInventory ui JOIN FETCH ui.shopItem WHERE ui.user.id = :userId")
    List<UserInventory> findByUserIdWithShopItem(@Param("userId") Long userId);

    @Query("SELECT ui FROM UserInventory ui JOIN FETCH ui.shopItem WHERE ui.user.id = :userId")
    List<UserInventory> findByUserIdWithItem(@Param("userId") Long userId);

    boolean existsByUserIdAndShopItemId(Long userId, Long shopItemId);
}