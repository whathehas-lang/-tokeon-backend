/**
 * ⚡ [TOKEON FastAPI WebSocket 클라이언트 서비스]
 * 
 * - 파이썬 FastAPI 백엔드(ws://localhost:8000 또는 Render wss://)와
 *   실시간 양방향 웹소켓 통신을 담당합니다.
 * - 채팅 룸 브로드캐스트 (`/ws/chat/{roomId}`)
 * - 실시간 경기 스코어/투구수 수신 (`/ws/live-matches`)
 * - 자동 재연결(Auto-Reconnect with Backoff) 내장
 */

export interface WsChatMessage {
  senderName: string;
  senderTier: string;
  senderAvatar: string;
  text: string;
  timeStr: string;
  isVvip?: boolean;
  color?: string;
  timestamp?: any;
}

export class TokeonWebSocketService {
  private static instance: TokeonWebSocketService;
  private wsBaseUrl: string;
  private roomSockets: Map<string, WebSocket> = new Map();
  private matchSocket: WebSocket | null = null;
  private roomListeners: Map<string, Set<(msg: any) => void>> = new Map();
  private matchListeners: Set<(payload: any) => void> = new Set();
  private reconnectTimers: Map<string, any> = new Map();

  private constructor() {
    // 환경에 따른 WebSocket URL 자동 판별 (개발 시 localhost:8000, 배포 시 Render wss://)
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    this.wsBaseUrl = isDev ? 'ws://localhost:8000' : 'wss://tokeon-backend.onrender.com';
  }

  public static getInstance(): TokeonWebSocketService {
    if (!TokeonWebSocketService.instance) {
      TokeonWebSocketService.instance = new TokeonWebSocketService();
    }
    return TokeonWebSocketService.instance;
  }

  /**
   * 💬 채팅 룸 웹소켓 연결 및 구독
   */
  public subscribeRoomChat(roomId: string, callback: (data: any) => void): () => void {
    if (!this.roomListeners.has(roomId)) {
      this.roomListeners.set(roomId, new Set());
    }
    this.roomListeners.get(roomId)!.add(callback);

    this.ensureRoomSocket(roomId);

    return () => {
      const listeners = this.roomListeners.get(roomId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.closeRoomSocket(roomId);
        }
      }
    };
  }

  private ensureRoomSocket(roomId: string) {
    const existing = this.roomSockets.get(roomId);
    if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const wsUrl = `${this.wsBaseUrl}/ws/chat/${encodeURIComponent(roomId)}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`[FastAPI WebSocket] 🟢 채팅 룸 연결 성공: ${roomId}`);
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const listeners = this.roomListeners.get(roomId);
          if (listeners) {
            listeners.forEach(fn => fn(parsed));
          }
        } catch (e) {
          console.warn('[FastAPI WebSocket] 메시지 파싱 오류:', e);
        }
      };

      ws.onclose = () => {
        console.log(`[FastAPI WebSocket] 🔴 채팅 룸 연결 종료: ${roomId}`);
        this.roomSockets.delete(roomId);
        // 리스너가 남아있는 경우 3초 후 자동 재연결 시도
        if (this.roomListeners.get(roomId)?.size) {
          clearTimeout(this.reconnectTimers.get(roomId));
          const timer = setTimeout(() => this.ensureRoomSocket(roomId), 3000);
          this.reconnectTimers.set(roomId, timer);
        }
      };

      ws.onerror = (err) => {
        console.warn(`[FastAPI WebSocket] ⚠️ 연결 에러 (Fallback 준비):`, err);
      };

      this.roomSockets.set(roomId, ws);
    } catch (e) {
      console.warn('[FastAPI WebSocket] Socket 생성 예외:', e);
    }
  }

  private closeRoomSocket(roomId: string) {
    const ws = this.roomSockets.get(roomId);
    if (ws) {
      ws.close();
      this.roomSockets.delete(roomId);
    }
  }

  /**
   * 💬 채팅 메시지 전송 (FastAPI WebSocket 서버로 전송)
   */
  public sendRoomMessage(roomId: string, message: WsChatMessage): boolean {
    const ws = this.roomSockets.get(roomId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  /**
   * 📡 실시간 경기 스코어/투구수 푸시 구독 (`/ws/live-matches`)
   */
  public subscribeLiveMatches(callback: (payload: any) => void): () => void {
    this.matchListeners.add(callback);
    this.ensureMatchSocket();

    return () => {
      this.matchListeners.delete(callback);
      if (this.matchListeners.size === 0 && this.matchSocket) {
        this.matchSocket.close();
        this.matchSocket = null;
      }
    };
  }

  private ensureMatchSocket() {
    if (this.matchSocket && (this.matchSocket.readyState === WebSocket.OPEN || this.matchSocket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const wsUrl = `${this.wsBaseUrl}/ws/live-matches`;
      this.matchSocket = new WebSocket(wsUrl);

      this.matchSocket.onopen = () => {
        console.log('[FastAPI WebSocket] 🟢 실시간 경기 스코어 소켓 연결 성공');
      };

      this.matchSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.matchListeners.forEach(fn => fn(data));
        } catch (e) {}
      };

      this.matchSocket.onclose = () => {
        console.log('[FastAPI WebSocket] 🔴 실시간 경기 스코어 소켓 종료 (3초 후 재연결)');
        this.matchSocket = null;
        if (this.matchListeners.size > 0) {
          setTimeout(() => this.ensureMatchSocket(), 3000);
        }
      };
    } catch (e) {
      console.warn('[FastAPI WebSocket] Live Matches Socket 에러:', e);
    }
  }
}

export const tokeonWsService = TokeonWebSocketService.getInstance();
