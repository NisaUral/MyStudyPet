export type ShopCategory = 'PET_ACCESSORY' | 'FURNITURE' | 'WALLPAPER';

export interface ShopItem {
  id: number;
  itemKey: string;
  name: string;
  description: string;
  category: ShopCategory;
  price: number;
  iconUrl?: string;
  isOwned: boolean;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  remainingCoins: number;
  purchasedItemKey: string;
}