import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onStart: (minutes: number) => void;
}

const PRESET_DURATIONS = [25, 45, 60, 90, 120];

export const StudyDurationModal: React.FC<Props> = ({ visible, onClose, onStart }) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(60);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Çalışma Hedefini Belirle</Text>
          <Text style={styles.subtitle}>Odaklanmak istediğin süreyi seç:</Text>

          <View style={styles.presetsGrid}>
            {PRESET_DURATIONS.map((min) => {
              const isSelected = selectedMinutes === min;
              return (
                <TouchableOpacity
                  key={min}
                  style={[styles.presetButton, isSelected && styles.selectedPreset]}
                  onPress={() => setSelectedMinutes(min)}
                >
                  <Text style={[styles.presetText, isSelected && styles.selectedPresetText]}>
                    {min} dk
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Vazgeç</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                onStart(selectedMinutes);
                onClose();
              }}
            >
              <Text style={styles.startText}>Odaklanmaya Başla</Text>
            </TouchableOpacity>
          </View>
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
    width: '100%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginVertical: Theme.spacing.xs,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    marginVertical: Theme.spacing.md,
  },
  presetButton: {
    backgroundColor: Theme.colors.surfaceLight,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedPreset: {
    borderColor: Theme.colors.primary,
    backgroundColor: '#3B4261',
  },
  presetText: {
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },
  selectedPresetText: {
    color: Theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surfaceLight,
  },
  cancelText: {
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  startButton: {
    flex: 2,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.primary,
  },
  startText: {
    color: Theme.colors.white,
    fontWeight: 'bold',
  },
});