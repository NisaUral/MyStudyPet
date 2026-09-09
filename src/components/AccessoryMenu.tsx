import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Theme } from '../theme';
import { PetType } from '../types';
import { useInventoryStore } from '../store/useInventoryStore';

interface Props {
  petType?: PetType;
  equippedHat: string;
  hatColor: string;
  equippedGlasses: string;
  glassesColor: string;
  equippedAccessory: string;
  accessoryColor: string;
  isSaving: boolean;
  onSelectAccessory: (id: string, category: 'HAT' | 'GLASSES' | 'NECK') => void;
  onSelectColor: (color: string, category: 'HAT' | 'GLASSES' | 'NECK') => void;
  onSave: () => void;
}

const COLOR_PALETTE = ['#6C5CE7', '#E74C3C', '#2ECC71', '#F1C40F', '#E67E22', '#2D3436'];

export const AccessoryMenu: React.FC<Props> = ({
  petType,
  equippedHat,
  hatColor,
  equippedGlasses,
  glassesColor,
  equippedAccessory,
  accessoryColor,
  isSaving,
  onSelectAccessory,
  onSelectColor,
  onSave,
}) => {
  const { fetchInventory, getOwnedAccessories, isLoading } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<'HAT' | 'GLASSES' | 'NECK'>('HAT');

  useEffect(() => {
    fetchInventory();
  }, []);

  const ownedAccessories = getOwnedAccessories();

  // Envanterdeki eşyaları kategoriye göre eşle
  const getItemsForTab = () => {
    const baseItems = [{ itemKey: 'NONE', name: 'Yok' }];

    const filtered = ownedAccessories.filter((item) => {
      if (activeTab === 'HAT') return item.itemKey.includes('HAT') || item.itemKey.includes('CAP') || item.itemKey.includes('CROWN');
      if (activeTab === 'GLASSES') return item.itemKey.includes('GLASSES');
      if (activeTab === 'NECK') return item.itemKey.includes('BOWTIE') || item.itemKey.includes('COLLAR');
      return false;
    });

    return [...baseItems, ...filtered];
  };

  const currentItems = getItemsForTab();
  const currentEquipped =
    activeTab === 'HAT' ? equippedHat : activeTab === 'GLASSES' ? equippedGlasses : equippedAccessory;

  return (
    <View style={styles.container}>
      {/* Kategori Seçici */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'HAT' && styles.activeTab]}
          onPress={() => setActiveTab('HAT')}
        >
          <Text style={[styles.tabText, activeTab === 'HAT' && styles.activeTabText]}>Şapkalar 🎩</Text>
        </TouchableOpacity>

        {petType !== 'FISH' && (
          <>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'GLASSES' && styles.activeTab]}
              onPress={() => setActiveTab('GLASSES')}
            >
              <Text style={[styles.tabText, activeTab === 'GLASSES' && styles.activeTabText]}>Gözlük 🕶️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'NECK' && styles.activeTab]}
              onPress={() => setActiveTab('NECK')}
            >
              <Text style={[styles.tabText, activeTab === 'NECK' && styles.activeTabText]}>Boyunluk 🎀</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Satın Alınan Eşyaların Yatay Listesi */}
      {isLoading ? (
        <ActivityIndicator size="small" color={Theme.colors.primary} style={{ marginVertical: 12 }} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemList}>
          {currentItems.map((item) => {
            const isSelected = currentEquipped === item.itemKey;
            return (
              <TouchableOpacity
                key={item.itemKey}
                style={[styles.itemCard, isSelected && styles.selectedCard]}
                onPress={() => onSelectAccessory(item.itemKey, activeTab)}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Renk Paleti */}
      {currentEquipped !== 'NONE' && (
        <View style={styles.colorRow}>
          {COLOR_PALETTE.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                (activeTab === 'HAT' ? hatColor : activeTab === 'GLASSES' ? glassesColor : accessoryColor) === c &&
                  styles.activeColorDot,
              ]}
              onPress={() => onSelectColor(c, activeTab)}
            />
          ))}
        </View>
      )}

      {/* Kaydet Butonu */}
      <TouchableOpacity
        style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
        onPress={onSave}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>{isSaving ? 'Kaydediliyor...' : 'Kuşan & Kaydet ✨'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#F1F5F9',
  },
  activeTab: {
    backgroundColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  itemList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
  },
  itemCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedCard: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(108, 92, 231, 0.08)',
  },
  itemName: {
    fontSize: 12,
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  activeColorDot: {
    borderWidth: 2.5,
    borderColor: '#1E293B',
  },
  saveButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.sm,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});