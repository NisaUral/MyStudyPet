package com.studyquest.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PurchaseResponseDTO {
    private boolean success;
    private String message;
    private Integer remainingCoins;
    private String purchasedItemKey;
}