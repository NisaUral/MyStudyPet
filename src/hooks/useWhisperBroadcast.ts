import { useState, useRef } from 'react';
import { GridCoord } from '../utils/pathfinding';
import { useLiveRoomStore } from '../store/useLiveRoomStore';

interface RoommateTarget {
  username: string;
  gridPos: GridCoord;
}

interface WhisperBroadcastProps {
  myHomePos: GridCoord;
  walkToTarget: (targetPos: GridCoord, obstacles: GridCoord[]) => Promise<boolean>;
  walkDirectToTile: (tile: GridCoord, obstacles: GridCoord[]) => Promise<boolean>;
  sendDirectMessage: (roomCode: string, sender: string, target: string, text: string) => void;
  roomCode: string;
  myUsername: string;
}

export const useWhisperBroadcast = ({
  myHomePos,
  walkToTarget,
  walkDirectToTile,
  sendDirectMessage,
  roomCode,
  myUsername,
}: WhisperBroadcastProps) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastingText, setBroadcastingText] = useState<string | null>(null);

  const startWhisperTour = async (targets: RoommateTarget[], message: string) => {
    if (isBroadcasting || targets.length === 0) return;
    setIsBroadcasting(true);
    setBroadcastingText(message);

    const allPositions = targets.map((t) => t.gridPos);

    // 1. Sırayla her arkadaşın masasına yürü
    for (const target of targets) {
      const otherPets = allPositions.filter(
        (p) => !(p.x === target.gridPos.x && p.y === target.gridPos.y)
      );

      // Hedefe doğru yürü
      await walkToTarget(target.gridPos, otherPets);

      // Yanına varınca fısılda
      sendDirectMessage(roomCode, myUsername, target.username, message);

      // Fısıldama animasyonu / duraklaması (1.6 sn)
      await new Promise((res) => setTimeout(res, 1600));
    }

    // 2. Tur bitince kendi masana geri dön
    await walkDirectToTile(myHomePos, allPositions);

    setIsBroadcasting(false);
    setBroadcastingText(null);
  };

  return {
    isBroadcasting,
    broadcastingText,
    startWhisperTour,
  };
};