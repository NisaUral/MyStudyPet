export const TILE_WIDTH = 64;   // Bir karonun piksel genişliği
export const TILE_HEIGHT = 32;  // 2:1 izometrik oran (Genişliğin yarısı)
export const GRID_SIZE = 8;     // 8x8 karo boyutunda standart çalışma odası

export interface Point2D {
  x: number;
  y: number;
}

export interface GridCoord {
  gridX: number;
  gridY: number;
}

// Grid (x, y) koordinatını ekrandaki piksel (screenX, screenY) merkezine çevirir
export const gridToScreen = (
  gridX: number,
  gridY: number,
  originX: number,
  originY: number
): Point2D => {
  const x = (gridX - gridY) * (TILE_WIDTH / 2) + originX;
  const y = (gridX + gridY) * (TILE_HEIGHT / 2) + originY;
  return { x, y };
};

// Ekrana dokunulan piksel noktasını en yakın Grid (x, y) hücresine çevirir
export const screenToGrid = (
  touchX: number,
  touchY: number,
  originX: number,
  originY: number
): GridCoord => {
  const relX = touchX - originX;
  const relY = touchY - originY;

  const tileHalfW = TILE_WIDTH / 2;
  const tileHalfH = TILE_HEIGHT / 2;

  const gridX = Math.floor((relY / tileHalfH + relX / tileHalfW) / 2);
  const gridY = Math.floor((relY / tileHalfH - relX / tileHalfW) / 2);

  return { gridX, gridY };
};

// Koordinatın odanın sınırları (8x8) içinde olup olmadığını denetler
export const isWithinBounds = (gridX: number, gridY: number): boolean => {
  return gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE;
};