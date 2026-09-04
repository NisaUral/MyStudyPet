import { GRID_SIZE, isWithinBounds } from './isometric';
import { FURNITURE_CATALOG, PlacedFurnitureState } from '../constants/furniture';

// Belirli bir eşyanın kapladığı tüm grid hücrelerini döndürür
export const getOccupiedTiles = (
  gridX: number,
  gridY: number,
  width: number,
  length: number
): { x: number; y: number }[] => {
  const tiles: { x: number; y: number }[] = [];
  for (let dx = 0; dx < width; dx++) {
    for (let dy = 0; dy < length; dy++) {
      tiles.push({ x: gridX + dx, y: gridY + dy });
    }
  }
  return tiles;
};

// Eşyanın yerleştirilmesinin geçerli olup olmadığını kontrol eder
export const canPlaceFurniture = (
  newItemId: string,
  targetX: number,
  targetY: number,
  existingFurnitures: PlacedFurnitureState[],
  ignoredInstanceId?: string // Güncelleniyorsa kendi ID'si hesaba katılmaz
): { valid: boolean; reason?: string } => {
  const itemMeta = FURNITURE_CATALOG.find((f) => f.id === newItemId);
  if (!itemMeta) return { valid: false, reason: 'Geçersiz eşya' };

  const newTiles = getOccupiedTiles(targetX, targetY, itemMeta.width, itemMeta.length);

  // 1. Sınır Kontrolü (Oda dışına taşıyor mu?)
  for (const tile of newTiles) {
    if (!isWithinBounds(tile.x, tile.y)) {
      return { valid: false, reason: 'Oda sınırları dışına yerleştirilemez' };
    }
  }

  // Halılar zemin katmanı olduğu için diğer katı mobilyalarla çakışmaz
  if (itemMeta.isWalkable) {
    return { valid: true };
  }

  // 2. Diğer Katı Eşyalarla Çakışma Kontrolü
  for (const placed of existingFurnitures) {
    if (placed.instanceId === ignoredInstanceId) continue;

    const placedMeta = FURNITURE_CATALOG.find((f) => f.id === placed.itemId);
    if (!placedMeta || placedMeta.isWalkable) continue; // Halıları atla

    const occupied = getOccupiedTiles(placed.gridX, placed.gridY, placedMeta.width, placedMeta.length);

    const hasCollision = newTiles.some((nt) =>
      occupied.some((ot) => ot.x === nt.x && ot.y === nt.y)
    );

    if (hasCollision) {
      return { valid: false, reason: 'Bu alanda başka bir mobilya var' };
    }
  }

  return { valid: true };
};