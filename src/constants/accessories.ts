export type AccessorySlot = 'hat' | 'glasses' | 'accessory';

export interface AccessoryItem {
  id: string;
  name: string;
  slot: AccessorySlot;
  emoji: string;
}

export const ACCESSORY_CATALOG: AccessoryItem[] = [
  // Şapkalar
  { id: 'hat_none', name: 'Yok', slot: 'hat', emoji: '❌' },
  { id: 'hat_cap', name: 'Mavi Şapka', slot: 'hat', emoji: '🧢' },
  { id: 'hat_crown', name: 'Kral Tacı', slot: 'hat', emoji: '👑' },
  { id: 'hat_grad', name: 'Mezuniyet Şapkası', slot: 'hat', emoji: '🎓' },
  { id: 'hat_beanie', name: 'Bere', slot: 'hat', emoji: '🧶' },

  // Gözlükler
  { id: 'glasses_none', name: 'Yok', slot: 'glasses', emoji: '❌' },
  { id: 'glasses_study', name: 'Ders Gözlüğü', slot: 'glasses', emoji: '👓' },
  { id: 'glasses_cool', name: 'Güneş Gözlüğü', slot: 'glasses', emoji: '🕶️' },
  { id: 'glasses_monocle', name: 'Monokl', slot: 'glasses', emoji: '🧐' },

  // Diğer Aksesuarlar
  { id: 'acc_none', name: 'Yok', slot: 'accessory', emoji: '❌' },
  { id: 'acc_bowtie', name: 'Papyon', slot: 'accessory', emoji: '🎀' },
  { id: 'acc_scarf', name: 'Kırmızı Atkı', slot: 'accessory', emoji: '🧣' },
  { id: 'acc_medal', name: 'Çalışma Madalyası', slot: 'accessory', emoji: '🏅' },
];