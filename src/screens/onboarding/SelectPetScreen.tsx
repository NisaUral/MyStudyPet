import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Theme } from '../../theme';
import { PET_OPTIONS, PetOption } from '../../constants/pets';
import { petApi } from '../../api/petApi';
import { useAuthStore } from '../../store/useAuthStore';
import { PetType } from '../../types';

interface Props {
  navigation: any;
}

export const SelectPetScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState<PetType>('CAT');
  const [petName, setPetName] = useState('');
  const [loading, setLoading] = useState(false);

  const setPetSelected = useAuthStore((state) => state.setPetSelected);

  const selectedPetMeta = PET_OPTIONS.find((p) => p.type === selectedType);

  const handleConfirm = async () => {
    if (!petName.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen evcil hayvanınıza bir isim verin.');
      return;
    }

    if (petName.trim().length < 2) {
      Alert.alert('Geçersiz İsim', 'İsim en az 2 karakter olmalıdır.');
      return;
    }

    try {
      setLoading(true);
      await petApi.createPet({
        type: selectedType,
        name: petName.trim(),
      });

      setPetSelected(true);
      // Bir sonraki adım olan "Oda Yarat / Koda Katıl" seçimine yönlendirilir
      navigation.replace('RoomChoiceScreen');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Karakter kaydedilirken bir sorun oluştu.';
      Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  const renderPetCard = ({ item }: { item: PetOption }) => {
    const isSelected = item.type === selectedType;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedType(item.type)}
        style={[
          styles.card,
          isSelected && styles.selectedCard,
        ]}
      >
        <Text style={styles.petEmoji}>{item.emoji}</Text>
        <Text style={[styles.petLabel, isSelected && styles.selectedPetLabel]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ders Arkadaşını Seç</Text>
          <Text style={styles.subtitle}>
            Çalışma odanda sana eşlik edecek karakteri belirle
          </Text>
        </View>

        {/* Seçilen Karakterin Önizleme Alanı */}
        <View style={styles.previewContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.largeEmoji}>{selectedPetMeta?.emoji}</Text>
          </View>
          <Text style={styles.previewName}>
            {petName.trim() || selectedPetMeta?.label}
          </Text>
          <Text style={styles.previewDescription}>
            {selectedPetMeta?.description}
          </Text>
        </View>

        {/* 10 Evcil Hayvan Listesi */}
        <View style={styles.listContainer}>
          <FlatList
            data={PET_OPTIONS}
            keyExtractor={(item) => item.type}
            renderItem={renderPetCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* İsim Verme ve Onay Bölümü */}
        <View style={styles.footer}>
          <Text style={styles.inputLabel}>Ona bir isim ver:</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: Pamuk, Bobo, Duman..."
            placeholderTextColor={Theme.colors.textSecondary}
            value={petName}
            onChangeText={setPetName}
            maxLength={25}
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Theme.colors.white} />
            ) : (
              <Text style={styles.buttonText}>Arkadaşımı Onayla</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: Theme.spacing.md,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Theme.colors.primary,
  },
  largeEmoji: {
    fontSize: 60,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginTop: Theme.spacing.sm,
  },
  previewDescription: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  listContainer: {
    height: 110,
  },
  horizontalList: {
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  card: {
    width: 80,
    height: 95,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.surfaceLight,
  },
  petEmoji: {
    fontSize: 32,
  },
  petLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  selectedPetLabel: {
    color: Theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  footer: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    height: 48,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.md,
    color: Theme.colors.textPrimary,
    fontSize: 15,
    marginBottom: Theme.spacing.md,
  },
  primaryButton: {
    height: 50,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});