package com.studyquest.controller;

import com.studyquest.dto.response.PurchaseResponseDTO;
import com.studyquest.dto.response.ShopItemResponseDTO;
import com.studyquest.model.ItemCategory;
import com.studyquest.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    /**
     * GET /api/shop/items?category=FURNITURE
     */
    @GetMapping("/items")
    public ResponseEntity<List<ShopItemResponseDTO>> getItems(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) ItemCategory category
    ) {
        return ResponseEntity.ok(shopService.getShopItems(userDetails.getUsername(), category));
    }

    /**
     * POST /api/shop/purchase/{itemId}
     */
    @PostMapping("/purchase/{itemId}")
    public ResponseEntity<PurchaseResponseDTO> purchaseItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.ok(shopService.purchaseItem(userDetails.getUsername(), itemId));
    }

    /**
     * GET /api/shop/inventory
     */
    @GetMapping("/inventory")
    public ResponseEntity<List<ShopItemResponseDTO>> getInventory(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(shopService.getUserInventory(userDetails.getUsername()));
    }
}