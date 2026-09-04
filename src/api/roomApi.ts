import apiClient from './client';

export interface PlacedFurniturePayload {
  itemId: string;
  gridX: number;
  gridY: number;
  rotation: number;
}

export interface SaveRoomLayoutPayload {
  wallpaperId?: string;
  floorId?: string;
  furnitures: PlacedFurniturePayload[];
}

export interface RoomDetailResponse {
  roomId: number;
  roomCode: string;
  ownerUsername: string;
  wallpaperId: string;
  floorId: string;
  isOwner: boolean;
  furnitures: PlacedFurniturePayload[];
}

export const roomApi = {
  saveLayout: async (payload: SaveRoomLayoutPayload): Promise<RoomDetailResponse> => {
    const res = await apiClient.put<RoomDetailResponse>('/rooms/layout', payload);
    return res.data;
  },
  getRoomDetail: async (roomCode: string): Promise<RoomDetailResponse> => {
    const res = await apiClient.get<RoomDetailResponse>(`/rooms/detail/${roomCode}`);
    return res.data;
  },
};