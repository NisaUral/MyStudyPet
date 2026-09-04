import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLiveRoomStore } from '../../store/useLiveRoomStore';
import { RoommatePetNode } from './RoommatePetNode';

interface Props {
  originX: number;
  originY: number;
}

export const LiveRoommatesLayer: React.FC<Props> = ({ originX, originY }) => {
  const roommates = useLiveRoomStore((state) => state.roommates);
  const roommateList = Object.values(roommates);

  if (roommateList.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {roommateList.map((mate, index) => (
        <RoommatePetNode
          key={mate.username}
          roommate={mate}
          slotIndex={index}
          originX={originX}
          originY={originY}
        />
      ))}
    </View>
  );
};