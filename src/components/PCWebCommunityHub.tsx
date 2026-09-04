import React, { useState, useRef, useEffect } from 'react';
import { Send, Globe, Plus, Lock, Key, Crown, X, ShieldAlert, Activity, Sparkles, MessageSquare, Volume2, VolumeX, Bell } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';
import { firebaseService, isFirebaseConfigured } from '../services/firebase/firebaseService';
import { authService } from '../services/auth/authService';

interface PCWebCommunityHubProps {
  matches: Match[];
  userProfile: {
    name: string;
    favoriteSport: string;
    accuracy: number;
  };
  membershipTier: MembershipTier;
  onOpenMatchDetail: (match: Match) => void;
  targetRoomId?: string;
  theme?: 'light' | 'dark';
}

interface CustomVvipRoom {
  id: string;
  roomTitle: string;
  creatorName: string;
  creatorTier?: string;
  isSecret?: boolean;
  participantCount?: number;
  category?: string;
  createdAt?: string;
  description?: string;
  attachedMatchNo?: number;
  isPasswordProtected?: boolean;
  passwordStr?: string;
  memberCount?: number;
  maxMembers?: number;
  timeStr?: string;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderTier: string;
  senderAvatar: string;
  text: string;
  timeStr: string;
  isVvip?: boolean;
}

