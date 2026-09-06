import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { PetType } from '../types';

const COLOR_PALETTE = [
  '#6C5CE7', // Mor
  '#E74C3C', // Kırmızı
  '#E67E22', // Turuncu
  '#F1C40F', // Sarı
  '#2ECC71', // Yeşil
  '#3498DB', // Mavi
  '#E84393', // Pembe
  '#2D3436', // Siyah
  '#FFFFFF', // Beyaz
];

const ITEMS_BY_CATEGORY = {
  HAT: [
    { id: 'NONE', label: 'Çıkar ❌' },
    { id: 'WIZARD_HAT', label: 'Büyücü 🧙‍♂️' },
    { id: 'BASEBALL_CAP', label: 'Kep 🧢' },
    { id: 'CROWN', label: 'Taç 👑' },
    { id: 'BERET', label: 'Ressam 🎨' },
  ],
  GLASSES: [
    { id: 'NONE', label: 'Çıkar ❌' },
    { id: 'NERD_GLASSES', label: 'Gözlük 👓' },
    { id: 'SUNGLASSES', label: 'Güneş Gözlüğü 🕶️' },
  ],
  NECK: [
    { id: 'NONE', label: 'Çıkar ❌' },
    { id: 'BOWTIE', label: 'Papyon 🎀' },
  ],
};

interface Props {
  petType?: PetType;
  equippedHat: string;
  hatColor: string;
  equippedGlasses: string;
  glassesColor: string;
  equippedAccessory: string;
  accessoryColor: string;
  isSaving?: boolean;
  onSelectAccessory: (id: string, category: 'HAT' | 'GLASSES' | 'NECK') => void;
  onSelectColor: (color: string, category: 'HAT' | 'GLASSES' | 'NECK') => void;
  onSave: () => void;
}

export const AccessoryMenu: React.FC<Props> = ({
  petType,
  equippedHat,
  hatColor,
  equippedGlasses,
  glassesColor,
  equippedAccessory,
  accessoryColor,
  isSaving = false,
  onSelectAccessory,
  onSelectColor,
  onSave,
}) => {
  const isFish = petType === 'FISH';
  const [activeTab, setActiveTab] = useState<'HAT' | 'GLASSES' | 'NECK'>('HAT');

  useEffect(() => {
    if (isFish) setActiveTab('HAT');
  }, [isFish]);

  const currentItem =
    activeTab === 'HAT'
      ? equippedHat || 'NONE'
      : activeTab === 'GLASSES'
      ? equippedGlasses || 'NONE'
      : equippedAccessory || 'NONE';

  const currentColor =
    activeTab === 'HAT'
      ? hatColor || '#6C5CE7'
      : activeTab === 'GLASSES'
      ? glassesColor || '#2D3436'
      : accessoryColor || '#E74C3C';

  return (
    <View style={styles.menuContainer}>
      {/* Kategori Sekmeleri */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'HAT' && styles.tabBtnActive]}
          onPress={() => setActiveTab('HAT')}
        >
          <Text style={[styles.tabText, activeTab === 'HAT' && styles.tabTextActive]}>
            Şapka 🎩
          </Text>
        </TouchableOpacity>

        {!isFish && (
          <>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'GLASSES' && styles.tabBtnActive]}
              onPress={() => setActiveTab('GLASSES')}
            >
              <Text style={[styles.tabText, activeTab === 'GLASSES' && styles.tabTextActive]}>
                Gözlük 👓
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'NECK' && styles.tabBtnActive]}
              onPress={() => setActiveTab('NECK')}
            >
              <Text style={[styles.tabText, activeTab === 'NECK' && styles.tabTextActive]}>
                Papyon 🎀
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Model Listesi */}
      <Text style={styles.sectionTitle}>Model Seç:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollArea}>
        {ITEMS_BY_CATEGORY[activeTab].map((item) => {
          const isSelected = currentItem === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemCard, isSelected && styles.itemCardActive]}
              onPress={() => onSelectAccessory(item.id, activeTab)}
            >
              <Text style={[styles.itemText, isSelected && styles.itemTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Renk Paleti */}
      <View style={styles.colorWrapper}>
        <Text style={styles.sectionTitle}>
          Renk Seç ({activeTab === 'HAT' ? 'Şapka' : activeTab === 'GLASSES' ? 'Gözlük' : 'Papyon'} için):
        </Text>
        <View style={styles.paletteRow}>
          {COLOR_PALETTE.map((color) => {
            const isColorActive = currentColor.toLowerCase() === color.toLowerCase();
            return (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  isColorActive && styles.colorCircleActive,
                ]}
                onPress={() => onSelectColor(color, activeTab)}
              />
            );
          })}
        </View>
      </View>

      {/* Kaydet Butonu */}
      <TouchableOpacity
        style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
        onPress={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.saveBtnText}>✓ Kıyafetleri Kaydet</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F2F6',
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#6C5CE7',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#636E72',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  scrollArea: {
    marginBottom: 10,
  },
  itemCard: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#DFE4EA',
  },
  itemCardActive: {
    borderColor: '#6C5CE7',
    backgroundColor: '#EDEAFE',
  },
  itemText: {
    fontSize: 12,
    color: '#2D3436',
    fontWeight: '600',
  },
  itemTextActive: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  colorWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#F1F2F6',
    paddingTop: 8,
    marginBottom: 10,
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#DFE4EA',
  },
  colorCircleActive: {
    borderColor: '#2D3436',
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
  saveBtn: {
    backgroundColor: '#2ED573',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});