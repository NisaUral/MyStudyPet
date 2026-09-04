import { PetType } from './index';

export type RoomAction = 'JOIN' | 'LEAVE' | 'START_STUDY' | 'STOP_STUDY';

export interface RoomPresenceMessage {
  roomCode: string;
  username: string;
  petType: PetType;
  action: RoomAction;
  targetMinutes?: number;
  timestamp: number;
}

export interface ActiveRoommate {
  username: string;
  petType: PetType;
  isStudying: boolean;
  targetMinutes?: number;
}