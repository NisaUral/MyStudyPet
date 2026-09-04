import { Client, IMessage } from '@stomp/stompjs';
import 'text-encoding';
import { RoomPresenceMessage } from '../types/socket';

// Emülatör için 10.0.2.2, Gerçek cihaz/Tunnel için bilgisayarınızın yerel IP'si veya backend adresi
const WS_URL = 'ws://10.0.2.2:8080/ws-study';

class SocketService {
  private client: Client | null = null;
  private currentSubscription: any = null;

  connect(
    roomCode: string,
    onMessageReceived: (message: RoomPresenceMessage) => void,
    onConnected?: () => void
  ) {
    // Varsa eski bağlantıyı temizle
    this.disconnect();

    this.client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      debug: (str) => {
        // Geliştirme aşamasında soket trafiğini izlemek için
        // console.log('[STOMP]:', str);
      },
      onConnect: () => {
        console.log(`[STOMP] Bağlantı başarılı. Odaya abone olunuyor: ${roomCode}`);

        // Odanın yayınına abone ol
        this.currentSubscription = this.client?.subscribe(
          `/topic/room/${roomCode}`,
          (message: IMessage) => {
            if (message.body) {
              const parsed: RoomPresenceMessage = JSON.parse(message.body);
              onMessageReceived(parsed);
            }
          }
        );

        if (onConnected) {
          onConnected();
        }
      },
      onStompError: (frame) => {
        console.error('[STOMP] Protokol Hatası:', frame.headers['message']);
      },
      onWebSocketClose: () => {
        console.log('[STOMP] Soket bağlantısı kapandı.');
      },
    });

    this.client.activate();
  }

  // Odaya aktivite mesajı yolla (JOIN, LEAVE, START_STUDY vb.)
  sendActivity(roomCode: string, payload: Omit<RoomPresenceMessage, 'timestamp' | 'roomCode'>) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: `/app/room/${roomCode}/activity`,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn('[STOMP] Mesaj gönderilemedi, soket bağlı değil.');
    }
  }

  disconnect() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }
}

export const socketService = new SocketService();