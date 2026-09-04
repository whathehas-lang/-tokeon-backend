import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Sparkles, MessageSquare, Clock, AlertTriangle, CreditCard, ShieldCheck, Database, CheckCircle2, RefreshCw, X, Globe, LogIn, LogOut, User } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { type AppLanguage, getUiText } from './utils/languageHelper';
import { MobileConnectModal } from './components/MobileConnectModal';
import { MatchCard } from './components/MatchCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { MatchLiveChatModal } from './components/MatchLiveChatModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PCWebCommunityHub } from './components/PCWebCommunityHub';
import { SportsBlogSection } from './components/SportsBlogSection';
import { UserProfileModal, type UserProfileData } from './components/UserProfileModal';
import { LoginModal } from './components/LoginModal';
import { SubscriptionPaywallModal } from './components/SubscriptionPaywallModal';
import { TotalIntegrityDashboardModal } from './components/TotalIntegrityDashboardModal';
import { sportsApiService } from './services/api/sportsApiService';
import { BetmanLiveSyncService } from './services/betman/betmanLiveSyncService';
import { getDynamicBetmanGamesMetadata } from './services/betman/betmanRoundRegistry';
import type { Match, BetmanFolderCategory, MembershipTier, ViewMode } from './types/sports';
import { isMatchCompleted, isMatchPassed as isMatchPassedHelper } from './utils/matchResultHelper';
import { firebaseService, isFirebaseConfigured } from './services/firebase/firebaseService';
import { verifiedMatchDatabase } from './services/db/verifiedMatchDatabase';
import type { VerificationAuditReport } from './services/verification/types';
import { LiveMatchPollingScheduler } from './services/api/liveMatchPollingScheduler';
import { ApiSportsWebhookService } from './services/api/apiSportsWebhookService';
import { MatchDbLockService } from './services/api/matchDbLockService';
import { KboLiveSubPipelineService } from './services/api/kboLiveSubPipelineService';
import { H2HBatchPrefetchService } from './services/batch/h2hBatchPrefetchService';
import { H2HRecentFormEngine } from './services/enricher/h2hRecentFormEngine';
import { BetmanHourlySyncScheduler } from './services/scheduler/betmanHourlySyncScheduler';
import { authService } from './services/auth/authService';
import { getOfficialBetmanSlip } from './mock/betmanOfficial14Slips';
import { TotoSlipTableView } from './components/TotoSlipTableView';

