import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Theme } from '../../theme';
import { UnlockedAchievement } from '../../store/useStudyStore';

interface Props {
  visible: boolean;
  earnedCoins: number;
  baseCoins?: number;
  multiplier?: number;
  currentStreak?: number;
  workedMinutes: number;
  isCompleted: boolean;
  newlyUnlockedAchievements?: UnlockedAchievement[];
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 12 parçacıklı hafif konfeti simülatörü
const CONFETTI_COLORS = ['#6C5CE7', '#F1C40F', '#E74C3C', '#2ECC71', '#3498DB', '#E67E22'];

export const RewardModal: React.FC<Props> = ({
  visible,
  earnedCoins,
  baseCoins = 0,
  multiplier = 1.0,
  currentStreak = 1,
  workedMinutes,
  isCompleted,
  newlyUnlockedAchievements = [],
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const confettiAnims = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible) {
      // Modal yaylanma efekti
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }).start();

      // Konfeti dökülme animasyonları
      const animations = confettiAnims.map((anim, idx) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 1200 + (idx % 4) * 200,
          useNativeDriver: true,
        })
      );
      Animated.parallel(animations).start();
    } else {
      scaleAnim.setValue(0.3);
      confettiAnims.forEach((a) => a.setValue(0));
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Konfeti Parçacıkları Katmanı */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {confettiAnims.map((anim, idx) => {
            const startX = (SCREEN_WIDTH / 12) * idx + 10;
            const translateY = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [-30, 450],
            });
            const rotate = anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', `${(idx % 2 === 0 ? 1 : -1) * 360}deg`],
            });
            const opacity = anim.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [1, 1, 0],
            });

            return (
              <Animated.View
                key={idx}
                style={[
                  styles.confettiPiece,
                  {
                    left: startX,
                    backgroundColor: CONFETTI_COLORS[idx % CONFETTI_COLORS.length],
                    transform: [{ translateY }, { rotate }],
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Ana Ödül Kartı */}
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.badgeEmoji}>{isCompleted ? '🎉' : '👏'}</Text>
          <Text style={styles.title}>
            {isCompleted ? 'Oturum Başarıyla Tamamlandı!' : 'Güzel Bir Mola!'}
          </Text>
          <Text style={styles.subtitle}>
            {workedMinutes} dakika boyunca harika bir odaklanma sergiledin.
          </Text>

          {/* Günlük Seri (Streak) ve Çarpan Rozeti */}
          <View style={styles.streakContainer}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>{currentStreak} Gün Serisi</Text>
            </View>
            {multiplier > 1.0 && (
              <View style={styles.multiplierBadge}>
                <Text style={styles.multiplierText}>⚡ {multiplier}x Bonus Çarpan</Text>
              </View>
            )}
          </View>

          {/* Kazanılan Altın Kutusu */}
          <View style={styles.coinBox}>
            <Text style={styles.coinBigIcon}>🪙</Text>
            <View>
              <Text style={styles.coinAmount}>+{earnedCoins} Coin</Text>
              {multiplier > 1.0 && baseCoins > 0 && (
                <Text style={styles.coinDetail}>
                  Temel: {baseCoins} + Çarpan Bonusu
                </Text>
              )}
            </View>
          </View>

          {/* Açılan Yeni Başarımlar (Varsa) */}
          {newlyUnlockedAchievements.length > 0 && (
            <View style={styles.achievementSection}>
              <Text style={styles.achievementSectionTitle}>🏆 Yeni Başarım Açıldı!</Text>
              <ScrollView style={{ maxHeight: 110 }} showsVerticalScrollIndicator={false}>
                {newlyUnlockedAchievements.map((ach) => (
                  <View key={ach.type} style={styles.achievementItem}>
                    <Text style={styles.achievementTrophy}>⭐</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.achievementTitle}>{ach.title}</Text>
                      <Text style={styles.achievementDesc}>{ach.description}</Text>
                    </View>
                    <Text style={styles.achievementBonus}>+{ach.bonusCoins} 🪙</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Topla & Kapat Butonu */}
          <TouchableOpacity style={styles.collectButton} onPress={onClose}>
            <Text style={styles.collectButtonText}>Ödülleri Topla ✨</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  badgeEmoji: {
    fontSize: 48,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#F97316',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C2410C',
  },
  multiplierBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  multiplierText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  coinBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
    gap: 12,
    marginBottom: 14,
  },
  coinBigIcon: {
    fontSize: 32,
  },
  coinAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#B45309',
  },
  coinDetail: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  achievementSection: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  achievementSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
  },
  achievementTrophy: {
    fontSize: 16,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  achievementDesc: {
    fontSize: 10,
    color: '#64748B',
  },
  achievementBonus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B45309',
  },
  collectButton: {
    width: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  collectButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  confettiPiece: {
    position: 'absolute',
    top: 0,
    width: 8,
    height: 14,
    borderRadius: 2,
  },
});