import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import { GridCoord, findPathAStar, findWalkableNeighbor, buildObstacleSet, PlacedItemObstacle } from '../utils/pathfinding';
import { gridToScreen } from '../utils/isometric';

interface Props {
  initialGridPos: GridCoord;
  originX: number;
  originY: number;
  furnitures: PlacedItemObstacle[];
}

export const usePetWalkingController = ({
  initialGridPos,
  originX,
  originY,
  furnitures,
}: Props) => {
  const [currentGridPos, setCurrentGridPos] = useState<GridCoord>(initialGridPos);
  const [isWalking, setIsWalking] = useState<boolean>(false);

  // Başlangıç ekran piksel konumu
  const initialScreenPos = gridToScreen(initialGridPos.x, initialGridPos.y, originX, originY);
  const animX = useRef(new Animated.Value(initialScreenPos.x)).current;
  const animY = useRef(new Animated.Value(initialScreenPos.y)).current;

  // Verilen karo dizisini adım adım yürütme
  const executePath = (path: GridCoord[]): Promise<void> => {
    return new Promise((resolve) => {
      if (path.length <= 1) {
        resolve();
        return;
      }

      setIsWalking(true);
      const stepAnimations: Animated.CompositeAnimation[] = [];

      for (let i = 1; i < path.length; i++) {
        const nextTile = path[i];
        const nextScreen = gridToScreen(nextTile.x, nextTile.y, originX, originY);

        stepAnimations.push(
          Animated.parallel([
            Animated.timing(animX, {
              toValue: nextScreen.x,
              duration: 380, // Adım başına yürüme hızı
              useNativeDriver: false,
            }),
            Animated.timing(animY, {
              toValue: nextScreen.y,
              duration: 380,
              useNativeDriver: false,
            }),
          ])
        );
      }

      Animated.sequence(stepAnimations).start(() => {
        const finalTile = path[path.length - 1];
        setCurrentGridPos(finalTile);
        setIsWalking(false);
        resolve();
      });
    });
  };

  // Belirli bir hedefe (veya komşusuna) yürü
  const walkToTarget = async (
    targetPos: GridCoord,
    otherPetPositions: GridCoord[] = []
  ): Promise<boolean> => {
    const obstacles = buildObstacleSet(furnitures, otherPetPositions);

    // Hedef petin yanındaki yürünebilir boş karoyu bul
    const destination = findWalkableNeighbor(currentGridPos, targetPos, obstacles) || targetPos;
    const path = findPathAStar(currentGridPos, destination, obstacles);

    if (path.length <= 1) return false;

    await executePath(path);
    return true;
  };

  // Doğrudan belirli bir karoya yürü (Örn: Masaya geri dönüş)
  const walkDirectToTile = async (
    tile: GridCoord,
    otherPetPositions: GridCoord[] = []
  ): Promise<boolean> => {
    const obstacles = buildObstacleSet(furnitures, otherPetPositions);
    const path = findPathAStar(currentGridPos, tile, obstacles);

    if (path.length <= 1) return false;

    await executePath(path);
    return true;
  };

  return {
    animX,
    animY,
    currentGridPos,
    isWalking,
    walkToTarget,
    walkDirectToTile,
  };
};