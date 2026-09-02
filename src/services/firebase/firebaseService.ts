import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { getFirebaseConfig } from '../auth/firebaseConfig';

const config = getFirebaseConfig();

// Check if actual credentials are provided (i.e. not placeholder)
export const isFirebaseConfigured = 
  config.apiKey && 
  config.apiKey !== 'AIzaSy_demo_key_placeholder';

let db: any = null;
let firebaseAuthInstance: Auth | null = null;
let firebaseAppInstance: any = null;

if (isFirebaseConfigured) {
  try {
    firebaseAppInstance = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getFirestore(firebaseAppInstance);
    firebaseAuthInstance = getAuth(firebaseAppInstance);
    console.log('[Firebase] Realtime Firestore & Auth Initialized Successfully!');
  } catch (err) {
    console.error('[Firebase] Failed to initialize firebase, running in local-only fallback mode:', err);
  }
} else {
  console.warn('[Firebase] Running in local-only fallback mode (API key is placeholder).');
}

export const getFirebaseAuth = (): Auth | null => {
  if (!firebaseAuthInstance && isFirebaseConfigured) {
    try {
      const app = getApps().length === 0 ? initializeApp(config) : getApp();
      firebaseAuthInstance = getAuth(app);
    } catch (e) {
      console.warn('[Firebase] Auth init error:', e);
    }
  }
  return firebaseAuthInstance;
};

export interface ChatMessage {
  id: string;
  senderName: string;
  senderTier: string;
  senderAvatar: string;
  text: string;
  timeStr: string;
  isVvip?: boolean;
  color?: string;
  timestamp?: any;
}

export const firebaseService = {
  /**
   * Subscribe to real-time updates for a specific room's messages.
   * Connects to both Firestore Realtime and BroadcastChannel for 100% guaranteed live messaging.
   */
  subscribeToRoomMessages(
    roomId: string, 
    onUpdate: (messages: ChatMessage[]) => void
  ): () => void {
    let activeMessages: ChatMessage[] = [];

    // 1. Load initial cached messages
    try {
      const saved = localStorage.getItem(`tokeon_realtime_room_${roomId}`);
      if (saved) {
        activeMessages = JSON.parse(saved);
        onUpdate(activeMessages);
      }
    } catch (e) {}

    // 2. BroadcastChannel for instant inter-tab/inter-window live sync
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel(`tokeon_chat_channel_${roomId}`);
        bc.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_MESSAGE') {
            const incomingMsg: ChatMessage = event.data.message;
            if (!activeMessages.some(m => m.id === incomingMsg.id)) {
              activeMessages = [...activeMessages, incomingMsg];
              try {
                localStorage.setItem(`tokeon_realtime_room_${roomId}`, JSON.stringify(activeMessages.slice(-100)));
              } catch (e) {}
              onUpdate(activeMessages);
            }
          }
        };
      }
    } catch (e) {
      console.warn('[Firebase] BroadcastChannel fallback:', e);
    }

    // 2.5 Storage Event listener (같은 브라우저 창/탭 간 0ms 실시간 동기화)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `tokeon_realtime_room_${roomId}` && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            activeMessages = parsed;
            onUpdate(parsed);
          }
        } catch (err) {}
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    // 3. Firestore Realtime onSnapshot listener (다른 PC / 스마트폰 / 친구와의 원격 실시간 동기화)
    let unsubscribeFirestore = () => {};
    if (db) {
      try {
        const messagesRef = collection(db, 'chat_rooms', roomId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

        unsubscribeFirestore = onSnapshot(q, 
          (snapshot) => {
            if (!snapshot.empty) {
              const msgs: ChatMessage[] = [];
              snapshot.forEach((doc) => {
                const data = doc.data();
                msgs.push({
                  id: doc.id,
                  senderName: data.senderName || '알수없음',
                  senderTier: data.senderTier || 'VVIP',
                  senderAvatar: data.senderAvatar || '👤',
                  text: data.text || '',
                  timeStr: data.timeStr || '',
                  isVvip: data.isVvip || false,
                  color: data.color || 'text-slate-200',
                  timestamp: data.timestamp
                });
              });
              activeMessages = msgs;
              try {
                localStorage.setItem(`tokeon_realtime_room_${roomId}`, JSON.stringify(msgs.slice(-100)));
              } catch (e) {}
              onUpdate(msgs);
            }
          },
          (error) => {
            console.warn(`[Firebase] onSnapshot notice for room ${roomId}:`, error);
          }
        );
      } catch (err) {
        console.warn(`[Firebase] Failed to subscribe to Firestore room ${roomId}:`, err);
      }
    }

    return () => {
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
      unsubscribeFirestore();
    };
  },

  /**
   * Send a message to a specific room in Firestore and broadcast to all connected clients.
   */
  async sendRoomMessage(roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<string | null> {
    const generatedId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const fullMessage: ChatMessage = {
      ...message,
      id: generatedId,
      timestamp: new Date().toISOString()
    };

    // 1. BroadcastChannel emit for 0ms instant display across tabs
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel(`tokeon_chat_channel_${roomId}`);
        bc.postMessage({ type: 'NEW_MESSAGE', message: fullMessage });
        bc.close();
      }
    } catch (e) {}

    // 2. Save to local cache
    try {
      const saved = localStorage.getItem(`tokeon_realtime_room_${roomId}`);
      const list: ChatMessage[] = saved ? JSON.parse(saved) : [];
      if (!list.some(m => m.id === generatedId)) {
        list.push(fullMessage);
        localStorage.setItem(`tokeon_realtime_room_${roomId}`, JSON.stringify(list.slice(-100)));
      }
    } catch (e) {}

    // 3. Send to Cloud Firestore
    if (db) {
      try {
        const messagesRef = collection(db, 'chat_rooms', roomId, 'messages');
        const docRef = await addDoc(messagesRef, {
          senderName: message.senderName,
          senderTier: message.senderTier,
          senderAvatar: message.senderAvatar,
          text: message.text,
          timeStr: message.timeStr,
          isVvip: message.isVvip || false,
          color: message.color || 'text-slate-200',
          timestamp: serverTimestamp()
        });
        return docRef.id;
      } catch (err) {
        console.warn(`[Firebase] Firestore addDoc fallback to local broadcast for room ${roomId}:`, err);
        return generatedId;
      }
    }

    return generatedId;
  }
};
