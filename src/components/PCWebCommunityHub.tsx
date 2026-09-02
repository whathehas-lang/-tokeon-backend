import React, { useState, useRef, useEffect } from 'react';
import { Send, Globe, Plus, Lock, Key, Crown, X, ShieldAlert, Activity, Sparkles } from 'lucide-react';
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
  onOpenMatchDetail,
  targetRoomId,
}: PCWebCommunityHubProps) => {
  // Define special 'Global All Users Chat Room' (전체 톡방)
  const globalChatRoom: Match = {
    id: 'global-all-chat',
    betmanMatchNo: 0,
    betmanRound: '야구 승5패 8회차',
    sport: 'football',
    countryFlag: '🌐',
    status: 'SCHEDULED',
    homeTeam: { id: 'g1', name: '📢 [전체 톡방] 토큰 메인 로비 대화방', logo: '🌐', countryName: 'KR', rank: 1, homeSeasonRecord: '10승 0패', awaySeasonRecord: '10승 0패', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '전체유저', totalMarketValueNum: 100 },
    awayTeam: { id: 'g2', name: '실시간 참여자 1명', logo: '💬', countryName: 'KR', rank: 1, homeSeasonRecord: '10승 0패', awaySeasonRecord: '10승 0패', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '전체회차', totalMarketValueNum: 100 },
    matchTime: '실시간 LIVE',
    closingTime: '회차 진행중',
    league: '토큰 메인 로비 전체 톡방',
    venue: 'tokeon.co.kr 글로벌 룸',
    betmanFolder: 'ALL',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '실시간', alertText: '📢 전체 대화 톡방', keyAbsenceNotice: '전체 회차 유저 라이브 소통중' },
    underOverFact: { last10OverRatio: 70, last10UnderRatio: 30, avgScoredGoals: 3.1, avgConcededGoals: 1.2, isFiveBack: false, tacticDescription: '전체 회차 팩트 토론' }
  };

  // Define Dedicated Sport Category Chat Rooms (야구, 농구, 축구, 배구 전체 톡방)
  const baseballCategoryRoom: Match = {
    id: 'category-baseball-chat',
    betmanMatchNo: 0,
    betmanRound: 'KBO & MLB 야구 회차',
    sport: 'baseball',
    countryFlag: '⚾',
    status: 'SCHEDULED',
    homeTeam: { id: 'b1', name: '⚾ [야구 전체 톡방] KBO & MLB 라이브 팩트 대화방', logo: '⚾', countryName: 'KR', rank: 1, homeSeasonRecord: '10승', awaySeasonRecord: '10승', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '야구유저', totalMarketValueNum: 100 },
    awayTeam: { id: 'b2', name: '실시간 참여자 1명', logo: '⚾', countryName: 'KR', rank: 1, homeSeasonRecord: '10승', awaySeasonRecord: '10승', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '야구전체', totalMarketValueNum: 100 },
    matchTime: '실시간 LIVE',
    closingTime: '야구 회차 진행중',
    league: '야구 카테고리 전체 톡방',
    venue: '선발 투수 ERA & 라팍 파크 팩터 토론',
    betmanFolder: 'SEUNG5PAE',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '실시간', alertText: '⚾ 야구 전체 톡방', keyAbsenceNotice: '야구 회차 유저 라이브 소통중' },
    underOverFact: { last10OverRatio: 70, last10UnderRatio: 30, avgScoredGoals: 6.5, avgConcededGoals: 3.2, isFiveBack: false, tacticDescription: '야구 팩트 토론' }
  };

  const basketballCategoryRoom: Match = {
    id: 'category-basketball-chat',
    betmanMatchNo: 0,
    betmanRound: 'NBA & KBL 농구 회차',
    sport: 'basketball',
    countryFlag: '🏀',
    status: 'SCHEDULED',
    homeTeam: { id: 'bk1', name: '🏀 [농구 전체 톡방] NBA & KBL 라이브 팩트 대화방', logo: '🏀', countryName: 'US', rank: 1, homeSeasonRecord: '10승', awaySeasonRecord: '10승', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '농구유저', totalMarketValueNum: 100 },
    awayTeam: { id: 'bk2', name: '실시간 참여자 1명', logo: '🏀', countryName: 'US', rank: 1, homeSeasonRecord: '10승', awaySeasonRecord: '10승', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '농구전체', totalMarketValueNum: 100 },
    matchTime: '실시간 LIVE',
    closingTime: '농구 회차 진행중',
    league: '농구 카테고리 전체 톡방',
    venue: 'NBA 백투백 연투 & 3,850km 비행 과부하 토론',
    betmanFolder: 'SEUNGBUSHIK',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '실시간', alertText: '🏀 농구 전체 톡방', keyAbsenceNotice: '농구 회차 유저 라이브 소통중' },
    underOverFact: { last10OverRatio: 75, last10UnderRatio: 25, avgScoredGoals: 115.0, avgConcededGoals: 110.0, isFiveBack: false, tacticDescription: '농구 팩트 토론' }
  };

  const footballCategoryRoom: Match = {
    id: 'category-football-chat',
    betmanMatchNo: 0,
    betmanRound: 'EPL & 라리가 축구 회차',
    sport: 'football',
    countryFlag: '⚽',
    status: 'SCHEDULED',
    homeTeam: { id: 'f1', name: '⚽ [축구 전체 톡방] EPL & 라리가 라이브 팩트 대화방', logo: '⚽', countryName: 'EU', rank: 1, homeSeasonRecord: '10승', awaySeasonRecord: '10승', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '축구유저', totalMarketValueNum: 100 },
    awayTeam: { id: 'f2', name: '실시간 참여자 1명', logo: '⚽', countryName: 'EU', rank: 1, homeSeasonRecord: '10승', awaySeasonRecord: '10승', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '축구전체', totalMarketValueNum: 100 },
    matchTime: '실시간 LIVE',
    closingTime: '축구 회차 진행중',
    league: '축구 카테고리 전체 톡방',
    venue: '해외축구 오피셜 선발 11명 포메이션 토론',
    betmanFolder: 'SEUNGMUPAE',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '실시간', alertText: '⚽ 축구 전체 톡방', keyAbsenceNotice: '축구 회차 유저 라이브 소통중' },
    underOverFact: { last10OverRatio: 70, last10UnderRatio: 30, avgScoredGoals: 2.5, avgConcededGoals: 1.1, isFiveBack: false, tacticDescription: '축구 팩트 토론' }
  };

  const volleyballCategoryRoom: Match = {
    id: 'category-volleyball-chat',
    betmanMatchNo: 0,
    betmanRound: 'V-리그 배구 회차',
    sport: 'football',
    countryFlag: '🏐',
    status: 'SCHEDULED',
    homeTeam: { id: 'v1', name: '🏐 [배구 전체 톡방] V-리그 & KOVO 라이브 팩트 대화방', logo: '🏐', countryName: 'KR', rank: 1, homeSeasonRecord: '10승', awaySeasonRecord: '10승', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '배구유저', totalMarketValueNum: 100 },
    awayTeam: { id: 'v2', name: '실시간 참여자 1명', logo: '🏐', countryName: 'KR', rank: 1, homeSeasonRecord: '10승', awaySeasonRecord: '10승', seasonRemainingGames: '진행중', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 100, totalMarketValue: '배구전체', totalMarketValueNum: 100 },
    matchTime: '실시간 LIVE',
    closingTime: '배구 회차 진행중',
    league: '배구 카테고리 전체 톡방',
    venue: 'V-리그 공격성공률 & 범실률 토론',
    betmanFolder: 'ALL',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '실시간', alertText: '🏐 배구 전체 톡방', keyAbsenceNotice: '배구 회차 유저 라이브 소통중' },
    underOverFact: { last10OverRatio: 65, last10UnderRatio: 35, avgScoredGoals: 185.0, avgConcededGoals: 175.0, isFiveBack: false, tacticDescription: '배구 팩트 토론' }
  };

  // Special Category Rooms Map
  const specialCategoryRooms = [globalChatRoom, baseballCategoryRoom, basketballCategoryRoom, footballCategoryRoom, volleyballCategoryRoom];

  // Find target match if targetRoomId is passed
  const initialMatch = (targetRoomId && (specialCategoryRooms.find(r => r.id === targetRoomId) || matches.find(m => m.id === targetRoomId))) || globalChatRoom;

  const [selectedMatch, setSelectedMatch] = useState<Match>(initialMatch);
  const [selectedCustomRoom, setSelectedCustomRoom] = useState<CustomVvipRoom | null>(null);

  const [chatInputText, setChatInputText] = useState<string>('');
  


  // 🔔 Community Hub Chat Notification Settings State ('sound' | 'browser' | 'none')
  const [hubNotificationSettings, setHubNotificationSettings] = useState<'sound' | 'browser' | 'none'>('sound');

  // 📌 ULTRA-HIGH DENSITY CHAT MESSAGES STREAM
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('tokeon_hub_chats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'global-all-chat': [
        { id: 'g1', senderName: '토큰공식리포터', senderTier: 'OFFICIAL FACT', senderAvatar: '🎟️', text: '📢 [전체 톡방] 토큰 라이브 대화방입니다! 모든 경기 팩트 수치를 자유롭게 공유하세요.', timeStr: '19:20', isVvip: true }
      ],
      'category-baseball-chat': [
        { id: 'cb1', senderName: '토큰공식리포터', senderTier: 'OFFICIAL FACT', senderAvatar: '🎟️', text: '⚾ [야구 전체 톡방] KBO & MLB 통합 야구 실시간 소통방입니다. 선발투수 ERA, 불펜 투구수, 구장 바람 파크 팩터를 공유하세요!', timeStr: '19:20', isVvip: true }
      ],
      'category-basketball-chat': [
        { id: 'cbk1', senderName: '토큰공식리포터', senderTier: 'OFFICIAL FACT', senderAvatar: '🎟️', text: '🏀 [농구 전체 톡방] NBA & KBL 통합 농구 실시간 소통방입니다. 백투백 연투 및 3,850km 대륙횡단 비행 과부하 수치를 체크하세요!', timeStr: '19:20', isVvip: true }
      ],
      'category-football-chat': [
        { id: 'cf1', senderName: '토큰공식리포터', senderTier: 'OFFICIAL FACT', senderAvatar: '🎟️', text: '⚽ [축구 전체 톡방] EPL, 라리가, UCL 통합 축구 실시간 대화방입니다. 오피셜 11명 선발 포메이션 팩트를 자유롭게 논의하세요!', timeStr: '19:20', isVvip: true }
      ],
      'category-volleyball-chat': [
        { id: 'cv1', senderName: '토큰공식리포터', senderTier: 'OFFICIAL FACT', senderAvatar: '🎟️', text: '🏐 [배구 전체 톡방] V-리그 남녀부 실시간 소통방입니다. 용병 몰빵 공격성공률, 범실 수치, 센터 블로킹 팩터를 공유하세요!', timeStr: '19:20', isVvip: true }
      ],
      'v_room_1': [
        { id: 'vr1', senderName: '토큰공식리포터', senderTier: 'OFFICIAL FACT', senderAvatar: '👑', text: '🔐 VVIP 전용 공유방이 개설되었습니다. 팩트 데이터 기반 소통을 이어가세요.', timeStr: '19:15', isVvip: true }
      ]
    };
  });

  const activeRoomId = selectedCustomRoom ? selectedCustomRoom.id : selectedMatch.id;
  const currentMatchChats = (chatMessages[activeRoomId] && chatMessages[activeRoomId].length > 0)
    ? chatMessages[activeRoomId]
    : [
        { id: 'def1', senderName: '토큰공식리포터', senderTier: 'OFFICIAL FACT', senderAvatar: '🎟️', text: `[${selectedCustomRoom ? selectedCustomRoom.roomTitle : selectedMatch.homeTeam.name}] 실시간 라이브 톡을 나눠보세요!`, timeStr: '19:28', isVvip: true }
      ];

  useEffect(() => {
    localStorage.setItem('tokeon_hub_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Subscribe to real-time Firebase messages if configured
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = firebaseService.subscribeToRoomMessages(activeRoomId, (msgs) => {
      setChatMessages(prev => {
        const newMsgs = msgs.length > 0 ? msgs : (prev[activeRoomId] || []);
        return {
          ...prev,
          [activeRoomId]: newMsgs
        };
      });
    });

    return () => unsubscribe();
  }, [activeRoomId]);

  // Web Audio Synth Sound player helper & Browser Push Notifications trigger for Community Hub
  const triggerHubNotification = (sender: string, text: string) => {
    if (hubNotificationSettings === 'sound') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(650, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (hubNotificationSettings === 'browser') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`💬 [토큰 전체 톡방] ${sender}`, {
          body: text,
          tag: 'tokeon-hub-chat'
        });
      }
    }
  };

  // 📌 INNER CHAT BOX ONLY SCROLL CONTAINER REFERENCE (PREVENT ENTIRE WEBPAGE FROM MOVING DOWN!)
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 👑 VVIP Custom Rooms List State
  const [customVvipRooms, setCustomVvipRooms] = useState<CustomVvipRoom[]>([
    {
      id: 'v_room_1',
      roomTitle: '👑 [VVIP 비밀방] 실시간 팩트 분석 토론방',
      creatorName: '빅데이터분석관',
      creatorTier: 'VVIP',
      isSecret: false,
      participantCount: 14,
      category: 'BASEBALL',
      createdAt: '10분 전',
      description: '선발 투수 조기 강판 시 불펜 싸움 예상'
    }
  ]);

  const [isCreateVvipRoomModalOpen, setIsCreateVvipRoomModalOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomAttachedMatchNo, setNewRoomAttachedMatchNo] = useState<number>(0);
  const [newRoomIsPassword, setNewRoomIsPassword] = useState(false);
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [newRoomMaxMembers, setNewRoomMaxMembers] = useState(10);

  // State for Entering Password-Protected Room
  const [passwordPromptRoom, setPasswordPromptRoom] = useState<CustomVvipRoom | null>(null);
  const [inputPasswordAttempt, setInputPasswordAttempt] = useState<string>('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>('');



  // 📌 Auto scroll to bottom strictly inside the chat container (prevents entire webpage window from jumping down!)
  const scrollToBottomInnerBoxOnly = () => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottomInnerBoxOnly();
    const timer = setTimeout(scrollToBottomInnerBoxOnly, 60);
    return () => clearTimeout(timer);
  }, [chatMessages, activeRoomId]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const baseMsg = {
      senderName: userProfile.name,
      senderTier: `${membershipTier} 회원`,
      senderAvatar: '👤',
      text: chatInputText.trim(),
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      isVvip: true
    };

    if (isFirebaseConfigured) {
      const docId = await firebaseService.sendRoomMessage(activeRoomId, baseMsg);
      if (!docId) {
        alert("⚠️ 실시간 전송 실패!\n\n파이어베이스 콘솔(Firestore Database)을 생성하셨는지 확인해 주세요. 규칙(Rules) 탭에서 'allow read, write: if true;'로 게시(Publish)해야 채팅이 작동합니다.");
      }
    } else {
      const newMsg: ChatMessage = {
        ...baseMsg,
        id: `msg_${Date.now()}`
      };
      setChatMessages(prev => ({
        ...prev,
        [activeRoomId]: [...(prev[activeRoomId] || []), newMsg]
      }));
    }

    triggerHubNotification(userProfile.name, chatInputText.trim());
    setChatInputText('');
  };

  // Handle selecting Official Room
  const handleSelectOfficialRoom = (m: Match) => {
    setSelectedCustomRoom(null);
    setSelectedMatch(m);
  };

  // Handle creating new VVIP Custom Room
  const handleCreateVvipRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    const newRoom: CustomVvipRoom = {
      id: `v_room_${Date.now()}`,
      roomTitle: `👑 [VVIP] ${newRoomTitle.trim()}`,
      creatorName: userProfile.name,
      attachedMatchNo: newRoomAttachedMatchNo,
      isPasswordProtected: newRoomIsPassword,
      passwordStr: newRoomIsPassword ? newRoomPassword.trim() : undefined,
      memberCount: 1,
      maxMembers: newRoomMaxMembers,
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    setCustomVvipRooms([newRoom, ...customVvipRooms]);
    setSelectedCustomRoom(newRoom);
    setIsCreateVvipRoomModalOpen(false);

    // Reset Form
    setNewRoomTitle('');
    setNewRoomIsPassword(false);
    setNewRoomPassword('');
  };

  // Handle clicking custom room with password check
  const handleSelectCustomRoom = (room: CustomVvipRoom) => {
    if (room.isPasswordProtected && room.creatorName !== userProfile.name) {
      setPasswordPromptRoom(room);
      setInputPasswordAttempt('');
      setPasswordErrorMsg('');
    } else {
      setSelectedCustomRoom(room);
    }
  };

  // Handle verifying room password
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordPromptRoom) return;

    if (inputPasswordAttempt === passwordPromptRoom.passwordStr) {
      setSelectedCustomRoom(passwordPromptRoom);
      setPasswordPromptRoom(null);
      setInputPasswordAttempt('');
      setPasswordErrorMsg('');
    } else {
      setPasswordErrorMsg('🔒 비밀번호가 일치하지 않습니다! 다시 입력해 주세요.');
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-3xl border-2 border-amber-500/40 shadow-2xl overflow-hidden p-2 sm:p-3.5 h-[calc(100vh-170px)] md:h-[690px] max-h-[80vh] md:max-h-[88vh] backdrop-blur-xl">
      
      {/* MAIN CONTAINER */}
      <div className="flex flex-row items-stretch gap-2 sm:gap-3 h-full overflow-hidden">
        
        {/* 👈 LEFT VERTICAL SIDEBAR PANEL (프리미엄 럭셔리 네온 사이드바) */}
        <div className="w-[125px] sm:w-[200px] md:w-80 bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-1.5 sm:p-3 flex flex-col space-y-2.5 shrink-0 shadow-2xl h-full overflow-hidden">
          
          {/* 👑 VVIP Exclusive Create Custom Room Button */}
          {membershipTier === 'VVIP' ? (
            <button
              onClick={() => setIsCreateVvipRoomModalOpen(true)}
              className="w-full py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 rounded-xl font-black text-[9px] sm:text-xs shadow-lg transition-all flex items-center justify-center gap-1 border border-yellow-200 cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              <span>👑 <span className="hidden sm:inline">비밀</span>방 만들기</span>
            </button>
          ) : (
            <div className="text-center py-1.5 text-[8px] sm:text-[10px] text-amber-400 font-bold bg-amber-950/80 rounded-xl border border-amber-500/40 shrink-0 leading-tight">
              👑 <span className="hidden sm:inline">VVIP </span>방 개설 가능
            </div>
          )}

          {/* 📌📌📌 CORE ROOMS ONLY LIST AREA (메인, 야구, 농구, 축구, 배구, VVIP 비밀방) */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar min-h-0">
            
            {/* 1. 📢 메인 & 종목별 전체 톡방 (5개) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1 mb-0.5">
                <span className="text-[9px] sm:text-[10px] font-black text-amber-400/90 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">카테고리별 </span>공식 톡방
                </span>
                <span className="text-[8px] sm:text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono font-bold hidden xs:inline">
                  LIVE
                </span>
              </div>

              {/* 📢 1. 메인 전체 톡방 */}
              <button
                onClick={() => handleSelectOfficialRoom(globalChatRoom)}
                className={`w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center justify-between border cursor-pointer ${
                  !selectedCustomRoom && selectedMatch.id === 'global-all-chat'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-400/50 scale-[1.01]'
                    : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-amber-400/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <Globe className={`w-3.5 h-3.5 shrink-0 ${!selectedCustomRoom && selectedMatch.id === 'global-all-chat' ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="truncate">📢 메인 <span className="hidden sm:inline">전체</span>톡방</span>
                </div>
                <span className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded bg-slate-900 font-mono text-amber-400 font-bold shrink-0 border border-amber-500/30">{activeRoomId === 'global-all-chat' ? '1명' : '0명'}</span>
              </button>

              {/* ⚾ 2. 야구 전체 톡방 */}
              <button
                onClick={() => handleSelectOfficialRoom(baseballCategoryRoom)}
                className={`w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center justify-between border cursor-pointer ${
                  !selectedCustomRoom && selectedMatch.id === 'category-baseball-chat'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-400/50 scale-[1.01]'
                    : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-amber-400/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-xs shrink-0">⚾</span>
                  <span className="truncate">야구 <span className="hidden sm:inline">전체</span>톡방</span>
                </div>
                <span className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold shrink-0 border border-amber-500/40">{activeRoomId === 'category-baseball-chat' ? '1명' : '0명'}</span>
              </button>

              {/* 🏀 3. 농구 전체 톡방 */}
              <button
                onClick={() => handleSelectOfficialRoom(basketballCategoryRoom)}
                className={`w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center justify-between border cursor-pointer ${
                  !selectedCustomRoom && selectedMatch.id === 'category-basketball-chat'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-400/50 scale-[1.01]'
                    : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-amber-400/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-xs shrink-0">🏀</span>
                  <span className="truncate">농구 <span className="hidden sm:inline">전체</span>톡방</span>
                </div>
                <span className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded bg-orange-950 text-orange-300 font-mono font-bold shrink-0 border border-orange-500/40">{activeRoomId === 'category-basketball-chat' ? '1명' : '0명'}</span>
              </button>

              {/* ⚽ 4. 축구 전체 톡방 */}
              <button
                onClick={() => handleSelectOfficialRoom(footballCategoryRoom)}
                className={`w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center justify-between border cursor-pointer ${
                  !selectedCustomRoom && selectedMatch.id === 'category-football-chat'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-400/50 scale-[1.01]'
                    : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-amber-400/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-xs shrink-0">⚽</span>
                  <span className="truncate">축구 <span className="hidden sm:inline">전체</span>톡방</span>
                </div>
                <span className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold shrink-0 border border-emerald-500/40">{activeRoomId === 'category-football-chat' ? '1명' : '0명'}</span>
              </button>

              {/* 🏐 5. 배구 전체 톡방 */}
              <button
                onClick={() => handleSelectOfficialRoom(volleyballCategoryRoom)}
                className={`w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center justify-between border cursor-pointer ${
                  !selectedCustomRoom && selectedMatch.id === 'category-volleyball-chat'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-400/50 scale-[1.01]'
                    : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-amber-400/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-xs shrink-0">🏐</span>
                  <span className="truncate">배구 <span className="hidden sm:inline">전체</span>톡방</span>
                </div>
                <span className="text-[8px] sm:text-[9px] px-1 py-0.5 rounded bg-sky-950 text-sky-300 font-mono font-bold shrink-0 border border-sky-500/40">{activeRoomId === 'category-volleyball-chat' ? '1명' : '0명'}</span>
              </button>

            </div>

            {/* 👑 2. VVIP 커스텀 비밀방 목록 */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[9px] sm:text-[10px] font-black text-amber-400/90 uppercase tracking-wider block px-1 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">VVIP </span>커스텀 비밀방
              </span>
              <div className="space-y-1.5">
                {customVvipRooms.map((room) => {
                  const isSelected = selectedCustomRoom?.id === room.id;
                  return (
                    <button
                      key={room.id}
                      onClick={() => handleSelectCustomRoom(room)}
                      className={`w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center justify-between border cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-400 text-slate-950 border-yellow-200 shadow-md ring-2 ring-yellow-400/50 scale-[1.01]'
                          : 'bg-slate-950/90 text-slate-300 border-amber-500/30 hover:border-amber-400 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {room.isPasswordProtected ? <Lock className="w-3 h-3 text-amber-400 shrink-0" /> : <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
                        <span className="truncate text-left">{room.roomTitle}</span>
                      </div>
                      <span className="text-[8px] sm:text-[9px] opacity-80 shrink-0 font-mono">{activeRoomId === room.id ? '1명' : '0명'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* 👉 👉 👉 RIGHT MAIN CHAT WINDOW PANEL (럭셔리 프리미엄 채팅 창) */}
        <div className="flex-1 bg-slate-900/95 rounded-2xl border-2 border-amber-500/50 overflow-hidden flex flex-col shadow-2xl relative h-full backdrop-blur-md">
          
          {/* Ultra-Streamlined Compact Chat Header */}
          <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ring-2 ring-emerald-500/50" />
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 truncate">
                  {selectedCustomRoom ? (
                    <span className="text-amber-300 flex items-center gap-1.5 truncate">
                      <Crown className="w-4 h-4 text-yellow-400 shrink-0" />
                      {selectedCustomRoom.roomTitle} {selectedCustomRoom.isPasswordProtected && '🔒'}
                    </span>
                  ) : selectedMatch.id === 'global-all-chat' ? (
                    <span className="text-amber-300 flex items-center gap-1.5 truncate">
                      <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                      📢 [토큰 메인 로비 전체 톡방] (전체 1,420명 라이브 대화중)
                    </span>
                  ) : selectedMatch.id.startsWith('category-') ? (
                    <span className="text-amber-300 flex items-center gap-1.5 truncate">
                      <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                      {selectedMatch.homeTeam.name}
                    </span>
                  ) : (
                    <span className="truncate">[{selectedMatch.betmanMatchNo > 0 ? `${selectedMatch.betmanMatchNo}번 경기` : '대화방'}] {selectedMatch.homeTeam.name}</span>
                  )}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Hub Notification Settings Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  const nextMap: Record<'sound' | 'browser' | 'none', 'sound' | 'browser' | 'none'> = {
                    sound: 'browser',
                    browser: 'none',
                    none: 'sound'
                  };
                  const next = nextMap[hubNotificationSettings];
                  setHubNotificationSettings(next);
                  if (next === 'browser') {
                    if ('Notification' in window) {
                      Notification.requestPermission().then(perm => {
                        if (perm !== 'granted') {
                          alert('브라우저 바탕화면 알림 권한이 필요합니다. 크롬/사파리 설정에서 알림을 허용해주세요!');
                        } else {
                          new Notification('🔔 토큰 실시간 전체 톡방 알림 활성화!', {
                            body: '선택한 톡방에 새로운 메시지가 오면 데스크톱 화면에 알림이 표시됩니다.',
                            tag: 'tokeon-hub-init'
                          });
                        }
                      });
                    } else {
                      alert('이 브라우저는 바탕화면 알림을 지원하지 않습니다.');
                    }
                  }
                }}
                className={`text-[10px] px-2.5 py-1 border rounded-lg font-black flex items-center gap-1 shadow transition-all cursor-pointer ${
                  hubNotificationSettings === 'sound'
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : hubNotificationSettings === 'browser'
                    ? 'bg-cyan-100 border-cyan-300 text-cyan-800'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="클릭하여 대화방 알림 설정을 전환합니다 (소리 🔊 -> 브라우저 🖥️ -> 알림끔 🚫)"
              >
                <span>{hubNotificationSettings === 'sound' ? '🔔 소리알림' : hubNotificationSettings === 'browser' ? '🖥️ 화면알림' : '🚫 알림차단'}</span>
              </button>

              {!selectedCustomRoom && selectedMatch.betmanMatchNo > 0 && (
                <button
                  type="button"
                  onClick={() => onOpenMatchDetail(selectedMatch)}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-[10px] font-black shadow transition-all cursor-pointer shrink-0"
                >
                  📊 팩트 상세
                </button>
              )}
            </div>
          </div>

          {/* 📌📌📌 CHAT MESSAGES INNER SCROLL BOX (초고밀도 마이크로 스트림 대화 카드) */}
          <div 
            ref={chatScrollContainerRef}
            className="flex-1 px-3 py-2.5 overflow-y-auto space-y-1.5 bg-slate-950/90 min-h-0 custom-scrollbar"
          >
            {currentMatchChats.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2 text-xs sm:text-sm group">
                {/* Micro Avatar Icon */}
                <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center shrink-0 text-xs shadow-md mt-0.5 group-hover:scale-105 transition-transform">
                  {msg.senderAvatar}
                </div>

                <div className="flex flex-col min-w-0 max-w-[92%] sm:max-w-[85%]">
                  {/* Ultra-Slim Inline Header */}
                  <div className="flex items-center gap-1.5 leading-none mb-0.5">
                    <span className="font-black text-amber-300 text-[11px] truncate">{msg.senderName}</span>
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-black ${
                      msg.isVvip ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {msg.senderTier}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">{msg.timeStr}</span>
                  </div>

                  {/* 📌 HIGH-CONTRAST NEON CHAT BUBBLE */}
                  <div className="bg-slate-900/95 py-1.5 px-3 rounded-xl border border-slate-700/90 text-white text-xs sm:text-sm font-bold leading-snug tracking-normal shadow-sm inline-block w-fit group-hover:border-slate-600 transition-colors">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 📌 ULTRA-SLIM CHAT INPUT BAR WITH NEON GLOW RING */}
          <form onSubmit={handleSendChatMessage} className="p-2 sm:p-2.5 bg-slate-950 border-t-2 border-amber-500/50 flex items-center gap-2 shrink-0 shadow-lg">
            <input
              type="text"
              required
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              placeholder={`[${selectedMatch.homeTeam.name}] 메시지 입력 (100% 선명 표출)...`}
              className="flex-1 bg-slate-900 border-2 border-amber-400/80 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-amber-200 font-black placeholder-slate-500 outline-none shadow-inner transition-all"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 rounded-xl font-black text-xs shadow-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer border border-yellow-200 hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              <span>전송</span>
            </button>
          </form>

        </div>

      </div>

      {/* 👑 MODAL 1: CREATE VVIP CUSTOM ROOM WITH TITLE & PASSWORD */}
      {isCreateVvipRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">👑 VVIP 커스텀 비밀방 만들기</h3>
              </div>
              <button onClick={() => setIsCreateVvipRoomModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVvipRoomSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">방 제목 (방제 설정):</label>
                <input
                  type="text"
                  required
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="예: [비밀방] 1번 경기 라팍 바람 & 메이저리그 팩트 수치방"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">연관 경기 선택:</label>
                <select
                  value={newRoomAttachedMatchNo}
                  onChange={(e) => setNewRoomAttachedMatchNo(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-amber-300 font-bold outline-none"
                >
                  <option value={0}>📢 전체 회차 대화방</option>
                  {matches.map(m => (
                    <option key={m.id} value={m.betmanMatchNo}>
                      {m.betmanMatchNo}번 경기 ({m.homeTeam.name} vs {m.awayTeam.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Password Toggle Switch */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-400" /> 비밀번호 설정 (비밀방)
                  </span>
                  <input
                    type="checkbox"
                    checked={newRoomIsPassword}
                    onChange={(e) => setNewRoomIsPassword(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                {newRoomIsPassword && (
                  <div className="pt-2 border-t border-slate-900 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-medium">숫자/문자 비밀번호 입력:</span>
                    <input
                      type="password"
                      required={newRoomIsPassword}
                      value={newRoomPassword}
                      onChange={(e) => setNewRoomPassword(e.target.value)}
                      placeholder="비밀번호 입력 (예: 7777)"
                      className="w-full bg-slate-900 border border-amber-500/50 rounded-lg px-3 py-2 text-white font-mono outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">최대 정원:</label>
                <select
                  value={newRoomMaxMembers}
                  onChange={(e) => setNewRoomMaxMembers(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
                >
                  <option value={30}>30명 제한</option>
                  <option value={50}>50명 제한</option>
                  <option value={100}>100명 제한 (기본)</option>
                  <option value={300}>300명 대형방</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                👑 VVIP 커스텀 방 개설하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔐 MODAL 2: ENTER PASSWORD FOR PROTECTED ROOM */}
      {passwordPromptRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">🔐 VVIP 비밀방 비밀번호 입력</h3>
              </div>
              <button onClick={() => setPasswordPromptRoom(null)} className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <p className="text-amber-300 font-bold text-[11px] leading-relaxed">
                [{passwordPromptRoom.roomTitle}] 방장이 비밀번호를 설정한 비밀방입니다.
              </p>

              {passwordErrorMsg && (
                <div className="p-2 bg-rose-950 text-rose-300 rounded-lg border border-rose-500 text-[10px] font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              <input
                type="password"
                required
                autoFocus
                value={inputPasswordAttempt}
                onChange={(e) => setInputPasswordAttempt(e.target.value)}
                placeholder="비밀번호 입력 (예: 7777)"
                className="w-full bg-slate-950 border border-amber-500/60 rounded-xl px-3.5 py-2.5 text-white font-mono text-center font-black text-sm outline-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                🔐 비밀번호 확인 & 입장하기
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
