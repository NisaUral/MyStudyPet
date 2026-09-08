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
// src/types/socket.ts içinde güncellenecek kısımlar:

export interface RoomPresenceMessage {
  roomCode: string;
  username: string;
  petType: PetType;
  action: RoomAction;
  timestamp: number;
  targetMinutes?: number;
  deskSlot?: number; // 0, 1, 2, 3 (Hangi masada oturuyor?)
  // Aksesuarlar...
  equippedHat?: string;
  hatColor?: string;
  equippedGlasses?: string;
  glassesColor?: string;
  equippedAccessory?: string;
  accessoryColor?: string;
  reactionEmoji?: string;
  targetUsername?: string;
}

export interface ActiveRoommate {
  username: string;
  petType: PetType;
  isStudying: boolean;
  targetMinutes?: number;
  deskSlot: number; // Kullanıcının kilitlendiği masa slotu
  equippedHat?: string;
  hatColor?: string;
  equippedGlasses?: string;
  glassesColor?: string;
  equippedAccessory?: string;
  accessoryColor?: string;
}
  