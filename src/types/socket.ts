import { PetType } from './index';


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
export interface ActiveRoommate {
  username: string;
  petType: PetType;
  isStudying: boolean;
  targetMinutes?: number;
  equippedHat?: string;
  hatColor?: string;
  equippedGlasses?: string;
  glassesColor?: string;
  equippedAccessory?: string;
  accessoryColor?: string;
}
// src/types/socket.ts

export type RoomAction =
  | 'JOIN'
  | 'LEAVE'
  | 'START_STUDY'
  | 'STOP_STUDY'
  | 'UPDATE_ACCESSORIES'
  |'SEND_REACTION';

export interface DirectMessage {
  roomCode: string;
  senderUsername: string;
  targetUsername: string;
  content: string;
  timestamp: number;
}
  