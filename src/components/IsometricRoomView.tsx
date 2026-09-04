import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { G } from 'react-native-svg';
import {
  GRID_SIZE,
  TILE_WIDTH,
  TILE_HEIGHT,
  gridToScreen,
  screenToGrid,
  isWithinBounds,
  GridCoord,
} from '../utils/isometric';
import { IsometricTile } from './IsometricTile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  onTileSelect?: (coord: GridCoord) => void;
}

export const IsometricRoomView: React.FC<Props> = ({ onTileSelect }) => {
  const [selectedTile, setSelectedTile] = useState<GridCoord | null>(null);

  // Odanın en üst köşesini ekranın yatay merkezine hizalar
  const originX = SCREEN_WIDTH / 2;
  const originY = 80;

  const handleTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const { gridX, gridY } = screenToGrid(locationX, locationY, originX, originY);

    if (isWithinBounds(gridX, gridY)) {
      setSelectedTile({ gridX, gridY });
      if (onTileSelect) {
        onTileSelect({ gridX, gridY });
      }
    }
  };

  // 8x8 Grid Karolarını Üret
  const renderTiles = () => {
    const tiles = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const center = gridToScreen(x, y, originX, originY);
        const isSelected = selectedTile?.gridX === x && selectedTile?.gridY === y;

        tiles.push(
          <IsometricTile
            key={`tile_${x}_${y}`}
            center={center}
            fillColor={isSelected ? '#7AA2F7' : (x + y) % 2 === 0 ? '#2F3549' : '#24283B'}
            strokeColor="#414868"
          />
        );
      }
    }
    return tiles;
  };

  // Toplam zemin yüksekliği hesaplama
  const canvasHeight = GRID_SIZE * TILE_HEIGHT + 160;

  return (
    <View style={[styles.container, { height: canvasHeight }]} onTouchEnd={handleTouch}>
      <Svg width={SCREEN_WIDTH} height={canvasHeight}>
        <G>{renderTiles()}</G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});