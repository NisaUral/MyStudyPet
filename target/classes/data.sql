INSERT INTO shop_items (item_key, name, description, category, price, is_available) VALUES
-- Pet Aksesuarları
('WIZARD_HAT', 'Büyücü Şapkası', 'Odaklanma büyüsü yapar.', 'PET_ACCESSORY', 150, true),
('BASEBALL_CAP', 'Beyzbol Şapkası', 'Sportif ve rahat.', 'PET_ACCESSORY', 80, true),
('CROWN', 'Kraliyet Tacı', 'Çalışma odasının efendisi.', 'PET_ACCESSORY', 300, true),
('SUNGLASSES', 'Güneş Gözlüğü', 'Havalı bir tarz katar.', 'PET_ACCESSORY', 100, true),
('NERD_GLASSES', 'İnek Gözlüğü', 'Ders çalışırken +10 karizma.', 'PET_ACCESSORY', 70, true),
('BOWTIE', 'Kırmızı Papyon', 'Özel dersler için şık dokunuş.', 'PET_ACCESSORY', 90, true),

-- Mobilyalar
('MODERN_DESK', 'Modern Çalışma Masası', 'Geniş ve ergonomik çalışma masası.', 'FURNITURE', 200, true),
('GAMING_CHAIR', 'Oyuncu Koltuğu', 'Uzun çalışma maratonları için ideal.', 'FURNITURE', 180, true),
('BOOKSHELF', 'Meşe Kitaplık', 'Çalışma odasına akademik hava katar.', 'FURNITURE', 250, true),
('COFFEE_MACHINE', 'Espresso Makinesi', 'Bitmeyen kahve kaynağı.', 'FURNITURE', 120, true),
('PLANT_POT', 'Monstera Saksısı', 'Odaya ferahlık verir.', 'FURNITURE', 60, true)
ON CONFLICT (item_key) DO NOTHING;