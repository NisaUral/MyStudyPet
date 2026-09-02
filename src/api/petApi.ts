import apiClient from './client';
import { Pet, PetType } from '../types';

export interface CreatePetPayload {
  type: PetType;
  name: string;
  equippedHat?: string;
  equippedGlasses?: string;
  equippedAccessory?: string;
  
}
export interface UpdateAccessoriesPayload {
  equippedHat?: string;
  equippedGlasses?: string;
  equippedAccessory?: string;
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
  const response = await apiClient.put<Pet>('/pets/accessories', payload);
  return response.data;
},
};