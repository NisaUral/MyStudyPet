import React from 'react';
import { Polygon } from 'react-native-svg';
import { TILE_WIDTH, TILE_HEIGHT, Point2D } from '../utils/isometric';

interface Props {
  center: Point2D;
  fillColor?: string;
  strokeColor?: string;
  onPress?: () => void;
}

export const IsometricTile: React.FC<Props> = ({
  center,
  fillColor = '#3B4261',
  strokeColor = '#545C7E',
  onPress,
}) => {
  const halfW = TILE_WIDTH / 2;
  const halfH = TILE_HEIGHT / 2;

  // 4 köşe noktası (Elmas şekli)
  const top = `${center.x},${center.y - halfH}`;
  const right = `${center.x + halfW},${center.y}`;
  const bottom = `${center.x},${center.y + halfH}`;
  const left = `${center.x - halfW},${center.y}`;

  const points = `${top} ${right} ${bottom} ${left}`;

  return (
    <Polygon
      points={points}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth="1"
      onPress={onPress}
    />
  );
};