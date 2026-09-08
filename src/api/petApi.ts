import apiClient from './client';
import { Pet, PetType } from '../types';

export interface CreatePetPayload {
  type: PetType;
  name: string;
  equippedHat?: string | null;
  equippedGlasses?: string | null;
  equippedAccessory?: string | null;
}

export interface UpdateAccessoriesPayload {
  equippedHat?: string | null;
  equippedGlasses?: string | null;
  equippedAccessory?: string | null;
}

export const petApi = {
  createPet: async (payload: CreatePetPayload): Promise<Pet> => {
    const response = await apiClient.post<Pet>('/pets/create', payload);
    return response.data;
  },

  getMyPet: async (): Promise<Pet> => {
    const response = await apiClient.get<Pet>('/pets/me');
    return response.data;
  },

  updateAccessories: async (payload: UpdateAccessoriesPayload): Promise<Pet> => {
    // Backend'e tam olarak temizlenmiş payload gönderiyoruz
    const response = await apiClient.put<Pet>('/pets/accessories', payload);
    return response.data;
  },
};