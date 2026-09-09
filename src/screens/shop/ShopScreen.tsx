import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { Theme } from '../../theme';
import { useShopStore } from '../../store/useShopStore';
import { ShopCategory, ShopItem } from '../../types/shop';

const CATEGORIES: { key: ShopCategory; label: string; emoji: string }[] = [
  { key: 'PET_ACCESSORY', label: 'Aksesuarlar', emoji: '🎀' },
  { key: 'FURNITURE', label: 'Mobilyalar', emoji: '🪑' },
  { key: 'WALLPAPER', label: 'Duvar Kağıdı', emoji: '🖼️' },
];

export const ShopScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    items,
    selectedCategory,
    userCoins,
    isLoading,
    isPurchasing,
    setSelectedCategory,
    fetchShopItems,
    fetchUserCoins,
    purchaseItem,
  } = useShopStore();

  const [selectedItemToBuy, setSelectedItemToBuy] = useState<ShopItem | null>(null);

  useEffect(() => {
    fetchUserCoins();
    fetchShopItems(selectedCategory);
  }, []);

  const handleConfirmPurchase = async () => {
    if (!selectedItemToBuy) return;

    const result = await purchaseItem(selectedItemToBuy.id);
    setSelectedItemToBuy(null);

    if (result.success) {
      Alert.alert('Hayırlı Olsun! 🎉', result.message);
    } else {
      Alert.alert('İşlem Başarısız', result.message);
    }
  };

  const renderItem = ({ item }: { item: ShopItem }) => {
    const canAfford = userCoins >= item.price;

    return (
      <View style={[styles.card, item.isOwned && styles.cardOwned]}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemEmoji}>
            {item.category === 'PET_ACCESSORY'
              ? '👑'
              : item.category === 'FURNITURE'
              ? '🛋️'
              : '🎨'}
          </Text>
          {item.isOwned && (
            <View style={styles.ownedBadge}>
              <Text style={styles.ownedBadgeText}>SAHİPSİN</Text>
            </View>
          )}
        </View>

        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description || 'Çalışma odanı özelleştir.'}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.priceRow}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>

          {item.isOwned ? (
            <View style={styles.ownedButton}>
              <Text style={styles.ownedButtonText}>Envanterde</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.buyButton,
                !canAfford && styles.buyButtonDisabled,
              ]}
              onPress={() => setSelectedItemToBuy(item)}
              disabled={!canAfford || isPurchasing}
            >
              <Text style={styles.buyButtonText}>
                {canAfford ? 'Satın Al' : 'Yetersiz'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar: Geri Butonu + Bakiye */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>

        <View style={styles.coinContainer}>
          <Text style={styles.coinBadgeIcon}>🪙</Text>
          <Text style={styles.coinBadgeText}>{userCoins}</Text>
        </View>
      </View>

      <Text style={styles.title}>Study Room Mağazası</Text>

      {/* Kategori Sekmeleri */}
      <View style={styles.tabsContainer}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text style={styles.tabEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Ürün Listesi */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Ürünler listeleniyor...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Bu kategoride henüz ürün yok.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Satın Alma Onay Modalı */}
      <Modal
        visible={!!selectedItemToBuy}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItemToBuy(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Satın Alma Onayı</Text>
            <Text style={styles.modalMessage}>
              <Text style={{ fontWeight: 'bold' }}>{selectedItemToBuy?.name}</Text>{' '}
              ürününü satın almak istiyor musunuz?
            </Text>

            <View style={styles.modalPriceRow}>
              <Text style={styles.modalPriceLabel}>Fiyat:</Text>
              <Text style={styles.modalPriceVal}>
                🪙 {selectedItemToBuy?.price} Coin
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setSelectedItemToBuy(null)}
                disabled={isPurchasing}
              >
                <Text style={styles.cancelBtnText}>Vazgeç</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirmPurchase}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.confirmBtnText}>Onayla</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  backButtonText: {
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
    gap: 6,
  },
  coinBadgeIcon: {
    fontSize: 16,
  },
  coinBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B45309',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface,
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  activeTabButton: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(108, 92, 231, 0.08)',
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  activeTabLabel: {
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardOwned: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemEmoji: {
    fontSize: 32,
  },
  ownedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ownedBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFF',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginBottom: 12,
    height: 30,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinIcon: {
    fontSize: 14,
  },
  priceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  buyButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.sm,
  },
  buyButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  ownedButton: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.sm,
  },
  ownedButtonText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: Theme.colors.textSecondary,
  },
  emptyText: {
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '82%',
    backgroundColor: '#FFF',
    borderRadius: Theme.borderRadius.lg,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  modalPriceLabel: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  modalPriceVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#B45309',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 10,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});