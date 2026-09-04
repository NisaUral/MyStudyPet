import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme';

interface Props {
  visible: boolean;
  earnedCoins: number;
  workedMinutes: number;
  isCompleted: boolean;
  onClose: () => void;
}

export const RewardModal: React.FC<Props> = ({
  visible,
  earnedCoins,
  workedMinutes,
  isCompleted,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.badgeEmoji}>{isCompleted ? '🎉' : '⏱️'}</Text>
          <Text style={styles.title}>
            {isCompleted ? 'Harika İş Çıkardın!' : 'Oturum Tamamlandı'}
          </Text>

          <Text style={styles.subtitle}>
            {workedMinutes} dakika boyunca odaklandın.
          </Text>

          <View style={styles.rewardContainer}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={styles.rewardText}>+{earnedCoins} Para</Text>
          </View>

          {earnedCoins === 0 && (
            <Text style={styles.warningText}>
              Ödül kazanabilmek için en az 5 dakika odaklanmalısın.
            </Text>
          )}

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmText}>Harika!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  card: {
    width: '85%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.accent,
  },
  badgeEmoji: {
    fontSize: 54,
    marginBottom: Theme.spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginVertical: Theme.spacing.xs,
    textAlign: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(224, 175, 104, 0.15)',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    marginVertical: Theme.spacing.md,
  },
  coinIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  rewardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.accent,
  },
  warningText: {
    fontSize: 12,
    color: Theme.colors.danger,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  confirmButton: {
    width: '100%',
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
  },
  confirmText: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});