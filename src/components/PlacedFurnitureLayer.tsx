import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { gridToScreen, TILE_WIDTH, TILE_HEIGHT } from '../utils/isometric';
import { FURNITURE_CATALOG, PlacedFurnitureState } from '../constants/furniture';

interface Props {
  furnitures: PlacedFurnitureState[];
  originX: number;
  originY: number;
  onSelectFurniture?: (furniture: PlacedFurnitureState) => void;
}

export const PlacedFurnitureLayer: React.FC<Props> = ({
  furnitures,
  originX,
  originY,
  onSelectFurniture,
}) => {
  // Derinlik Sıralaması:
  // 1. Öncelik: Halılar en alta (isWalkable = true)
  // 2. Öncelik: gridX + gridY toplamı küçük olanlar arkaya, büyük olanlar öne
  const sortedFurnitures = [...furnitures].sort((a, b) => {
    const metaA = FURNITURE_CATALOG.find((f) => f.id === a.itemId);
    const metaB = FURNITURE_CATALOG.find((f) => f.id === b.itemId);

    const aIsWalkable = metaA?.isWalkable ? 0 : 1;
    const bIsWalkable = metaB?.isWalkable ? 0 : 1;

    if (aIsWalkable !== bIsWalkable) {
      return aIsWalkable - bIsWalkable;
    }

    const depthA = a.gridX + a.gridY;
    const depthB = b.gridX + b.gridY;
    return depthA - depthB;
  });

  return (
    <>
      {sortedFurnitures.map((item) => {
        const meta = FURNITURE_CATALOG.find((f) => f.id === item.itemId);
        if (!meta) return null;

        // Eşyanın kapladığı taban alanının merkez noktasını hesapla
        const centerX = item.gridX + (meta.width - 1) / 2;
        const centerY = item.gridY + (meta.length - 1) / 2;
        const screenPos = gridToScreen(centerX, centerY, originX, originY);

        const zIndexScore = (meta.isWalkable ? 10 : 100) + (item.gridX + item.gridY);

        return (
          <TouchableOpacity
            key={item.instanceId}
            activeOpacity={0.7}
            onPress={() => onSelectFurniture && onSelectFurniture(item)}
            style={[
              styles.itemContainer,
              {
                left: screenPos.x - TILE_WIDTH / 2,
                top: screenPos.y - TILE_HEIGHT,
                zIndex: zIndexScore,
              },
            ]}
          >
            <Text
              style={[
                styles.emojiText,
                { fontSize: meta.isWalkable ? 36 : 42 },
                meta.isWalkable && styles.floorItemOpacity,
              ]}
            >
              {meta.emoji}
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    position: 'absolute',
    width: TILE_WIDTH,
    height: TILE_HEIGHT * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    textAlign: 'center',
  },
  floorItemOpacity: {
    opacity: 0.85,
  },
});