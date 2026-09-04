import { create } from 'zustand';
import { ActiveRoommate, RoomPresenceMessage } from '../types/socket';
import { socketService } from '../services/socketService';
import { PetType } from '../types';

interface LiveRoomState {
  isConnected: boolean;
  roommates: Record<string, ActiveRoommate>; // username -> Kullanıcı verisi
  latestToast: string | null;

  // Eylemler
  joinLiveRoom: (roomCode: string, username: string, petType: PetType) => void;
  leaveLiveRoom: (roomCode: string, username: string, petType: PetType) => void;
  setToast: (msg: string | null) => void;
  broadcastStudyStatus: (
    roomCode: string,
    username: string,
    petType: PetType,
    isStudying: boolean,
    targetMinutes?: number
  ) => void;
  handleIncomingMessage: (msg: RoomPresenceMessage, myUsername: string) => void;
  resetLiveRoom: () => void;
}

export const useLiveRoomStore = create<LiveRoomState>((set, get) => ({
  isConnected: false,
  roommates: {},
  latestToast: null,

  setToast: (msg) => set({ latestToast: msg }),

  joinLiveRoom: (roomCode, username, petType) => {
    socketService.connect(
      roomCode,
      (incomingMsg) => {
        get().handleIncomingMessage(incomingMsg, username);
      },
      () => {
        set({ isConnected: true });
        // Odaya katıldığını diğer kullanıcılara duyur
        socketService.sendActivity(roomCode, {
          username,
          petType,
          action: 'JOIN',
        });
      }
    );
  },

  leaveLiveRoom: (roomCode, username, petType) => {
    socketService.sendActivity(roomCode, {
      username,
      petType,
      action: 'LEAVE',
    });
    socketService.disconnect();
    get().resetLiveRoom();
  },

  broadcastStudyStatus: (roomCode, username, petType, isStudying, targetMinutes) => {
    socketService.sendActivity(roomCode, {
      username,
      petType,
      action: isStudying ? 'START_STUDY' : 'STOP_STUDY',
      targetMinutes,
    });
  },

  handleIncomingMessage: (msg, myUsername) => {
    // Kullanıcının kendi gönderdiği mesajları listeye tekrar eklememesi için
    if (msg.username === myUsername) return;

    set((state) => {
      const updated = { ...state.roommates };
      let toastMessage = state.latestToast;

      switch (msg.action) {
        case 'JOIN':
          updated[msg.username] = {
            username: msg.username,
            petType: msg.petType,
            isStudying: false,
          };
          toastMessage = `${msg.username} odaya katıldı! 👋`;
          break;

        case 'LEAVE':
          delete updated[msg.username];
          toastMessage = `${msg.username} odadan ayrıldı.`;
          break;

        case 'START_STUDY':
          if (updated[msg.username]) {
            updated[msg.username].isStudying = true;
            updated[msg.username].targetMinutes = msg.targetMinutes;
          } else {
            updated[msg.username] = {
              username: msg.username,
              petType: msg.petType,
              isStudying: true,
              targetMinutes: msg.targetMinutes,
            };
          }
          toastMessage = `${msg.username}, ${msg.targetMinutes || 25} dk odaklanmaya başladı! 📖`;
          break;

        case 'STOP_STUDY':
          if (updated[msg.username]) {
            updated[msg.username].isStudying = false;
          }
          toastMessage = `${msg.username} mola verdi. ☕`;
          break;
      }

      return {
        roommates: updated,
        latestToast: toastMessage,
      };
    });
  },

  resetLiveRoom: () => {
    set({ isConnected: false, roommates: {}, latestToast: null });
  },
}));