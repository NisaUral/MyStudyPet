export type PetState = 'IDLE' | 'WALKING' | 'PLAYING' | 'SLEEPING' | 'STUDYING';

export interface PetStateConfig {
  state: PetState;
  duration: number; // Durumun süreceği milisaniye
}