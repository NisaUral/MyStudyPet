import { useState, useEffect, useRef } from 'react';
import { PetState } from '../types/petState';

interface UsePetStateMachineProps {
  isStudying: boolean;
  canWalk?: boolean; // Gezinme aktif mi?
}

export const usePetStateMachine = ({ isStudying, canWalk = true }: UsePetStateMachineProps) => {
  const [currentState, setCurrentState] = useState<PetState>('IDLE');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Olası rastgele durumlar ve ağırlıkları
  const pickNextState = (): { nextState: PetState; duration: number } => {
    const states: { state: PetState; weight: number; minDuration: number; maxDuration: number }[] = [
      { state: 'IDLE', weight: 40, minDuration: 8000, maxDuration: 13000 },
      { state: 'SLEEPING', weight: 25, minDuration: 10000, maxDuration: 16000 },
      { state: 'PLAYING', weight: 20, minDuration: 4000, maxDuration: 6000 },
      ...(canWalk ? [{ state: 'WALKING' as PetState, weight: 15, minDuration: 3500, maxDuration: 5000 }] : []),
    ];

    const totalWeight = states.reduce((sum, item) => sum + item.weight, 0);
    let randomNum = Math.random() * totalWeight;

    for (const item of states) {
      if (randomNum < item.weight) {
        const duration = Math.floor(
          Math.random() * (item.maxDuration - item.minDuration) + item.minDuration
        );
        return { nextState: item.state, duration };
      }
      randomNum -= item.weight;
    }

    return { nextState: 'IDLE', duration: 8000 };
  };

  useEffect(() => {
    // Ders çalışma oturumu başladıysa durum makinesini doğrudan STUDYING durumuna kilitle
    if (isStudying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCurrentState('STUDYING');
      return;
    }

    // Ders bittiğinde veya ilk açılışta IDLE ile başla
    setCurrentState('IDLE');

    const scheduleNextState = () => {
      const { nextState, duration } = pickNextState();
      setCurrentState(nextState);

      timerRef.current = setTimeout(() => {
        scheduleNextState();
      }, duration);
    };

    // İlk durum geçişini 6 saniye sonra başlat
    timerRef.current = setTimeout(() => {
      scheduleNextState();
    }, 6000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isStudying]);

  return {
    currentState,
  };
};