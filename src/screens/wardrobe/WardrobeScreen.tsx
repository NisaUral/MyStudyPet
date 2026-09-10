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

export interface AccessoryItem {
  id: string;
  name: string;
  emoji: string;
  category: 'HAT' | 'GLASSES' | 'BOW' | 'NONE';
  description: string;
}

export const WARDROBE_ITEMS: AccessoryItem[] = [
  { id: 'NONE', name: 'Çıkar', emoji: '❌', category: 'NONE', description: 'Tüm aksesuarları çıkarır' },
  { id: 'HAT_WIZARD', name: 'Büyücü Şapkası', emoji: '🧙‍♂️', category: 'HAT', description: '+10 Odaklanma Gücü' },
  { id: 'GLASSES_STUDIOUS', name: 'Ders Gözlüğü', emoji: '👓', category: 'GLASSES', description: 'Ciddi ve çalışkan hava' },
  { id: 'BOW_RED', name: 'Kırmızı Papyon', emoji: '🎀', category: 'BOW', description: 'Önemli çalışma günleri için' },
  { id: 'HAT_GRADUATION', name: 'Mezuniyet Kepi', emoji: '🎓', category: 'HAT', description: 'Büyük hedefler için' },
  { id: 'GLASSES_COOL', name: 'Güneş Gözlüğü', emoji: '🕶️', category: 'GLASSES', description: 'Mola vakti tarzı' },
];

interface Props {
  navigation: any;
}

export const WardrobeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, inventory: storeInventory, updateEquippedAccessory } = useAuthStore() as any;

  // Envanter listesini hem user hem store üzerinden garantiye al
  const inventory: string[] = user?.inventory || storeInventory || [];

  const [selectedAccessory, setSelectedAccessory] = useState<string>(
    user?.equippedAccessory || 'NONE'
  );

  const handleEquip = (item: AccessoryItem) => {
    const isUnlocked = item.id === 'NONE' || inventory.includes(item.id);

    if (!isUnlocked) {
      triggerHaptic.error();
      Alert.alert(
        'Kilitli Aksesuar 🔒',
        `"${item.name}" eşyasına henüz sahip değilsin. Mağazadan satın alarak kilidini açabilirsin!`,
        [
          { text: 'Tamam', style: 'cancel' },
          { text: 'Mağazaya Git', onPress: () => navigation.navigate('Shop') },
        ]
      );
      return;
    }

    triggerHaptic.light();
    setSelectedAccessory(item.id);

    if (updateEquippedAccessory) {
      updateEquippedAccessory(item.id === 'NONE' ? null : item.id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pet Gardırobu</Text>
        <Text style={styles.subtitle}>Satın aldığın aksesuarları petine giydir!</Text>
      </View>

      {/* Pet Önizleme Alanı */}
      <View style={styles.previewContainer}>
        <View style={styles.petAvatarCircle}>
          <Text style={styles.petBaseEmoji}>🐱</Text>
          {selectedAccessory !== 'NONE' && (
            <View style={styles.accessoryOverlay}>
              <Text style={styles.overlayEmoji}>
                {WARDROBE_ITEMS.find((i) => i.id === selectedAccessory)?.emoji}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.equippedText}>
          Şu an kuşanılan:{' '}
          <Text style={styles.highlightText}>
            {WARDROBE_ITEMS.find((i) => i.id === selectedAccessory)?.name}
          </Text>
        </Text>
      </View>

      {/* Aksesuar Kartları Listesi */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Mevcut Aksesuarlar</Text>
        <View style={styles.grid}>
          {WARDROBE_ITEMS.map((item) => {
            const isSelected = selectedAccessory === item.id;
            const isUnlocked = item.id === 'NONE' || inventory.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemCard,
                  isSelected && styles.itemCardActive,
                  !isUnlocked && styles.itemCardLocked,
                ]}
                activeOpacity={0.8}
                onPress={() => handleEquip(item)}
              >
                {/* Kilit Rozeti */}
                {!isUnlocked && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockBadgeText}>🔒 Kilitli</Text>
                  </View>
                )}

                <Text style={[styles.itemEmoji, !isUnlocked && styles.lockedTextOpacity]}>
                  {item.emoji}
                </Text>
                <Text style={[styles.itemName, !isUnlocked && styles.lockedTextOpacity]}>
                  {item.name}
                </Text>
                <Text style={styles.itemDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                {isSelected && (
                  <View style={styles.equippedBadge}>
                    <Text style={styles.equippedBadgeText}>Kuşanıldı</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
    paddingBottom: 16,
  },
  backButton: {
    marginBottom: 10,
    paddingVertical: 6,
    width: 70,
  },
  backButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: '#24283B',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#414868',
  },
  petAvatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1A1B26',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#7AA2F7',
  },
  petBaseEmoji: {
    fontSize: 52,
  },
  accessoryOverlay: {
    position: 'absolute',
    top: -12,
    right: 4,
  },
  overlayEmoji: {
    fontSize: 32,
  },
  equippedText: {
    marginTop: 12,
    color: '#A9B1D6',
    fontSize: 14,
  },
  highlightText: {
    color: '#7AA2F7',
    fontWeight: '700',
  },
  scrollList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#24283B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#414868',
    position: 'relative',
  },
  itemCardActive: {
    borderColor: '#7AA2F7',
    backgroundColor: '#1F2335',
  },
  itemCardLocked: {
    opacity: 0.65,
    borderColor: '#2D3149',
    backgroundColor: '#1A1D2B',
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lockBadgeText: {
    color: '#E0AF68',
    fontSize: 10,
    fontWeight: '700',
  },
  lockedTextOpacity: {
    opacity: 0.5,
  },
  itemEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 15,
  },
  equippedBadge: {
    marginTop: 10,
    backgroundColor: '#7AA2F7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  equippedBadgeText: {
    color: '#1A1B26',
    fontSize: 11,
    fontWeight: '800',
  },
});