export const PCWebCommunityHub = ({
  matches,
  userProfile,
  membershipTier,
  onOpenMatchDetail,
  theme = 'dark'
}: PCWebCommunityHubProps) => {
  const isLight = theme === 'light';
  const globalChatRoom = {
    id: 'global-all-chat',
    homeTeam: { name: '전세계 라이브 톡' },
    awayTeam: { name: '통합 소통방' },
    league: '오피셜 팩트 허브'
  };

  const [selectedMatch, setSelectedMatch] = useState<any>(globalChatRoom);
  const [inputMsg, setInputMsg] = useState('');
  const [hubNotificationSettings, setHubNotificationSettings] = useState<'sound' | 'browser' | 'none'>('sound');

  const [customRooms, setCustomRooms] = useState<CustomVvipRoom[]>(() => {
    const saved = localStorage.getItem('tokeon_vvip_custom_rooms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'v_room_1',
        roomTitle: '👑 VVIP 90%+ 승률 분석방',
        creatorName: '팩트마스터',
        creatorTier: 'PRO_ANALYST',
        isSecret: true,
        participantCount: 8,
        category: 'VVIP 비밀방',
        timeStr: '방금 전',
        description: '오피셜 선발 라인업 및 기상 팩터 분석방',
        isPasswordProtected: false,
        memberCount: 8,
        maxMembers: 20
      }
    ];
  });

  const [selectedCustomRoom, setSelectedCustomRoom] = useState<CustomVvipRoom | null>(null);
  const [isCreateVvipRoomModalOpen, setIsCreateVvipRoomModalOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomIsPassword, setNewRoomIsPassword] = useState(false);
  const [newRoomPassword, setNewRoomPassword] = useState('');

  const [passwordPromptRoom, setPasswordPromptRoom] = useState<CustomVvipRoom | null>(null);
  const [inputPasswordAttempt, setInputPasswordAttempt] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('tokeon_hub_chats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'global-all-chat': [
        { id: 'g1', senderName: '토큰공식리포터', senderTier: 'OFFICIAL FACT', senderAvatar: '🎟️', text: '🌐 전 세계 5대 스포츠 (축구, 야구, 농구, 배구, 하키) 실시간 라이브 톡 채널에 오신 것을 환영합니다!', timeStr: '19:00', isVvip: true }
      ]
    };
  });

  const activeRoomId = selectedCustomRoom ? selectedCustomRoom.id : selectedMatch.id;
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  // ⚡ FastAPI WebSocket 실시간 양방향 통신 채널 연결
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = window.location.hostname || 'localhost';
      // 로컬 개발 환경 및 서버 환경 포트 8000 자동 감지
      const wsUrl = `${wsProtocol}//${wsHost}:8000/ws/chat/${encodeURIComponent(activeRoomId)}`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'USER_COUNT') {
            setOnlineCount(payload.count || 1);
          } else if (payload.type === 'CHAT_MESSAGE' && payload.data) {
            const incoming = payload.data as ChatMessage;
            setChatMessages(prev => {
              const currentList = prev[activeRoomId] || [];
              if (currentList.some(m => m.id === incoming.id)) return prev;
              return {
                ...prev,
                [activeRoomId]: [...currentList, incoming]
              };
            });
          }
        } catch (e) {}
      };

      ws.onclose = () => {
        setIsWsConnected(false);
      };

      ws.onerror = () => {
        setIsWsConnected(false);
      };

      wsRef.current = ws;
    } catch (e) {
      setIsWsConnected(false);
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [activeRoomId]);

  const currentMatchChats = (chatMessages[activeRoomId] && chatMessages[activeRoomId].length > 0)
    ? chatMessages[activeRoomId]
    : [
        { id: 'def1', senderName: '토큰공식리포터', senderTier: 'OFFICIAL FACT', senderAvatar: '🎟️', text: `[${selectedCustomRoom ? selectedCustomRoom.roomTitle : selectedMatch.homeTeam?.name || '라이브 톡'}] 실시간 소통을 나눠보세요!`, timeStr: '19:28', isVvip: true }
      ];

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, activeRoomId]);

  const handleSendMsg = () => {
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      senderName: userProfile.name,
      senderTier: membershipTier === 'VVIP' ? 'VVIP 팩트마스터' : '토큰 멤버',
      senderAvatar: membershipTier === 'VVIP' ? '👑' : '🎟️',
      text: inputMsg.trim(),
      timeStr: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      isVvip: membershipTier === 'VVIP'
    };

    // 1. 로컬 상태 즉시 반영
    setChatMessages(prev => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMsg]
    }));

    // 2. FastAPI WebSocket 양방향 브로드캐스트 전송 (접속한 모든 유저에게 0.01초 만에 배포)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(newMsg));
    }

    setInputMsg('');
  };

  return (
    <div className={`w-full h-full rounded-none border-r flex flex-col justify-between overflow-hidden p-3 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Simple Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                💬 실시간 라이브 채팅방
              </span>
              <span className="text-[11px] text-emerald-500 font-medium">● 라이브</span>
              <span className="text-[11px] text-slate-400">({onlineCount}명 참여 중)</span>
            </div>
            
            <button
              onClick={() => {
                const nextMap: Record<'sound' | 'browser' | 'none', 'sound' | 'browser' | 'none'> = {
                  sound: 'browser',
                  browser: 'none',
                  none: 'sound'
                };
                setHubNotificationSettings(nextMap[hubNotificationSettings]);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {hubNotificationSettings === 'sound' ? '🔊 소리' : hubNotificationSettings === 'browser' ? '🖥️ 알림' : '🚫 무음'}
            </button>
          </div>

          {/* Text-based Chat Feed (IRC / Twitch style simple text rows) */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-1.5 py-2 pr-1 font-sans text-xs leading-relaxed custom-scrollbar">
            {currentMatchChats.map((msg) => (
              <div key={msg.id} className="py-0.5 hover:bg-slate-800/20 px-1 rounded transition-colors flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-mono shrink-0 select-none">[{msg.timeStr}]</span>
                <span className="font-bold text-emerald-500 shrink-0 select-none">{msg.senderName} :</span>
                <span className="text-slate-800 dark:text-slate-200 break-all">{msg.text}</span>
              </div>
            ))}
          </div>

          {/* Simple Text Input */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="메시지를 입력하세요 (Enter)"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
              className={`flex-1 border rounded-lg px-3 py-1.5 text-xs focus:outline-none transition-all ${
                isLight 
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500 placeholder-slate-400' 
                  : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-emerald-500 placeholder-slate-500'
              }`}
            />
            <button
              onClick={handleSendMsg}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-all shrink-0 cursor-pointer"
            >
              보내기
            </button>
          </div>

    </div>
  );
};
