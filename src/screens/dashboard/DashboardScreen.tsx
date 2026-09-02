import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
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

  useEffect(() => {
    fetchMyPet();
  }, []);

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
          <Text style={styles.coinAmount}>{coinBalance}</Text>
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
              equippedGlasses={pet.equippedGlasses}
              equippedAccessory={pet.equippedAccessory}
            />
            <Text style={styles.petName}>{pet.name}</Text>
            <TouchableOpacity
              style={styles.wardrobeButton}
              onPress={() => navigation.navigate('WardrobeScreen')}
            >
              <Text style={styles.wardrobeButtonText}>👕 Tarzı Değiştir</Text>
            </TouchableOpacity>
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
    padding: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.lg,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  petName: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginTop: Theme.spacing.md,
  },
  wardrobeButton: {
    marginTop: Theme.spacing.md,
    backgroundColor: Theme.colors.surfaceLight,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  wardrobeButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
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