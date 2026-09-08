import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PetAvatar } from '../PetAvatar';
import { gridToScreen } from '../../utils/isometric';
import { useLiveRoomStore } from '../../store/useLiveRoomStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePetStore } from '../../store/usePetStore';
import { RoommateProfileModal } from '../../screens/room/RoommateProfileModal';
import { ActiveRoommate } from '../../types/socket';
import { PetType } from '../../types';
import { SpeechBubble } from './SpeechBubble';

interface Props {
  originX: number;
  originY: number;
}

const DESK_SLOTS = [
  { x: 2, y: 3 },
  { x: 6, y: 3 },
  { x: 2, y: 6 },
  { x: 6, y: 6 },
];

export const LiveRoommatesLayer: React.FC<Props> = ({ originX, originY }) => {
  const { roommates, activeReactions, activeSpeechBubbles, sendReaction, sendDirectMessage } = useLiveRoomStore();
  const { username, roomCode } = useAuthStore();
  const { pet } = usePetStore();
  

  const [selectedRoommate, setSelectedRoommate] = useState<ActiveRoommate | null>(null);

  const roommateList = Object.values(roommates);

  const handleSendReaction = (emoji: string) => {
    if (!selectedRoommate || !roomCode) return;
    sendReaction(
      roomCode,
      username || 'Misafir',
      selectedRoommate.username,
      emoji,
      pet?.type || 'CAT'
    );
  };

  return (
    <>
      {roommateList.map((mate, index) => {
        const slot = DESK_SLOTS[index % DESK_SLOTS.length];
        const screenPos = gridToScreen(slot.x, slot.y, originX, originY);
        const currentSpeech = activeSpeechBubbles[mate.username];
        const currentReaction = activeReactions[mate.username];

        return (
          <View
            key={mate.username}
            style={[
              styles.roommatePositioner,
              {
                left: screenPos.x - 52.5,
                top: screenPos.y - 92,
                zIndex: slot.x + slot.y + 50,
              },
            ]}
          >
            {/* Konuşma Baloncuğu */}
            {currentSpeech && <SpeechBubble message={currentSpeech} />}
            
            {/* Tepki Emojisi Baloncuğu (Varsa Petin Üzerinde Belirir) */}
            {currentReaction && (
              <View style={styles.reactionBubble}>
                <Text style={styles.reactionEmojiText}>{currentReaction}</Text>
              </View>
            )}

            {/* Dokunulabilir Pet */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedRoommate(mate)}
            >
              <PetAvatar
                type={(mate.petType as PetType) || 'CAT'}
                size={105}
                isStudying={mate.isStudying}
                equippedHat={mate.equippedHat || 'NONE'}
                hatColor={mate.hatColor || '#6C5CE7'}
                equippedGlasses={mate.equippedGlasses || 'NONE'}
                glassesColor={mate.glassesColor || '#2D3436'}
                equippedAccessory={mate.equippedAccessory || 'NONE'}
                accessoryColor={mate.accessoryColor || '#E74C3C'}
              />
            </TouchableOpacity>

            {/* İsim & Durum Rozeti */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedRoommate(mate)}
              style={[styles.nameTag, mate.isStudying && styles.studyingTag]}
            >
              <Text style={styles.nameText}>
                {mate.isStudying ? '📖 ' : ''}{mate.username}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Mini Profil & Tepki Modalı */}
      <RoommateProfileModal
  visible={!!selectedRoommate}
  roommate={selectedRoommate}
  myUsername={username || 'Misafir'}
  onClose={() => setSelectedRoommate(null)}
  onSendReaction={handleSendReaction}
  onSendMessage={(text) => {
    if (selectedRoommate && roomCode) {
      sendDirectMessage(roomCode, username || 'Misafir', selectedRoommate.username, text);
    }
  }}
/>
    </>
  );
};

const styles = StyleSheet.create({
  roommatePositioner: {
    position: 'absolute',
    alignItems: 'center',
  },
  nameTag: {
    backgroundColor: 'rgba(26, 27, 38, 0.85)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: -8,
  },
  studyingTag: {
    backgroundColor: 'rgba(46, 213, 115, 0.9)',
  },
  nameText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  reactionBubble: {
    position: 'absolute',
    top: -24,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: '#6C5CE7',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  reactionEmojiText: {
    fontSize: 18,
  },
});