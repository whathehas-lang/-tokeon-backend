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
  onOpenMatchDetail
}: PCWebCommunityHubProps) => {
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
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl border-2 border-amber-500/40 shadow-2xl overflow-hidden p-2 sm:p-3.5 h-[calc(100vh-100px)] backdrop-blur-xl sticky top-20 flex flex-col">
      
      {/* MAIN CONTAINER */}
      <div className="flex flex-row items-stretch gap-2 sm:gap-3 flex-1 overflow-hidden">
        
        {/* 👈 LEFT VERTICAL SIDEBAR PANEL */}
        <div className="w-[125px] sm:w-[200px] md:w-80 bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-1.5 sm:p-3 flex flex-col space-y-2.5 shrink-0 shadow-2xl h-full overflow-hidden">
          
          <button
            onClick={() => setSelectedMatch(globalChatRoom)}
            className={`w-full py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between border cursor-pointer ${
              !selectedCustomRoom && selectedMatch.id === 'global-all-chat'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-400/50 scale-[1.01]'
                : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-amber-400/80 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Globe className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span className="truncate">🌐 전세계 라이브 톡</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
              LIVE
            </span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {matches.slice(0, 30).map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedCustomRoom(null);
                  setSelectedMatch(m);
                }}
                className={`w-full p-2 rounded-xl text-left transition-all border flex flex-col space-y-1 cursor-pointer ${
                  !selectedCustomRoom && selectedMatch.id === m.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-950/60 border-slate-850 hover:bg-slate-900 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>{m.countryFlag || '🌐'} {m.league}</span>
                  <span className="text-amber-400 font-mono">{m.matchTime}</span>
                </div>
                <div className="font-extrabold text-xs text-white truncate flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">[홈]</span>
                  <span>{m.homeTeam.name}</span>
                  <span className="text-slate-500 font-normal">vs</span>
                  <span className="text-cyan-400 font-bold">[원정]</span>
                  <span>{m.awayTeam.name}</span>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* 👉 RIGHT MAIN CHAT AREA */}
        <div className="flex-1 bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between shadow-2xl h-full overflow-hidden">
          
          {/* Room Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-black text-white truncate">
                    {selectedCustomRoom ? selectedCustomRoom.roomTitle : `[홈] ${selectedMatch.homeTeam?.name || '홈팀'} vs [원정] ${selectedMatch.awayTeam?.name || '원정팀'}`}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 ${
                    isWsConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isWsConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                    <span>{isWsConnected ? 'FastAPI 웹소켓 연결' : '폴백 모드'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    접속 {onlineCount}명
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                  {selectedCustomRoom ? selectedCustomRoom.description : `${selectedMatch.league} 오피셜 실시간 라이브 분석 채널`}
                </p>
              </div>
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
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-amber-400 hover:border-amber-500/50 transition-all"
            >
              {hubNotificationSettings === 'sound' ? '🔊 소리ON' : hubNotificationSettings === 'browser' ? '🖥️ 알림ON' : '🚫 알림OFF'}
            </button>
          </div>

          {/* Chat Feed */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-3 py-3 pr-2 custom-scrollbar">
            {currentMatchChats.map((msg) => (
              <div key={msg.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{msg.senderAvatar}</span>
                    <span className="font-black text-xs text-amber-400">{msg.senderName}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {msg.senderTier}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{msg.timeStr}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="전 세계 스포츠 라이브 톡에 메시지를 입력하세요..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
            <button
              onClick={handleSendMsg}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:from-amber-300 hover:to-yellow-400 transition-all shrink-0 cursor-pointer"
            >
              전송 🚀
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
