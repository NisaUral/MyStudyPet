import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PetAvatar } from '../PetAvatar';
import { Theme } from '../../theme';
import { gridToScreen } from '../../utils/isometric';
import { ActiveRoommate } from '../../types/socket';

interface Props {
  roommate: ActiveRoommate;
  slotIndex: number;
  originX: number;
  originY: number;
}

export const RoommatePetNode: React.FC<Props> = ({
  roommate,
  slotIndex,
  originX,
  originY,
}) => {
  // GUEST_SLOTS havuzundan slot seç (5'ten fazla olursa mod alarak dağıt)
  const slotCoords = [
    { gridX: 2, gridY: 3 },
    { gridX: 5, gridY: 2 },
    { gridX: 2, gridY: 5 },
    { gridX: 6, gridY: 4 },
    { gridX: 3, gridY: 6 },
  ];
  const targetSlot = slotCoords[slotIndex % slotCoords.length];

  const screenPos = gridToScreen(targetSlot.gridX, targetSlot.gridY, originX, originY);
  const depthZIndex = targetSlot.gridX + targetSlot.gridY + 40; // Mobilyalarla uyumlu derinlik puanı

  return (
    <View
      style={[
        styles.container,
        {
          left: screenPos.x - 35,
          top: screenPos.y - 65,
          zIndex: depthZIndex,
        },
      ]}
      pointerEvents="none"
    >
      {/* 1. Durum Rozeti (Çalışıyor / Mola) */}
      <View
        style={[
          styles.statusBadge,
          roommate.isStudying ? styles.studyingBadge : styles.idleBadge,
        ]}
      >
        <Text style={styles.statusText}>
          {roommate.isStudying ? '📖 Odaklanıyor' : '☕ Molada'}
        </Text>
      </View>

      {/* 2. Misafir Pet Avatarı */}
      <PetAvatar type={roommate.petType} size={70} />

      {/* 3. Kullanıcı Adı Etiketi */}
      <View style={styles.nameTag}>
        <Text style={styles.nameText} numberOfLines={1}>
          {roommate.username}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    width: 70,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.round,
    marginBottom: 2,
    borderWidth: 1,
  },
  studyingBadge: {
    backgroundColor: 'rgba(158, 206, 106, 0.2)',
    borderColor: '#9ECE6A',
  },
  idleBadge: {
    backgroundColor: 'rgba(187, 154, 247, 0.15)',
    borderColor: '#BB9AF7',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: Theme.colors.white,
  },
  nameTag: {
    backgroundColor: 'rgba(26, 27, 38, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: -4,
  },
  nameText: {
    fontSize: 10,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
});