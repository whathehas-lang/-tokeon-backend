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
    </header>
  );
};
