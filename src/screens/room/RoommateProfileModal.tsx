import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { ActiveRoommate } from '../../types/socket';
import { PetAvatar } from '../../components/PetAvatar';
import { useLiveRoomStore } from '../../store/useLiveRoomStore';

interface Props {
  visible: boolean;
  roommate: ActiveRoommate | null;
  myUsername: string;
  onClose: () => void;
  onSendReaction: (emoji: string) => void;
  onSendMessage: (text: string) => void;
}

const REACTIONS = ['👋', '👏', '🔥', '☕', '❤️', '⭐'];

export const RoommateProfileModal: React.FC<Props> = ({
  visible,
  roommate,
  myUsername,
  onClose,
  onSendReaction,
  onSendMessage,
}) => {
  const [messageText, setMessageText] = useState('');
  const { messages } = useLiveRoomStore();

  if (!roommate) return null;

  // Sadece bu arkadaşla aramızdaki mesajları filtrele
  const conversation = messages.filter(
    (m) =>
      (m.senderUsername === myUsername && m.targetUsername === roommate.username) ||
      (m.senderUsername === roommate.username && m.targetUsername === myUsername)
  );

  const handleSend = () => {
    if (!messageText.trim()) return;
    onSendMessage(messageText.trim());
    setMessageText('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            {/* Pet & Kullanıcı Bilgisi */}
            <View style={styles.avatarWrap}>
              <PetAvatar
                type={roommate.petType}
                size={85}
                isStudying={roommate.isStudying}
                equippedHat={roommate.equippedHat}
                hatColor={roommate.hatColor}
                equippedGlasses={roommate.equippedGlasses}
                glassesColor={roommate.glassesColor}
                equippedAccessory={roommate.equippedAccessory}
                accessoryColor={roommate.accessoryColor}
              />
            </View>

            <Text style={styles.username}>{roommate.username}</Text>
            <View
              style={[
                styles.statusBadge,
                roommate.isStudying ? styles.studyingBadge : styles.idleBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {roommate.isStudying
                  ? `📖 Odaklanıyor (${roommate.targetMinutes || 25} dk)`
                  : '☕ Molada'}
              </Text>
            </View>

            {/* Hızlı Tepki Emojileri */}
            <View style={styles.reactionRow}>
              {REACTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.reactionBtn}
                  onPress={() => {
                    onSendReaction(emoji);
                    onClose();
                  }}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Mini Sohbet Geçmişi */}
            <View style={styles.chatSection}>
              <Text style={styles.chatHeader}>Fısıltılar</Text>
              <ScrollView style={styles.chatList} contentContainerStyle={{ gap: 6 }}>
                {conversation.length === 0 ? (
                  <Text style={styles.emptyText}>Henüz bir fısıltı yok. İlk sen yaz!</Text>
                ) : (
                  conversation.slice(-4).map((msg, idx) => {
                    const isMe = msg.senderUsername === myUsername;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.chatBubble,
                          isMe ? styles.myBubble : styles.theirBubble,
                        ]}
                      >
                        <Text style={[styles.chatText, isMe && styles.myText]}>
                          {msg.content}
                        </Text>
                      </View>
                    );
                  })
                )}
              </ScrollView>
            </View>

            {/* Mesaj Yazma Girişi */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Bir fısıltı gönder..."
                placeholderTextColor="#94A3B8"
                value={messageText}
                onChangeText={setMessageText}
                maxLength={60}
              />
              <TouchableOpacity
                style={[styles.sendBtn, !messageText.trim() && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={!messageText.trim()}
              >
                <Text style={styles.sendBtnText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardWrap: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '84%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  avatarWrap: {
    marginTop: 4,
    marginBottom: 6,
  },
  username: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  studyingBadge: { backgroundColor: '#DCFCE7' },
  idleBadge: { backgroundColor: '#F1F5F9' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#166534' },
  reactionRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 12,
  },
  reactionBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 6,
    borderRadius: 10,
  },
  emojiText: { fontSize: 18 },
  chatSection: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chatHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  chatList: {
    maxHeight: 90,
  },
  emptyText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  chatBubble: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: '85%',
  },
  myBubble: {
    backgroundColor: '#6C5CE7',
    alignSelf: 'flex-end',
  },
  theirBubble: {
    backgroundColor: '#E2E8F0',
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 12,
    color: '#1E293B',
  },
  myText: {
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1E293B',
  },
  sendBtn: {
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});