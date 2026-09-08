import { create } from 'zustand';
import { ActiveRoommate, RoomPresenceMessage } from '../types/socket';
import { socketService } from '../services/socketService';
import { PetType } from '../types';

export interface AccessoryPayload {
  equippedHat?: string;
  hatColor?: string;
  equippedGlasses?: string;
  glassesColor?: string;
  equippedAccessory?: string;
  accessoryColor?: string;
}

export interface DirectMessage {
  senderUsername: string;
  targetUsername: string;
  content: string;
  timestamp: number;
}

interface LiveRoomState {
  isConnected: boolean;
  roommates: Record<string, ActiveRoommate>; // username -> Kullanıcı verisi
  latestToast: string | null;
  activeReactions: Record<string, string>; // targetUsername -> emoji
  activeSpeechBubbles: Record<string, string>; // username -> mesaj metni
  messages: DirectMessage[]; // Bireysel mesaj geçmişi

  // Eylemler
  joinLiveRoom: (
    roomCode: string,
    username: string,
    petType: PetType,
    accessories?: AccessoryPayload
  ) => void;
  leaveLiveRoom: (roomCode: string, username: string, petType: PetType) => void;
  setToast: (msg: string | null) => void;
  broadcastStudyStatus: (
    roomCode: string,
    username: string,
    petType: PetType,
    isStudying: boolean,
    targetMinutes?: number
  ) => void;
  broadcastAccessories: (
    roomCode: string,
    username: string,
    petType: PetType,
    accessories: AccessoryPayload
  ) => void;
  sendReaction: (
    roomCode: string,
    fromUsername: string,
    targetUsername: string,
    emoji: string,
    petType: PetType
  ) => void;
  sendDirectMessage: (
    roomCode: string,
    senderUsername: string,
    targetUsername: string,
    content: string
  ) => void;
  receiveDirectMessage: (dm: DirectMessage) => void;
  handleIncomingMessage: (msg: RoomPresenceMessage, myUsername: string) => void;
  resetLiveRoom: () => void;
}

