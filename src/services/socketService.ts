import { Client, StompSubscription } from '@stomp/stompjs';
import { RoomPresenceMessage, DirectMessage } from '../types/socket';

class SocketService {
  // 1. stompClient alanını açıkça tanımlıyoruz
  private stompClient: Client | null = null;
  private roomSubscription: StompSubscription | null = null;
  private dmSubscription: StompSubscription | null = null;

  connect(
    roomCode: string,
    username: string,
    onPresenceReceived: (msg: RoomPresenceMessage) => void,
    onDirectMessageReceived: (dm: DirectMessage) => void,
    onConnectedCallback?: () => void
  ) {
    // Projende SockJS veya ws URL'in neredeyse onu kullanıyorsun
    this.stompClient = new Client({
      brokerURL: 'ws://10.0.2.2:8080/ws-room', // veya backend websocket adresin
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // 1. Genel Oda Kanalına Abone Ol
        this.roomSubscription = this.stompClient?.subscribe(
          `/topic/room/${roomCode}`,
          (message) => {
            const parsed: RoomPresenceMessage = JSON.parse(message.body);
            onPresenceReceived(parsed);
          }
        ) || null;

        // 2. Kullanıcıya Özel Direkt Mesaj Kanalına Abone Ol
        this.dmSubscription = this.stompClient?.subscribe(
          `/topic/room/${roomCode}/private/${username}`,
          (message) => {
            const dm: DirectMessage = JSON.parse(message.body);
            onDirectMessageReceived(dm);
          }
        ) || null;

        if (onConnectedCallback) {
          onConnectedCallback();
        }
      },
      onStompError: (frame) => {
        console.error('STOMP Hatası:', frame.headers['message']);
      },
    });

    this.stompClient.activate();
  }

  // Standart Oda Aktivitesi Gönderimi (JOIN, LEAVE, START_STUDY vb.)
  sendActivity(roomCode: string, payload: any) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/room/${roomCode}/activity`,
        body: JSON.stringify(payload),
      });
    }
  }

  // 19. Gün: Bireysel Mesaj Gönderimi
  sendDirectMessage(
    roomCode: string,
    payload: { senderUsername: string; targetUsername: string; content: string }
  ) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/room/${roomCode}/direct-message`,
        body: JSON.stringify(payload),
      });
    }
  }

  disconnect() {
    if (this.roomSubscription) {
      this.roomSubscription.unsubscribe();
      this.roomSubscription = null;
    }
    if (this.dmSubscription) {
      this.dmSubscription.unsubscribe();
      this.dmSubscription = null;
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }
}

export const socketService = new SocketService();