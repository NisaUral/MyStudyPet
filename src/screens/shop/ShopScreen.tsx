import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { triggerHaptic } from '../../utils/haptics';

interface ShopItemModel {
  id: number;
  itemKey: string;
  name: string;
  description: string;
  category: 'FURNITURE' | 'PET_ACCESSORY' | 'WALLPAPER';
  price: number;
  iconEmoji: string;
  isOwned: boolean;
}

const INITIAL_SHOP_ITEMS: ShopItemModel[] = [
  {
    id: 1,
    itemKey: 'DESK_WOODEN',
    name: 'Ahşap Çalışma Masası',
    description: 'Odaklanmak için sade ve klasik meşe masa.',
    category: 'FURNITURE',
    price: 150,
    iconEmoji: '🪵',
    isOwned: false,
  },
  {
    id: 2,
    itemKey: 'BOOKSHELF_OAK',
    name: 'Kitaplık',
    description: 'Çalışma kitaplarını ve notları dizebileceğin raf.',
    category: 'FURNITURE',
    price: 200,
    iconEmoji: '📚',
    isOwned: false,
  },
  {
    id: 3,
    itemKey: 'PLANT_MONSTERA',
    name: 'Monstera Bitkisi',
    description: 'Odaya ferahlık katan yeşil yapraklı saksı çiçeği.',
    category: 'FURNITURE',
    price: 80,
    iconEmoji: '🪴',
    isOwned: false,
  },
  {
    id: 4,
    itemKey: 'COZY_LAMP',
    name: 'Sıcak Gece Lambası',
    description: 'Gece çalışmaları için gözü yormayan sarı ışık.',
    category: 'FURNITURE',
    price: 120,
    iconEmoji: '🛋️',
    isOwned: false,
  },
  {
    id: 5,
    itemKey: 'HAT_WIZARD',
    name: 'Büyücü Şapkası',
    description: 'Petine +10 bilgelik katan mor şapka.',
    category: 'PET_ACCESSORY',
    price: 100,
    iconEmoji: '🧙‍♂️',
    isOwned: false,
  },
  {
    id: 6,
    itemKey: 'GLASSES_STUDIOUS',
    name: 'Ders Çalışma Gözlüğü',
    description: 'Ciddi ve entelektüel bir hava katar.',
    category: 'PET_ACCESSORY',
    price: 90,
    iconEmoji: '👓',
    isOwned: false,
  },
  {
    id: 7,
    itemKey: 'BOW_RED',
    name: 'Kırmızı Papyon',
    description: 'Önemli sınav günleri için şık bir papyon.',
    category: 'PET_ACCESSORY',
    price: 60,
    iconEmoji: '🎀',
    isOwned: false,
  },
  {
    id: 8,
    itemKey: 'FLOOR_WOOD_DARK',
    name: 'Koyu Ahşap Parke',
    description: 'Odaya modern bir zemin dokusu kazandırır.',
    category: 'WALLPAPER',
    price: 250,
    iconEmoji: '🧱',
    isOwned: false,
  },
];

export const ShopScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, buyItem } = useAuthStore() as any;
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const userCoins = user?.coins ?? 0;
  const userInventory: string[] = user?.inventory ?? [];

  // Eşyaların sahiplik durumunu global inventory'den oku
  const items = INITIAL_SHOP_ITEMS.map((item) => ({
    ...item,
    isOwned: userInventory.includes(item.itemKey),
  }));

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const handleBuy = (item: any) => {
    triggerHaptic.light();

    if (userCoins < item.price) {
      Alert.alert('Yetersiz Coin 🪙', 'Bu eşyayı almak için biraz daha ders çalışmalısın!');
      return;
    }

    Alert.alert(
      'Satın Alma Onayı',
      `${item.name} eşyasını ${item.price} Coin karşılığında almak istiyor musun?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Satın Al',
          onPress: () => {
            const success = buyItem(item.itemKey, item.price);
            if (success) {
              triggerHaptic.success();
              Alert.alert('Hayırlı Olsun! 🎉', `${item.name} başarıyla satın alındı.`);
            } else {
              Alert.alert('Hata', 'İşlem gerçekleştirilemedi.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.title}>StudyQuest Mağaza 🏪</Text>
          <View style={styles.coinBadge}>
            <Text style={styles.coinText}>🪙 {userCoins} Coin</Text>
          </View>
        </View>
      </View>

      {/* Kategori Filtre Butonları */}
      <View style={styles.filterRow}>
        {['ALL', 'FURNITURE', 'PET_ACCESSORY', 'WALLPAPER'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
            onPress={() => {
              triggerHaptic.light();
              setSelectedCategory(cat);
            }}
          >
            <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>
              {cat === 'ALL' ? 'Tümü' : cat === 'FURNITURE' ? 'Mobilya' : cat === 'PET_ACCESSORY' ? 'Pet' : 'Zemin'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Eşya Listesi */}
      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.itemEmoji}>{item.iconEmoji}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.priceText}>🪙 {item.price}</Text>
              </View>

              <TouchableOpacity
                style={[styles.buyButton, item.isOwned && styles.ownedButton]}
                disabled={item.isOwned}
                onPress={() => handleBuy(item)}
              >
                <Text style={[styles.buyButtonText, item.isOwned && styles.ownedButtonText]}>
                  {item.isOwned ? 'Sahipsin ✓' : 'Satın Al'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1B26',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backButton: {
    marginBottom: 10,
    paddingVertical: 4,
    width: 70,
  },
  backButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  coinBadge: {
    backgroundColor: '#24283B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0AF68',
  },
  coinText: {
    color: '#E0AF68',
    fontWeight: '700',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#24283B',
    borderWidth: 1,
    borderColor: '#414868',
  },
  filterChipActive: {
    backgroundColor: '#7AA2F7',
    borderColor: '#7AA2F7',
  },
  filterChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#1A1B26',
    fontWeight: '700',
  },
  scrollList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#24283B',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#414868',
  },
  itemEmoji: {
    fontSize: 38,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 8,
    height: 28,
  },
  priceRow: {
    marginBottom: 10,
  },
  priceText: {
    color: '#E0AF68',
    fontWeight: '700',
    fontSize: 13,
  },
  buyButton: {
    backgroundColor: '#7AA2F7',
    width: '100%',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  ownedButton: {
    backgroundColor: '#343B58',
  },
  buyButtonText: {
    color: '#1A1B26',
    fontWeight: '700',
    fontSize: 12,
  },
  ownedButtonText: {
    color: '#9ECE6A',
  },
});