import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useStudyStore } from '../../store/useStudyStore';
import { triggerHaptic } from '../../utils/haptics';

export const FocusOverlay: React.FC = () => {
  const {
    isFocusModeActive,
    remainingSeconds,
    tick,
    stopSessionEarly,
  } = useStudyStore();

  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  // Interval tekil yönetimi
  useEffect(() => {
    if (isFocusModeActive && !isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isFocusModeActive, isPaused, tick]);

  if (!isFocusModeActive) {
    return null;
  }

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Duraklat / Devam Et Tıklaması
  const togglePause = () => {
    try {
      triggerHaptic.light();
    } catch (e) {}
    setIsPaused((prev) => !prev);
  };

  // Seansı Erken Bitir (Pes Et)
  // Seansı Erken Bitir (Doğrudan ve garantili çağrı)
  const handleFinishEarly = async () => {
    try {
      triggerHaptic.medium();
    } catch (e) {}

    // Sayacı temizle
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(false);

    // Seansı sonlandır
    try {
      await stopSessionEarly();
    } catch (err) {
      console.error('[FocusOverlay] Bitirme hatası:', err);
    }
  };

  return (
    <View style={styles.bottomContainer} pointerEvents="box-none">
      <View style={styles.capsule}>
        {/* Durum Noktası & Sayaç */}
        <View style={styles.timerSection}>
          <View
            style={[
              styles.indicatorDot,
              isPaused && styles.indicatorDotPaused,
            ]}
          />
          <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
        </View>

        {/* Aksiyon Butonları */}
        <View style={styles.actionsSection}>
          {/* Duraklat / Devam Et Butonu */}
          <TouchableOpacity
            style={[styles.btn, isPaused ? styles.resumeBtn : styles.pauseBtn]}
            activeOpacity={0.7}
            onPress={togglePause}
            hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
          >
            <Text style={[styles.btnText, isPaused ? styles.resumeText : styles.pauseText]}>
              {isPaused ? '▶ Devam' : '⏸ Duraklat'}
            </Text>
          </TouchableOpacity>

          {/* Seansı Bitir Butonu */}
          <TouchableOpacity
            style={[styles.btn, styles.stopBtn]}
            activeOpacity={0.7}
            onPress={handleFinishEarly}
            hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
          >
            <Text style={[styles.btnText, styles.stopText]}>⏹ Bitir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 30, // Ekranın en altına hizalama
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99999, // Dokunma önceliği garanti
    elevation: 99,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E2233',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#7AA2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
    gap: 16,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ECE6A', // Canlı yeşil (çalışıyor)
  },
  indicatorDotPaused: {
    backgroundColor: '#E0AF68', // Turuncu/sarı (duraklatıldı)
  },
  timerText: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  btnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pauseBtn: {
    backgroundColor: '#24283B',
    borderWidth: 1,
    borderColor: '#414868',
  },
  pauseText: {
    color: '#A9B1D6',
  },
  resumeBtn: {
    backgroundColor: 'rgba(158, 206, 106, 0.2)',
    borderWidth: 1,
    borderColor: '#9ECE6A',
  },
  resumeText: {
    color: '#9ECE6A',
  },
  stopBtn: {
    backgroundColor: 'rgba(247, 118, 142, 0.15)',
    borderWidth: 1,
    borderColor: '#F7768E',
  },
  stopText: {
    color: '#F7768E',
  },
});