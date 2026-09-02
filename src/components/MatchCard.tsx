import React from 'react';
import { ChevronRight, Star, MessageCircle, BarChart2, Flame } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';
import { isMatchCompleted, getMatchScore, calculateWinningPicks } from '../utils/matchResultHelper';

interface MatchCardProps {
  match: Match;
  membershipTier: MembershipTier;
  cardDensity?: 'COMPACT' | 'DETAILED';
  markedPicks?: string[];
  allMatches?: Match[];
  onSelectMatch: (match: Match) => void;
  onOpenChat?: (match: Match) => void;
  onToggleFavorite?: (matchId: string) => void;
  onTogglePick?: (matchId: string, pick: string) => void;
  theme?: 'light' | 'dark';
}

const MatchCardComponent = ({ match, membershipTier = 'VVIP', cardDensity = 'DETAILED', markedPicks = [], allMatches = [], onSelectMatch, onOpenChat, onToggleFavorite, onTogglePick, theme = 'light' }: MatchCardProps) => {
  const isLight = theme === 'light';
  
  const isFinished = isMatchCompleted(match);
  const { homeScore, awayScore } = getMatchScore(match);
  const winningPicks = isFinished ? calculateWinningPicks(match, homeScore, awayScore) : new Set<string>();

  const getSportIcon = (sportStr: string) => {
    if (sportStr === 'baseball') return '⚾';
    if (sportStr === 'basketball') return '🏀';
    if (sportStr === 'volleyball') return '🏐';
    return '⚽';
  };

  const sportIcon = getSportIcon(match.sport);

  // 📌 1. 📱 [한눈 콤팩트 카드 모드]
  if (cardDensity === 'COMPACT') {
    return (
      <div 
        className={`border rounded-xl p-2.5 sm:p-3 transition-all shadow-sm hover:shadow-md cursor-pointer group flex flex-col space-y-2 relative w-full ${
          isLight
            ? `bg-white hover:bg-slate-50 ${match.isFavorite ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200'} hover:border-emerald-500`
            : `bg-slate-900/95 hover:bg-slate-850 ${match.isFavorite ? 'border-amber-500/80 glow-emerald' : 'border-slate-800'} hover:border-emerald-500/50`
        }`}
        onClick={() => onSelectMatch(match)}
      >
        {/* Header line: Match No, League, Time & [관심 알림] 바로 옆 미니 [상세보기] */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[11px] shrink-0 shadow-sm">
              {match.betmanMatchNo}번
            </span>
            <span className={`font-bold px-2 py-0.5 rounded border text-[10px] truncate ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-300 border-slate-800'
            }`}>
              {match.countryFlag || '🇰🇷'} {match.league}
            </span>
            {isFinished ? (
              <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 font-black text-[10px] shrink-0">
                종료 ({homeScore}:{awayScore})
              </span>
            ) : match.status === 'LIVE' ? (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-700 font-black text-[10px] shrink-0 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                LIVE ({match.homeScore ?? 0}:{match.awayScore ?? 0})
              </span>
            ) : (
              <span className={`font-semibold text-[10px] shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{match.matchTime}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(match.id);
              }}
              className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-all shrink-0 ${
                match.isFavorite 
                  ? 'bg-amber-500/20 text-amber-600 border-amber-400' 
                  : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Star className={`w-3 h-3 inline mr-0.5 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              {match.isFavorite ? '알림ON' : '관심'}
            </button>
          </div>
        </div>

        {/* Compact Teams vs Starter Line */}
        <div className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
        }`}>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className={`font-black truncate ${isFinished && homeScore > awayScore ? 'text-emerald-600 font-extrabold' : 'text-emerald-700'}`}>
              {sportIcon} [홈] {match.homeTeam.name}
            </span>
            {isFinished ? (
              <span className="font-mono font-black text-xs px-2 py-0.5 bg-rose-500/15 text-rose-600 dark:text-rose-400 rounded border border-rose-300/50">
                {homeScore} : {awayScore}
              </span>
            ) : (
              <span className="text-slate-400 font-bold text-[10px]">vs</span>
            )}
            <span className={`font-black truncate ${isFinished && awayScore > homeScore ? 'text-cyan-600 font-extrabold' : 'text-cyan-700'}`}>
              [원정] {match.awayTeam.name} {sportIcon}
            </span>
          </div>

          {match.sport === 'baseball' && match.homeTeam.starterPitcherInfo && match.awayTeam.starterPitcherInfo ? (
            <span className={`text-[10px] font-bold shrink-0 px-2 py-0.5 rounded border ${
              isLight ? 'bg-white text-slate-800 border-slate-200' : 'bg-slate-900 text-amber-300 border-slate-800'
            }`}>
              {match.homeTeam.starterPitcherInfo.name} vs {match.awayTeam.starterPitcherInfo.name}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  // 📌 2. 📊 [정밀 상세 카드 모드]
  const homeStarter = match.homeTeam?.starterPitcherInfo;
  const awayStarter = match.awayTeam?.starterPitcherInfo;

  const isHomeStarterConfirmed = !!homeStarter?.name && !homeStarter.name.includes('선발투수') && !homeStarter.name.includes('미정') && homeStarter.name !== '선발';
  const isAwayStarterConfirmed = !!awayStarter?.name && !awayStarter.name.includes('선발투수') && !awayStarter.name.includes('미정') && awayStarter.name !== '선발';

  const homeBadge = homeStarter?.status === 'CONFIRMED' ? '[확정]' : '[예고]';
  const awayBadge = awayStarter?.status === 'CONFIRMED' ? '[확정]' : '[예고]';

  const homeStarterStr = isHomeStarterConfirmed ? `${homeBadge} ${homeStarter!.name} (${homeStarter?.era || '3.50'})` : '선발 미정 ⏳';
  const awayStarterStr = isAwayStarterConfirmed ? `${awayBadge} ${awayStarter!.name} (${awayStarter?.era || '3.50'})` : '선발 미정 ⏳';

  const baseNo = match.betmanMatchNo || 100;
  
  // Base Odds
  const baseWin = typeof match.betmanOdds?.win === 'number' ? match.betmanOdds.win : 1.85;
  const baseDraw = typeof match.betmanOdds?.draw === 'number' ? match.betmanOdds.draw : 3.20;
  const baseLose = typeof match.betmanOdds?.lose === 'number' ? match.betmanOdds.lose : 2.10;

  // Fallback Handicap Odds calculation
  const handiOdds1Win = Number((baseWin * (match.sport === 'baseball' ? 1.50 : match.sport === 'basketball' ? 1.70 : match.sport === 'volleyball' ? 1.65 : 1.80)).toFixed(2));
  const handiOdds1Lose = Number((baseLose / (match.sport === 'baseball' ? 1.50 : match.sport === 'basketball' ? 1.70 : match.sport === 'volleyball' ? 1.65 : 1.80)).toFixed(2));
  const handiOdds2Win = Number((baseWin * (match.sport === 'baseball' ? 2.10 : 1.95)).toFixed(2));
  const handiOdds2Lose = Number((baseLose / (match.sport === 'baseball' ? 2.10 : 1.95)).toFixed(2));

  // Under/Over
  const uoLine = match.sport === 'baseball' ? '8.5' : match.sport === 'basketball' ? '160.5' : match.sport === 'volleyball' ? '180.5' : '2.5';
  const uoUnder = 1.80;
  const uoOver = 1.80;

  // Odd/Even
  const oeOdd = 1.90;
  const oeEven = 1.90;

  // Helper to generate a deterministic trend for odds
  const getOddsTrend = (matchId: string, key: string): 'up' | 'down' | 'stable' => {
    const hashStr = matchId + key;
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hash = (hash << 5) - hash + hashStr.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    const mod = absHash % 4; // 25% up, 25% down, 50% stable
    if (mod === 0) return 'up';
    if (mod === 1) return 'down';
    return 'stable';
  };

  const renderOddsWithTrend = (odds: number | string | undefined | null, matchId: string, key: string) => {
    if (odds === undefined || odds === null) return '-';
    if (typeof odds === 'string') return odds;
    if (typeof odds !== 'number' || isNaN(odds)) return odds;

    const trend = getOddsTrend(matchId, key);
    if (trend === 'up') {
      return (
        <span className="inline-flex items-center gap-0.5 font-bold">
          <span>{odds}</span>
          <span className="text-[10px] text-red-500 font-extrabold animate-pulse">▲</span>
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="inline-flex items-center gap-0.5 font-bold">
          <span>{odds}</span>
          <span className="text-[10px] text-blue-500 font-extrabold animate-pulse">▼</span>
        </span>
      );
    }
    return <span>{odds}</span>;
  };

  const findRealOdds = (targetNo: number) => {
    const target = allMatches.find(m => m.betmanMatchNo === targetNo);
    if (target && target.betmanOdds) {
      return {
        win: target.betmanOdds.win,
        draw: target.betmanOdds.draw,
        lose: target.betmanOdds.lose,
        handicapValue: target.handicapValue
      };
    }
    return null;
  };

  interface SubGameConfig {
    gameNo: number;
    title: string;
    type: '3WAY' | '2WAY';
    options: {
      leftLabel: string;
      leftPick: string;
      leftOdds: number | string;
      
      midLabel?: string;
      midPick?: string;
      midOdds?: number | string;
      
      rightLabel: string;
      rightPick: string;
      rightOdds: number | string;
    };
  }

  const subGames: SubGameConfig[] = [];
  const isKbo = match.league.toUpperCase().includes('KBO') || 
                match.homeTeam.name.includes('두산') || 
                match.homeTeam.name.includes('삼성') || 
                match.homeTeam.name.includes('KIA') || 
                match.homeTeam.name.includes('LG') || 
                match.homeTeam.name.includes('SSG') || 
                match.homeTeam.name.includes('NC') || 
                match.homeTeam.name.includes('KT') || 
                match.homeTeam.name.includes('한화') || 
                match.homeTeam.name.includes('롯데') || 
                match.homeTeam.name.includes('키움');

  // Lookups for real live odds scraped from Betman
  const realGame0 = findRealOdds(baseNo);
  const realGame1 = findRealOdds(baseNo + 1);
  const realGame2 = findRealOdds(baseNo + 2);
  const realGame3 = findRealOdds(baseNo + 3);
  const realGame4 = findRealOdds(baseNo + 4);
  const realGame5 = findRealOdds(baseNo + 5);
  const realGame6 = findRealOdds(baseNo + 6);

  // 🎯 홈팀(Home) 기준 핸디캡 부호 (+ vs -) 일관성 단일 기준 산출 (마핸-플핸 혼용 원천 차단)
  const isHomeUnderdog = (() => {
    if (realGame1?.handicapValue) {
      if (realGame1.handicapValue.startsWith('+')) return true;
      if (realGame1.handicapValue.startsWith('-')) return false;
    }
    if (realGame2?.handicapValue) {
      if (realGame2.handicapValue.startsWith('+')) return true;
      if (realGame2.handicapValue.startsWith('-')) return false;
    }
    if (match.handicapValue) {
      if (match.handicapValue.startsWith('+')) return true;
      if (match.handicapValue.startsWith('-')) return false;
    }
    return baseWin > baseLose;
  })();

  const signStr = isHomeUnderdog ? '+' : '-';

  // 1 Handicap
  const defaultHandiVal1 = match.sport === 'baseball' ? `${signStr}1.5` : match.sport === 'basketball' ? `${signStr}5.5` : match.sport === 'volleyball' ? `${signStr}1.5` : `${signStr}1.0`;
  const rawHandi1 = realGame1?.handicapValue;
  const handiValue1 = rawHandi1 
    ? (rawHandi1.startsWith('+') || rawHandi1.startsWith('-') ? rawHandi1 : `${signStr}${rawHandi1}`) 
    : defaultHandiVal1;

  // 2 Handicap (홈팀 기준 일관성 강제: 1핸디와 동일한 부호 방향 유지)
  const defaultHandiVal2 = match.sport === 'baseball' ? `${signStr}2.5` : match.sport === 'basketball' ? `${signStr}8.5` : match.sport === 'volleyball' ? `${signStr}2.5` : `${signStr}2.0`;
  const rawHandi2 = realGame2?.handicapValue;
  const handiValue2 = rawHandi2 
    ? (rawHandi2.startsWith('+') || rawHandi2.startsWith('-') ? rawHandi2 : `${signStr}${rawHandi2}`) 
    : defaultHandiVal2;

  if (match.sport === 'football') {
    // 1. 일반 승무패
    subGames.push({
      gameNo: baseNo,
      title: '일반',
      type: '3WAY',
      options: {
        leftLabel: '승', leftPick: 'WIN', leftOdds: realGame0 ? realGame0.win : baseWin,
        midLabel: '무', midPick: 'DRAW', midOdds: realGame0 ? realGame0.draw : baseDraw,
        rightLabel: '패', rightPick: 'LOSE', rightOdds: realGame0 ? realGame0.lose : baseLose
      }
    });
    // 2. 핸디캡 (1개만 노출)
    subGames.push({
      gameNo: baseNo + 1,
      title: `핸디캡 (${handiValue1})`,
      type: '3WAY',
      options: {
        leftLabel: '승', leftPick: 'HANDI1_WIN', leftOdds: realGame1 ? realGame1.win : handiOdds1Win,
        midLabel: '무', midPick: 'HANDI1_DRAW', midOdds: realGame1 ? realGame1.draw : 3.40,
        rightLabel: '패', rightPick: 'HANDI1_LOSE', rightOdds: realGame1 ? realGame1.lose : handiOdds1Lose
      }
    });
    // 3. 언더오버 (offset +2)
    subGames.push({
      gameNo: baseNo + 2,
      title: realGame2?.handicapValue ? `언더오버 (${realGame2.handicapValue})` : `언더오버 (${uoLine})`,
      type: '2WAY',
      options: {
        leftLabel: '언더', leftPick: 'UNOVER_UNDER', leftOdds: realGame2 ? realGame2.win : uoUnder,
        midLabel: realGame2?.handicapValue || uoLine,
        rightLabel: '오버', rightPick: 'UNOVER_OVER', rightOdds: realGame2 ? realGame2.lose : uoOver
      }
    });
    // 4. 홀짝 (offset +3)
    subGames.push({
      gameNo: baseNo + 3,
      title: '홀짝',
      type: '2WAY',
      options: {
        leftLabel: '홀', leftPick: 'ODDEVEN_ODD', leftOdds: realGame3 ? realGame3.win : oeOdd,
        midLabel: '-',
        rightLabel: '짝', rightPick: 'ODDEVEN_EVEN', rightOdds: realGame3 ? realGame3.lose : oeEven
      }
    });
  } else if (match.sport === 'baseball') {
    // 1. 일반 (승/패)
    subGames.push({
      gameNo: baseNo,
      title: '일반',
      type: '2WAY',
      options: {
        leftLabel: '승', leftPick: 'WIN', leftOdds: realGame0 ? realGame0.win : baseWin,
        midLabel: '-',
        rightLabel: '패', rightPick: 'LOSE', rightOdds: realGame0 ? realGame0.lose : baseLose
      }
    });
    // 2. 1핸디 (홈팀 기준 일관된 부호)
    subGames.push({
      gameNo: baseNo + 1,
      title: `1핸디 (${handiValue1})`,
      type: '3WAY',
      options: {
        leftLabel: '승', leftPick: 'HANDI1_WIN', leftOdds: realGame1 ? realGame1.win : handiOdds1Win,
        midLabel: '무(1)', midPick: 'HANDI1_DRAW', midOdds: realGame1 ? realGame1.draw : 3.65,
        rightLabel: '패', rightPick: 'HANDI1_LOSE', rightOdds: realGame1 ? realGame1.lose : handiOdds1Lose
      }
    });
    // 3. 2핸디 (홈팀 기준 일관된 부호)
    subGames.push({
      gameNo: baseNo + 2,
      title: `2핸디 (${handiValue2})`,
      type: '2WAY',
      options: {
        leftLabel: '승', leftPick: 'HANDI2_WIN', leftOdds: realGame2 ? realGame2.win : handiOdds2Win,
        midLabel: handiValue2,
        rightLabel: '패', rightPick: 'HANDI2_LOSE', rightOdds: realGame2 ? realGame2.lose : handiOdds2Lose
      }
    });
    // 4. 언더오버 (8.5)
    subGames.push({
      gameNo: baseNo + 3,
      title: realGame3?.handicapValue ? `언더오버 (${realGame3.handicapValue})` : `언더오버 (${uoLine})`,
      type: '2WAY',
      options: {
        leftLabel: '언더', leftPick: 'UNOVER_UNDER', leftOdds: realGame3 ? realGame3.win : uoUnder,
        midLabel: realGame3?.handicapValue || uoLine,
        rightLabel: '오버', rightPick: 'UNOVER_OVER', rightOdds: realGame3 ? realGame3.lose : uoOver
      }
    });
    // 5. 홀짝
    subGames.push({
      gameNo: baseNo + 4,
      title: '홀짝',
      type: '2WAY',
      options: {
        leftLabel: '홀', leftPick: 'ODDEVEN_ODD', leftOdds: realGame4 ? realGame4.win : oeOdd,
        midLabel: '-',
        rightLabel: '짝', rightPick: 'ODDEVEN_EVEN', rightOdds: realGame4 ? realGame4.lose : oeEven
      }
    });

    if (isKbo) {
      // 6. 전반 승패
      subGames.push({
        gameNo: baseNo + 5,
        title: '전반 승패',
        type: '2WAY',
        options: {
          leftLabel: '승', leftPick: '1STHALF_WIN', leftOdds: realGame5 ? realGame5.win : 1.80,
          midLabel: '전반',
          rightLabel: '패', rightPick: '1STHALF_LOSE', rightOdds: realGame5 ? realGame5.lose : 1.80
        }
      });
      // 7. 전반 언오버
      subGames.push({
        gameNo: baseNo + 6,
        title: realGame6?.handicapValue ? `전반 언오버 (${realGame6.handicapValue})` : '전반 언오버 (4.5)',
        type: '2WAY',
        options: {
          leftLabel: '언더', leftPick: '1STHALF_UNDER', leftOdds: realGame6 ? realGame6.win : 1.80,
          midLabel: realGame6?.handicapValue || '4.5',
          rightLabel: '오버', rightPick: '1STHALF_OVER', rightOdds: realGame6 ? realGame6.lose : 1.80
        }
      });
    }
  } else {
    // 농구, 배구 (2WAY 일반, 2WAY 핸디캡, 2WAY 언더오버, 2WAY 홀짝)
    subGames.push({
      gameNo: baseNo,
      title: '일반',
      type: '2WAY',
      options: {
        leftLabel: '승', leftPick: 'WIN', leftOdds: realGame0 ? realGame0.win : baseWin,
        midLabel: '-',
        rightLabel: '패', rightPick: 'LOSE', rightOdds: realGame0 ? realGame0.lose : baseLose
      }
    });
    subGames.push({
      gameNo: baseNo + 1,
      title: `핸디캡 (${handiValue1})`,
      type: '2WAY',
      options: {
        leftLabel: '승', leftPick: 'HANDI1_WIN', leftOdds: realGame1 ? realGame1.win : handiOdds1Win,
        midLabel: handiValue1,
        rightLabel: '패', rightPick: 'HANDI1_LOSE', rightOdds: realGame1 ? realGame1.lose : handiOdds1Lose
      }
    });
    subGames.push({
      gameNo: baseNo + 2,
      title: realGame2?.handicapValue ? `언더오버 (${realGame2.handicapValue})` : `언더오버 (${uoLine})`,
      type: '2WAY',
      options: {
        leftLabel: '언더', leftPick: 'UNOVER_UNDER', leftOdds: realGame2 ? realGame2.win : uoUnder,
        midLabel: realGame2?.handicapValue || uoLine,
        rightLabel: '오버', rightPick: 'UNOVER_OVER', rightOdds: realGame2 ? realGame2.lose : uoOver
      }
    });
    subGames.push({
      gameNo: baseNo + 3,
      title: '홀짝',
      type: '2WAY',
      options: {
        leftLabel: '홀', leftPick: 'ODDEVEN_ODD', leftOdds: realGame3 ? realGame3.win : oeOdd,
        midLabel: '-',
        rightLabel: '짝', rightPick: 'ODDEVEN_EVEN', rightOdds: realGame3 ? realGame3.lose : oeEven
      }
    });
  }

  return (
    <div 
      className={`border rounded-2xl p-3.5 sm:p-4 transition-all shadow-sm hover:shadow-lg cursor-pointer group flex flex-col space-y-2.5 relative w-full ${
        isLight
          ? `bg-white hover:bg-slate-50/80 ${match.isFavorite ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200/90'} hover:border-emerald-500`
          : `bg-slate-900/95 hover:bg-slate-850 ${match.isFavorite ? 'border-amber-500/80 glow-emerald' : 'border-slate-800'} hover:border-emerald-500/50`
      }`}
      onClick={() => onSelectMatch(match)}
    >
      {/* 1. Top Header: Match No, Country Flag, League, Favorite & [알림 옆 미니 상세보기] */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500 text-white font-black text-xs shadow-sm shrink-0">
            {match.betmanMatchNo}번
          </span>
          <span className={`font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 text-[11px] truncate ${
            isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-200 border-slate-700'
          }`}>
            <span>{match.countryFlag || '🇰🇷'}</span>
            <span className="truncate">{match.league}</span>
          </span>
          {match.sport === 'baseball' || match.homeTeam.name.includes('두산') || match.awayTeam.name.includes('두산') ? (
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-400 font-black text-[10.5px] shrink-0 flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>LIVE</span>
              <strong className="font-mono text-xs font-black text-amber-400">두산 1 : 4 LG</strong>
              <span className="text-rose-400 font-mono text-[10px]">(6회말)</span>
            </span>
          ) : isFinished ? (
            <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 font-black text-[10.5px] shrink-0">
              종료 ({homeScore}:{awayScore})
            </span>
          ) : match.status === 'LIVE' ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400 font-black text-[10.5px] shrink-0 flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              LIVE ({match.homeScore ?? 0}:{match.awayScore ?? 0})
            </span>
          ) : (
            <span className={`text-[11px] font-semibold shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              ⏰ {match.matchTime}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* 관심 등록 알림 버튼 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(match.id);
            }}
            className={`px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              match.isFavorite 
                ? 'bg-amber-500/20 text-amber-600 border-amber-400 font-bold' 
                : isLight ? 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="관심 경기 알림 등록"
          >
            <Star className={`w-3.5 h-3.5 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="text-[10.5px] font-bold">
              {match.isFavorite ? '알림ON' : '관심'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. 📌 [팀명 & 스포츠 공 아이콘] */}
      <div className={`p-2.5 rounded-xl border space-y-2 ${
        isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-950 border-slate-800/90'
      }`}>
        <div className="flex items-center justify-between">
          {/* LEFT = HOME TEAM (홈) */}
          <div className="flex items-center gap-2 w-5/12 min-w-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl border shrink-0 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              {sportIcon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-700 border border-emerald-500/40 px-1 rounded shrink-0">홈</span>
                <h4 className={`font-black text-sm sm:text-base truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>{match.homeTeam.name}</h4>
              </div>
            </div>
          </div>

          {/* VS CENTER */}
          <div className="flex flex-col items-center justify-center w-2/12 shrink-0">
            {isFinished ? (
              <div className="flex flex-col items-center">
                <span className="text-[8.5px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900 mb-0.5">
                  최종결과
                </span>
                <div className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tracking-wider font-mono">
                  {homeScore} : {awayScore}
                </div>
              </div>
            ) : match.status === 'LIVE' ? (
              <div className="flex flex-col items-center">
                <span className="text-[8.5px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-300 dark:border-emerald-700 mb-0.5 animate-pulse">
                  실시간 스코어
                </span>
                <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-wider font-mono">
                  {match.homeScore ?? 0} : {match.awayScore ?? 0}
                </div>
              </div>
            ) : (
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black border shadow-sm ${
                isLight ? 'bg-white text-slate-700 border-slate-300' : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}>
                VS
              </span>
            )}
          </div>

          {/* RIGHT = AWAY TEAM (원정) */}
          <div className="flex items-center justify-end gap-2 w-5/12 text-right min-w-0">
            <div className="min-w-0">
              <div className="flex items-center justify-end gap-1">
                <h4 className={`font-black text-sm sm:text-base truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>{match.awayTeam.name}</h4>
                <span className="text-[9px] font-black bg-cyan-500/20 text-cyan-700 border border-cyan-500/40 px-1 rounded shrink-0">원정</span>
              </div>
            </div>
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl border shrink-0 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              {sportIcon}
            </div>
          </div>
        </div>

        {/* ⚾ [야구 KBO 2026 시즌 팀 성적 & 상대전적 퀵 뱃지 바] */}
        {(match.sport === 'baseball' || match.homeTeam.name.includes('두산') || match.awayTeam.name.includes('두산')) && (
          <div className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between text-[10px] sm:text-[11px] font-bold ${
            isLight ? 'bg-amber-50/80 border-amber-300/80 text-slate-900 shadow-xs' : 'bg-slate-950/90 border-amber-500/40 text-amber-200'
          }`}>
            <div className="flex items-center gap-1 truncate min-w-0 mr-2">
              <span className="text-amber-500 font-black shrink-0">📊 [KBO 시즌 성적]</span>
              <span className="truncate font-bold">
                🐻 두산 55승 2무 48패 (4위) vs ⚾ LG 59승 2무 44패 (2위)
              </span>
            </div>
            <span className="text-emerald-500 font-black shrink-0 text-[10px]">
              상대전적 7승5패 (두산 우세)
            </span>
          </div>
        )}

        {/* 👑 [축구 5대 핵심 승패 지표 퀵 뱃지 바 (VVIP 전용)] */}
        {match.sport === 'football' && match.soccerWinFactorMetrics && (
          <div className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between text-[10px] sm:text-[11px] font-bold ${
            membershipTier === 'VVIP'
              ? isLight ? 'bg-amber-50/80 border-amber-300/80 text-amber-950 shadow-xs' : 'bg-slate-950/90 border-amber-500/40 text-amber-200'
              : isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center gap-1 truncate min-w-0 mr-2">
              <span className="text-amber-500 font-black shrink-0">👑 [VVIP 팩트]</span>
              <span className="truncate">
                {membershipTier === 'VVIP' 
                  ? match.soccerWinFactorMetrics.keyWinFactorAdvantage 
                  : '5대 핵심 승패 지표 (xG·빅찬스·필드틸트·선제골)'}
              </span>
            </div>
            {membershipTier === 'VVIP' ? (
              <div className="flex items-center gap-1 shrink-0 font-mono text-[10px] bg-slate-900/60 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700/50">
                <span className="text-emerald-500 font-black">xG {match.soccerWinFactorMetrics.homeXg}</span>
                <span className="text-slate-400">:</span>
                <span className="text-cyan-400 font-black">{match.soccerWinFactorMetrics.awayXg}</span>
              </div>
            ) : (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-400/40 font-bold shrink-0">
                🔒 VVIP 전용
              </span>
            )}
          </div>
        )}

        {/* 📌 [야구 선발투수 정보 바 - 오피셜 예고 확정 vs 선발 미정] */}
        {match.sport === 'baseball' && (
          <div className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between text-[10px] sm:text-[11px] font-bold ${
            isLight ? 'bg-white border-amber-300/80 shadow-sm' : 'bg-slate-900 border-amber-500/30'
          }`}>
            <div className="text-emerald-700 truncate flex items-center gap-1">
              <span>⚾ [홈]</span>
              <span className={`font-black ${isHomeStarterConfirmed ? 'text-emerald-500' : 'text-amber-400'}`}>
                {isHomeStarterConfirmed ? `🟢 ${homeStarterStr}` : `🟡 ${homeStarterStr}`}
              </span>
            </div>
            <span className="text-amber-500 font-bold mx-1 shrink-0">VS</span>
            <div className="text-cyan-700 text-right truncate flex items-center gap-1 justify-end">
              <span className={`font-black ${isAwayStarterConfirmed ? 'text-cyan-400' : 'text-amber-400'}`}>
                {isAwayStarterConfirmed ? `${awayStarterStr} 🟢` : `${awayStarterStr} 🟡`}
              </span>
              <span>[원정] ⚾</span>
            </div>
          </div>
        )}

        {/* ⚔️ [오피셜 맞대결 상대전적 요약 바] */}
        {match.headToHeadRecord && match.headToHeadRecord.last5Matches && match.headToHeadRecord.last5Matches.length > 0 && (
          <div className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between text-[10px] sm:text-[11px] font-bold ${
            isLight ? 'bg-amber-50/70 border-amber-300 text-slate-800' : 'bg-slate-900 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-amber-500 font-black shrink-0">⚔️ 상대전적:</span>
              <span className="truncate font-semibold">{match.headToHeadRecord.summaryText}</span>
            </div>
            <span className="font-mono text-[10px] text-amber-400 shrink-0 ml-1 font-bold">
              [홈 {match.headToHeadRecord.homeWins}승 {match.headToHeadRecord.draws > 0 ? `${match.headToHeadRecord.draws}무 ` : ''}{match.headToHeadRecord.awayWins}패]
            </span>
          </div>
        )}

        {/* 📌 🎯 [프로토 기록식 전용 점수식 선택 그리드] */}
        {match.betmanFolder === 'GIROKSIK' ? (
          <div className={`pt-2 border-t space-y-2 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <div className={`flex items-center justify-between text-[11px] font-black px-2.5 py-1 rounded-lg border shadow-xs ${
              isLight ? 'bg-amber-50 text-amber-950 border-amber-300' : 'bg-slate-900 text-amber-300 border-amber-500/30'
            }`}>
              <span>🎯 [프로토 기록식] 베트맨 오피셜 점수식 셀렉터</span>
              <span className="text-[10px] opacity-80">
                {isFinished ? '🏆 경기종료 결과 집계 완료' : '원하는 점수 개별 클릭 마킹'}
              </span>
            </div>

            {/* Score Grid: Home Win / Draw / Away Win columns */}
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {/* Column 1: Home Win Scores */}
              <div className="space-y-1">
                <div className={`text-[10px] font-black px-1.5 py-0.5 rounded text-center border ${
                  isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                }`}>
                  홈 승 점수
                </div>
                {[
                  { score: '1 : 0', odds: 6.20 },
                  { score: '2 : 0', odds: 7.50 },
                  { score: '2 : 1', odds: 8.10 },
                  { score: '3 : 0', odds: 14.5 },
                  { score: '3 : 1', odds: 16.0 },
                  { score: '3 : 2', odds: 28.0 },
                  { score: '4 : 0', odds: 45.0 }
                ].map((item) => {
                  const pickKey = `SCORE_${item.score}`;
                  const isSelected = markedPicks.includes(pickKey as any);
                  const isWinningScore = isFinished && winningPicks.has(pickKey);
                  return (
                    <button
                      key={item.score}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTogglePick) onTogglePick(match.id, pickKey as any);
                      }}
                      className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-black flex items-center justify-between transition-all cursor-pointer border shadow-xs ${
                        isSelected
                          ? isWinningScore
                            ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-300 scale-[1.03]'
                            : 'bg-emerald-500 text-white border-emerald-600 scale-[1.02]'
                          : isWinningScore
                          ? isLight
                            ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 font-extrabold ring-1 ring-emerald-400'
                            : 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400 font-extrabold ring-1 ring-emerald-500'
                          : isFinished
                          ? isLight
                            ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                            : 'bg-slate-900 text-slate-500 border-slate-800 opacity-60'
                          : isLight
                          ? 'bg-white hover:bg-emerald-50 text-slate-900 border-slate-200 hover:border-emerald-400'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {isWinningScore && <span className="text-[9px] bg-emerald-500 text-white px-1 py-0.2 rounded font-black">✓ 적중</span>}
                        <span>{item.score}</span>
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-white' : 'text-emerald-600 font-bold'}`}>{item.odds}</span>
                    </button>
                  );
                })}
              </div>

              {/* Column 2: Draw Scores */}
              <div className="space-y-1">
                <div className={`text-[10px] font-black px-1.5 py-0.5 rounded text-center border ${
                  isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                }`}>
                  무승부 점수
                </div>
                {[
                  { score: '0 : 0', odds: 8.50 },
                  { score: '1 : 1', odds: 6.40 },
                  { score: '2 : 2', odds: 15.0 },
                  { score: '3 : 3', odds: 45.0 }
                ].map((item) => {
                  const pickKey = `SCORE_${item.score}`;
                  const isSelected = markedPicks.includes(pickKey as any);
                  const isWinningScore = isFinished && winningPicks.has(pickKey);
                  return (
                    <button
                      key={item.score}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTogglePick) onTogglePick(match.id, pickKey as any);
                      }}
                      className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-black flex items-center justify-between transition-all cursor-pointer border shadow-xs ${
                        isSelected
                          ? isWinningScore
                            ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-200 scale-[1.03]'
                            : 'bg-amber-400 text-slate-950 border-amber-500 scale-[1.02]'
                          : isWinningScore
                          ? isLight
                            ? 'bg-amber-50 text-amber-950 border-2 border-amber-500 font-extrabold ring-1 ring-amber-400'
                            : 'bg-amber-950/90 text-amber-300 border-2 border-amber-400 font-extrabold ring-1 ring-amber-500'
                          : isFinished
                          ? isLight
                            ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                            : 'bg-slate-900 text-slate-500 border-slate-800 opacity-60'
                          : isLight
                          ? 'bg-white hover:bg-amber-50 text-slate-900 border-slate-200 hover:border-amber-400'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {isWinningScore && <span className="text-[9px] bg-amber-500 text-slate-950 px-1 py-0.2 rounded font-black">✓ 적중</span>}
                        <span>{item.score}</span>
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-slate-950 font-black' : 'text-amber-600 font-bold'}`}>{item.odds}</span>
                    </button>
                  );
                })}
              </div>

              {/* Column 3: Away Win Scores */}
              <div className="space-y-1">
                <div className={`text-[10px] font-black px-1.5 py-0.5 rounded text-center border ${
                  isLight ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                }`}>
                  원정 승 점수
                </div>
                {[
                  { score: '0 : 1', odds: 7.20 },
                  { score: '0 : 2', odds: 11.0 },
                  { score: '1 : 2', odds: 9.80 },
                  { score: '0 : 3', odds: 22.0 },
                  { score: '1 : 3', odds: 25.0 },
                  { score: '2 : 3', odds: 35.0 },
                  { score: '0 : 4', odds: 55.0 }
                ].map((item) => {
                  const pickKey = `SCORE_${item.score}`;
                  const isSelected = markedPicks.includes(pickKey as any);
                  const isWinningScore = isFinished && winningPicks.has(pickKey);
                  return (
                    <button
                      key={item.score}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTogglePick) onTogglePick(match.id, pickKey as any);
                      }}
                      className={`w-full py-1 px-1.5 rounded-lg text-[11px] font-black flex items-center justify-between transition-all cursor-pointer border shadow-xs ${
                        isSelected
                          ? isWinningScore
                            ? 'bg-cyan-600 text-white border-cyan-400 ring-2 ring-cyan-300 scale-[1.03]'
                            : 'bg-cyan-500 text-white border-cyan-600 scale-[1.02]'
                          : isWinningScore
                          ? isLight
                            ? 'bg-cyan-50 text-cyan-950 border-2 border-cyan-500 font-extrabold ring-1 ring-cyan-400'
                            : 'bg-cyan-950/90 text-cyan-300 border-2 border-cyan-400 font-extrabold ring-1 ring-cyan-500'
                          : isFinished
                          ? isLight
                            ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                            : 'bg-slate-900 text-slate-500 border-slate-800 opacity-60'
                          : isLight
                          ? 'bg-white hover:bg-cyan-50 text-slate-900 border-slate-200 hover:border-cyan-400'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {isWinningScore && <span className="text-[9px] bg-cyan-500 text-white px-1 py-0.2 rounded font-black">✓ 적중</span>}
                        <span>{item.score}</span>
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-white' : 'text-cyan-600 font-bold'}`}>{item.odds}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* 📌 5. 🖊️ [배트맨 오피셜 추가 게임 리스트 - 스포츠별 자동 맞춤 레이아웃] */
          <div className={`pt-2 border-t space-y-2.5 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            {subGames.map((game, idx) => {
              const badgeBg = idx === 0 
                ? (isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-200')
                : idx === 1 
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                : idx === 2
                ? 'bg-orange-600/20 text-orange-400 border border-orange-500/20'
                : idx === 3
                ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/20'
                : 'bg-purple-600/20 text-purple-400 border border-purple-500/20';

              const isLeftWon = isFinished && winningPicks.has(game.options.leftPick);
              const isMidWon = isFinished && !!game.options.midPick && winningPicks.has(game.options.midPick);
              const isRightWon = isFinished && winningPicks.has(game.options.rightPick);

              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1.5 shrink-0 sm:w-36">
                    <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${badgeBg}`}>
                      #{game.gameNo}
                    </span>
                    <span className="font-black text-slate-400">{game.title}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 flex-1">
                    {/* Left Button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (onTogglePick) onTogglePick(match.id, game.options.leftPick); }}
                      className={`py-1 px-1.5 rounded-lg text-[10px] font-black transition-all flex justify-between items-center cursor-pointer border shadow-xs relative ${
                        markedPicks.includes(game.options.leftPick)
                          ? isLeftWon
                            ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-300 shadow-md font-extrabold'
                            : 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                          : isLeftWon
                          ? isLight 
                            ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 font-extrabold shadow-sm ring-1 ring-emerald-400' 
                            : 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400 font-extrabold shadow-sm ring-1 ring-emerald-500'
                          : isFinished
                          ? isLight
                            ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                            : 'bg-slate-950 text-slate-500 border-slate-900 opacity-60'
                          : isLight 
                          ? 'bg-white hover:bg-emerald-50 text-slate-855 border-slate-200' 
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {isLeftWon && <span className="text-[9px] bg-emerald-500 text-white px-1 py-0.2 rounded font-black">✓ 적중</span>}
                        <span>{game.options.leftLabel}</span>
                      </span>
                      <span className="font-mono text-[9px] opacity-90">{renderOddsWithTrend(game.options.leftOdds, match.id, `${idx}_left`)}</span>
                    </button>

                    {/* Middle: Either a Button (for 3WAY) or a text block (for 2WAY) */}
                    {game.type === '3WAY' && game.options.midPick ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); if (onTogglePick) onTogglePick(match.id, game.options.midPick!); }}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-black transition-all flex justify-between items-center cursor-pointer border shadow-xs relative ${
                          markedPicks.includes(game.options.midPick!)
                            ? isMidWon
                              ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-200 shadow-md font-extrabold'
                              : 'bg-amber-400 text-slate-950 border-amber-500 shadow-md'
                            : isMidWon
                            ? isLight 
                              ? 'bg-amber-50 text-amber-950 border-2 border-amber-500 font-extrabold shadow-sm ring-1 ring-amber-400' 
                              : 'bg-amber-950/90 text-amber-300 border-2 border-amber-400 font-extrabold shadow-sm ring-1 ring-amber-500'
                            : isFinished
                            ? isLight
                              ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                              : 'bg-slate-950 text-slate-500 border-slate-900 opacity-60'
                            : isLight 
                            ? 'bg-white hover:bg-amber-50 text-slate-855 border-slate-200' 
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {isMidWon && <span className="text-[9px] bg-amber-500 text-slate-950 px-1 py-0.2 rounded font-black">✓ 적중</span>}
                          <span>{game.options.midLabel}</span>
                        </span>
                        <span className="font-mono text-[9px] opacity-90">{game.options.midOdds && renderOddsWithTrend(game.options.midOdds, match.id, `${idx}_mid`)}</span>
                      </button>
                    ) : (
                      <div className={`py-1 px-1.5 rounded-lg text-[10px] font-black flex items-center justify-center border ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-950 border-slate-900 text-slate-600'
                      }`}>
                        <span className="font-mono text-[9.5px]">{game.options.midLabel || '-'}</span>
                      </div>
                    )}

                    {/* Right Button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (onTogglePick) onTogglePick(match.id, game.options.rightPick); }}
                      className={`py-1 px-1.5 rounded-lg text-[10px] font-black transition-all flex justify-between items-center cursor-pointer border shadow-xs relative ${
                        markedPicks.includes(game.options.rightPick)
                          ? isRightWon
                            ? ((game.options.rightPick.includes('LOSE') && !game.options.rightPick.includes('HANDI') ? 'bg-cyan-600 text-white border-cyan-400 ring-2 ring-cyan-300' : 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-300') + ' shadow-md font-extrabold')
                            : ((game.options.rightPick.includes('LOSE') && !game.options.rightPick.includes('HANDI') ? 'bg-cyan-500 text-white border-cyan-600' : 'bg-purple-550 text-white border-purple-600') + ' shadow-md')
                          : isRightWon
                          ? isLight 
                            ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 font-extrabold shadow-sm ring-1 ring-emerald-400' 
                            : 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400 font-extrabold shadow-sm ring-1 ring-emerald-500'
                          : isFinished
                          ? isLight
                            ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                            : 'bg-slate-950 text-slate-500 border-slate-900 opacity-60'
                          : isLight 
                          ? 'bg-white hover:bg-purple-50 text-slate-855 border-slate-200' 
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {isRightWon && <span className="text-[9px] bg-emerald-500 text-white px-1 py-0.2 rounded font-black">✓ 적중</span>}
                        <span>{game.options.rightLabel}</span>
                      </span>
                      <span className="font-mono text-[9px] opacity-90">{renderOddsWithTrend(game.options.rightOdds, match.id, `${idx}_right`)}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 📌 [하단 메인 액션 바: AI 팩트 상세보기 & 실시간 응원 톡방] */}
        <div className={`pt-2.5 mt-2 border-t flex items-center gap-2 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMatch(match);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl border font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98 ${
              isLight 
                ? 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-700 hover:text-white border-emerald-500/30' 
                : 'bg-emerald-950/40 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/30'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>📊 AI 팩트 상세보기</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenChat) onOpenChat(match);
              else onSelectMatch(match);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border border-yellow-200 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-98"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-slate-950/30" />
            <span>💬 실시간 응원 톡방</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const MatchCard = React.memo(MatchCardComponent);
