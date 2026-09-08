export interface GridCoord {
  x: number;
  y: number;
}

export interface PlacedItemObstacle {
  gridX: number;
  gridY: number;
  width?: number;  // Mobilyanın grid genişliği (varsayılan 1)
  height?: number; // Mobilyanın grid derinliği (varsayılan 1)
}

interface Node {
  x: number;
  y: number;
  g: number; // Başlangıçtan buraya olan gerçek maliyet
  h: number; // Hedefe olan tahmini Manhattan mesafesi
  f: number; // Toplam maliyet (g + h)
  parent: Node | null;
}

const DEFAULT_GRID_SIZE = 8;

/**
 * 8x8 odadaki tüm engelleri (mobilyalar + masa petleri) bir engel kümesine çevirir.
 */
export const buildObstacleSet = (
  furnitures: PlacedItemObstacle[],
  otherPetCoords: GridCoord[] = []
): Set<string> => {
  const obstacleSet = new Set<string>();

  // 1. Mobilyaların kapladığı tüm karolar
  furnitures.forEach((item) => {
    const w = item.width || 1;
    const h = item.height || 1;
    for (let dx = 0; dx < w; dx++) {
      for (let dy = 0; dy < h; dy++) {
        obstacleSet.add(`${item.gridX + dx},${item.gridY + dy}`);
      }
    }
  });

  // 2. Diğer petlerin oturduğu karolar
  otherPetCoords.forEach((coord) => {
    obstacleSet.add(`${coord.x},${coord.y}`);
  });

  return obstacleSet;
};

/**
 * İki koordinat arasındaki Manhattan mesafesi sezgisi (Heuristic)
 */
const getManhattanDistance = (a: GridCoord, b: GridCoord): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

/**
 * Hedef petin yanındaki yürünebilir en yakın komşu karoyu seçer.
 */
export const findWalkableNeighbor = (
  start: GridCoord,
  target: GridCoord,
  obstacles: Set<string>,
  gridSize = DEFAULT_GRID_SIZE
): GridCoord | null => {
  const directions: GridCoord[] = [
    { x: 0, y: 1 },  // Aşağı
    { x: 0, y: -1 }, // Yukarı
    { x: 1, y: 0 },  // Sağ
    { x: -1, y: 0 }, // Sol
  ];

  const candidates = directions
    .map((d) => ({ x: target.x + d.x, y: target.y + d.y }))
    .filter(
      (c) =>
        c.x >= 0 &&
        c.x < gridSize &&
        c.y >= 0 &&
        c.y < gridSize &&
        !obstacles.has(`${c.x},${c.y}`)
    );

  if (candidates.length === 0) return null;

  // Başlangıç konumuna en yakın olan komşuyu döndür
  candidates.sort((a, b) => getManhattanDistance(start, a) - getManhattanDistance(start, b));
  return candidates[0];
};

/**
 * A* (A-Star) Algoritması: Mobilyalara çarpmadan hedefe giden en kısa adım dizisini üretir.
 * @returns Başlangıçtan hedefe sırayla atılacak adımlar listesi [start, ..., target]
 */
export const findPathAStar = (
  start: GridCoord,
  target: GridCoord,
  obstacles: Set<string>,
  gridSize = DEFAULT_GRID_SIZE
): GridCoord[] => {
  // Başlangıç veya hedef sınır dışındaysa rota boş döner
  if (
    start.x < 0 || start.x >= gridSize || start.y < 0 || start.y >= gridSize ||
    target.x < 0 || target.x >= gridSize || target.y < 0 || target.y >= gridSize
  ) {
    return [];
  }

  // Başlangıç ve hedef aynıysa hareket gerekmez
  if (start.x === target.x && start.y === target.y) {
    return [start];
  }

  const openList: Node[] = [];
  const closedSet = new Set<string>();

  const startNode: Node = {
    x: start.x,
    y: start.y,
    g: 0,
    h: getManhattanDistance(start, target),
    f: getManhattanDistance(start, target),
    parent: null,
  };

  openList.push(startNode);

  // 4 Yönlü Hareket (Yukarı, Aşağı, Sol, Sağ)
  const neighbors = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];

  while (openList.length > 0) {
    // En düşük f skorlu düğümü seç
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift()!;
    const currentKey = `${current.x},${current.y}`;

    // Hedefe varıldı mı?
    if (current.x === target.x && current.y === target.y) {
      const path: GridCoord[] = [];
      let temp: Node | null = current;
      while (temp !== null) {
        path.unshift({ x: temp.x, y: temp.y });
        temp = temp.parent;
      }
      return path;
    }

    closedSet.add(currentKey);

    for (const offset of neighbors) {
      const nx = current.x + offset.x;
      const ny = current.y + offset.y;
      const neighborKey = `${nx},${ny}`;

      // Sınır ve engel kontrolü
      if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) continue;
      if (obstacles.has(neighborKey) && !(nx === target.x && ny === target.y)) continue;
      if (closedSet.has(neighborKey)) continue;

      const gScore = current.g + 1;
      let existingNode = openList.find((n) => n.x === nx && n.y === ny);

      if (!existingNode) {
        const hScore = getManhattanDistance({ x: nx, y: ny }, target);
        const newNode: Node = {
          x: nx,
          y: ny,
          g: gScore,
          h: hScore,
          f: gScore + hScore,
          parent: current,
        };
        openList.push(newNode);
      } else if (gScore < existingNode.g) {
        existingNode.g = gScore;
        existingNode.f = gScore + existingNode.h;
        existingNode.parent = current;
      }
    }
  }

  // Yol bulunamadıysa (etrafı mobilyalarla tamamen çevriliyse)
  return [];
};