import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Send, 
  MessageCircle, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Trophy, 
  ThumbsUp, 
  Heart, 
  TrendingUp,
  Share2,
  RefreshCw,
  Tv
} from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';
import { isMatchCompleted, getMatchScore } from '../utils/matchResultHelper';
import { firebaseService, isFirebaseConfigured, type ChatMessage } from '../services/firebase/firebaseService';
import { authService } from '../services/auth/authService';
import { BaseballGraphicLiveField } from './BaseballGraphicLiveField';

interface MatchLiveChatModalProps {
  match: Match;
  onClose: () => void;
  membershipTier?: MembershipTier;
  theme?: 'light' | 'dark';
}

export const MatchLiveChatModal: React.FC<MatchLiveChatModalProps> = ({
  match,
  onClose,
  membershipTier = 'VVIP',
  theme = 'light'
}) => {
  const isLight = theme === 'light';
  const roomId = `match_${match.id || match.betmanMatchNo || 'general'}`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [cheerTarget, setCheerTarget] = useState<'HOME' | 'AWAY' | 'ALL'>('ALL');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HOME' | 'AWAY' | 'VVIP'>('ALL');
  const [myNickname, setMyNickname] = useState<string>(() => {
    return localStorage.getItem('tokeon_chat_nickname') || authService.getCurrentUser()?.name || `유저_${Math.floor(100 + Math.random() * 900)}`;
  });
  const [isEditingNick, setIsEditingNick] = useState<boolean>(false);
  const [nickInput, setNickInput] = useState<string>('');

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFinished = isMatchCompleted(match);
  const { homeScore, awayScore } = getMatchScore(match);

  // 참여자 수 및 응원 비율 계산
  const baseSeed = (match.betmanMatchNo || 100) * 17;
  const participantCount = 45 + (baseSeed % 70);
  const homeCheerPercent = 45 + (baseSeed % 25);
  const awayCheerPercent = 100 - homeCheerPercent;

  // 1. 방 진입 시 저장된 실제 대화 복원 및 실시간 리스너 구독
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

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  // 2. 메시지 목록 스크롤만 하단 유지 (모달 상단 경기판 스크롤 간섭 100% 방지)
  useEffect(() => {
    if (chatScrollRef.current) {
      requestAnimationFrame(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages.length, activeFilter]);

  // 3. 메시지 전송 로직
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend) return;

    const senderName = myNickname.trim() || '토큰회원';
    const senderTier = membershipTier || 'VVIP';
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      senderName,
      senderTier,
      senderAvatar: cheerTarget === 'HOME' ? '🏠' : cheerTarget === 'AWAY' ? '✈️' : '🔥',
      text: textToSend,
      timeStr,
      isVvip: senderTier === 'VVIP',
      color: senderTier === 'VVIP' ? 'text-amber-400' : 'text-slate-200'
    };

    const updated = [...messages, newMsg];
    setMessages(updated);

    try {
      localStorage.setItem(`tokeon_realtime_room_${roomId}`, JSON.stringify(updated.slice(-100)));
    } catch (e) {}

    if (!customText) setInputText('');

    try {
      await firebaseService.sendRoomMessage(roomId, {
        senderName: newMsg.senderName,
        senderTier: newMsg.senderTier,
        senderAvatar: newMsg.senderAvatar,
        text: newMsg.text,
        timeStr: newMsg.timeStr,
        isVvip: newMsg.isVvip,
        color: newMsg.color
      });
    } catch (err) {
      console.warn('[MatchLiveChatModal] send error:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPresets = useMemo(() => [
    `🔥 ${match.homeTeam.name} 승리 가자!`,
    `⚡ ${match.awayTeam.name} 역배 노린다`,
    `🎯 언더/오버 팩트 적중 기원`,
    `🛡️ 오피셜 라인업 팩트 확인완료`,
    `💰 배당 가치 최고네요`
  ], [match.homeTeam.name, match.awayTeam.name]);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (activeFilter === 'HOME') return m.senderAvatar === '🏠';
      if (activeFilter === 'AWAY') return m.senderAvatar === '✈️';
      if (activeFilter === 'VVIP') return m.isVvip || m.senderTier?.includes('VVIP');
      return true;
    });
  }, [messages, activeFilter]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-1.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className={`w-full max-w-6xl h-[96vh] sm:h-[88vh] max-h-[850px] rounded-3xl flex flex-col shadow-2xl overflow-hidden border relative ${
        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-amber-500/40 text-white'
      }`}>
        
        {/* 🏆 최상단 헤더 */}
        <div className={`px-3 py-2 border-b shrink-0 flex items-center justify-between gap-2 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[11px] shrink-0">
              {match.betmanMatchNo}번
            </span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold truncate ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {match.countryFlag || '🇰🇷'} {match.league}
            </span>
            {isFinished ? (
              <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-800 font-black text-[10px] shrink-0">
                종료 ({homeScore}:{awayScore})
              </span>
            ) : match.status === 'LIVE' ? (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-400 font-black text-[10px] shrink-0 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                LIVE
              </span>
            ) : (
              <span className={`text-[10px] font-bold shrink-0 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                ⏰ {match.matchTime}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black">
              <Users className="w-3 h-3" />
              <span>{participantCount}명</span>
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 📐 메인 스마트 2분할 영역 (모바일: 위 2D야구중계 + 아래 대화창 / PC: 좌 2D야구중계 + 우 대화창) */}
        <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-12 overflow-hidden">
          
          {/* 👈 [LEFT/TOP SECTION]: ⚽ / ⚾ 실시간 경기 2D 중계판 (스마트폰 상단 100% 무조건 보임) */}
          <div className="h-auto shrink-0 md:h-full md:col-span-6 lg:col-span-7 flex flex-col p-2 sm:p-3 border-b md:border-b-0 md:border-r border-slate-800 space-y-2 bg-slate-950/80">
            
            {/* 대진 팀명 & 스코어/배당률 카운터 */}
            <div className={`p-2 rounded-xl border flex items-center justify-between gap-1.5 shrink-0 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              {/* 홈팀 */}
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px] font-black shrink-0">
                  홈
                </div>
                <div className="min-w-0">
                  <h4 className={`font-black text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {match.homeTeam.name}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    배당 {match.betmanOdds?.win || '1.85'}
                  </span>
                </div>
              </div>

              {/* 센터 스코어 */}
              <div className="flex flex-col items-center justify-center shrink-0 px-1">
                {isFinished || match.status === 'LIVE' ? (
                  <div className="text-base sm:text-xl font-black font-mono tracking-wider text-emerald-400">
                    {match.homeScore ?? homeScore} : {match.awayScore ?? awayScore}
                  </div>
                ) : (
                  <span className="text-[11px] font-black text-slate-400">VS</span>
                )}
              </div>

              {/* 원정팀 */}
              <div className="flex items-center justify-end gap-1.5 min-w-0 flex-1 text-right">
                <div className="min-w-0">
                  <h4 className={`font-black text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {match.awayTeam.name}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">
                    배당 {match.betmanOdds?.lose || '2.10'}
                  </span>
                </div>
                <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[10px] font-black shrink-0">
                  원정
                </div>
              </div>
            </div>

            {/* 🏟️ 야구 경기 시 2D 야구장 실시간 그래픽 중계판 (스마트폰 상단 100% 즉시 표출) */}
            {match.sport === 'baseball' ? (
              <div className="w-full shrink-0">
                <BaseballGraphicLiveField match={match} theme={theme} />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-1 shrink-0">
                <Tv className="w-6 h-6 text-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black text-white">⚽ 축구 실시간 중계</h3>
                <p className="text-[10px] text-slate-400">라인업 및 xG 기대득점 실시간 중계 중</p>
              </div>
            )}
          </div>

          {/* 👉 [RIGHT/BOTTOM SECTION]: 실시간 응원 대화 톡방 (스마트폰 하단 100% 무조건 완벽 표출) */}
          <div className="flex-1 min-h-0 md:h-full md:col-span-6 lg:col-span-5 flex flex-col bg-slate-900/90 relative">
            
            {/* 닉네임 설정 & 응원 대상 선택 바 */}
            <div className="p-1.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-1 shrink-0">
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-slate-400 font-bold">닉네임:</span>
                {isEditingNick ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={nickInput}
                      onChange={(e) => setNickInput(e.target.value)}
                      placeholder="닉네임"
                      className="px-1 py-0.2 rounded bg-slate-800 border border-emerald-500 text-white text-[10px] font-bold w-20 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (nickInput.trim()) {
                          setMyNickname(nickInput.trim());
                          localStorage.setItem('tokeon_chat_nickname', nickInput.trim());
                        }
                        setIsEditingNick(false);
                      }}
                      className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black text-[10px] cursor-pointer"
                    >
                      저장
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setNickInput(myNickname);
                      setIsEditingNick(true);
                    }}
                    className="font-black text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{myNickname}</span>
                    <span className="text-[9px] text-slate-400">✏️</span>
                  </button>
                )}
              </div>

              {/* 응원할 팀 선택 */}
              <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded border border-slate-800 text-[9px] font-bold">
                <button
                  onClick={() => setCheerTarget('HOME')}
                  className={`px-1.5 py-0.2 rounded transition-all cursor-pointer ${
                    cheerTarget === 'HOME' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  홈
                </button>
                <button
                  onClick={() => setCheerTarget('ALL')}
                  className={`px-1.5 py-0.2 rounded transition-all cursor-pointer ${
                    cheerTarget === 'ALL' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  중립
                </button>
                <button
                  onClick={() => setCheerTarget('AWAY')}
                  className={`px-1.5 py-0.2 rounded transition-all cursor-pointer ${
                    cheerTarget === 'AWAY' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  원정
                </button>
              </div>
            </div>

            {/* 💬 메시지 수신 스크롤 리스트 (하단 전체 독점 확보) */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 min-h-0 custom-scrollbar"
            >
              {filteredMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-3 text-slate-500 space-y-1">
                  <MessageCircle className="w-7 h-7 text-slate-700 animate-bounce" />
                  <p className="text-xs font-bold text-slate-400">아직 응원 메시지가 없습니다.</p>
                  <p className="text-[10px] text-slate-500">첫 응원 메시지를 전송하고 대화를 시작해 보세요!</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isMine = msg.senderName === myNickname;
                  return (
                    <div 
                      key={msg.id} 
                      className={`py-1 px-2 rounded-lg text-xs leading-snug flex items-start gap-1.5 transition-all hover:bg-slate-800/40 border-b border-slate-800/30 ${
                        isMine ? 'bg-emerald-500/10' : ''
                      }`}
                    >
                      <span className="text-[11px] shrink-0 mt-0.5">{msg.senderAvatar || '👤'}</span>
                      <div className="min-w-0 flex-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                        <span className={`font-black text-[11px] shrink-0 ${
                          isMine ? 'text-emerald-400' : msg.isVvip ? 'text-amber-400' : 'text-slate-200'
                        }`}>
                          {msg.senderName}:
                        </span>
                        <span className={`font-medium text-xs break-words ${isMine ? 'text-emerald-200' : 'text-slate-100'}`}>
                          {msg.text}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 shrink-0 ml-auto">
                          {msg.timeStr}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ⚡ 퀵 응원 멘트 버블 */}
            <div className="px-2 py-1 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto shrink-0 no-scrollbar">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset)}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 whitespace-nowrap transition-all cursor-pointer shrink-0"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* ⌨️ 대화 입력창 하단 바 */}
            <div className="p-2 bg-slate-950 border-t border-slate-800 shrink-0">
              <div className="flex items-center gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`[${cheerTarget === 'HOME' ? match.homeTeam.name : cheerTarget === 'AWAY' ? match.awayTeam.name : '실시간 응원'}] 대화 입력...`}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
                >
                  <span>전송</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
