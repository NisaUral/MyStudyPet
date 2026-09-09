import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Theme } from '../../theme';
import { ShopItem } from '../../types/shop';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useRoomStore } from '../../store/useRoomStore';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const FurniturePlacementModal: React.FC<Props> = ({ visible, onClose }) => {
  const { getOwnedFurnitures } = useInventoryStore();
  const { addFurniture, furnitures } = useRoomStore();

  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [targetX, setTargetX] = useState<number>(1);
  const [targetY, setTargetY] = useState<number>(1);

  const ownedFurnitures = getOwnedFurnitures();

  const handlePlace = () => {
    if (!selectedItem) {
      Alert.alert('Seçim Yapın', 'Lütfen yerleştirmek istediğiniz mobilyayı seçin.');
      return;
    }

    // Seçilen karoda çakışma kontrolü
    const isOccupied = furnitures.some(
      (f) => f.gridX === targetX && f.gridY === targetY
    );

    if (isOccupied) {
      Alert.alert('Karo Dolu!', `(${targetX}, ${targetY}) koordinatında zaten bir mobilya var.`);
      return;
    }

    // useRoomStore üzerinden odaya ekle
    addFurniture({
      furnitureType: selectedItem.itemKey,
      gridX: targetX,
      gridY: targetY,
    });

    Alert.alert('Yerleştirildi! 🛋️', `${selectedItem.name} odaya yerleştirildi.`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Odaya Mobilya Yerleştir</Text>

          {/* Sahip Olunan Mobilyalar */}
          <Text style={styles.sectionLabel}>1. Mobilya Seç:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemList}>
            {ownedFurnitures.length === 0 ? (
              <Text style={styles.emptyText}>Henüz mobilyanız yok. Mağazadan satın alabilirsiniz! 🛒</Text>
            ) : (
              ownedFurnitures.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, selectedItem?.id === item.id && styles.selectedItemCard]}
                  onPress={() => setSelectedItem(item)}
                >
                  <Text style={styles.itemEmoji}>🛋️</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Grid Koordinat Seçimi (0..7) */}
          <Text style={styles.sectionLabel}>2. Konum Belirle (Grid Karo):</Text>
          <View style={styles.coordRow}>
            <View style={styles.coordCol}>
              <Text style={styles.coordLabel}>X Karosu (0-7):</Text>
              <View style={styles.counterWrap}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setTargetX(Math.max(0, targetX - 1))}
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.coordVal}>{targetX}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setTargetX(Math.min(7, targetX + 1))}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.coordCol}>
              <Text style={styles.coordLabel}>Y Karosu (0-7):</Text>
              <View style={styles.counterWrap}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setTargetY(Math.max(0, targetY - 1))}
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.coordVal}>{targetY}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setTargetY(Math.min(7, targetY + 1))}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Aksiyon Butonları */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Vazgeç</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, !selectedItem && styles.confirmBtnDisabled]}
              onPress={handlePlace}
              disabled={!selectedItem}
            >
              <Text style={styles.confirmBtnText}>Odaya Koy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 8,
    marginBottom: 6,
  },
  itemList: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 10,
    minWidth: 90,
  },
  selectedItemCard: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(108, 92, 231, 0.08)',
  },
  itemEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  coordRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 18,
  },
  coordCol: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 10,
  },
  coordLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  counterWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  coordVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#64748B',
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});