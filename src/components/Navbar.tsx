import React from 'react';
import { Sparkles, Trophy, Bell, ShieldCheck, Filter, Eye, EyeOff } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';

interface NavbarProps {
  matches: Match[];
  membershipTier: MembershipTier;
  onOpenMobileConnect: () => void;
  onOpenIntegrityDashboard: () => void;
  onSelectMatch: (match: Match) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  showAllMatchesMode?: boolean; // 4번: 설정/필터 탭 [전체 보기] 토글 상태
  onToggleShowAllMatches?: () => void; // 4번: 설정/필터 탭 [전체 보기] 토글 핸들러
}

export const Navbar: React.FC<NavbarProps> = ({
  matches,
  membershipTier,
  onOpenMobileConnect,
  onOpenIntegrityDashboard,
  onSelectMatch,
  theme = 'light',
  onToggleTheme,
  showAllMatchesMode = false,
  onToggleShowAllMatches
}) => {
  const isLight = theme === 'light';

  // 4번: 경기 시작 시 상단 전경기 바에서 해당 경기 자동 숨김 (showAllMatchesMode가 true면 100% 전체 노출)
  const displayTickerMatches = matches.filter((m) => {
    if (showAllMatchesMode) return true; // 4번 설정 탭 [전체 보기] 활성화 시 진행/종료 경기 다 보임
    return !(m as any).isStarted && m.status !== 'LIVE' && m.status !== 'FINISHED'; // 기본: 시작 안 한 경기만 표기
  });

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
      isLight ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-lg'
    }`}>
      {/* 🚀 상단 오피셜 라이브 틱커 경기바 (3번 & 4번 무인 자동화 반영) */}
      <div className={`w-full py-1.5 px-3 border-b overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2 text-xs ${
        isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-850'
      }`}>
        <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-500/20">
          <Trophy className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
          <span>오피셜 경기바 ({displayTickerMatches.length}경기)</span>
        </div>

        {/* 4번: 설정/필터 탭 - [전체 보기] 토글 스위치 */}
        <button
          type="button"
          onClick={onToggleShowAllMatches}
          className={`px-2 py-0.5 rounded-md border font-extrabold text-[11px] transition-all shrink-0 flex items-center gap-1 ${
            showAllMatchesMode
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : isLight ? 'bg-white text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-200 border-slate-700'
          }`}
          title="경기가 시작되면 자동으로 숨겨지며, [전체 보기] 클릭 시 시작/종료된 경기도 모두 표시됩니다."
        >
          {showAllMatchesMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>{showAllMatchesMode ? '전체 보기 ON' : '시작 전 경기만 (시작 시 숨김)'}</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-800 shrink-0" />

        {displayTickerMatches.length === 0 ? (
          <span className="text-slate-400 font-bold text-[11px] px-2">
            현재 예정된 시작 전 경기가 모두 진행 중/종료되었습니다. [전체 보기 ON]을 누르면 모든 경기를 보실 수 있습니다.
          </span>
        ) : (
          displayTickerMatches.map((m) => {
            const isFinished = m.status === 'FINISHED';
            const isLive = m.status === 'LIVE';

            return (
              <div
                key={m.id}
                onClick={() => onSelectMatch(m)}
                className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border cursor-pointer transition-all shrink-0 ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-200'
                }`}
              >
                <span className="font-bold text-[11px]">{m.homeTeam.name}</span>
                
                {/* 3번: 종료된 경기 오피셜 결과 체크 표기 */}
                {isFinished ? (
                  <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-600 font-black text-[10px] border border-rose-400/30">
                    종료 ({m.homeScore}:{m.awayScore} {(m as any).winningPick ? `✔ ${(m as any).winningPick}` : ''})
                  </span>
                ) : isLive ? (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 font-black text-[10px] border border-emerald-400/30 animate-pulse">
                    LIVE ({m.homeScore}:{m.awayScore})
                  </span>
                ) : (
                  <span className="text-slate-400 font-extrabold text-[10px]">vs</span>
                )}
                
                <span className="font-bold text-[11px]">{m.awayTeam.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">({m.matchTime})</span>
              </div>
            );
          })
        )}
      </div>
    </header>
  );
};