export const useLiveRoomStore = create<LiveRoomState>((set, get) => ({
  isConnected: false,
  roommates: {},
  latestToast: null,
  activeReactions: {},
  activeSpeechBubbles: {},
  messages: [],

  setToast: (msg) => set({ latestToast: msg }),

  joinLiveRoom: (roomCode, username, petType, accessories) => {
    socketService.connect(
      roomCode,
      username,
      (incomingMsg) => {
        get().handleIncomingMessage(incomingMsg, username);
      },
      (incomingDm) => {
        get().receiveDirectMessage(incomingDm);
      },
      () => {
        set({ isConnected: true });
        socketService.sendActivity(roomCode, {
          username,
          petType,
          action: 'JOIN',
          ...accessories,
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

  broadcastAccessories: (roomCode, username, petType, accessories) => {
    socketService.sendActivity(roomCode, {
      username,
      petType,
      action: 'UPDATE_ACCESSORIES' as any,
      ...accessories,
    });
  },

  sendReaction: (roomCode, fromUsername, targetUsername, emoji, petType) => {
    socketService.sendActivity(roomCode, {
      username: fromUsername,
      petType,
      action: 'SEND_REACTION' as any,
      reactionEmoji: emoji,
      targetUsername,
    } as any);

    // Gönderenin ekranında tepkiyi hemen göster
    set((state) => ({
      activeReactions: {
        ...state.activeReactions,
        [targetUsername]: emoji,
      },
    }));

    // 2.5 saniye sonra kaldır
    setTimeout(() => {
      set((state) => {
        const copy = { ...state.activeReactions };
        delete copy[targetUsername];
        return { activeReactions: copy };
      });
    }, 2500);
  },

  // 19. Gün: Bireysel Mesaj Gönderimi
  sendDirectMessage: (roomCode, senderUsername, targetUsername, content) => {
    const dm: DirectMessage = {
      senderUsername,
      targetUsername,
      content,
      timestamp: Date.now(),
    };

    // 1. Soket üzerinden ilet
    socketService.sendDirectMessage(roomCode, {
      senderUsername,
      targetUsername,
      content,
    });

    // 2. Kendi ekranında baloncuk göster ve mesaj listesine ekle
    set((state) => ({
      messages: [...state.messages, dm],
      activeSpeechBubbles: {
        ...state.activeSpeechBubbles,
        [senderUsername]: content,
      },
    }));

    // 4.5 saniye sonra baloncuğu söndür
    setTimeout(() => {
      set((state) => {
        const copy = { ...state.activeSpeechBubbles };
        delete copy[senderUsername];
        return { activeSpeechBubbles: copy };
      });
    }, 4500);
  },

  // 19. Gün: Bireysel Mesaj Alma
  receiveDirectMessage: (dm) => {
    set((state) => ({
      messages: [...state.messages, dm],
      activeSpeechBubbles: {
        ...state.activeSpeechBubbles,
        [dm.senderUsername]: dm.content,
      },
      latestToast: `${dm.senderUsername} sana fısıldadı: "${dm.content}"`,
    }));

    // 4.5 saniye sonra baloncuğu söndür
    setTimeout(() => {
      set((state) => {
        const copy = { ...state.activeSpeechBubbles };
        delete copy[dm.senderUsername];
        return { activeSpeechBubbles: copy };
      });
    }, 4500);
  },

  handleIncomingMessage: (msg: any, myUsername: string) => {
    if (msg.username === myUsername) return;

    set((state) => {
      const updated = { ...state.roommates };
      let toastMessage = state.latestToast;
      const reactions = { ...state.activeReactions };

      // 1. Canlı Tepki Emojisi Yakalama
      if (msg.action === 'SEND_REACTION') {
        const target = msg.targetUsername;
        if (target) {
          reactions[target] = msg.reactionEmoji;

          if (target === myUsername) {
            toastMessage = `${msg.username} sana ${msg.reactionEmoji} gönderdi!`;
          }

          setTimeout(() => {
            set((s) => {
              const r = { ...s.activeReactions };
              delete r[target];
              return { activeReactions: r };
            });
          }, 2500);
        }

        return {
          roommates: updated,
          latestToast: toastMessage,
          activeReactions: reactions,
        };
      }

      // 2. Aksesuar Verisi
      const accessoryData: AccessoryPayload = {
        equippedHat: msg.equippedHat,
        hatColor: msg.hatColor,
        equippedGlasses: msg.equippedGlasses,
        glassesColor: msg.glassesColor,
        equippedAccessory: msg.equippedAccessory,
        accessoryColor: msg.accessoryColor,
      };

      // 3. Standart Oda Durumu Aksiyonları
      switch (msg.action) {
        case 'JOIN':
          updated[msg.username] = {
            username: msg.username,
            petType: msg.petType,
            isStudying: false,
            ...accessoryData,
          };
          toastMessage = `${msg.username} odaya katıldı! 👋`;
          break;

        case 'LEAVE':
          delete updated[msg.username];
          toastMessage = `${msg.username} odadan ayrıldı.`;
          break;

        case 'START_STUDY':
          if (updated[msg.username]) {
            updated[msg.username] = {
              ...updated[msg.username],
              isStudying: true,
              targetMinutes: msg.targetMinutes,
            };
          } else {
            updated[msg.username] = {
              username: msg.username,
              petType: msg.petType,
              isStudying: true,
              targetMinutes: msg.targetMinutes,
              ...accessoryData,
            };
          }
          toastMessage = `${msg.username}, ${msg.targetMinutes || 25} dk odaklanmaya başladı! 📖`;
          break;

        case 'STOP_STUDY':
          if (updated[msg.username]) {
            updated[msg.username] = {
              ...updated[msg.username],
              isStudying: false,
            };
          }
          toastMessage = `${msg.username} mola verdi. ☕`;
          break;

        case 'UPDATE_ACCESSORIES':
          if (updated[msg.username]) {
            updated[msg.username] = {
              ...updated[msg.username],
              ...accessoryData,
            };
            toastMessage = `${msg.username} yeni tarzını kuşandı! ✨`;
          }
          break;
      }

      return {
        roommates: updated,
        latestToast: toastMessage,
        activeReactions: reactions,
      };
    });
  },

  resetLiveRoom: () => {
    set({
      isConnected: false,
      roommates: {},
      latestToast: null,
      activeReactions: {},
      activeSpeechBubbles: {},
      messages: [],
    });
  },
}));