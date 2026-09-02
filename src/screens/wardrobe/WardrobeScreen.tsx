import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Theme } from '../../theme';
import { PetAvatar } from '../../components/PetAvatar';
import { ACCESSORY_CATALOG, AccessorySlot } from '../../constants/accessories';
import { usePetStore } from '../../store/usePetStore';

export const WardrobeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { pet, updateAccessories, isLoading } = usePetStore();

  const [activeTab, setActiveTab] = useState<AccessorySlot>('hat');
  const [hat, setHat] = useState<string>(pet?.equippedHat || 'hat_none');
  const [glasses, setGlasses] = useState<string>(pet?.equippedGlasses || 'glasses_none');
  const [accessory, setAccessory] = useState<string>(pet?.equippedAccessory || 'acc_none');

  if (!pet) return null;

  const currentItems = ACCESSORY_CATALOG.filter((item) => item.slot === activeTab);

  const handleSelect = (id: string) => {
    if (activeTab === 'hat') setHat(id);
    else if (activeTab === 'glasses') setGlasses(id);
    else if (activeTab === 'accessory') setAccessory(id);
  };

  const getSelectedIdForTab = () => {
    if (activeTab === 'hat') return hat;
    if (activeTab === 'glasses') return glasses;
    return accessory;
  };

  const handleSave = async () => {
    try {
      await updateAccessories({
        equippedHat: hat,
        equippedGlasses: glasses,
        equippedAccessory: accessory,
      });
      Alert.alert('Başarılı', 'Karakterinin tarzı kaydedildi!');
      navigation.goBack();
    } catch {
      Alert.alert('Hata', 'Değişiklikler kaydedilemedi.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dolap & Stil</Text>
        <Text style={styles.petName}>{pet.name}</Text>
      </View>

      {/* Anlık Katmanlı Önizleme */}
      <View style={styles.previewContainer}>
        <PetAvatar
          type={pet.type}
          size={160}
          equippedHat={hat}
          equippedGlasses={glasses}
          equippedAccessory={accessory}
        />
      </View>

      {/* Sekmeler */}
      <View style={styles.tabs}>
        {(['hat', 'glasses', 'accessory'] as AccessorySlot[]).map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[styles.tab, activeTab === slot && styles.activeTab]}
            onPress={() => setActiveTab(slot)}
          >
            <Text style={[styles.tabText, activeTab === slot && styles.activeTabText]}>
              {slot === 'hat' ? 'Şapka' : slot === 'glasses' ? 'Gözlük' : 'Aksesuar'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Eşya Seçim Izgarası */}
      <ScrollView contentContainerStyle={styles.grid}>
        {currentItems.map((item) => {
          const isSelected = getSelectedIdForTab() === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemCard, isSelected && styles.selectedItemCard]}
              onPress={() => handleSelect(item.id)}
            >
              <Text style={styles.itemEmoji}>{item.emoji}</Text>
              <Text style={[styles.itemLabel, isSelected && styles.selectedItemLabel]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Kaydet Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Theme.colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Görünümü Kaydet</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  petName: {
    fontSize: 14,
    color: Theme.colors.primary,
    marginTop: 2,
  },
  previewContainer: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface,
    marginHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Theme.spacing.lg,
    marginVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.sm,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: Theme.colors.primary,
  },
  tabText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: Theme.colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  itemCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItemCard: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.surfaceLight,
  },
  itemEmoji: {
    fontSize: 32,
  },
  itemLabel: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  selectedItemLabel: {
    color: Theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  footer: {
    padding: Theme.spacing.lg,
  },
  saveButton: {
    height: 50,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});