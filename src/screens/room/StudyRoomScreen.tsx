import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Theme } from '../../theme';
import { IsometricRoomView } from '../../components/IsometricRoomView';
import { PlacedFurnitureLayer } from '../../components/PlacedFurnitureLayer';
import { PetAvatar } from '../../components/PetAvatar';
import { StudyDurationModal } from '../../components/study/StudyDurationModal';
import { FocusOverlay } from '../../components/study/FocusOverlay';
import { RewardModal } from '../../components/study/RewardModal';
import { gridToScreen } from '../../utils/isometric';
import { useLiveRoomStore } from '../../store/useLiveRoomStore';
import { LiveRoommatesLayer } from '../../components/room/LiveRoommatesLayer';
import { RoomStatsOverlay } from '../../components/room/RoomStatsOverlay';

import { useAuthStore } from '../../store/useAuthStore';
import { useRoomStore } from '../../store/useRoomStore';
import { usePetStore } from '../../store/usePetStore';
import { useStudyStore } from '../../store/useStudyStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StudyRoomScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { roomCode, username } = useAuthStore();
  const { furnitures, loadRoom, isLoading: isRoomLoading } = useRoomStore();
  const { pet, fetchMyPet } = usePetStore();
  const {
    isFocusModeActive,
    startSession,
    lastReward,
    isRewardModalVisible,
    closeRewardModal,
  } = useStudyStore();

  const { joinLiveRoom, leaveLiveRoom, broadcastStudyStatus } = useLiveRoomStore();

  const [isDurationModalVisible, setDurationModalVisible] = useState(false);

  // Zemin ve mobilyaların ekranda ortalanması için merkez koordinatlar
  const originX = SCREEN_WIDTH / 2;
  const originY = 90;

  // Pet'in odadaki varsayılan başlangıç konumu (Grid 4, 4)
  const petScreenPos = gridToScreen(4, 4, originX, originY);

  // Oda ve pet verilerini yükle
  useEffect(() => {
    if (roomCode) {
      loadRoom(roomCode);
    }
    fetchMyPet();
  }, [roomCode]);

  // Canlı WebSocket bağlantısı yaşam döngüsü
  useEffect(() => {
    const activeUsername = username || 'Misafir';
    const petType = pet?.type || 'CAT';

    if (roomCode) {
      joinLiveRoom(roomCode, activeUsername, petType);
    }

    return () => {
      if (roomCode) {
        leaveLiveRoom(roomCode, activeUsername, petType);
      }
    };
  }, [roomCode, username, pet?.type]);

  // Odak seansı başlatıldığında canlı odaya duyur
  const handleStartStudy = async (minutes: number) => {
    try {
      await startSession(minutes);
      if (roomCode && pet) {
        broadcastStudyStatus(roomCode, username || 'Misafir', pet.type, true, minutes);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Çalışma oturumu başlatılamadı.';
      Alert.alert('Hata', msg);
    }
  };

  // Seans bittiğinde veya ödül modalı kapandığında mola durumunu bildir
  const handleCloseReward = () => {
    if (roomCode && pet) {
      broadcastStudyStatus(roomCode, username || 'Misafir', pet.type, false);
    }
    closeRewardModal();
  };

  if (isRoomLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Oda yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Bilgi Barı: Takvimdeki Oda Kodu & Geri Dön */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isFocusModeActive}
        >
          <Text style={[styles.backButtonText, isFocusModeActive && styles.disabledText]}>
            ← Çıkış
          </Text>
        </TouchableOpacity>

        {/* Duvardaki Takvim / Oda Kodu Panosu */}
        <View style={styles.roomCalendarBadge}>
          <Text style={styles.calendarIcon}>📅</Text>
          <View>
            <Text style={styles.calendarLabel}>ODA KODU</Text>
            <Text style={styles.calendarCode}>{roomCode || 'YOK'}</Text>
          </View>
        </View>
      </View>
      {/* YENİ: Ortak Çalışma İstatistikleri & Toast Alanı */}
  <RoomStatsOverlay />

      {/* 2D İzometrik Oda Alanı */}
      <View style={styles.roomViewport}>
        {/* 1. Katman: 8x8 Karo Zemin */}
        <IsometricRoomView />

        {/* 2. Katman: Z-Index Sıralı Mobilyalar */}
        <PlacedFurnitureLayer
          furnitures={furnitures}
          originX={originX}
          originY={originY}
        />

        {/* 3. Katman: Canlı Bağlanan Diğer Kullanıcıların Petleri */}
        <LiveRoommatesLayer originX={originX} originY={originY} />

        {/* 4. Katman: Kullanıcının Kendi Peti */}
        {pet && (
          <View
            style={[
              styles.petPositioner,
              {
                left: petScreenPos.x - 40,
                top: petScreenPos.y - 70,
                zIndex: 4 + 4 + 50,
              },
            ]}
          >
            <PetAvatar
              type={pet.type}
              size={80}
              equippedHat={pet.equippedHat}
              equippedGlasses={pet.equippedGlasses}
              equippedAccessory={pet.equippedAccessory}
            />
            <View style={styles.petNameTag}>
              <Text style={styles.petNameText}>{pet.name}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Alt Kontrol Paneli: Çalışmaya Başla Butonu */}
      {!isFocusModeActive && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.startStudyButton}
            onPress={() => setDurationModalVisible(true)}
          >
            <Text style={styles.startStudyIcon}>⏳</Text>
            <Text style={styles.startStudyText}>Çalışmaya Başla</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Süre Belirleme Modalı */}
      <StudyDurationModal
        visible={isDurationModalVisible}
        onClose={() => setDurationModalVisible(false)}
        onStart={handleStartStudy}
      />

      {/* Odak Modu Perdesi & Geri Sayım Rozeti */}
      <FocusOverlay />

      {/* Ödül Bildirim Modalı */}
      <RewardModal
        visible={isRewardModalVisible}
        earnedCoins={lastReward?.earnedCoins || 0}
        workedMinutes={lastReward?.actualDurationMinutes || 0}
        isCompleted={lastReward?.isCompleted || false}
        onClose={handleCloseReward}
      />
    </SafeAreaView>
     
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    zIndex: 10,
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
  disabledText: {
    opacity: 0.4,
  },
  roomCalendarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    gap: 8,
  },
  calendarIcon: {
    fontSize: 20,
  },
  calendarLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Theme.colors.textSecondary,
    letterSpacing: 1,
  },
  calendarCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  roomViewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  petPositioner: {
    position: 'absolute',
    alignItems: 'center',
  },
  petNameTag: {
    backgroundColor: 'rgba(26, 27, 38, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: -8,
  },
  petNameText: {
    fontSize: 11,
    color: Theme.colors.white,
    fontWeight: '600',
  },
  bottomBar: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  startStudyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    width: '100%',
    height: 52,
    borderRadius: Theme.borderRadius.md,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  startStudyIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  startStudyText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});