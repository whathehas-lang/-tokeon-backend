import React from 'react';
import { Star, MessageCircle, BarChart2, Flame, TrendingUp, ChevronRight } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';
import { getMatchScore, getEvaluatedMatchStatus } from '../utils/matchResultHelper';
import { getLocalizedTeamName, type AppLanguage } from '../utils/languageHelper';
import { SportsEntityMappingService } from '../services/mappers/sportsEntityMappingService';

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
  lang?: AppLanguage;
}

export const MatchCardComponent = ({
  match,
  membershipTier = 'VVIP',
  cardDensity = 'DETAILED',
  markedPicks = [],
  allMatches = [],
  onSelectMatch,
  onOpenChat,
  onToggleFavorite,
  onTogglePick,
  theme = 'light',
  lang = 'ko'
}: MatchCardProps) => {
  const isLight = theme === 'light';
  
  const evaluatedStatus = getEvaluatedMatchStatus(match);
  const isFinished = evaluatedStatus === 'FINISHED';
  const isLiveNow = evaluatedStatus === 'LIVE';
  const { homeScore, awayScore } = getMatchScore(match);

  const getSportIcon = (sportStr: string) => {
    if (sportStr === 'baseball') return '⚾';
    if (sportStr === 'basketball') return '🏀';
    if (sportStr === 'volleyball') return '🏐';
    if (sportStr === 'hockey') return '🏒';
    return '⚽';
  };

  const sportIcon = getSportIcon(match.sport);

  const homeEntity = SportsEntityMappingService.resolveTeamEntity(match.homeTeam.name);
  const awayEntity = SportsEntityMappingService.resolveTeamEntity(match.awayTeam.name);

  const homeLogo = homeEntity?.logo;
  const awayLogo = awayEntity?.logo;

  const odds = (match as any).foreignApiStats?.pinnacleOdds || match.betmanOdds || { win: 1.95, draw: 3.30, lose: 2.90 };

  const homePickKey = `${match.id}_WIN`;
  const drawPickKey = `${match.id}_DRAW`;
  const awayPickKey = `${match.id}_LOSE`;

  const isHomePicked = markedPicks.includes(homePickKey) || markedPicks.includes('WIN');
  const isDrawPicked = markedPicks.includes(drawPickKey) || markedPicks.includes('DRAW');
  const isAwayPicked = markedPicks.includes(awayPickKey) || markedPicks.includes('LOSE');

  const hasDraw = match.sport !== 'baseball' && match.sport !== 'basketball';

  return (
    <div
      onClick={() => onSelectMatch(match)}
      className={`relative w-full rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden group select-none ${
        isLight
          ? `bg-white hover:bg-slate-50/90 ${match.isFavorite ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200/90'} shadow-xs hover:shadow-md`
          : `bg-slate-900/95 hover:bg-slate-850 ${match.isFavorite ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-800/90'} shadow-sm hover:border-slate-700`
      }`}
    >
      {/* 🏅 Top Header: 리그, 시간/상태, 즐겨찾기 & 톡방 버튼 */}
      <div className={`px-3 py-2 flex items-center justify-between border-b text-xs ${
        isLight ? 'bg-slate-50/80 border-slate-100 text-slate-600' : 'bg-slate-950/60 border-slate-800/70 text-slate-400'
      }`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-xs shrink-0">{match.countryFlag || sportIcon}</span>
          <span className="font-extrabold text-[11px] truncate tracking-tight text-slate-800 dark:text-slate-200">
            {match.league}
          </span>
          {isLiveNow ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-500 font-black text-[10px] tracking-wide animate-pulse border border-rose-500/30 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              LIVE
            </span>
          ) : isFinished ? (
            <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] shrink-0">
              종료
            </span>
          ) : (
            <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 shrink-0">
              {match.matchTime}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* 독립 실시간 톡방 바로가기 버튼 */}
          {onOpenChat && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(match);
              }}
              className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                isLight 
                  ? 'bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border-slate-200' 
                  : 'bg-slate-900 hover:bg-emerald-950/50 text-slate-400 hover:text-emerald-400 border-slate-800'
              }`}
              title="실시간 톡방 열기"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 관심 경기 (즐겨찾기) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(match.id);
            }}
            className={`p-1 rounded-lg border transition-colors cursor-pointer ${
              match.isFavorite
                ? 'bg-amber-500/20 text-amber-500 border-amber-400/50'
                : isLight ? 'bg-white hover:bg-slate-100 text-slate-400 hover:text-amber-500 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border-slate-800'
            }`}
            title={match.isFavorite ? '즐겨찾기 해제' : '관심 경기 등록'}
          >
            <Star className={`w-3.5 h-3.5 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 🏟️ Center Match Content: 홈팀 vs 스코어/시간 vs 원정팀 */}
      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2">
        {/* [홈팀] */}
        <div className="flex-1 flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
            {homeLogo ? (
              <img src={homeLogo} alt="" className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            ) : (
              <span>{sportIcon}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black text-emerald-500 shrink-0">홈</span>
              <span className={`font-bold text-xs sm:text-sm truncate block ${
                isFinished && homeScore > awayScore ? 'text-emerald-500 font-extrabold' : ''
              }`}>
                {getLocalizedTeamName(match.homeTeam.name, lang)}
              </span>
            </div>
            {match.sport === 'baseball' && match.homeTeam.starterPitcherInfo?.name && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">
                선발 {match.homeTeam.starterPitcherInfo.name} ({match.homeTeam.starterPitcherInfo.era || 'ERA --'})
              </span>
            )}
          </div>
        </div>

        {/* [스코어 또는 VS 배지] */}
        <div className="shrink-0 px-2 flex flex-col items-center justify-center">
          {isLiveNow || isFinished ? (
            <div className={`px-2.5 py-1 rounded-xl font-mono font-black text-sm sm:text-base border flex items-center gap-1.5 shadow-xs ${
              isLiveNow
                ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}>
              <span className={homeScore > awayScore ? 'text-emerald-500' : ''}>{homeScore}</span>
              <span className="text-slate-400">:</span>
              <span className={awayScore > homeScore ? 'text-emerald-500' : ''}>{awayScore}</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              VS
            </div>
          )}
        </div>

        {/* [원정팀] */}
        <div className="flex-1 flex items-center justify-end gap-2.5 min-w-0 text-right">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-end gap-1">
              <span className={`font-bold text-xs sm:text-sm truncate block ${
                isFinished && awayScore > homeScore ? 'text-emerald-500 font-extrabold' : ''
              }`}>
                {getLocalizedTeamName(match.awayTeam.name, lang)}
              </span>
              <span className="text-[10px] font-black text-cyan-400 shrink-0">원정</span>
            </div>
            {match.sport === 'baseball' && match.awayTeam.starterPitcherInfo?.name && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">
                선발 {match.awayTeam.starterPitcherInfo.name} ({match.awayTeam.starterPitcherInfo.era || 'ERA --'})
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
            {awayLogo ? (
              <img src={awayLogo} alt="" className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            ) : (
              <span>{sportIcon}</span>
            )}
          </div>
        </div>
      </div>

      {/* 📊 Bottom Bar: 오피셜 배당률 퀵 버튼 (승 / 무 / 패) */}
      <div className={`px-2.5 py-1.5 border-t grid ${hasDraw ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 text-xs ${
        isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-slate-950/40 border-slate-800/60'
      }`}>
        <button
          type="button"
          onClick={(e) => {
            if (onTogglePick) {
              e.stopPropagation();
              onTogglePick(match.id, 'WIN');
            }
          }}
          className={`py-1 px-1.5 rounded-lg border text-center font-bold flex items-center justify-between transition-all cursor-pointer ${
            isHomePicked
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs font-black'
              : isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <span className="text-[10px] opacity-75">승</span>
          <span className="font-mono text-[11px] font-bold">{odds.win ? Number(odds.win).toFixed(2) : '1.95'}</span>
        </button>

        {hasDraw && (
          <button
            type="button"
            onClick={(e) => {
              if (onTogglePick) {
                e.stopPropagation();
                onTogglePick(match.id, 'DRAW');
              }
            }}
            className={`py-1 px-1.5 rounded-lg border text-center font-bold flex items-center justify-between transition-all cursor-pointer ${
              isDrawPicked
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs font-black'
                : isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <span className="text-[10px] opacity-75">무</span>
            <span className="font-mono text-[11px] font-bold">{odds.draw ? Number(odds.draw).toFixed(2) : '3.30'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            if (onTogglePick) {
              e.stopPropagation();
              onTogglePick(match.id, 'LOSE');
            }
          }}
          className={`py-1 px-1.5 rounded-lg border text-center font-bold flex items-center justify-between transition-all cursor-pointer ${
            isAwayPicked
              ? 'bg-cyan-500 text-white border-cyan-400 shadow-xs font-black'
              : isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <span className="text-[10px] opacity-75">패</span>
          <span className="font-mono text-[11px] font-bold">{odds.lose ? Number(odds.lose).toFixed(2) : '2.90'}</span>
        </button>
      </div>
    </div>
  );
};

export const MatchCard = React.memo(MatchCardComponent);
