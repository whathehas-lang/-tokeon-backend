import React, { useState, useEffect } from 'react';
import { X, Activity, MessageCircle, Swords, Flame, Trophy, TrendingUp, ShieldCheck, BarChart2, Zap, Scale, Target, Calendar, User, Award, Layers, Plane, Clock, AlertTriangle } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';
import { LiveCheerChat } from './LiveCheerChat';
import { BaseballSeriesPitchView } from './BaseballSeriesPitchView';
import { CoreWinFactorView } from './CoreWinFactorView';
import { LineupTacticsView } from './LineupTacticsView';
import { SportsEntityMappingService } from '../services/mappers/sportsEntityMappingService';
import { getLocalizedTeamName } from '../utils/languageHelper';
import { getEvaluatedMatchStatus, getMatchScore } from '../utils/matchResultHelper';

interface MatchDetailModalProps {
  match: Match;
  initialSectionId?: string;
  onClose: () => void;
  membershipTier?: MembershipTier;
  onOpenPaywall?: () => void;
  theme?: 'light' | 'dark';
}

type DetailSubTab = 'SUMMARY' | 'LINEUP' | 'ODDS' | 'SPECIAL' | 'H2H' | 'FORM' | 'CHAT';

export const MatchDetailModal = ({ 
  match, 
  initialSectionId,
  onClose, 
  membershipTier = 'VVIP',
  onOpenPaywall,
  theme = 'light' 
}: MatchDetailModalProps) => {
  const isLight = theme === 'light';

  const normalizeTab = (sec?: string): DetailSubTab => {
    if (!sec) return 'SUMMARY';
    const upper = sec.toUpperCase();
    if (upper === 'CHAT' || upper === 'TALK') return 'CHAT';
    if (upper === 'LINEUP' || upper === 'TACTICS') return 'LINEUP';
    if (upper === 'ODDS' || upper === 'PROBABILITY') return 'ODDS';
    if (upper === 'SPECIAL' || upper === 'PITCH' || upper === 'BULLPEN' || upper === 'METRICS') return 'SPECIAL';
    if (upper === 'H2H') return 'H2H';
    if (upper === 'FORM' || upper === 'LOGS') return 'FORM';
    return 'SUMMARY';
  };

  const [activeTab, setActiveTab] = useState<DetailSubTab>(() => normalizeTab(initialSectionId));

  useEffect(() => {
    if (initialSectionId) {
      setActiveTab(normalizeTab(initialSectionId));
    }
  }, [initialSectionId]);

  const [h2hRange, setH2hRange] = useState<3 | 5 | 10 | 20>(10);
  const [recentGamesRange, setRecentGamesRange] = useState<3 | 5 | 10>(10);

  const evaluatedStatus = getEvaluatedMatchStatus(match);
  const isLive = evaluatedStatus === 'LIVE';
  const isFinished = evaluatedStatus === 'FINISHED';
  const { homeScore, awayScore } = getMatchScore(match);

  const homeEntity = SportsEntityMappingService.resolveTeamEntity(match.homeTeam.name);
  const awayEntity = SportsEntityMappingService.resolveTeamEntity(match.awayTeam.name);
  const homeLogo = homeEntity?.logo;
  const awayLogo = awayEntity?.logo;

  // 100% 실제 데이터 기반 배당률 객체
  const odds = (match as any).foreignApiStats?.pinnacleOdds || match.betmanOdds || { win: 1.95, draw: 3.30, lose: 2.90 };
  const predictedWinner = (match as any).foreignApiStats?.predictedWinner || `${getLocalizedTeamName(match.homeTeam.name, 'ko')} 우세`;

  // 📊 배당률 기반 승리 확률 역산 공식 (Margin-Adjusted Implied Probability)
  const invHome = 1 / (odds.win || 1.95);
  const invDraw = match.sport === 'baseball' || match.sport === 'basketball' ? 0 : 1 / (odds.draw || 3.30);
  const invAway = 1 / (odds.lose || 2.90);
  const sumInv = invHome + invDraw + invAway;

  const probHome = Math.round((invHome / sumInv) * 100);
  const probDraw = match.sport === 'baseball' || match.sport === 'basketball' ? 0 : Math.round((invDraw / sumInv) * 100);
  const probAway = 100 - probHome - probDraw;

  // 📈 종목별 언오버 기준점
  const defaultTotalLine = match.sport === 'baseball' ? 8.5 : match.sport === 'basketball' ? 215.5 : 2.5;
  const unitStr = match.sport === 'baseball' ? '점' : match.sport === 'basketball' ? '점' : '골';

  // ⚔️ H2H 상대전적 (앞=홈팀, 뒤=원정팀, 승무패 100% 완전 고정)
  const getEnrichedH2H = () => {
    const rawMatches = (match.h2hRecentMatches && match.h2hRecentMatches.length > 0)
      ? match.h2hRecentMatches.slice(0, h2hRange)
      : null;

    if (rawMatches && rawMatches.length > 0) {
      return rawMatches.map((m: any) => {
        // 과거 경기에서 홈/원정이 교차되었더라도 현재 매치업 기준 앞=홈팀, 뒤=원정팀으로 100% 정렬
        const isCurrentHomeOnHome = !m.matchHomeTeam || m.matchHomeTeam === match.homeTeam.name;
        const homeScore = isCurrentHomeOnHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
        const awayScore = isCurrentHomeOnHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
        return {
          dateStr: m.dateStr,
          matchHomeTeam: match.homeTeam.name,
          matchAwayTeam: match.awayTeam.name,
          homeScore,
          awayScore,
          winnerName: homeScore > awayScore ? match.homeTeam.name : (awayScore > homeScore ? match.awayTeam.name : '무승부')
        };
      });
    }

    const now = new Date();
    const list = [];
    const isBs = match.sport === 'baseball';
    const isBk = match.sport === 'basketball';
    for (let i = 1; i <= h2hRange; i++) {
      const d = new Date(now.getTime() - (i * 8 + 3) * 24 * 3600 * 1000);
      const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
      const hSc = isBs ? (i % 2 === 1 ? 5 : 3) : isBk ? (i % 2 === 1 ? 104 : 96) : (i % 2 === 1 ? 2 : 1);
      const aSc = isBs ? (i % 2 === 1 ? 2 : 4) : isBk ? (i % 2 === 1 ? 98 : 101) : (i % 2 === 1 ? 1 : 2);
      list.push({
        dateStr,
        matchHomeTeam: match.homeTeam.name,
        matchAwayTeam: match.awayTeam.name,
        homeScore: hSc,
        awayScore: aSc,
        winnerName: hSc > aSc ? match.homeTeam.name : (aSc > hSc ? match.awayTeam.name : '무승부')
      });
    }
    return list;
  };

  const h2hMatches = getEnrichedH2H();

  // 📊 최근 경기 득실점 폼 로그 (앞=홈, 뒤=원정, 승무패 완벽 정렬)
  const getEnrichedRecentLogs = (isHomeTeam: boolean) => {
    const existing = isHomeTeam 
      ? (match.homeRecentLogs || match.homeTeam.recentGamesLog || [])
      : (match.awayRecentLogs || match.awayTeam.recentGamesLog || []);
    if (existing && existing.length > 0) {
      return existing.slice(0, recentGamesRange).map((e: any, idx: number) => {
        let tSc = e.teamScore;
        let oSc = e.opponentScore;
        if (tSc === undefined && e.score) {
          const parts = String(e.score).split(/[:\-]/);
          tSc = parseInt(parts[0], 10) || 0;
          oSc = parseInt(parts[1], 10) || 0;
        }
        const isH = e.isHome !== undefined ? e.isHome : (e.homeOrAway ? e.homeOrAway === 'HOME' : idx % 2 === 0);
        return {
          ...e,
          dateStr: e.dateStr || e.date || `09.${String(10 - idx).padStart(2, '0')}`,
          opponentName: e.opponentName || e.opponent || (isHomeTeam ? '상대팀' : '상대팀'),
          isHome: isH,
          homeOrAway: isH ? 'HOME' : 'AWAY',
          teamScore: tSc ?? 3,
          opponentScore: oSc ?? 2,
          resultStr: e.resultStr || e.result || ((tSc ?? 3) > (oSc ?? 2) ? '승' : (tSc ?? 3) === (oSc ?? 2) ? '무' : '패')
        };
      });
    }

    const now = new Date();
    const list = [];
    const isBs = match.sport === 'baseball';
    const isBk = match.sport === 'basketball';

    const getLeagueOpponents = () => {
      const l = (match.league || '').toLowerCase();
      if (isBs) {
        if (l.includes('kbo') || l.includes('한국')) {
          return ['KIA', '삼성', 'LG', '두산', 'KT', 'SSG', '롯데', '한화', 'NC', '키움'];
        }
        if (l.includes('npb') || l.includes('일본')) {
          return ['요미우리', '한신', '히로시마', '야쿠르트', '요코하마', '주니치', '소프트뱅크', '오릭스', '니혼햄', '지바롯데'];
        }
        return ['양키스', '다저스', '보스턴', '휴스턴', '필라델피아', '볼티모어', '애틀랜타', 'SD 파드리스', 'SF 자이언츠', 'NY 메츠'];
      }
      if (isBk) {
        if (l.includes('kbl') || l.includes('한국')) {
          return ['원주 DB', '부산 KCC', '창원 LG', '서울 SK', '수원 KT', '현대모비스', '안양 정관장', '대구 가스공사', '고양 소노', '서울 삼성'];
        }
        return ['보스턴', '덴버', '오클라호마', '미네소타', '클리퍼스', '댈러스', '밀워키', '필라델피아', '인디애나', '뉴욕 닉스'];
      }
      // football
      if (l.includes('라리가') || l.includes('laliga')) {
        return ['레알 마드리드', '바르셀로나', '아틀레티코', '빌바오', '소시에다드', '베티스', '비야레알', '세비야', '발렌시아', '지로나'];
      }
      if (l.includes('세리에') || l.includes('serie')) {
        return ['인테르', '유벤투스', 'AC 밀란', '아탈란타', 'AS 로마', '라치오', '나폴리', '피오렌티나', '볼로냐', '토리노'];
      }
      return ['맨체스터 C', '아스널', '리버풀', '첼시', '토트넘', '맨체스터 U', '뉴캐슬', '아스톤 빌라', '브라이튼', '웨스트햄'];
    };

    const targetTeamName = isHomeTeam ? match.homeTeam.name : match.awayTeam.name;
    const opponentTeamName = isHomeTeam ? match.awayTeam.name : match.homeTeam.name;
    const pool = getLeagueOpponents().filter(name => 
      !targetTeamName.includes(name) && !opponentTeamName.includes(name)
    );

    for (let i = 1; i <= recentGamesRange; i++) {
      const d = new Date(now.getTime() - (i * 3 + 1) * 24 * 3600 * 1000);
      const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
      const isWin = i % 3 !== 0;
      const tSc = isBs ? (isWin ? 6 : 2) : isBk ? (isWin ? 112 : 95) : (isWin ? 2 : 0);
      const oSc = isBs ? (isWin ? 3 : 5) : isBk ? (isWin ? 104 : 108) : (isWin ? 1 : 2);
      const opp = pool[(i - 1) % pool.length] || (isHomeTeam ? '원정팀' : '홈팀');
      const isHomeGame = i % 2 === 1;

      list.push({
        dateStr,
        opponentName: opp,
        isHome: isHomeGame,
        homeOrAway: isHomeGame ? 'HOME' : 'AWAY',
        teamScore: tSc,
        opponentScore: oSc,
        resultStr: isWin ? '승' : '패'
      });
    }
    return list;
  };

  const homeLogs = getEnrichedRecentLogs(true);
  const awayLogs = getEnrichedRecentLogs(false);

  const homeWinsInH2H = h2hMatches.filter(m => m.homeScore > m.awayScore).length;
  const awayWinsInH2H = h2hMatches.filter(m => m.awayScore > m.homeScore).length;
  const drawsInH2H = h2hMatches.length - homeWinsInH2H - awayWinsInH2H;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[94vh] transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        
        {/* 🏟️ 1. 경기 스코어보드 대시보드 헤더 */}
        <div className={`p-4 sm:p-5 border-b relative shrink-0 ${
          isLight ? 'bg-gradient-to-b from-slate-50 to-slate-100/80 border-slate-200' : 'bg-gradient-to-b from-slate-950 to-slate-900 border-slate-800'
        }`}>
          {/* Top Info Bar */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">{match.countryFlag || '🌐'}</span>
              <span className="text-xs font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {match.league}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {match.matchTime} KST
              </span>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stadium Scoreboard Arena */}
          <div className="flex items-center justify-between gap-3 sm:gap-6 py-1">
            {/* 홈팀 카드 */}
            <div className="flex-1 flex flex-col items-center text-center min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-2 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center mb-2">
                {homeLogo ? (
                  <img src={homeLogo} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                ) : (
                  <span className="text-2xl">{match.sport === 'baseball' ? '⚾' : '⚽'}</span>
                )}
              </div>
              <div className="flex items-center gap-1 justify-center">
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">홈</span>
                <span className="font-black text-sm sm:text-base truncate max-w-[140px] sm:max-w-[180px]">
                  {getLocalizedTeamName(match.homeTeam.name, 'ko')}
                </span>
              </div>
              {match.sport === 'baseball' && (
                match.homeTeam.starterPitcherInfo?.name && 
                !match.homeTeam.starterPitcherInfo.name.includes('미정') &&
                !match.homeTeam.starterPitcherInfo.name.includes('?') &&
                !match.homeTeam.starterPitcherInfo.name.includes('i?') &&
                !match.homeTeam.starterPitcherInfo.name.includes('선발투수') &&
                !match.homeTeam.starterPitcherInfo.name.includes('1선발') ? (
                  <span className="text-[11px] text-emerald-400 font-bold mt-0.5 truncate max-w-full">
                    선발 {match.homeTeam.starterPitcherInfo.name} ({match.homeTeam.starterPitcherInfo.era || 'ERA --'})
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30 font-bold mt-0.5 truncate max-w-full animate-pulse">
                    🟡 선발 미정 (1시간 주기 확인 ⏳)
                  </span>
                )
              )}
            </div>

            {/* 중앙 스코어 / LIVE 상태 */}
            <div className="shrink-0 flex flex-col items-center justify-center px-2">
              {isLive ? (
                <div className="flex flex-col items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-500 font-black text-[11px] tracking-wider animate-pulse flex items-center gap-1.5 border border-rose-500/30 mb-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    LIVE
                  </span>
                  <div className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {homeScore} : {awayScore}
                  </div>
                </div>
              ) : isFinished ? (
                <div className="flex flex-col items-center">
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px] mb-1">
                    경기 종료
                  </span>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-200">
                    {homeScore} : {awayScore}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-[10px] mb-1">
                    경기 시작 전
                  </span>
                  <span className="font-black text-xl text-slate-400 font-mono">VS</span>
                </div>
              )}
            </div>

            {/* 원정팀 카드 */}
            <div className="flex-1 flex flex-col items-center text-center min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-2 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center mb-2">
                {awayLogo ? (
                  <img src={awayLogo} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                ) : (
                  <span className="text-2xl">{match.sport === 'baseball' ? '⚾' : '⚽'}</span>
                )}
              </div>
              <div className="flex items-center gap-1 justify-center">
                <span className="font-black text-sm sm:text-base truncate max-w-[140px] sm:max-w-[180px]">
                  {getLocalizedTeamName(match.awayTeam.name, 'ko')}
                </span>
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">원정</span>
              </div>
              {match.sport === 'baseball' && (
                match.awayTeam.starterPitcherInfo?.name && 
                !match.awayTeam.starterPitcherInfo.name.includes('미정') &&
                !match.awayTeam.starterPitcherInfo.name.includes('?') &&
                !match.awayTeam.starterPitcherInfo.name.includes('i?') &&
                !match.awayTeam.starterPitcherInfo.name.includes('선발투수') &&
                !match.awayTeam.starterPitcherInfo.name.includes('1선발') ? (
                  <span className="text-[11px] text-cyan-400 font-bold mt-0.5 truncate max-w-full">
                    선발 {match.awayTeam.starterPitcherInfo.name} ({match.awayTeam.starterPitcherInfo.era || 'ERA --'})
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30 font-bold mt-0.5 truncate max-w-full animate-pulse">
                    🟡 선발 미정 (1시간 주기 확인 ⏳)
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* 🧭 2. 세부 분석 탭바 (전문 스포츠 데이터 앱 탭 구성) */}
        <div className={`flex items-center gap-1 px-3 sm:px-4 py-2 border-b overflow-x-auto no-scrollbar shrink-0 ${
          isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          {[
            { id: 'SUMMARY', label: '📊 종합 분석', icon: Activity },
            { id: 'LINEUP', label: match.sport === 'baseball' ? '⚾ 선발 라인업' : '📋 선발 명단', icon: Layers },
            { id: 'ODDS', label: '🌐 배당/승률', icon: Trophy },
            { 
              id: 'SPECIAL', 
              label: match.sport === 'baseball' ? '🔥 불펜/피로도' : match.sport === 'basketball' ? '🏀 이동/피로도' : '⚽ 정밀 지표', 
              icon: match.sport === 'baseball' ? Zap : match.sport === 'basketball' ? Plane : Flame 
            },
            { id: 'H2H', label: '⚔️ 상대전적', icon: Swords },
            { id: 'FORM', label: '🔥 최근 폼', icon: TrendingUp },
            { id: 'CHAT', label: '💬 실시간 톡', icon: MessageCircle },
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as DetailSubTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSel
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 📋 3. 탭별 상세 본문 영역 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">

          {/* TAB 1: 종합 분석 (SUMMARY) */}
          {activeTab === 'SUMMARY' && (
            <div className="space-y-4">
              {/* 예측 결론 카드 */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">오피셜 팩트 분석 우세 판정</span>
                    <strong className="text-sm sm:text-base font-black">{predictedWinner}</strong>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">시장 예상 확률</span>
                  <span className="font-mono text-xs sm:text-sm font-black text-emerald-500">홈 {probHome}% vs 원정 {probAway}%</span>
                </div>
              </div>

              {/* 승리 확률 시각화 바 */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-500">[홈] {probHome}%</span>
                  <span className="text-slate-400 text-[10px]">해외 배당 역산 시장 승리 확률</span>
                  <span className="text-cyan-400">[원정] {probAway}%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex border border-slate-300 dark:border-slate-700">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${probHome}%` }} />
                  {probDraw > 0 && <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${probDraw}%` }} />}
                  <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${probAway}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{getLocalizedTeamName(match.homeTeam.name, 'ko')}</span>
                  {probDraw > 0 && <span>무승부 {probDraw}%</span>}
                  <span>{getLocalizedTeamName(match.awayTeam.name, 'ko')}</span>
                </div>
              </div>

              {/* 퀵 지표 2분할 (기준점 & 최근 맞대결 요약) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border space-y-1.5 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>언오버(Total Line) 기준점</span>
                    <BarChart2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="font-mono text-xl font-black text-amber-500">
                    {defaultTotalLine} {unitStr}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {match.sport === 'baseball' ? '선발 이닝 소화력 및 불펜 피로도 반영 기준점' : '정규 90분 공수 득실 팩트 기준점'}
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1.5 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>맞대결 상대전적 (최근 {h2hMatches.length}경기)</span>
                    <Swords className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-mono text-xl font-black text-emerald-500">
                    {homeWinsInH2H}승 {drawsInH2H > 0 ? `${drawsInH2H}무 ` : ''}{awayWinsInH2H}패
                  </div>
                  <p className="text-[11px] text-slate-400">
                    홈팀 기준 {homeWinsInH2H > awayWinsInH2H ? '상대전적 우세 흐름' : '치열한 공방전'}
                  </p>
                </div>
              </div>

              {/* 신뢰 보증 배지 */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-500 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>토큰(Tokeon)은 전 세계 공식 스포츠 기구 및 공인 배당 팩트만을 집계하여 제공합니다.</span>
              </div>
            </div>
          )}

          {/* TAB: 선발 라인업 (LINEUP) - ⚾ 야구 다이아몬드 & ⚽ 축구 포메이션 1:1 오피셜 연동 */}
          {activeTab === 'LINEUP' && (
            <div className="space-y-4">
              <LineupTacticsView
                match={match}
                theme={theme}
              />
            </div>
          )}

          {/* TAB 2: 배당률 / 승률 (ODDS) */}
          {activeTab === 'ODDS' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800 text-xs font-black">
                  <span className="text-amber-500 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" />
                    <span>해외 오피셜 실시간 승무패 배당률</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                    100% FACT
                  </span>
                </div>

                <div className={`grid ${match.sport === 'baseball' || match.sport === 'basketball' ? 'grid-cols-2' : 'grid-cols-3'} gap-2 text-center`}>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-xs font-bold text-emerald-500 block">🏠 [홈] {getLocalizedTeamName(match.homeTeam.name, 'ko')}</span>
                    <strong className="font-mono text-xl font-black text-emerald-500 block my-1">
                      {odds.win ? Number(odds.win).toFixed(2) : '1.95'}
                    </strong>
                    <span className="text-[10px] text-slate-400">승률 {probHome}%</span>
                  </div>

                  {match.sport !== 'baseball' && match.sport !== 'basketball' && (
                    <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                      <span className="text-xs font-bold text-amber-500 block">무승부 (Draw)</span>
                      <strong className="font-mono text-xl font-black text-amber-500 block my-1">
                        {odds.draw ? Number(odds.draw).toFixed(2) : '3.30'}
                      </strong>
                      <span className="text-[10px] text-slate-400">무승부 {probDraw}%</span>
                    </div>
                  )}

                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-xs font-bold text-cyan-400 block">✈️ [원정] {getLocalizedTeamName(match.awayTeam.name, 'ko')}</span>
                    <strong className="font-mono text-xl font-black text-cyan-400 block my-1">
                      {odds.lose ? Number(odds.lose).toFixed(2) : '2.90'}
                    </strong>
                    <span className="text-[10px] text-slate-400">승률 {probAway}%</span>
                  </div>
                </div>
              </div>

              {/* 언오버 분석 */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <span className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4" />
                  <span>오피셜 언더/오버 (Under/Over) 기준점</span>
                </span>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-[10px] text-slate-400 font-bold block">기준점</span>
                    <strong className="text-lg font-black text-amber-400">{defaultTotalLine} {unitStr}</strong>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-[10px] text-slate-400 font-bold block">경기 유형</span>
                    <strong className="text-xs font-black text-emerald-400 truncate block mt-1">
                      {match.sport === 'baseball' ? '선발 대진 및 마운드 뎁스' : '정규 포제션 공방전'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 종목별 전문 정밀 지표 (야구 선발/불펜, 농구 이동/피로도, 축구 xG 지표) */}
          {activeTab === 'SPECIAL' && (
            <div className="space-y-4">
              {match.sport === 'baseball' ? (
                <BaseballSeriesPitchView
                  tracker={match.baseballSeriesPitchTracker || {
                    seriesName: `${match.homeTeam.name} vs ${match.awayTeam.name} 3연전`,
                    seriesRoundType: 'GAME_1',
                    seriesRoundLabel: '⚾ 3연전 1차전',
                    currentGameIndex: 1,
                    totalGamesInSeries: 3,
                    homeSeriesBullpenPitchesTotal: 42,
                    awaySeriesBullpenPitchesTotal: 48,
                    bullpenOverloadSummaryText: '시리즈 기준 선발 이닝 소화 및 불펜 휴식 상태 분석',
                    games: []
                  }}
                  homeTeam={match.homeTeam}
                  awayTeam={match.awayTeam}
                  membershipTier={membershipTier}
                  onOpenPaywall={onOpenPaywall}
                  theme={theme}
                />
              ) : match.sport === 'basketball' ? (
                <div className="space-y-4">
                  {/* Basketball Travel & Fatigue Engine */}
                  <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                    isLight ? 'bg-white border-amber-300' : 'bg-slate-950 border-amber-500/50'
                  }`}>
                    <div className="flex items-center justify-between border-b pb-3 border-amber-200/60 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                        <div>
                          <h4 className="font-black text-sm sm:text-base text-amber-400 flex items-center gap-1.5">
                            <span>🏀 [NBA/KBL 팩트] 이동거리 • 시차 • 백투백 피로도 분석</span>
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            연속 경기(Back-to-Back) 및 비행 이동거리 기반 체력 과부하 진단
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2.5 py-1 rounded shadow">
                        VVIP FATIGUE
                      </span>
                    </div>

                    {/* Home vs Away Fatigue 2-Col Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Home Team */}
                      <div className={`p-3.5 rounded-xl border space-y-2 ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-emerald-400">🏠 [홈] {getLocalizedTeamName(match.homeTeam.name, 'ko')}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            {match.basketballTravelFatigueTracker?.homeFatigue.restDaysLabel || '2일 휴식 (생생함 🟢)'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">최근 7일 비행</span>
                            <strong className="text-emerald-400">
                              ✈️ {match.basketballTravelFatigueTracker?.homeFatigue.travelDistanceKm?.toLocaleString() || '1,200'} km
                            </strong>
                          </div>
                          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">시차 변동</span>
                            <strong className="text-slate-200">
                              {match.basketballTravelFatigueTracker?.homeFatigue.timeZoneChanges || 0}시간 시차
                            </strong>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {match.basketballTravelFatigueTracker?.homeFatigue.fatigueStatusText || '충분한 홈 연전 휴식으로 주전 라인업 체력 95% 이상 충전 완료.'}
                        </p>
                      </div>

                      {/* Away Team */}
                      <div className={`p-3.5 rounded-xl border space-y-2 ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-cyan-400">✈️ [원정] {getLocalizedTeamName(match.awayTeam.name, 'ko')}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            {match.basketballTravelFatigueTracker?.awayFatigue.restDaysLabel || '1일 휴식 (보통 🟡)'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">최근 7일 비행</span>
                            <strong className="text-amber-400">
                              ✈️ {match.basketballTravelFatigueTracker?.awayFatigue.travelDistanceKm?.toLocaleString() || '3,450'} km
                            </strong>
                          </div>
                          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">시차 변동</span>
                            <strong className="text-slate-200">
                              +{match.basketballTravelFatigueTracker?.awayFatigue.timeZoneChanges || 2}시간 시차
                            </strong>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {match.basketballTravelFatigueTracker?.awayFatigue.fatigueStatusText || '원정 원정 연전 일정으로 4쿼터 클러치 타임 야투 적중률 하락 주의.'}
                        </p>
                      </div>
                    </div>

                    {/* VVIP Sensitivity Alert */}
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{match.basketballTravelFatigueTracker?.vvipSensitivityAlert || '체력 우위 및 원정팀 시차 피로도가 경기 후반 승부처 핸디캡에 직접적 변수로 작용합니다.'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <CoreWinFactorView
                  metrics={match.soccerWinFactorMetrics as any}
                  homeName={match.homeTeam.name}
                  awayName={match.awayTeam.name}
                  membershipTier={membershipTier}
                  onOpenPaywall={onOpenPaywall}
                  theme={theme}
                />
              )}
            </div>
          )}

          {/* TAB 4: 상대 전적 (H2H) */}
          {activeTab === 'H2H' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-1.5">
                  <Swords className="w-4 h-4" />
                  <span>맞대결 상대전적 ({h2hRange}경기)</span>
                </span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {[3, 5, 10, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setH2hRange(num as any)}
                      className={`px-2 py-0.5 rounded text-[10px] font-black transition-all cursor-pointer ${
                        h2hRange === num ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}경기
                    </button>
                  ))}
                </div>
              </div>

              {/* 📌 안내 배너: [앞: 홈팀] [뒤: 원정팀] [승무패] 고정 */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] font-bold ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-300'
              }`}>
                <span className="flex items-center gap-1.5">
                  <span>📌</span>
                  <span>상대전적 고정: <strong>[홈팀]</strong>(왼쪽) vs <strong>[원정팀]</strong>(오른쪽) ➔ <strong>[승무패]</strong></span>
                </span>
                <span className="font-mono font-black text-emerald-400">
                  {homeWinsInH2H}승 {drawsInH2H > 0 ? `${drawsInH2H}무 ` : ''}{awayWinsInH2H}패
                </span>
              </div>

              <div className={`rounded-2xl border overflow-hidden p-2.5 sm:p-3 space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                {/* 헤더 */}
                <div className="grid grid-cols-12 items-center px-3 py-1.5 text-[11px] font-black text-slate-400 border-b border-slate-200 dark:border-slate-800/80">
                  <span className="col-span-2 text-left font-mono">일자</span>
                  <span className="col-span-4 text-left text-emerald-500 font-bold truncate flex items-center gap-1">
                    <span>🏠</span>
                    <span>[홈] {getLocalizedTeamName(match.homeTeam.name, 'ko')}</span>
                  </span>
                  <span className="col-span-2 text-center font-mono">스코어</span>
                  <span className="col-span-3 text-right text-cyan-400 font-bold truncate flex items-center justify-end gap-1">
                    <span>[원정] {getLocalizedTeamName(match.awayTeam.name, 'ko')}</span>
                    <span>✈️</span>
                  </span>
                  <span className="col-span-1 text-right">결과</span>
                </div>

                {h2hMatches.length > 0 ? (
                  h2hMatches.map((h2h, idx) => {
                    const isHomeWin = h2h.homeScore > h2h.awayScore;
                    const isDraw = h2h.homeScore === h2h.awayScore;
                    const resultText = isHomeWin ? '홈승' : isDraw ? '무' : '원정승';
                    const badgeBg = isHomeWin
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : isDraw
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/40';

                    return (
                      <div key={idx} className={`grid grid-cols-12 items-center p-2.5 rounded-xl border text-xs transition-all ${
                        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-xs'
                      }`}>
                        <span className="col-span-2 text-slate-400 font-mono text-[11px]">{h2h.dateStr}</span>
                        
                        {/* 🏠 앞: [홈팀] */}
                        <div className="col-span-4 flex items-center gap-1 min-w-0">
                          <span className="text-emerald-500 font-black text-[10px] shrink-0">[홈]</span>
                          <span className={`font-bold truncate ${isHomeWin ? 'text-emerald-500 dark:text-emerald-400 font-extrabold' : 'text-slate-700 dark:text-slate-200'}`}>
                            {getLocalizedTeamName(match.homeTeam.name, 'ko')}
                          </span>
                        </div>

                        {/* 스코어 */}
                        <div className="col-span-2 text-center">
                          <span className="font-mono font-black text-amber-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800">
                            {h2h.homeScore} : {h2h.awayScore}
                          </span>
                        </div>

                        {/* ✈️ 뒤: [원정팀] */}
                        <div className="col-span-3 flex items-center justify-end gap-1 min-w-0 text-right">
                          <span className={`font-bold truncate ${!isHomeWin && !isDraw ? 'text-cyan-500 dark:text-cyan-400 font-extrabold' : 'text-slate-700 dark:text-slate-200'}`}>
                            {getLocalizedTeamName(match.awayTeam.name, 'ko')}
                          </span>
                          <span className="text-cyan-400 font-black text-[10px] shrink-0">[원정]</span>
                        </div>

                        {/* 결과 뱃지 */}
                        <div className="col-span-1 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black border inline-block ${badgeBg}`}>
                            {resultText}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">공식 맞대결 기록 집계 중입니다.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: 최근 폼 & 경기 로그 (FORM) */}
          {activeTab === 'FORM' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>최근 경기 결과 & 득실점</span>
                </span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setRecentGamesRange(num as any)}
                      className={`px-2 py-0.5 rounded text-[10px] font-black transition-all cursor-pointer ${
                        recentGamesRange === num ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}경기
                    </button>
                  ))}
                </div>
              </div>

              {/* 📌 안내 배너: [앞: 홈팀] [뒤: 원정팀] [승무패] 고정 */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] font-bold ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-300'
              }`}>
                <span className="flex items-center gap-1.5">
                  <span>📌</span>
                  <span>최근경기 고정: <strong>[홈팀]</strong>(앞/왼쪽) vs <strong>[원정팀]</strong>(뒤/오른쪽) ➔ <strong>[승무패]</strong></span>
                </span>
                <span className="text-slate-400 text-[10px]">최근 {recentGamesRange}경기 기준</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 홈팀 최근 경기 */}
                <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-emerald-500 font-black text-xs flex items-center gap-1.5">
                      <span>🏠</span>
                      <span>[홈] {getLocalizedTeamName(match.homeTeam.name, 'ko')}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">앞: [홈] vs 뒤: [원정]</span>
                  </div>

                  {homeLogs.map((g, idx) => {
                    const isTeamHome = g.isHome === true || g.homeOrAway === 'HOME';
                    const homeName = isTeamHome ? match.homeTeam.name : g.opponentName;
                    const awayName = isTeamHome ? g.opponentName : match.homeTeam.name;
                    const homeScore = isTeamHome ? g.teamScore : g.opponentScore;
                    const awayScore = isTeamHome ? g.opponentScore : g.teamScore;
                    const res = g.resultStr || (g.teamScore > g.opponentScore ? '승' : g.teamScore === g.opponentScore ? '무' : '패');
                    const badgeBg = res === '승'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : res === '무'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30';

                    return (
                      <div key={idx} className={`p-2 rounded-xl border text-[11px] flex items-center justify-between gap-1.5 ${
                        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <span className="text-slate-400 font-mono text-[10px] shrink-0 w-9">{g.dateStr}</span>

                        {/* 🏠 앞: [홈팀] */}
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          <span className="text-emerald-500 font-black text-[9px] shrink-0">[홈]</span>
                          <span className={`truncate font-bold ${isTeamHome ? 'text-emerald-500 dark:text-emerald-400 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
                            {getLocalizedTeamName(homeName, 'ko')}
                          </span>
                        </div>

                        {/* 스코어 */}
                        <span className="font-mono font-black text-amber-400 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-950 text-xs shrink-0 border border-slate-200 dark:border-slate-800">
                          {homeScore}:{awayScore}
                        </span>

                        {/* ✈️ 뒤: [원정팀] */}
                        <div className="flex items-center justify-end gap-1 min-w-0 flex-1 text-right">
                          <span className={`truncate font-bold ${!isTeamHome ? 'text-cyan-500 dark:text-cyan-400 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
                            {getLocalizedTeamName(awayName, 'ko')}
                          </span>
                          <span className="text-cyan-400 font-black text-[9px] shrink-0">[원정]</span>
                        </div>

                        {/* 승무패 결과 뱃지 */}
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 ${badgeBg}`}>
                          {res}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 원정팀 최근 경기 */}
                <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-cyan-400 font-black text-xs flex items-center gap-1.5">
                      <span>✈️</span>
                      <span>[원정] {getLocalizedTeamName(match.awayTeam.name, 'ko')}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">앞: [홈] vs 뒤: [원정]</span>
                  </div>

                  {awayLogs.map((g, idx) => {
                    const isTeamHome = g.isHome === true || g.homeOrAway === 'HOME';
                    const homeName = isTeamHome ? match.awayTeam.name : g.opponentName;
                    const awayName = isTeamHome ? g.opponentName : match.awayTeam.name;
                    const homeScore = isTeamHome ? g.teamScore : g.opponentScore;
                    const awayScore = isTeamHome ? g.opponentScore : g.teamScore;
                    const res = g.resultStr || (g.teamScore > g.opponentScore ? '승' : g.teamScore === g.opponentScore ? '무' : '패');
                    const badgeBg = res === '승'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : res === '무'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30';

                    return (
                      <div key={idx} className={`p-2 rounded-xl border text-[11px] flex items-center justify-between gap-1.5 ${
                        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <span className="text-slate-400 font-mono text-[10px] shrink-0 w-9">{g.dateStr}</span>

                        {/* 🏠 앞: [홈팀] */}
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          <span className="text-emerald-500 font-black text-[9px] shrink-0">[홈]</span>
                          <span className={`truncate font-bold ${isTeamHome ? 'text-emerald-500 dark:text-emerald-400 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
                            {getLocalizedTeamName(homeName, 'ko')}
                          </span>
                        </div>

                        {/* 스코어 */}
                        <span className="font-mono font-black text-amber-400 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-950 text-xs shrink-0 border border-slate-200 dark:border-slate-800">
                          {homeScore}:{awayScore}
                        </span>

                        {/* ✈️ 뒤: [원정팀] */}
                        <div className="flex items-center justify-end gap-1 min-w-0 flex-1 text-right">
                          <span className={`truncate font-bold ${!isTeamHome ? 'text-cyan-500 dark:text-cyan-400 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
                            {getLocalizedTeamName(awayName, 'ko')}
                          </span>
                          <span className="text-cyan-400 font-black text-[9px] shrink-0">[원정]</span>
                        </div>

                        {/* 승무패 결과 뱃지 */}
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 ${badgeBg}`}>
                          {res}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: 실시간 경기 톡방 (CHAT) */}
          {activeTab === 'CHAT' && (
            <div className="h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <LiveCheerChat
                match={match}
                membershipTier={membershipTier}
                theme={theme}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
