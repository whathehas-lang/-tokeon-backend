import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Sparkles, Flame, Shield, ShieldCheck, Heart, ThumbsUp, AlertCircle } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';
import { firebaseService, isFirebaseConfigured, type ChatMessage } from '../services/firebase/firebaseService';
import { authService } from '../services/auth/authService';

interface LiveCheerChatProps {
  match: Match;
  userProfile?: {
    name: string;
    tier?: string;
  };
  membershipTier?: MembershipTier;
  theme?: 'light' | 'dark';
}

export const LiveCheerChat: React.FC<LiveCheerChatProps> = ({
  match,
  userProfile,
  membershipTier = 'VVIP',
  theme = 'light'
}) => {
  const isLight = theme === 'light';
  const roomId = `match_${match.id || match.betmanMatchNo || 'general'}`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedTeamCheer, setSelectedTeamCheer] = useState<'HOME' | 'AWAY' | 'NEUTRAL'>('NEUTRAL');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to Firestore realtime messages
  useEffect(() => {
    let localSaved: ChatMessage[] = [];
    try {
      const raw = localStorage.getItem(`tokeon_realtime_room_${roomId}`);
      if (raw) localSaved = JSON.parse(raw);
    } catch (e) {}

    setMessages(localSaved);

    const unsubscribe = firebaseService.subscribeToRoomMessages(roomId, (realtimeMsgs) => {
      if (realtimeMsgs) {
        setMessages(realtimeMsgs);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend) return;

    const currentSession = authService.getCurrentUser();
    const senderName = currentSession?.name || userProfile?.name || '토큰 팩트회원';
    const senderTier = currentSession?.tier || membershipTier || 'VVIP';
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      senderName,
      senderTier,
      senderAvatar: currentSession?.photoURL ? '👤' : (senderTier === 'VVIP' ? '👑' : '💬'),
      text: selectedTeamCheer === 'HOME' 
        ? `[🏠 ${match.homeTeam.name} 응원] ${textToSend}`
        : selectedTeamCheer === 'AWAY' 
        ? `[✈️ ${match.awayTeam.name} 응원] ${textToSend}`
        : textToSend,
      timeStr,
      isVvip: senderTier === 'VVIP',
      color: senderTier === 'VVIP' ? 'text-amber-400' : 'text-slate-200'
    };

    // Optimistic local update
    const updated = [...messages, newMsg];
    setMessages(updated);
    try {
      localStorage.setItem(`tokeon_chat_${roomId}`, JSON.stringify(updated.slice(-50)));
    } catch (e) {}

    if (!customText) setInputText('');

    // Send to Firestore
    if (isFirebaseConfigured) {
      await firebaseService.sendRoomMessage(roomId, {
        senderName: newMsg.senderName,
        senderTier: newMsg.senderTier,
        senderAvatar: newMsg.senderAvatar,
        text: newMsg.text,
        timeStr: newMsg.timeStr,
        isVvip: newMsg.isVvip,
        color: newMsg.color
      });
    }
  };

  // Quick Preset Reactions
  const quickPresets = [
    `🔥 ${match.homeTeam.name} 승리 가자!`,
    `⚡ ${match.awayTeam.name} 역배 노린다`,
    `🎯 언더/오버 팩트 적중 기원`,
    `🛡️ 오피셜 라인업 확인완료`
  ];

  return (
    <div className={`flex flex-col h-full rounded-2xl border overflow-hidden shadow-inner ${
      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
    }`}>
      {/* Header (슬림 콤팩트 응원팀 선택 바) */}
      <div className={`px-3 py-2 border-b flex items-center justify-between shrink-0 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-1.5 font-black text-xs">
          <MessageCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>실시간 응원 톡방</span>
        </div>

        {/* Home / Away Cheer Selector */}
        <div className="flex items-center gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setSelectedTeamCheer(prev => prev === 'HOME' ? 'NEUTRAL' : 'HOME')}
            className={`px-2 py-0.5 rounded-lg border font-bold transition-all cursor-pointer ${
              selectedTeamCheer === 'HOME'
                ? 'bg-blue-600 text-white border-blue-400 shadow-xs'
                : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            🏠 {match.homeTeam.name.slice(0, 4)}
          </button>
          <button
            type="button"
            onClick={() => setSelectedTeamCheer(prev => prev === 'AWAY' ? 'NEUTRAL' : 'AWAY')}
            className={`px-2 py-0.5 rounded-lg border font-bold transition-all cursor-pointer ${
              selectedTeamCheer === 'AWAY'
                ? 'bg-rose-600 text-white border-rose-400 shadow-xs'
                : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            ✈️ {match.awayTeam.name.slice(0, 4)}
          </button>
        </div>
      </div>

      {/* Message List (유튜브/트위치 라이브 스트리밍 초경량 한 줄 라인 톡 스타일) */}
      <div 
        ref={chatScrollRef}
        className="flex-1 p-2 space-y-1 overflow-y-auto min-h-[140px] max-h-[340px] scrollbar-thin"
      >
        {messages.map((msg) => {
          const isOfficial = msg.senderTier === 'OFFICIAL';
          const isVvip = msg.isVvip || msg.senderTier === 'VVIP';
          return (
            <div 
              key={msg.id} 
              className={`py-1 px-2 rounded-lg text-xs leading-snug flex items-start gap-1.5 transition-all hover:bg-slate-800/40 ${
                isOfficial
                  ? 'bg-amber-500/10 border-l-2 border-amber-400'
                  : 'border-b border-slate-800/30'
              }`}
            >
              <span className="text-[11px] shrink-0 mt-0.5">{msg.senderAvatar || '👤'}</span>
              <div className="min-w-0 flex-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className={`font-black text-[11px] shrink-0 ${
                  isOfficial ? 'text-amber-400' : isVvip ? 'text-amber-300' : isLight ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  {msg.senderName}:
                </span>
                <span className={`font-medium text-xs break-words ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {msg.text}
                </span>
                <span className="text-[9px] font-mono text-slate-500 shrink-0 ml-auto">
                  {msg.timeStr}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Cheer Presets */}
      <div className={`px-3 py-1.5 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <span className="text-[10px] font-black text-amber-500 shrink-0 flex items-center gap-0.5">
          ⚡ 빠른톡:
        </span>
        {quickPresets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(preset)}
            className={`px-2 py-0.8 rounded-full text-[10px] font-bold shrink-0 border transition-all cursor-pointer ${
              isLight 
                ? 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200 hover:border-amber-400' 
                : 'bg-slate-950 hover:bg-amber-950 text-slate-300 border-slate-800 hover:border-amber-500'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className={`p-2.5 border-t flex items-center gap-2 shrink-0 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
      }`}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`[${match.betmanMatchNo}번] 응원 및 팩트 분석 톡 입력...`}
          className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-amber-400 transition-all ${
            isLight ? 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-400' : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button
          type="button"
          onClick={() => handleSendMessage()}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1 shrink-0 cursor-pointer border border-yellow-200"
        >
          <Send className="w-3.5 h-3.5" />
          <span>전송</span>
        </button>
      </div>
    </div>
  );
};

