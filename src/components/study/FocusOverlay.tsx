import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Theme } from '../../theme';
import { useStudyStore } from '../../store/useStudyStore';

interface Props {
  onStopEarly?: () => void;
}

export const FocusOverlay: React.FC<Props> = ({ onStopEarly }) => {
  const { status, remainingSeconds, isFocusModeActive, tick, stopSessionEarly } = useStudyStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (status === 'RUNNING') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  if (!isFocusModeActive) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleStopPress = () => {
    Alert.alert(
      'Çalışmayı Sonlandır',
      'Çalışma seansını erken bitirmek istediğine emin misin?',
      [
        { text: 'Devam Et', style: 'cancel' },
        {
          text: 'Bitir',
          style: 'destructive',
          onPress: async () => {
            // Artık Promise bekleniyor ve modal store üzerinden otomatik açılıyor
            await stopSessionEarly();
            if (onStopEarly) {
              onStopEarly();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.backdrop} pointerEvents="box-none">
      {/* Üst Kısım: Zamanlayıcı Rozeti */}
      <View style={styles.timerBadge}>
        <Text style={styles.timerLabel}>ODAK MODU</Text>
        <Text style={styles.timerDigits}>{formattedTime}</Text>
      </View>

      {/* Alt Kısım: Erken Sonlandırma Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.earlyStopButton} onPress={handleStopPress}>
          <Text style={styles.earlyStopText}>Çalışmayı Erken Sonlandır</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 17, 26, 0.45)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
    zIndex: 50,
  },
  timerBadge: {
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    marginTop: 20,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.colors.primary,
    letterSpacing: 1.5,
  },
  timerDigits: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  footer: {
    width: '100%',
    paddingHorizontal: Theme.spacing.xl,
  },
  earlyStopButton: {
    backgroundColor: 'rgba(247, 118, 142, 0.2)',
    borderWidth: 1,
    borderColor: Theme.colors.danger,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  earlyStopText: {
    color: Theme.colors.danger,
    fontWeight: 'bold',
    fontSize: 14,
  },
});