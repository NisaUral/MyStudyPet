import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Theme } from '../../theme';
import { useLiveRoomStore } from '../../store/useLiveRoomStore';

export const RoomStatsOverlay: React.FC = () => {
  const roommates = useLiveRoomStore((state) => state.roommates);
  const latestToast = useLiveRoomStore((state) => state.latestToast);
  const setToast = useLiveRoomStore((state) => state.setToast);

  const roommateList = Object.values(roommates);
  const totalPeople = roommateList.length + 1; // Kendimiz dahil
  const studyingCount = roommateList.filter((r) => r.isStudying).length;

  // Toast mesajı geldiğinde 3 saniye sonra otomatik temizle
  useEffect(() => {
    if (latestToast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [latestToast]);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* 1. Canlı İstatistik Barı */}
      <View style={styles.statsBadge}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>👥</Text>
          <Text style={styles.statText}>{totalPeople} Kişi Odada</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statText}>{studyingCount} Odaklanıyor</Text>
        </View>
      </View>

      {/* 2. Anlık Toast Bildirim Balonu */}
      {latestToast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{latestToast}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
    paddingHorizontal: Theme.spacing.lg,
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 27, 38, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.round,
    borderWidth: 1,
    borderColor: '#414868',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 13,
  },
  statText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: '#414868',
    marginHorizontal: 10,
  },
  toastContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(122, 162, 247, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  toastText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1B26',
    textAlign: 'center',
  },
});