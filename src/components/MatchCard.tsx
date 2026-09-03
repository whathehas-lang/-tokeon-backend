import React from 'react';
import { ChevronRight, Star, MessageCircle, BarChart2, Flame } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';
import { isMatchCompleted, getMatchScore, calculateWinningPicks, getEvaluatedMatchStatus, getAutoTodayFormattedDate } from '../utils/matchResultHelper';

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

export const MatchCardComponent = ({ match, membershipTier = 'VVIP', cardDensity = 'DETAILED', markedPicks = [], allMatches = [], onSelectMatch, onOpenChat, onToggleFavorite, onTogglePick, theme = 'light' }: MatchCardProps) => {
  const isLight = theme === 'light';
  
  const evaluatedStatus = getEvaluatedMatchStatus(match);
  const isFinished = evaluatedStatus === 'FINISHED';
  const isLiveNow = evaluatedStatus === 'LIVE';
  const { homeScore, awayScore } = getMatchScore(match);
  const autoToday = getAutoTodayFormattedDate(); // 🗓️ 365일 무인 자동 날짜/요일 산출기

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
        {/* Header line: Match No, League, Time */}
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
            ) : isLiveNow ? (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-700 font-black text-[10px] shrink-0 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                LIVE ({homeScore}:{awayScore})
              </span>
            ) : (
              <span className={`font-semibold text-[10px] shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {autoToday.fullTimeStr}
              </span>
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

  // 📌 2. 📱 [상세 카드 모드]
  return (
    <div 
      className={`border rounded-2xl p-3.5 sm:p-4 transition-all shadow-md hover:shadow-xl cursor-pointer group flex flex-col space-y-3 relative w-full ${
        isLight
          ? `bg-white hover:bg-slate-50 ${match.isFavorite ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200'} hover:border-emerald-500`
          : `bg-slate-900/95 hover:bg-slate-850 ${match.isFavorite ? 'border-amber-500/80 glow-emerald' : 'border-slate-800'} hover:border-emerald-500/50`
      }`}
      onClick={() => onSelectMatch(match)}
    >
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
            <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 font-black text-[10px] shrink-0">
              경기종료 ({homeScore}:{awayScore})
            </span>
          ) : isLiveNow ? (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-700 font-black text-[10px] shrink-0 flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              🔴 LIVE ({homeScore}:{awayScore})
            </span>
          ) : (
            <span className={`font-semibold text-[10px] shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {autoToday.fullTimeStr}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(match.id);
            }}
            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all shrink-0 ${
              match.isFavorite 
                ? 'bg-amber-500/20 text-amber-600 border-amber-400' 
                : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Star className={`w-3.5 h-3.5 inline mr-1 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            {match.isFavorite ? '알림ON' : '관심'}
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-3 p-3 rounded-xl border text-sm ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
      }`}>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 mb-0.5">HOME</span>
          <span className={`font-black text-sm sm:text-base ${isFinished && homeScore > awayScore ? 'text-emerald-600' : ''}`}>
            {sportIcon} {match.homeTeam.name}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-400 mb-0.5">AWAY</span>
          <span className={`font-black text-sm sm:text-base ${isFinished && awayScore > homeScore ? 'text-cyan-600' : ''}`}>
            {match.awayTeam.name} {sportIcon}
          </span>
        </div>
      </div>
    </div>
  );
};

export const MatchCard = React.memo(MatchCardComponent);
