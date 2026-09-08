import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated,
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
import { AccessoryMenu } from '../../components/AccessoryMenu';

import { useAuthStore } from '../../store/useAuthStore';
import { useRoomStore } from '../../store/useRoomStore';
import { usePetStore } from '../../store/usePetStore';
import { useStudyStore } from '../../store/useStudyStore';
import { usePetStateMachine } from '../../hooks/usePetStateMachine';
import { usePetWalkingController } from '../../hooks/usePetWalkingController';
import { useWhisperBroadcast } from '../../hooks/useWhisperBroadcast';
import { SpeechBubble } from '../../components/room/SpeechBubble';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HOME_POS = { x: 4, y: 4 };

// Masa slotları (LiveRoommatesLayer ile senkron)
const DESK_SLOTS = [
  { x: 2, y: 3 },
  { x: 6, y: 3 },
  { x: 2, y: 6 },
  { x: 6, y: 6 },
];

export const StudyRoomScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { roomCode, username } = useAuthStore();
  const { furnitures, loadRoom, isLoading: isRoomLoading } = useRoomStore();
  const { pet, fetchMyPet, updateAccessories } = usePetStore();

  const {
    isFocusModeActive,
    startSession,
    lastReward,
    isRewardModalVisible,
    closeRewardModal,
  } = useStudyStore();

  // Tek ve birleşik useLiveRoomStore çağrısı
  const {
    joinLiveRoom,
    leaveLiveRoom,
    broadcastStudyStatus,
    broadcastAccessories,
    sendDirectMessage,
    roommates,
  } = useLiveRoomStore();

  const [isDurationModalVisible, setDurationModalVisible] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  // Aksesuar ve Renk State'leri
  const [equippedHat, setEquippedHat] = useState<string>('NONE');
  const [hatColor, setHatColor] = useState<string>('#6C5CE7');

  const [equippedGlasses, setEquippedGlasses] = useState<string>('NONE');
  const [glassesColor, setGlassesColor] = useState<string>('#2D3436');

  const [equippedAccessory, setEquippedAccessory] = useState<string>('NONE');
  const [accessoryColor, setAccessoryColor] = useState<string>('#E74C3C');

  const isInitialLoaded = useRef(false);

  const originX = SCREEN_WIDTH / 2;
  const originY = 80;

  // 18. Gün: Pet Durum Makinesi
  const { currentState: myPetState } = usePetStateMachine({
    isStudying: isFocusModeActive,
  });

  // 20. Gün: Yürüme ve Fısıldama Kontrolcüleri (Erken return öncesinde tanımlandı)
  const {
    animX,
    animY,
    currentGridPos,
    isWalking,
    walkToTarget,
    walkDirectToTile,
  } = usePetWalkingController({
    initialGridPos: HOME_POS,
    originX,
    originY,
    furnitures,
  });

  const { isBroadcasting, broadcastingText, startWhisperTour } = useWhisperBroadcast({
    myHomePos: HOME_POS,
    walkToTarget,
    walkDirectToTile,
    sendDirectMessage,
    roomCode: roomCode || '',
    myUsername: username || 'Misafir',
  });

  useEffect(() => {
    if (roomCode) {
      loadRoom(roomCode);
    }
    fetchMyPet();
  }, [roomCode]);

  useEffect(() => {
    if (pet && !isInitialLoaded.current) {
      if (pet.equippedHat) setEquippedHat(pet.equippedHat);
      if (pet.equippedGlasses) setEquippedGlasses(pet.equippedGlasses);
      if (pet.equippedAccessory) setEquippedAccessory(pet.equippedAccessory);
      isInitialLoaded.current = true;
    }
  }, [pet]);

  useEffect(() => {
    const activeUsername = username || 'Misafir';
    const petType = pet?.type || 'CAT';

    if (roomCode) {
      joinLiveRoom(roomCode, activeUsername, petType, {
        equippedHat,
        hatColor,
        equippedGlasses,
        glassesColor,
        equippedAccessory,
        accessoryColor,
      });
    }

    return () => {
      if (roomCode) {
        leaveLiveRoom(roomCode, activeUsername, petType);
      }
    };
  }, [roomCode, username, pet?.type]);

  const handleStartStudy = async (minutes: number) => {
    try {
      setShowWardrobe(false);
      await startSession(minutes);
      if (roomCode && pet) {
        broadcastStudyStatus(roomCode, username || 'Misafir', pet.type, true, minutes);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Çalışma oturumu başlatılamadı.';
      Alert.alert('Hata', msg);
    }
  };

  const handleCloseReward = () => {
    if (roomCode && pet) {
      broadcastStudyStatus(roomCode, username || 'Misafir', pet.type, false);
    }
    closeRewardModal();
  };

  const handleSaveAccessories = async () => {
    if (isSavingLocal) return;
    setIsSavingLocal(true);

    const isFish = pet?.type === 'FISH';
    const payload = {
      equippedHat: equippedHat === 'NONE' ? null : equippedHat,
      equippedGlasses: isFish || equippedGlasses === 'NONE' ? null : equippedGlasses,
      equippedAccessory: isFish || equippedAccessory === 'NONE' ? null : equippedAccessory,
    };

    try {
      await updateAccessories(payload as any);

      if (roomCode && pet) {
        broadcastAccessories(roomCode, username || 'Misafir', pet.type, {
          equippedHat: equippedHat === 'NONE' ? undefined : equippedHat,
          hatColor,
          equippedGlasses: isFish || equippedGlasses === 'NONE' ? undefined : equippedGlasses,
          glassesColor,
          equippedAccessory: isFish || equippedAccessory === 'NONE' ? undefined : equippedAccessory,
          accessoryColor,
        });
      }

      Alert.alert('Başarılı! 🎉', 'Evcil hayvanının tarzı kaydedildi.');
      setShowWardrobe(false);
    } catch (error: any) {
      console.error('Kıyafet kaydetme hatası:', error?.response?.data || error?.message || error);
      Alert.alert('Hata', 'Kıyafetler kaydedilirken bir sorun oluştu.');
    } finally {
      setIsSavingLocal(false);
    }
  };

  const handleBroadcastWhisper = () => {
    const roommateList = Object.values(roommates);
    if (roommateList.length === 0) {
      Alert.alert('Oda Boş', 'Odada fısıldayabileceğin başka bir arkadaşın yok.');
      return;
    }

    const targets = roommateList.map((mate, idx) => ({
      username: mate.username,
      gridPos: DESK_SLOTS[idx % DESK_SLOTS.length],
    }));

    if (Alert.prompt) {
      Alert.prompt('Herkese Fısılda', 'Odadaki herkese iletilecek mesajı yazın:', (text) => {
        if (!text?.trim()) return;
        startWhisperTour(targets, text.trim());
      });
    } else {
      startWhisperTour(targets, 'Birlikte iyi çalışıyoruz! 🚀');
    }
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
      {/* Üst Bilgi Barı */}
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

        <View style={styles.roomCalendarBadge}>
          <Text style={styles.calendarIcon}>📅</Text>
          <View>
            <Text style={styles.calendarLabel}>ODA KODU</Text>
            <Text style={styles.calendarCode}>{roomCode || 'YOK'}</Text>
          </View>
        </View>
      </View>

      <RoomStatsOverlay />

      {/* 2D İzometrik Oda Alanı */}
      <View style={styles.roomViewport}>
        <IsometricRoomView />

        <PlacedFurnitureLayer
          furnitures={furnitures}
          originX={originX}
          originY={originY}
        />

        <LiveRoommatesLayer originX={originX} originY={originY} />

        {/* Katman: Kullanıcının Kendi Peti (Artık doğru şekilde roomViewport içinde) */}
        {pet && (
          <Animated.View
            style={[
              styles.petPositioner,
              {
                left: Animated.subtract(animX, 52.5),
                top: Animated.subtract(animY, 92),
                zIndex: currentGridPos.x + currentGridPos.y + 50,
              },
            ]}
          >
            {isBroadcasting && broadcastingText && (
              <SpeechBubble message={broadcastingText} />
            )}

            <PetAvatar
              type={pet.type}
              size={105}
              isStudying={isFocusModeActive}
              petState={isWalking ? 'WALKING' : myPetState}
              equippedHat={equippedHat}
              hatColor={hatColor}
              equippedGlasses={equippedGlasses}
              glassesColor={glassesColor}
              equippedAccessory={equippedAccessory}
              accessoryColor={accessoryColor}
            />
            <View style={styles.petNameTag}>
              <Text style={styles.petNameText}>{pet.name}</Text>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Aksesuar & Gardırop Menüsü */}
      {!isFocusModeActive && showWardrobe && (
        <View style={styles.wardrobeContainer}>
          <AccessoryMenu
            petType={pet?.type}
            equippedHat={equippedHat}
            hatColor={hatColor}
            equippedGlasses={equippedGlasses}
            glassesColor={glassesColor}
            equippedAccessory={equippedAccessory}
            accessoryColor={accessoryColor}
            isSaving={isSavingLocal}
            onSelectAccessory={(id, category) => {
              if (category === 'HAT') setEquippedHat(id);
              if (category === 'GLASSES') setEquippedGlasses(id);
              if (category === 'NECK') setEquippedAccessory(id);
            }}
            onSelectColor={(color, category) => {
              if (category === 'HAT') setHatColor(color);
              if (category === 'GLASSES') setGlassesColor(color);
              if (category === 'NECK') setAccessoryColor(color);
            }}
            onSave={handleSaveAccessories}
          />
        </View>
      )}

      {/* Alt Kontrol Paneli */}
      {!isFocusModeActive && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.wardrobeToggleBtn}
            onPress={() => setShowWardrobe(!showWardrobe)}
          >
            <Text style={styles.btnEmoji}>{showWardrobe ? '✖' : '🎀'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.wardrobeToggleBtn, isBroadcasting && { opacity: 0.5 }]}
            onPress={handleBroadcastWhisper}
            disabled={isBroadcasting}
          >
            <Text style={styles.btnEmoji}>💬</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startStudyButton}
            onPress={() => setDurationModalVisible(true)}
          >
            <Text style={styles.startStudyIcon}>⏳</Text>
            <Text style={styles.startStudyText}>Çalışmaya Başla</Text>
          </TouchableOpacity>
        </View>
      )}

      <StudyDurationModal
        visible={isDurationModalVisible}
        onClose={() => setDurationModalVisible(false)}
        onStart={handleStartStudy}
      />

      <FocusOverlay />

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
  wardrobeContainer: {
    paddingHorizontal: Theme.spacing.sm,
    marginBottom: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
    gap: 10,
    alignItems: 'center',
  },
  wardrobeToggleBtn: {
    width: 52,
    height: 52,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
  },
  btnEmoji: {
    fontSize: 22,
  },
  startStudyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
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