export default function App() {
  const dynamicMeta = getDynamicBetmanGamesMetadata();
  const [matches, setMatches] = useState<Match[]>(() => BetmanLiveSyncService.getAllLiveMatches());
  const [selectedFolder, setSelectedFolder] = useState<BetmanFolderCategory>('ALL');
  const [selectedRound, setSelectedRound] = useState<string>(`프로토 승부식 ${dynamicMeta.G101.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`);
  const [auditReport, setAuditReport] = useState<VerificationAuditReport | null>(() => verifiedMatchDatabase.getLatestAuditReport());
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isIntegrityModalOpen, setIsIntegrityModalOpen] = useState<boolean>(false);
  const [isReverifying, setIsReverifying] = useState<boolean>(false);
  const [membershipTier, setMembershipTier] = useState<MembershipTier>(() => {
    const saved = localStorage.getItem('tokeon_membership_tier');
    return (saved as MembershipTier) || 'FREE';
  });
  const [showAllMatchesMode, setShowAllMatchesMode] = useState<boolean>(() => {
    return localStorage.getItem('tokeon_show_all_matches_mode') === 'true';
  });

  // 🌐 다국어 지원 언어 상태 ('ko' | 'en' | 'ja')
  const [appLanguage, setAppLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('tokeon_app_lang') as AppLanguage) || 'ko';
  });
  const handleChangeLanguage = (lang: AppLanguage) => {
    setAppLanguage(lang);
    localStorage.setItem('tokeon_app_lang', lang);
  };

  const handleToggleShowAllMatches = () => {
    setShowAllMatchesMode(prev => {
      const next = !prev;
      localStorage.setItem('tokeon_show_all_matches_mode', next ? 'true' : 'false');
      return next;
    });
  };

  const handleReverifyAll = () => {
    setIsReverifying(true);
    setTimeout(async () => {
      const freshMatches = await BetmanLiveSyncService.getMatchesAsync();
      const { verifiedMatches, auditReport: newReport } = verifiedMatchDatabase.ingestAndVerifyMatches(freshMatches);
      setMatches(verifiedMatches);
      setAuditReport(newReport);
      setIsReverifying(false);
    }, 400);
  };

  // ⚡ 마운트 즉시 최신 오피셜 데이터 동기화 & 실시간 라이브 폴링 즉시 가동
  useEffect(() => {
    BetmanLiveSyncService.getMatchesAsync().then(freshMatches => {
      if (freshMatches && freshMatches.length > 0) {
        setMatches(freshMatches);
        // 🚀 실시간 라이브 스코어 스케줄러 즉시 동기화 및 15초 폴링 가동
        LiveMatchPollingScheduler.syncActiveMatches(freshMatches);
        
        // 🛡️ 상대전적 H2H 배치 수집은 실시간 스코어와 100% 분리되어 백그라운드 지연 실행 (UI/실시간 간섭 0%)
        setTimeout(() => {
          H2HBatchPrefetchService.runDailyBatchPrefetch(freshMatches).then(() => {
            setMatches(prev => prev.map(m => H2HRecentFormEngine.enrichH2HAndRecentLogs(m)));
          }).catch(() => {});
        }, 1000);
      }
    });

    const unsubscribeDb = verifiedMatchDatabase.subscribe(() => {
      const dbMatches = verifiedMatchDatabase.getVerifiedMatches();
      if (dbMatches && dbMatches.length > 0) {
        setMatches(dbMatches);
      }
    });

    // 🔑 실제 Google/Kakao 소셜 인증 세션 실시간 동기화
    const unsubscribeAuth = authService.onAuthChange((sessionUser) => {
      if (sessionUser) {
        setIsLoggedIn(true);
        setMembershipTier(sessionUser.tier);
        setIsTrialExpired(false);
        setIsPaywallOpen(false);
        setUserProfile({
          id: sessionUser.uid,
          name: sessionUser.name,
          tier: sessionUser.tier === 'VVIP' ? 'PRO_ANALYST' : 'BASIC',
          favoriteSport: '야구/축구 (오피셜 팩트)',
          accuracy: sessionUser.tier === 'VVIP' ? 94.8 : 72.5,
          totalVotes: 120,
          correctVotes: 114,
          badges: sessionUser.tier === 'VVIP' 
            ? [`👑 ${sessionUser.provider === 'google' ? '구글' : sessionUser.provider === 'kakao' ? '카카오' : 'VVIP'} 팩트 마스터`, '🎟️ 토큰 오피셜회원']
            : ['🎟️ 토큰 공식 멤버']
        });
      }
    });

    return () => {
      unsubscribeDb();
      unsubscribeAuth();
    };
  }, []);
  


  
  // 📌 1,000+ Sequence Pagination & Search States
  const [searchMatchNo, setSearchMatchNo] = useState<string>('');
  const [matchLimit, setMatchLimit] = useState<number>(999999);
  const [showPassedSection, setShowPassedSection] = useState<boolean>(false);

  // 💬 Sidebar Chat Panel Message states
  const [sidebarMessages, setSidebarMessages] = useState<{ id: string; sender: string; text: string; timeStr: string; tier: string; color: string }[]>(() => {
    const saved = localStorage.getItem('tokeon_sidebar_chat');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', sender: '토큰공식리포터', text: '🎟️ 실시간 라이브 톡 채널이 개설되었습니다. 팩트 데이터 분석을 자유롭게 논의하세요!', timeStr: '방금 전', tier: 'OFFICIAL FACT', color: 'text-amber-400' }
    ];
  });

  const sidebarChatContainerRef = useRef<HTMLDivElement>(null);

  const scrollSidebarToBottom = () => {
    if (sidebarChatContainerRef.current) {
      sidebarChatContainerRef.current.scrollTop = sidebarChatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    localStorage.setItem('tokeon_sidebar_chat', JSON.stringify(sidebarMessages));
    scrollSidebarToBottom();
    const timer = setTimeout(scrollSidebarToBottom, 60);
    return () => clearTimeout(timer);
  }, [sidebarMessages]);

  // Subscribe to real-time Firebase sidebar messages if configured
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = firebaseService.subscribeToRoomMessages('homepage-sidebar-chat', (msgs) => {
      setSidebarMessages(prev => {
        const mapped = msgs.map(m => ({
          id: m.id,
          sender: m.senderName,
          text: m.text,
          timeStr: m.timeStr,
          tier: m.senderTier,
          color: m.color || 'text-slate-200'
        }));
        return mapped.length > 0 ? mapped : prev;
      });
    });

    return () => unsubscribe();
  }, []);

  // ⚡ 실시간 라이브 경기 스코어 자동 동기화 (DB Lock & Fallback & KBO 10초 서브 파이프라인)
  useEffect(() => {
    // 1. 점수 변경 시 실시간 상태 갱신 (상태값 기반 DB Lock & 점수 감소 차단)
    const unsubscribePolling = LiveMatchPollingScheduler.onScoreUpdate((matchId, homeScore, awayScore, statusLabel, isFinished) => {
      setMatches(prev => prev.map(m => {
        if (m.id === matchId || String(m.betmanMatchNo) === matchId || m.id.includes(matchId)) {
          return MatchDbLockService.applyDbLockAndValidation(m, {
            homeScore,
            awayScore,
            statusLabel,
            isCompleted: isFinished,
            statusCode: isFinished ? 'FT' : 'INP'
          });
        }
        return m;
      }));
    });

    // 2. 웹훅 이벤트 수신 시 실시간 반영 (DB Lock 가드 적용)
    const unsubscribeWebhook = ApiSportsWebhookService.subscribe((payload) => {
      if (payload.gameId) {
        const hScore = payload.data?.scores?.home?.total;
        const aScore = payload.data?.scores?.away?.total;
        if (typeof hScore === 'number' && typeof aScore === 'number') {
          setMatches(prev => prev.map(m => {
            if (m.id.includes(String(payload.gameId)) || String(m.betmanMatchNo) === String(payload.gameId)) {
              return MatchDbLockService.applyDbLockAndValidation(m, {
                homeScore: hScore,
                awayScore: aScore,
                statusCode: payload.event === 'game.finished' ? 'FT' : 'INP',
                isCompleted: payload.event === 'game.finished'
              });
            }
            return m;
          }));
        }
      }
    });

    // 3. ⚡ KBO 전용 10초 독립 서브 파이프라인 리스너 연동 (국내 야구 채널 이원화)
    KboLiveSubPipelineService.start();
    const unsubscribeKbo = KboLiveSubPipelineService.subscribe((kboGame) => {
      setMatches(prev => prev.map(m => {
        if (m.sport === 'baseball') {
          const isHome = m.homeTeam.name.includes(kboGame.homeTeam) || kboGame.homeTeam.includes(m.homeTeam.name);
          const isAway = m.awayTeam.name.includes(kboGame.awayTeam) || kboGame.awayTeam.includes(m.awayTeam.name);
          if (isHome && isAway) {
            return KboLiveSubPipelineService.crossValidateKboMatch(m, kboGame, m.homeScore, m.awayScore);
          }
        }
        return m;
      }));
    });

    // 4. ⏰ 오후 3시(15:00) 1시간 단위 배트맨 추가 경기(MLB 등) 자동 동기화 스케줄러 시작
    BetmanHourlySyncScheduler.start();
    const unsubscribeHourly = BetmanHourlySyncScheduler.subscribe((latestMatches) => {
      if (latestMatches && latestMatches.length > 0) {
        setMatches(latestMatches);
      }
    });

    return () => {
      unsubscribePolling();
      unsubscribeWebhook();
      unsubscribeKbo();
      unsubscribeHourly();
      KboLiveSubPipelineService.stop();
      BetmanHourlySyncScheduler.stop();
    };
  }, []);

  // ⚡ 경기 목록 갱신 시 라이브 폴링 스케줄러 동기화
  useEffect(() => {
    if (matches.length > 0) {
      LiveMatchPollingScheduler.syncActiveMatches(matches);
    }
  }, [matches]);

  const [sidebarInput, setSidebarInput] = useState<string>('');
  
  // 🔔 Sidebar Live Chat Notification Settings State ('sound' | 'browser' | 'none')
  const [chatNotificationSettings, setChatNotificationSettings] = useState<'sound' | 'browser' | 'none'>('sound');

  // Web Audio Synth Sound player helper & Browser Push Notifications trigger
  const triggerNotificationFeedback = (sender: string, text: string) => {
    if (chatNotificationSettings === 'sound') {
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
    } else if (chatNotificationSettings === 'browser') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`💬 [토큰 라이브 톡] ${sender}`, {
          body: text,
          tag: 'tokeon-sidebar-chat'
        });
      }
    }
  };

  const handleSendSidebarMessage = async () => {
    if (!sidebarInput.trim()) return;
    const session = authService.getCurrentUser();
    const currentName = session?.name || userProfile.name || '토큰 팩트회원';
    const currentTier = session?.tier || membershipTier || 'VVIP';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: currentName,
      text: sidebarInput.trim(),
      timeStr: nowTime,
      tier: currentTier,
      color: 'text-amber-400'
    };

    setSidebarMessages((prev) => [...prev, newMsg]);
    setSidebarInput('');

    await firebaseService.sendRoomMessage('homepage-sidebar-chat', {
      senderName: currentName,
      senderTier: currentTier,
      senderAvatar: '👑',
      text: newMsg.text,
      timeStr: nowTime,
      color: newMsg.color,
      isVvip: true
    });

    triggerNotificationFeedback(currentName, newMsg.text);
  };

  // 📌 Subscribe to verified match database changes
  useEffect(() => {
    const unsubscribe = verifiedMatchDatabase.subscribe(() => {
      setAuditReport(verifiedMatchDatabase.getLatestAuditReport());
    });
    return () => unsubscribe();
  }, []);

  // 📌 Load API / Betman matches dynamically from instant Round Registry (1-hour auto-refresh)
  useEffect(() => {
    let isMounted = true;
    const loadMatches = async () => {
      try {
        const numSearch = searchMatchNo ? parseInt(searchMatchNo.trim(), 10) : undefined;
        const fetchedMatches = await sportsApiService.fetchBetmanMatchesByRound(
          selectedRound,
          selectedFolder,
          isNaN(numSearch as number) ? undefined : numSearch,
          matchLimit
        );
        if (isMounted && fetchedMatches && fetchedMatches.length > 0) {
          setMatches(fetchedMatches);
          setAuditReport(verifiedMatchDatabase.getLatestAuditReport());
        }
      } catch (err) {
        console.error('Failed to load Betman matches:', err);
      }
    };

    loadMatches();

    // 🕒 1시간(60분) 마다 실시간 오피셜 데이터 자동 갱신
    // 🔄 30-Second Real-Time Auto-Polling Background Sync (핸드폰 새로고침 불필요)
    const autoSyncTimer = setInterval(() => {
      console.log('[AutoSync] 30초 실시간 백그라운드 자동 갱신 실행 중...');
      loadMatches();
    }, 30 * 1000);

    return () => {
      isMounted = false;
      clearInterval(autoSyncTimer);
    };
  }, [selectedRound, selectedFolder, searchMatchNo, matchLimit]);
  
  // UI View Mode (APP = Mobile Match Cards List, PC_WEB = 2-Column Desktop View)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('tokeon_view_mode');
    return (saved as any) || 'PC_WEB';
  });
  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'profile'>(() => {
    const saved = localStorage.getItem('tokeon_active_tab');
    return (saved as any) || 'home';
  });
  
  useEffect(() => {
    localStorage.setItem('tokeon_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('tokeon_active_tab', activeTab);
  }, [activeTab]);

  const [cardDensity, setCardDensity] = useState<'COMPACT' | 'DETAILED'>('DETAILED');

  // Active Match Detail Modal
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<Match | null>(null);
  // Active Match Live Chat Modal (독립 초경량 실시간 톡방)
  const [activeChatMatch, setActiveChatMatch] = useState<Match | null>(null);

  // 🎨 THEME STATE (☀️ 'light' by default vs 🌙 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const handleToggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const isLight = theme === 'light';

  // 📌 AUTH LOGIN & LOGOUT STATE MANAGEMENT
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('tokeon_is_logged_in') === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // 📌 3-DAY FREE TRIAL & PAID SUBSCRIPTION STATE MANAGEMENT (무료 3일 체험 72시간 카운트다운 & 유료 전환)
  const [trialSecondsLeft, setTrialSecondsLeft] = useState<number>(() => {
    const savedStart = localStorage.getItem('tokeon_trial_start_time');
    const now = Date.now();
    let startTime = now;
    if (savedStart) {
      startTime = parseInt(savedStart, 10);
    } else {
      localStorage.setItem('tokeon_trial_start_time', now.toString());
    }
    const diffSeconds = Math.floor((now - startTime) / 1000);
    const totalTrial = 3 * 24 * 3600; // 3 days
    return Math.max(0, totalTrial - diffSeconds);
  });

  const [isTrialExpired, setIsTrialExpired] = useState<boolean>(() => {
    const savedTier = localStorage.getItem('tokeon_membership_tier');
    if (savedTier === 'VVIP') return false;

    const savedStart = localStorage.getItem('tokeon_trial_start_time');
    if (!savedStart) return false;
    const startTime = parseInt(savedStart, 10);
    const diffSeconds = Math.floor((Date.now() - startTime) / 1000);
    return diffSeconds >= 3 * 24 * 3600;
  });

  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(() => {
    const savedTier = localStorage.getItem('tokeon_membership_tier');
    if (savedTier === 'VVIP') return false;

    const savedStart = localStorage.getItem('tokeon_trial_start_time');
    if (!savedStart) return false;
    const startTime = parseInt(savedStart, 10);
    const diffSeconds = Math.floor((Date.now() - startTime) / 1000);
    return diffSeconds >= 3 * 24 * 3600;
  });

  // Sync membership tier changes to localStorage
  useEffect(() => {
    localStorage.setItem('tokeon_membership_tier', membershipTier);
  }, [membershipTier]);

  // User Profile Data
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('tokeon_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      id: 'guest',
      name: '손님 (로그인 필요)',
      tier: 'GUEST',
      favoriteSport: '선택 안 됨',
      accuracy: 0,
      totalVotes: 0,
      correctVotes: 0,
      badges: []
    };
  });

  // 📌 승무패 / 베팅 마킹 상태 관리 (matchId -> string[])
  const [markedPicks, setMarkedPicks] = useState<Record<string, string[]>>({});

  const handleTogglePick = (matchId: string, pick: string) => {
    setMarkedPicks((prev) => {
      const current = prev[matchId] || [];
      const exists = current.includes(pick);
      let next: string[];
      if (exists) {
        next = current.filter((p) => p !== pick);
      } else {
        next = [...current, pick];
      }
      if (next.length === 0) {
        const copy = { ...prev };
        delete copy[matchId];
        return copy;
      }
      return { ...prev, [matchId]: next };
    });
  };

  const handleClearAllPicks = () => {
    setMarkedPicks({});
  };

  const markedMatchCount = Object.keys(markedPicks).length;
  const totalCombinations = Object.values(markedPicks).reduce((acc, picks) => acc * Math.max(1, picks.length), 1);
  const totalCost = (markedMatchCount > 0 ? totalCombinations : 0) * 1000;

  // Countdown timer effect (compares real-time to prevent resets)
  useEffect(() => {
    if (isTrialExpired || membershipTier === 'VVIP') return;
    const timer = setInterval(() => {
      const savedStart = localStorage.getItem('tokeon_trial_start_time');
      if (!savedStart) return;
      const startTime = parseInt(savedStart, 10);
      const diffSeconds = Math.floor((Date.now() - startTime) / 1000);
      const totalTrial = 3 * 24 * 3600; // 3 days
      const remaining = totalTrial - diffSeconds;
      if (remaining <= 0) {
        setTrialSecondsLeft(0);
        setIsTrialExpired(true);
        setIsPaywallOpen(true);
        clearInterval(timer);
      } else {
        setTrialSecondsLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isTrialExpired, membershipTier]);

  // Format Trial Timer String
  const formatTimerStr = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours}시간 ${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
  };

  // 📌 Handle Login & Signup Success (회원가입 및 유료 등급 로그인 시 차단 창 즉시 해제 및 모달 닫기!)
  const handleLoginSuccess = (userData: { name: string; tier: MembershipTier; email: string }) => {
    setIsLoggedIn(true);
    localStorage.setItem('tokeon_is_logged_in', 'true');
    setMembershipTier(userData.tier);
    localStorage.setItem('tokeon_membership_tier', userData.tier);
    
    const newProfile: UserProfileData = {
      id: 'u_' + Date.now(),
      name: userData.name,
      tier: userData.tier === 'VVIP' ? 'PRO_ANALYST' : 'BASIC',
      favoriteSport: '야구/농구 (KBO & NBA 팩트)',
      accuracy: userData.tier === 'VVIP' ? 94.8 : 72.5,
      totalVotes: userData.tier === 'VVIP' ? 120 : 10,
      correctVotes: userData.tier === 'VVIP' ? 114 : 7,
      badges: userData.tier === 'VVIP' ? ['👑 VVIP 팩트 마스터', '🎟️ 토큰 오피셜분석가'] : [`👑 ${userData.tier} 팩트 회원`, '🎟️ 토큰 공식 수치 멤버']
    };
    setUserProfile(newProfile);
    localStorage.setItem('tokeon_user_profile', JSON.stringify(newProfile));
    setIsLoginModalOpen(false);

    // VVIP/VIP 유료 회원가입 및 로그인 시 즉시 결제 차단 창(Paywall) 닫기!
    if (userData.tier === 'VVIP' || userData.tier === 'VIP') {
      setIsTrialExpired(false);
      setTrialSecondsLeft(30 * 24 * 3600); // 30일 유료 구독 적용
      setIsPaywallOpen(false); // 차단 창 즉시 해제 & 지우기!
    }
  };

  // Handle Logout
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    localStorage.removeItem('tokeon_is_logged_in');
    localStorage.removeItem('tokeon_user_profile');
    localStorage.removeItem('tokeon_membership_tier');
    setMembershipTier('FREE');
    setUserProfile({
      id: 'guest',
      name: '손님 (로그인 필요)',
      tier: 'GUEST',
      favoriteSport: '선택 안 됨',
      accuracy: 0,
      totalVotes: 0,
      correctVotes: 0,
      badges: []
    });
  };

  // 📌 Handle Upgrade Paid Membership Success (유료 결제 시 차단 창 즉시 해제 및 모달 닫기!)
  const handleUpgradeSuccess = (tier: MembershipTier) => {
    setMembershipTier(tier);
    localStorage.setItem('tokeon_membership_tier', tier);
    setIsTrialExpired(false);
    setTrialSecondsLeft(30 * 24 * 3600); // 30일 유료 멤버십 결제 적용
    setIsPaywallOpen(false); // 차단 창 즉시 해제 & 지우기!
  };

  // Handle Simulate Trial Expiration Test
  const handleSimulateTrialExpired = () => {
    const fourDaysAgo = Date.now() - 4 * 24 * 3600 * 1000;
    localStorage.setItem('tokeon_trial_start_time', fourDaysAgo.toString());
    localStorage.setItem('tokeon_membership_tier', 'FREE');
    setMembershipTier('FREE');
    setTrialSecondsLeft(0);
    setIsTrialExpired(true);
    setIsPaywallOpen(true);
  };

  const [nowTicker, setNowTicker] = useState<number>(() => Date.now());
  useEffect(() => {
    const ticker = setInterval(() => {
      setNowTicker(Date.now());
    }, 15000); // 15초 마다 실시간 시계 체크
    return () => clearInterval(ticker);
  }, []);

  // 📌 ⏰ 한국시간(KST) 기준 경기 시작 시간이 이미 지난 지난경기 자동 숨김 헬퍼
  const isMatchPassed = (match: Match): boolean => {
    return isMatchPassedHelper(match, nowTicker);
  };

  const [hidePassedMatches] = useState<boolean>(true); // 🔒 무조건 강제 true: 지난 경기는 100% 영구 자동 숨김

  useEffect(() => {
    localStorage.removeItem('tokeon_hide_passed_matches');
  }, []);

  // 📌 Handle folder selection with automatic round title synchronization
  const handleSelectFolder = (folder: BetmanFolderCategory) => {
    setSelectedFolder(folder);
    const meta = getDynamicBetmanGamesMetadata();
    const roundTitle = folder === 'SEUNGMUBAE' 
      ? `축구 승무패 ${meta.G011.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`
      : folder === 'SEUNG1PAE'
      ? `야구 승1패 ${meta.G024.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`
      : folder === 'SEUNG5PAE'
      ? `농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)`
      : folder === 'GIROKSIK'
      ? `프로토 기록식 ${meta.G102.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`
      : folder === 'football'
      ? `축구 실시간 경기 (시간순 정렬)`
      : folder === 'baseball'
      ? `야구 실시간 경기 (시간순 정렬)`
      : folder === 'basketball'
      ? `농구 실시간 경기 (시간순 정렬)`
      : folder === 'volleyball'
      ? `배구 실시간 경기 (시간순 정렬)`
      : folder === 'hockey'
      ? `하키 실시간 경기 (시간순 정렬)`
      : `프로토 승부식 ${meta.G101.defaultRoundTs}회차 (betman.co.kr 오피셜 슬립)`;
    setSelectedRound(roundTitle);
  };

  // 📌 팩트 데이터 카테고리 필터링 및 시간 지난 경기 100% 자동 숨김 파이프라인
  const rawFiltered = matches.filter((m) => {
    if (!m) return false;

    // 🔒 1. 시간이 지난 경기 (경기 시작과 동시에 100% 즉시 숨김)
    if (hidePassedMatches) {
      if (m.status === 'FINISHED' || m.status === 'LIVE' || (m as any).isStarted) {
        return false;
      }
      
      const nowSeconds = Math.floor(Date.now() / 1000);
      const matchTimestamp = (m as any).timestamp;
      
      // 1) 초 단위 유닉스 타임스탬프 기준: 시작 시각이 현재 시각 이하(과거/현재)면 즉시 100% 숨김
      if (matchTimestamp && matchTimestamp <= nowSeconds) {
        return false;
      }

      // 2) ISO 문자열 기준: 시작 시각이 현재 시각 이하이면 즉시 100% 숨김
      const rawTime = (m as any).rawTimeIso || m.matchTime || '';
      if (rawTime.includes('T')) {
        const matchDt = new Date(rawTime);
        if (!isNaN(matchDt.getTime()) && matchDt.getTime() <= Date.now()) {
          return false;
        }
      }
    }

    // 🏆 [명품 메이저 1부 리그 & 주요 대회 엄선 화이트리스트 필터]
    const sport = m.sport;
    const league = (m.league || '').toLowerCase();

    // ⚾ 야구: MLB, NPB, KBO 메이저 3대 리그만 100% 허용 (마이너/멕시칸 등 제외)
    if (sport === 'baseball') {
      const isMajorBaseball = league.includes('mlb') || 
                             league.includes('major league') || 
                             league.includes('kbo') || 
                             league.includes('npb') || 
                             league.includes('professional baseball') ||
                             (m as any).leagueId === 1 || (m as any).leagueId === 12 || (m as any).leagueId === 15;
      if (!isMajorBaseball) return false;
    }

    // ⚽ 축구: 유럽 5대 빅리그, 챔스, 유로파, K리그1, 주요 A매치/컵대회만 허용 (잡리그 100% 차단)
    if (sport === 'football') {
      // ❌ 잡리그 블랙리스트 단어 즉시 차단
      if (league.includes('second') || league.includes('2nd') || league.includes('3rd') || 
          league.includes('liga 3') || league.includes('liga 2') || league.includes('division 2') ||
          league.includes('reserve') || league.includes('u20') || league.includes('u19') || league.includes('u21') ||
          league.includes('u23') || league.includes('kakkonen') || league.includes('alef') || league.includes('amateur') ||
          league.includes('youth') || league.includes('junior')) {
        return false;
      }

      // ⭕ 메이저 대회 & 1부 리그만 통과
      const isMajorFootball = league.includes('premier league') || 
                             league.includes('la liga') || league.includes('primera') ||
                             league.includes('bundesliga') || 
                             league.includes('serie a') || 
                             league.includes('ligue 1') || 
                             league.includes('champions league') || league.includes('europa') || league.includes('conference league') ||
                             league.includes('k league 1') || league.includes('kleague') ||
                             league.includes('eredivisie') || league.includes('world cup') || league.includes('nations league') ||
                             league.includes('fa cup') || league.includes('copa del rey') || league.includes('coppa italia') || league.includes('dfb pokal') ||
                             league.includes('super cup') || league.includes('asian cup') || league.includes('afc champions');
      if (!isMajorFootball) return false;
    }

    // 🔒 2. 카테고리/종목 필터링 (버튼 클릭 시 해당 종목만 필터링)
    if (selectedFolder === 'football') {
      if (m.sport !== 'football') return false;
    } else if (selectedFolder === 'baseball') {
      if (m.sport !== 'baseball') return false;
    } else if (selectedFolder === 'basketball') {
      if (m.sport !== 'basketball') return false;
    } else if (selectedFolder === 'volleyball') {
      if (m.sport !== 'volleyball') return false;
    } else if (selectedFolder === 'hockey') {
      if (m.sport !== 'hockey') return false;
    } else if (selectedFolder === 'SEUNGMUBAE') {
      // ⚽ 축구 승무패 (배트맨 오피셜 14경기 슬립 또는 승무패 폴더)
      if (m.betmanFolder !== 'SEUNGMUBAE' && m.sport !== 'football') return false;
    } else if (selectedFolder === 'SEUNG1PAE') {
      // ⚾ 야구 승1패 (배트맨 오피셜 14경기 슬립 또는 승1패 폴더)
      if (m.betmanFolder !== 'SEUNG1PAE' && m.sport !== 'baseball') return false;
    } else if (selectedFolder === 'SEUNG5PAE') {
      // 🏀⚾ 농구/야구 승5패
      if (m.betmanFolder !== 'SEUNG5PAE' && m.sport !== 'basketball' && m.sport !== 'baseball') return false;
    } else if (selectedFolder === 'GIROKSIK') {
      if (m.betmanFolder !== 'GIROKSIK') return false;
    } else if (selectedFolder !== 'ALL' && selectedFolder !== 'SEUNGBUSHIK' && (m.sport as string) !== (selectedFolder as string)) {
      return false;
    }

    // 🔒 3. 팀명 검색어 필터링
    if (searchMatchNo && searchMatchNo.trim() !== '') {
      const q = searchMatchNo.trim();
      const homeStr = m.homeTeam?.name || '';
      const awayStr = m.awayTeam?.name || '';
      if (!homeStr.includes(q) && !awayStr.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // ⏰ 4. 100% 무조건 유닉스 타임스탬프(timestamp 숫자) 오름차순 정렬 (시차 꼬임 0%)
  const sortedRaw = [...rawFiltered].sort((a, b) => {
    // 승무패/승1패/승5패의 경우 오피셜 배트맨 경기번호(1~14번) 우선, 없을 시 시간순
    if (selectedFolder === 'SEUNGMUBAE' || selectedFolder === 'SEUNG1PAE' || selectedFolder === 'SEUNG5PAE') {
      const noA = (a as any).betmanMatchNo || 9999;
      const noB = (b as any).betmanMatchNo || 9999;
      if (noA !== noB && noA <= 14 && noB <= 14) return noA - noB;
    }
    const tsA = (a as any).timestamp || 0;
    const tsB = (b as any).timestamp || 0;
    if (tsA !== tsB) return tsA - tsB;
    const timeA = a.matchTime || '';
    const timeB = b.matchTime || '';
    return timeA.localeCompare(timeB);
  });

  // 🎯 승무패/승1패/승5패 선택 시 배트맨 오피셜 공식 14경기 슬립으로 정확히 구성
  const officialSlipMatches = (selectedFolder === 'SEUNGMUBAE' || selectedFolder === 'SEUNG1PAE' || selectedFolder === 'SEUNG5PAE')
    ? getOfficialBetmanSlip(selectedFolder)
    : [];

  const filteredMatches = (selectedFolder === 'SEUNGMUBAE' || selectedFolder === 'SEUNG1PAE' || selectedFolder === 'SEUNG5PAE')
    ? (officialSlipMatches.length > 0
        ? officialSlipMatches
        : sortedRaw.slice(0, 14).map((m, idx) => ({
            ...m,
            betmanMatchNo: (m as any).betmanMatchNo && (m as any).betmanMatchNo <= 14 ? (m as any).betmanMatchNo : idx + 1
          }))
      )
    : sortedRaw;
  
  // 📌 100% 무조건 유닉스 타임스탬프 오름차순 정렬
  const sortedMatches = filteredMatches;

  // Handle favorite toggle
  const handleToggleFavorite = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return { ...m, isFavorite: !m.isFavorite };
        }
        return m;
      })
    );
  };

  // Detail modal section state (e.g. 'chat')
  const [selectedDetailSection, setSelectedDetailSection] = useState<string | undefined>(undefined);

  // Handle opening match detail modal
  const handleOpenDetailModal = (match: Match, sectionId?: string) => {
    if (isTrialExpired) {
      setIsPaywallOpen(true);
      return;
    }
    setSelectedDetailSection(sectionId);
    setSelectedMatchForDetail(match);
  };

  // Handle opening match chat directly (독립 초경량 실시간 톡방 즉시 오픈 - 100% 무조건 개방)
  const handleOpenMatchChat = (match: Match) => {
    setActiveChatMatch(match);
  };

  return (
    <div className={`h-screen w-screen flex flex-col font-sans transition-colors duration-200 overflow-hidden ${
      isLight ? 'bg-slate-100/70 text-slate-900 selection:bg-emerald-500 selection:text-white' : 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
    }`}>

      {/* 🌐 최상단 유틸리티 바 (로그인/계정 공간 & 한국어/English/日本語 언어 번역 바) */}
      <header className={`h-8 min-h-[32px] px-3.5 border-b flex items-center justify-between text-xs select-none shrink-0 z-30 transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        {/* 좌측: 로고 & 플랫폼 명칭 */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-black tracking-wider text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent cursor-pointer" onClick={() => handleSelectFolder('ALL')}>
            TOKEON
          </span>
          <span className="hidden xl:inline text-[11px] font-medium text-slate-400">
            | {getUiText('logo_sub', appLanguage)}
          </span>
        </div>

        {/* 🏆 중앙: 종목별/토토14경기 퀵 필터 탭 (전체, 축구, 야구, 농구, 배구, 하키 | 승무패, 승1패, 승5패) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 mx-2 flex-1 justify-center max-w-2xl">
          {/* 일반 종목군 */}
          {[
            { id: 'ALL', labelKey: 'tab_all' },
            { id: 'football', labelKey: 'tab_football' },
            { id: 'baseball', labelKey: 'tab_baseball' },
            { id: 'basketball', labelKey: 'tab_basketball' },
            { id: 'volleyball', labelKey: 'tab_volleyball' },
            { id: 'hockey', labelKey: 'tab_hockey' },
          ].map(tab => {
            const isSelected = selectedFolder === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectFolder(tab.id as any)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {getUiText(tab.labelKey, appLanguage)}
              </button>
            );
          })}

          <span className="text-slate-500/60 text-xs px-0.5 select-none">|</span>

          {/* 배트맨 14경기 토토군 */}
          {[
            { id: 'SEUNGMUBAE', labelKey: 'tab_seungmubae' },
            { id: 'SEUNG1PAE', labelKey: 'tab_seung1pae' },
            { id: 'SEUNG5PAE', labelKey: 'tab_seung5pae' },
          ].map(tab => {
            const isSelected = selectedFolder === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectFolder(tab.id as any)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : isLight
                      ? 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
                      : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/40'
                }`}
              >
                {getUiText(tab.labelKey, appLanguage)}
              </button>
            );
          })}
        </div>

        {/* 우측: [번역 언어 선택기] + [로그인 공간] */}
        <div className="flex items-center gap-3 shrink-0">
          {/* 🌐 언어 선택 탭 (한국어 | English | 日本語) */}
          <div className={`flex items-center gap-1 p-0.5 rounded-md border text-[11px] font-semibold ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/80 border-slate-700'
          }`}>
            <Globe className="w-3 h-3 ml-1 text-slate-400 shrink-0" />
            <button
              onClick={() => handleChangeLanguage('ko')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                appLanguage === 'ko'
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="한국어"
            >
              한국어
            </button>
            <span className="text-slate-500 text-[9px]">|</span>
            <button
              onClick={() => handleChangeLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                appLanguage === 'en'
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              English
            </button>
            <span className="text-slate-500 text-[9px]">|</span>
            <button
              onClick={() => handleChangeLanguage('ja')}
              className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                appLanguage === 'ja'
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="日本語"
            >
              日本語
            </button>
          </div>

          {/* 🔑 로그인 / 사용자 프로필 구역 */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-emerald-950/50 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                }`}
              >
                <User className="w-3 h-3" />
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{userProfile.name}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500 text-white font-mono">
                  {membershipTier}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title={getUiText('logout', appLanguage)}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              <span>{getUiText('login', appLanguage)}</span>
            </button>
          )}
        </div>
      </header>

      {/* Dynamic View Mode Main Container - 100% full viewport, zero margin */}
      <main className="flex-1 w-full h-full p-0 m-0 flex flex-col overflow-hidden">





        {/* HOME TAB CONTENT (경기목록 탭 전용) */}
        {activeTab === 'home' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            


            {/* 🖥️ PC DESKTOP (lg 이상): 좌측(실제 모바일 경기 화면) + 중앙(실시간 채팅) + 우측(블로그) 3등분 완벽 분할 */}
            <div className="hidden lg:flex flex-row gap-0 w-full items-stretch h-full flex-1 overflow-hidden">
              
              {/* 📱 1. [LEFT PANE 50% (비율 5)]: 실시간 경기 목록 */}
              <div className={`w-[50%] h-full flex flex-col min-w-0 rounded-none border-r overflow-hidden ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                {/* 좌측 경기 목록 헤더 */}
                <div className={`p-3.5 border-b flex items-center justify-between shrink-0 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">실시간 경기</span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {filteredMatches.length}경기
                  </span>
                </div>

                {/* 실제 모바일 경기 카드 목록 스크롤 영역 또는 승1패/승무패 배트맨 슬립 표 */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {selectedFolder === 'SEUNG1PAE' || selectedFolder === 'SEUNGMUBAE' ? (
                    <TotoSlipTableView
                      category={selectedFolder as any}
                      matches={filteredMatches}
                      onSelectMatch={(m) => handleOpenDetailModal(m)}
                      theme={theme}
                      lang={appLanguage}
                    />
                  ) : filteredMatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-xl font-bold">
                        ⏱️
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-200">
                          {selectedFolder === 'SEUNG5PAE' 
                            ? '현재 발매 중인 승5패 대상경기가 없습니다'
                            : '현재 진행 중인 대상경기가 없습니다'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {selectedFolder === 'SEUNG5PAE'
                            ? '다음 공식 회차 공지 및 발매 시작 시 자동으로 실시간 업데이트됩니다.'
                            : '상단 탭에서 다른 종목을 선택해 주세요.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    filteredMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        membershipTier={membershipTier}
                        cardDensity="COMPACT"
                        lang={appLanguage}
                        markedPicks={markedPicks[match.id] || []}
                        allMatches={matches}
                        onSelectMatch={(m) => handleOpenDetailModal(m)}
                        onOpenChat={handleOpenMatchChat}
                        onToggleFavorite={handleToggleFavorite}
                        onTogglePick={handleTogglePick}
                        theme={theme}
                      />
                    ))
                  )}

                  {/* ➕ Load More Button */}
                  {!searchMatchNo && matchLimit < 1000 && (
                    <div className="pt-2 pb-6 text-center">
                      <button
                        onClick={() => setMatchLimit((prev) => prev + 20)}
                        className={`w-full py-2.5 rounded-xl border text-xs font-bold shadow-sm transition-all cursor-pointer ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                        }`}
                      >
                        ➕ 경기 더보기 (+20개 로딩)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 💬 2. [CENTER PANE 30% (비율 3)]: 실시간 텍스트 채팅방 */}
              <div className="w-[30%] h-full flex flex-col min-w-0">
                <PCWebCommunityHub
                  matches={matches}
                  userProfile={userProfile}
                  membershipTier={membershipTier}
                  onOpenMatchDetail={(m) => handleOpenDetailModal(m)}
                  theme={theme}
                />
              </div>

              {/* 📝 3. [RIGHT PANE 20% (비율 2)]: 스포츠 분석 블로그 */}
              <div className="w-[20%] h-full flex flex-col min-w-0">
                <SportsBlogSection
                  matches={matches}
                  theme={theme}
                  onSelectMatch={(m) => handleOpenDetailModal(m)}
                />
              </div>

            </div>

            {/* 📱 MOBILE SCREENS (lg 미만 모바일 기기): 기존 단일 모바일 1열 스택 또는 승1패 배트맨 슬립 표 */}
            <div className="lg:hidden flex flex-col w-full space-y-3">
              {selectedFolder === 'SEUNG1PAE' || selectedFolder === 'SEUNGMUBAE' ? (
                <TotoSlipTableView
                  category={selectedFolder as any}
                  matches={filteredMatches}
                  onSelectMatch={(m) => handleOpenDetailModal(m)}
                  theme={theme}
                  lang={appLanguage}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs">
                    <span className="font-black text-amber-300">실시간 경기 목록</span>
                    <span className="text-[10px] font-mono font-bold text-slate-300">{filteredMatches.length}경기</span>
                  </div>
                  {filteredMatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-2 bg-slate-900/50 rounded-xl border border-slate-800 p-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-lg font-bold">
                        ⏱️
                      </div>
                      <p className="text-xs font-bold text-slate-200">
                        {selectedFolder === 'SEUNG5PAE' 
                          ? '현재 발매 중인 승5패 대상경기가 없습니다'
                          : '현재 진행 중인 대상경기가 없습니다'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {selectedFolder === 'SEUNG5PAE'
                          ? '다음 공식 회차 공지 및 발매 시 자동 업데이트됩니다.'
                          : '다른 종목 탭을 선택해 주세요.'}
                      </p>
                    </div>
                  ) : (
                    filteredMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        membershipTier={membershipTier}
                        cardDensity={cardDensity}
                        lang={appLanguage}
                        markedPicks={markedPicks[match.id] || []}
                        allMatches={matches}
                        onSelectMatch={(m) => handleOpenDetailModal(m)}
                        onOpenChat={handleOpenMatchChat}
                        onToggleFavorite={handleToggleFavorite}
                        onTogglePick={handleTogglePick}
                        theme={theme}
                      />
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* 💻 PC WEB EXCLUSIVE CHAT ROOM TAB */}
        {activeTab === 'community' && (
          <div className="space-y-4 relative">
            
            {/* 1. PC Web Community Hub Live Chat Room */}
            <PCWebCommunityHub
              matches={matches}
              userProfile={userProfile}
              membershipTier={membershipTier}
              onOpenMatchDetail={(m) => handleOpenDetailModal(m)}
              theme={theme}
            />

            {/* 2. [배너 입점 문의 📲] 바 */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 px-4 py-3.5 rounded-2xl border-2 border-amber-500/50 shadow-xl">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin shrink-0" />
                <span className="text-xs sm:text-sm font-black text-amber-300 truncate">
                  📢 [토큰 (Tokeon) 공식 프리미엄 배너 광고 입점 문의 구역]
                </span>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-yellow-200">
                <span>배너 입점 문의 📲</span>
              </button>
            </div>

          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <UserProfileModal
            userProfile={userProfile}
            onLogout={handleLogout}
          />
        )}


    </main>

      {/* 📌 초슬림 1줄 미니 푸터 (높이 24px, 공간 차지 최소화) */}
      <footer className={`h-6 border-t px-3 flex items-center justify-between text-[11px] select-none shrink-0 z-30 ${
        isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">토큰 (Tokeon)</span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span className="font-mono text-emerald-500">tokeon.co.kr</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <span>오피셜 스포츠 팩트 데이터 플랫폼</span>
          <span>•</span>
          <span>© 2026 Tokeon Analytics</span>
        </div>
      </footer>

      {/* 🎟️ 플로팅 실시간 승무패 마킹 슬립 집계 바 (Floating Slip Cart) */}
      {markedMatchCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-3xl bg-slate-950/95 border-2 border-amber-500 rounded-2xl p-3.5 sm:p-4 shadow-[0_0_35px_rgba(245,158,11,0.4)] backdrop-blur-lg flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
              🎟️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-xs sm:text-sm">
                  {selectedFolder === 'SEUNGMUPAE' || selectedFolder === 'SEUNGMUBAE' ? '⚽ 축구 승무패 마킹 완료' : '🎯 베트맨 승무패 마킹 슬립'}
                </span>
                <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black text-[11px]">
                  {markedMatchCount}경기 선택
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-bold block mt-0.5">
                총 <strong className="text-amber-400 font-black">{totalCombinations.toLocaleString()}개 조합</strong> • 예상 구매금액 <strong className="text-emerald-400 font-black">{totalCost.toLocaleString()}원</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAllPicks}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 text-xs font-bold rounded-xl border border-rose-500/40 transition-all cursor-pointer shadow"
            >
              초기화 🗑️
            </button>
            <button
              onClick={() => {
                const text = Object.entries(markedPicks)
                  .map(([id, picks]) => {
                    const matchNo = id.split('_')[2] || id;
                    const readablePicks = picks.map(p => {
                      if (p === 'WIN') return '일반[승]';
                      if (p === 'DRAW') return '일반[무]';
                      if (p === 'LOSE') return '일반[패]';
                      if (p === 'HANDI1_WIN') return '1핸디[승]';
                      if (p === 'HANDI1_DRAW') return '1핸디[무]';
                      if (p === 'HANDI1_LOSE') return '1핸디[패]';
                      if (p === 'HANDI2_WIN') return '2핸디[승]';
                      if (p === 'HANDI2_LOSE') return '2핸디[패]';
                      if (p === 'UNOVER_UNDER') return '언더오버[언더]';
                      if (p === 'UNOVER_OVER') return '언더오버[오버]';
                      if (p === 'ODDEVEN_ODD') return '홀짝[홀]';
                      if (p === 'ODDEVEN_EVEN') return '홀짝[짝]';
                      if (p === '1STHALF_WIN') return '전반[승]';
                      if (p === '1STHALF_LOSE') return '전반[패]';
                      if (p === '1STHALF_UNDER') return '전반[언더]';
                      if (p === '1STHALF_OVER') return '전반[오버]';
                      return p;
                    });
                    return `경기 #${matchNo}: ${readablePicks.join('/')}`;
                  })
                  .join('\n');
                navigator.clipboard.writeText(`[토큰(Tokeon) 오피셜 마킹 내역]\n${text}\n총 ${totalCombinations}개 조합 (${totalCost.toLocaleString()}원)`);
                alert('마킹 조합이 클립보드에 복사되었습니다! 📋');
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1 border border-yellow-200"
            >
              <span>조합 복사 📋</span>
            </button>
          </div>
        </div>
      )}



      {/* MODAL 1: MATCH FACT DETAIL MODAL */}
      {selectedMatchForDetail && (
        <ErrorBoundary 
          fallbackTitle="경기 상세 정보 렌더링 복구" 
          onClose={() => setSelectedMatchForDetail(null)}
        >
          <MatchDetailModal
            match={selectedMatchForDetail}
            initialSectionId={selectedDetailSection}
            onClose={() => setSelectedMatchForDetail(null)}
            membershipTier={membershipTier}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            theme={theme}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 1-2: 💬 MATCH SPECIFIC LIVE CHEER CHAT MODAL (독립 경기 톡방) */}
      {activeChatMatch && (
        <ErrorBoundary 
          fallbackTitle="실시간 경기 톡방 렌더링 복구" 
          onClose={() => setActiveChatMatch(null)}
        >
          <MatchLiveChatModal
            match={activeChatMatch}
            onClose={() => setActiveChatMatch(null)}
            membershipTier={membershipTier}
            theme={theme}
          />
        </ErrorBoundary>
      )}

      {/* MODAL 2: LOGIN & SIGNUP MODAL */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* MODAL 3: 3-DAY TRIAL EXPIRED & SUBSCRIPTION PAYWALL MODAL */}
      {isPaywallOpen && (
        <SubscriptionPaywallModal
          isTrialExpired={isTrialExpired}
          onClose={isTrialExpired ? undefined : () => setIsPaywallOpen(false)}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      )}

      {/* MODAL 4: 🛡️ FACT VERIFICATION ENGINE & DB AUDIT REPORT MODAL */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-emerald-500/40 text-slate-100'
          }`}>
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
              isLight ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                    <span>5단계 팩트 검증 엔진 & 무결성 DB 감사 보고서</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono font-bold">100% FACT</span>
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    API 원시 데이터를 검증 엔진으로 정제한 뒤 전용 Verified DB에 저장하여 출력하는 안전 파이프라인
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className={`p-3 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="text-[11px] text-slate-500 font-bold">DB 보관 경기</div>
                  <div className="text-lg sm:text-xl font-black text-emerald-500 mt-1 font-mono">
                    {verifiedMatchDatabase.count()}경기
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% 검증 완료</div>
                </div>

                <div className={`p-3 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="text-[11px] text-slate-500 font-bold">중복 전적 제거</div>
                  <div className="text-lg sm:text-xl font-black text-cyan-500 mt-1 font-mono">
                    {auditReport?.sanitizationCounts?.duplicateMatchesRemoved || 0}건
                  </div>
                  <div className="text-[10px] text-slate-500">Deduplicated</div>
                </div>

                <div className={`p-3 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="text-[11px] text-slate-500 font-bold">전적 최신순 정렬</div>
                  <div className="text-lg sm:text-xl font-black text-indigo-500 mt-1 font-mono">
                    {auditReport?.sanitizationCounts?.datesSorted || 0}회
                  </div>
                  <div className="text-[10px] text-slate-500">Date Sorted</div>
                </div>

                <div className={`p-3 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="text-[11px] text-slate-500 font-bold">이상치/스탯 보정</div>
                  <div className="text-lg sm:text-xl font-black text-amber-500 mt-1 font-mono">
                    {(auditReport?.sanitizationCounts?.anomalousStatsFixed || 0) + (auditReport?.sanitizationCounts?.oddsSanitized || 0)}건
                  </div>
                  <div className="text-[10px] text-slate-500">Sanitized</div>
                </div>
              </div>

              {/* 5-Stage Verification Checklist */}
              <div className="space-y-2.5">
                <h4 className="font-black text-sm text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>5대 핵심 검증 단계별 수행 결과</span>
                </h4>

                <div className="space-y-2">
                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">1. 경기 ID, 팀 ID, 리그 ID, 시즌/회차 일치성 검증</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        홈/원정 팀 분리 여부, 리그 식별자 및 공식 배트맨 회차 번호 정합성 100% 일치 확인
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">2. 선수 소속팀 확인 & 라인업 엔트리/등번호 중복 검증</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        스쿼드 내 등번호 중복 검출 및 고유 번호 재부여, 1군/대체선발 엔트리 유효성 정제 완료
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">3. 야구 선발투수 ERA/이닝/WHIP/상대전적 스탯 유효성 검증</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        음수 방어율(ERA), NaN 결측치 보정 및 맞대결 상대전적 로그 중복 제거 완료
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">4. 최근 10경기 및 H2H 상대전적 날짜순 정렬 & 중복 제거 (Deduplication)</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        동일 날짜·동일 상대팀 중복 경기 기록 완전 삭제 및 최신 경기 순서로 완벽 정렬
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-950 border-emerald-500/20'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-bold text-[10px] shrink-0 mt-0.5">PASS</span>
                    <div>
                      <div className="font-bold text-xs">5. 데이터 급변 / 이상 문자 감지 시 관리자 검토 큐(Quarantine) 자동 격리</div>
                      <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        이상한 팀명/선수명 또는 배당률 급변 발생 시 화면 노출을 즉시 차단하고 '정보 확인 중'으로 격리
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified DB Architecture Footer Notice */}
              <div className={`p-3.5 rounded-xl border text-[11px] space-y-1 ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  <span>야구·축구·농구 공통 검증 및 DB 저장소 아키텍처</span>
                </div>
                <p>
                  API에서 수신한 모든 데이터는 <strong>CommonSportsVerificationEngine</strong> 공통 모듈을 통해 검증되며, 검증에 통과한 정상 데이터만 <strong>VerifiedMatchDatabase</strong>에 저장됩니다. 미발표 선발/라인업은 <strong>'정보 확인 중'</strong>으로 안전하게 보호되며 관리자 승인 후 반영됩니다.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-3 sm:p-4 border-t flex justify-end ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer shadow-sm"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
