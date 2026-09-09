package com.studyquest.dto.response;

import com.studyquest.model.ItemCategory;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShopItemResponseDTO {
    private Long id;
    private String itemKey;
    private String name;
    private String description;
    private ItemCategory category;
    private Integer price;
    private String iconUrl;
    private Boolean isOwned; // Giriş yapmış kullanıcı bu eşyaya sahip mi?
}