package com.studyquest.service;

import com.studyquest.dto.response.PurchaseResponseDTO;
import com.studyquest.dto.response.ShopItemResponseDTO;
import com.studyquest.exception.BadRequestException;
import com.studyquest.model.*;
import com.studyquest.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.studyquest.entity.*;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopItemRepository shopItemRepository;
    private final UserInventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    /**
     * Mağazadaki ürünleri kullanıcının sahiplik durumuna göre listeleme
     */
    @Transactional(readOnly = true)
    public List<ShopItemResponseDTO> getShopItems(String username, ItemCategory category) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Kullanıcı bulunamadı"));

        List<ShopItem> items = (category != null)
                ? shopItemRepository.findByCategoryAndIsAvailableTrue(category)
                : shopItemRepository.findByIsAvailableTrue();

        // Kullanıcının halihazırda sahip olduğu eşyaların ID kümesi
        Set<Long> ownedItemIds = inventoryRepository.findByUserIdWithItem(user.getId())
                .stream()
                .map(ui -> ui.getShopItem().getId())
                .collect(Collectors.toSet());

        return items.stream().map(item -> ShopItemResponseDTO.builder()
                .id(item.getId())
                .itemKey(item.getItemKey())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .price(item.getPrice())
                .iconUrl(item.getIconUrl())
                .isOwned(ownedItemIds.contains(item.getId()))
                .build()
        ).collect(Collectors.toList());
    }

    /**
     * Eşya Satın Alma İşlemi (Atomic Transaction)
     */
    @Transactional
    public PurchaseResponseDTO purchaseItem(String username, Long itemId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Kullanıcı bulunamadı"));

        ShopItem item = shopItemRepository.findById(itemId)
                .orElseThrow(() -> new BadRequestException("Satın alınmak istenen ürün bulunamadı"));

        if (!item.getIsAvailable()) {
            throw new BadRequestException("Bu ürün şu anda satışa kapalı.");
        }

        // 1. Zaten sahip mi kontrolü
        if (inventoryRepository.existsByUserIdAndShopItemId(user.getId(), item.getId())) {
            throw new BadRequestException("Bu eşyaya zaten sahipsiniz.");
        }

        // 2. Bakiye kontrolü
        int currentCoins = user.getCoins() != null ? user.getCoins() : 0;
        if (currentCoins < item.getPrice()) {
            throw new BadRequestException(
                String.format("Yetersiz bakiye! Gerekli: %d Coin, Mevcut: %d Coin", item.getPrice(), currentCoins)
            );
        }

        // 3. Bakiyeden düş
        user.setCoins(currentCoins - item.getPrice());
        userRepository.save(user);

        // 4. Envantere ekle
        UserInventory inventory = UserInventory.builder()
                .user(user)
                .shopItem(item)
                .purchasedAt(Instant.now())
                .build();
        inventoryRepository.save(inventory);

        log.info("[MAĞAZA] Kullanıcı: {} -> Ürün Satın Aldı: {} (Kalan Coin: {})",
                username, item.getName(), user.getCoins());

        return PurchaseResponseDTO.builder()
                .success(true)
                .message("Satın alma işlemi başarıyla tamamlandı! Güle güle kullanın 🎉")
                .remainingCoins(user.getCoins())
                .purchasedItemKey(item.getItemKey())
                .build();
    }

    /**
     * Kullanıcının sahip olduğu tüm eşyaların listesi
     */
    @Transactional(readOnly = true)
    public List<ShopItemResponseDTO> getUserInventory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Kullanıcı bulunamadı"));

        return inventoryRepository.findByUserIdWithItem(user.getId())
                .stream()
                .map(ui -> ShopItemResponseDTO.builder()
                        .id(ui.getShopItem().getId())
                        .itemKey(ui.getShopItem().getItemKey())
                        .name(ui.getShopItem().getName())
                        .description(ui.getShopItem().getDescription())
                        .category(ui.getShopItem().getCategory())
                        .price(ui.getShopItem().getPrice())
                        .iconUrl(ui.getShopItem().getIconUrl())
                        .isOwned(true)
                        .build()
                ).collect(Collectors.toList());
    }
}