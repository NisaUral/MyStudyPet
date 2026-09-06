import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Theme } from '../../theme';
import { PetAvatar } from '../../components/PetAvatar';
import { useAuthStore } from '../../store/useAuthStore';
import { usePetStore } from '../../store/usePetStore';

interface Props {
  navigation: any;
}

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { username, coinBalance, roomCode, logout } = useAuthStore();
  const { pet, fetchMyPet, isLoading } = usePetStore();

  // Odadan geri dönüldüğünde kuşanılan yeni eşyaların Dashboard'a anında yansıması için
  useFocusEffect(
    useCallback(() => {
      fetchMyPet();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bar: Kullanıcı Adı & Bakiye */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.username}>{username || 'Öğrenci'}</Text>
        </View>

        <View style={styles.coinBadge}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinAmount}>{coinBalance ?? 0}</Text>
        </View>
      </View>

      {/* Merkez Alan: Pet Sergileme Alanı */}
      <View style={styles.petShowcase}>
        {isLoading && !pet ? (
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        ) : pet ? (
          <View style={styles.petContainer}>
            <PetAvatar
              type={pet.type}
              size={150}
              equippedHat={pet.equippedHat}
              hatColor="#6C5CE7"
              equippedGlasses={pet.equippedGlasses}
              glassesColor="#2D3436"
              equippedAccessory={pet.equippedAccessory}
              accessoryColor="#E74C3C"
            />
            <Text style={styles.petName}>{pet.name}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.selectPetPrompt}
            onPress={() => navigation.navigate('SelectPetScreen')}
          >
            <Text style={styles.promptText}>Evcil Hayvanını Seç</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Alt Aksiyonlar: Oda ve Çalışma Butonları */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={() => navigation.navigate('StudyRoomScreen')}
        >
          <Text style={styles.actionIcon}>📖</Text>
          <View>
            <Text style={styles.actionTitle}>Çalışma Odasına Gir</Text>
            <Text style={styles.actionSubtitle}>
              {roomCode ? `Oda Kodu: ${roomCode}` : 'Kendi odan veya katıldığın oda'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('RoomChoiceScreen')}
          >
            <Text style={styles.secondaryButtonText}>🚪 Oda Değiştir / Katıl</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Çıkış</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
  },
  greeting: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
    borderWidth: 1,
    borderColor: Theme.colors.accent,
  },
  coinIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  coinAmount: {
    color: Theme.colors.accent,
    fontWeight: 'bold',
    fontSize: 16,
  },
  petShowcase: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petContainer: {
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    paddingVertical: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  petName: {
    fontSize: 22,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginTop: Theme.spacing.md,
  },
  selectPetPrompt: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
  },
  promptText: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  actionIcon: {
    fontSize: 28,
    marginRight: Theme.spacing.md,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.white,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 2,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  secondaryButton: {
    flex: 3,
    backgroundColor: Theme.colors.surface,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
  },
  secondaryButtonText: {
    color: Theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceLight,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
  },
  logoutButtonText: {
    color: Theme.colors.danger,
    fontWeight: '600',
    fontSize: 14,
  },
});