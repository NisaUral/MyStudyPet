package com.studyquest.service;

import com.studyquest.dto.response.PurchaseResponseDTO;
import com.studyquest.dto.response.ShopItemResponseDTO;
import com.studyquest.exception.BadRequestException;
import com.studyquest.repository.ShopItemRepository;
import com.studyquest.repository.UserInventoryRepository;
import com.studyquest.repository.UserRepository;

// Entity paketinden doğru ShopItem import edildi:
import com.studyquest.entity.User;
import com.studyquest.entity.ShopItem;
import com.studyquest.entity.UserInventory;
import com.studyquest.model.ItemCategory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                ? shopItemRepository.findByCategoryAndIsAvailableTrue(category.name())
                : shopItemRepository.findByIsAvailableTrue();

        // Kullanıcının halihazırda sahip olduğu eşyaların ID kümesi
        Set<Long> ownedItemIds = inventoryRepository.findByUserIdWithShopItem(user.getId())
                .stream()
                .map(ui -> ui.getShopItem().getId())
                .collect(Collectors.toSet());

        return items.stream().map(item -> ShopItemResponseDTO.builder()
                .id(item.getId())
                .itemKey(item.getItemKey())
                .name(item.getName())
                .description(item.getDescription())
                .category(ItemCategory.valueOf(item.getCategory()))
                .price(item.getPrice())
                .iconUrl(item.getIconUrl())
                .isOwned(ownedItemIds.contains(item.getId()))
                .build()
        ).collect(Collectors.toList());
    } // <-- EKSİK OLAN KAPATMA PARANTEZİ EKLENDİ

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

        // 4. Envantere ekle (Saf Java Constructor)
        UserInventory inventory = new UserInventory();
        inventory.setUser(user);
        inventory.setShopItem(item);
        inventory.setPurchasedAt(Instant.now());

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
   /**
     * Kullanıcının sahip olduğu tüm eşyaların listesi
     */
    @Transactional(readOnly = true)
    public List<ShopItemResponseDTO> getUserInventory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Kullanıcı bulunamadı"));

        List<UserInventory> inventoryList = inventoryRepository.findByUserIdWithShopItem(user.getId());
        List<ShopItemResponseDTO> responseList = new java.util.ArrayList<>();

        for (UserInventory ui : inventoryList) {
            ShopItem item = ui.getShopItem();
            
            // Kategori enum veya string kontrolü:
            ItemCategory categoryEnum = null;
            if (item.getCategory() != null) {
                try {
                    categoryEnum = ItemCategory.valueOf(item.getCategory());
                } catch (IllegalArgumentException e) {
                    // Veritabanındaki değer enum ile tam eşleşmezse null geçer
                    categoryEnum = null;
                }
            }

            ShopItemResponseDTO dto = ShopItemResponseDTO.builder()
                    .id(item.getId())
                    .itemKey(item.getItemKey())
                    .name(item.getName())
                    .description(item.getDescription())
                    // Eğer DTO'da category String ise -> .category(item.getCategory())
                    // Eğer DTO'da category ItemCategory ise -> .category(categoryEnum)
                    .category(categoryEnum) 
                    .price(item.getPrice())
                    .iconUrl(item.getIconUrl())
                    .isOwned(true)
                    .build();

            responseList.add(dto);
        }

        return responseList;
    }
}