import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
} from 'react-native';
import { triggerHaptic } from '../../utils/haptics';

interface Props {
  navigation: any;
}

export const RoomChoiceScreen: React.FC<Props> = ({ navigation }) => {
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState('');

  // 1. Kendi Bireysel Odasına Giriş
  const handleEnterSoloRoom = () => {
    triggerHaptic.light();
    navigation.navigate('StudyRoomScreen');
  };

  // 2. Arkadaşının Odasına Katılma
  const handleJoinFriendRoom = () => {
    if (!roomCodeInput.trim()) {
      triggerHaptic.error();
      Alert.alert('Uyarı', 'Lütfen geçerli bir oda kodu giriniz.');
      return;
    }

    triggerHaptic.success();
    setIsJoinModalVisible(false);
    const code = roomCodeInput.trim().toUpperCase();
    setRoomCodeInput('');

    // StudyRoomScreen'e oda kodunu parametre olarak gönderiyoruz
    navigation.navigate('StudyRoomScreen', { roomCode: code });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Çalışma Modu Seç</Text>
        <Text style={styles.subtitle}>
          Nasıl odaklanmak istersin?
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {/* Bireysel Çalışma Kartı */}
        <TouchableOpacity
          style={[styles.card, styles.soloCard]}
          activeOpacity={0.85}
          onPress={handleEnterSoloRoom}
        >
          <Text style={styles.cardEmoji}>🏡</Text>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Kendi Çalışma Odan</Text>
            <Text style={styles.cardDescription}>
              Kişiselleştirdiğin odanda sanal petinle baş başa sessizce odaklan.
            </Text>
          </View>
          <Text style={styles.enterArrow}>→</Text>
        </TouchableOpacity>

        {/* Çok Oyunculu / Ortak Çalışma Kartı */}
        <TouchableOpacity
          style={[styles.card, styles.multiCard]}
          activeOpacity={0.85}
          onPress={() => {
            triggerHaptic.light();
            setIsJoinModalVisible(true);
          }}
        >
          <Text style={styles.cardEmoji}>👥</Text>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Arkadaşına Katıl</Text>
            <Text style={styles.cardDescription}>
              Oda kodu girerek arkadaşlarınla aynı odada eşzamanlı çalış ve yarış.
            </Text>
          </View>
          <Text style={styles.enterArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Oda Kodu Giriş Modalı */}
      <Modal
        visible={isJoinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🔑</Text>
            <Text style={styles.modalTitle}>Oda Kodu ile Katıl</Text>
            <Text style={styles.modalSubtitle}>
              Arkadaşının paylaştığı 6 haneli kodu gir:
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Örn: ROOM-42"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={roomCodeInput}
              onChangeText={setRoomCodeInput}
              maxLength={12}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setIsJoinModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={handleJoinFriendRoom}
              >
                <Text style={styles.confirmBtnText}>Odaya Gir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1B26',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 6,
    width: 80,
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  soloCard: {
    backgroundColor: '#24283B',
    borderColor: '#414868',
  },
  multiCard: {
    backgroundColor: '#24283B',
    borderColor: '#7AA2F7',
  },
  cardEmoji: {
    fontSize: 36,
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#A9B1D6',
    lineHeight: 17,
  },
  enterArrow: {
    fontSize: 22,
    color: '#7AA2F7',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#24283B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#414868',
  },
  modalEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#1A1B26',
    borderWidth: 1.5,
    borderColor: '#7AA2F7',
    borderRadius: 14,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 12,
    marginBottom: 20,
    letterSpacing: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#414868',
  },
  cancelBtnText: {
    color: '#C0CAF5',
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: '#7AA2F7',
  },
  confirmBtnText: {
    color: '#1A1B26',
    fontWeight: '700',
  },
});