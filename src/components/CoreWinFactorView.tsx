import React from 'react';
import { Target, Zap, Crosshair, Trophy, TrendingUp, Lock, Crown } from 'lucide-react';
import type { SoccerWinFactorMetrics, MembershipTier } from '../types/sports';

interface CoreWinFactorViewProps {
  metrics: SoccerWinFactorMetrics;
  homeName: string;
  awayName: string;
  membershipTier?: MembershipTier;
  onOpenPaywall?: () => void;
  theme?: 'light' | 'dark';
}

export const CoreWinFactorView: React.FC<CoreWinFactorViewProps> = ({
  metrics,
  homeName = '홈팀',
  awayName = '원정팀',
  membershipTier = 'VVIP',
  onOpenPaywall,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const isVvip = membershipTier === 'VVIP';

  const safeMetrics = metrics || {
    xgMarginDiff: 0.3,
    homeXg: 1.45,
    homeXga: 1.15,
    awayXg: 1.15,
    awayXga: 1.45,
    homeBigChances: 3,
    homeBigChancesConceded: 1,
    awayBigChances: 2,
    awayBigChancesConceded: 2,
    homeInsideBoxShotPct: 65,
    awayInsideBoxShotPct: 55,
    homeInsideBoxShots: 8,
    homeTotalShots: 12,
    awayInsideBoxShots: 6,
    awayTotalShots: 11,
    homeFieldTiltPct: 54,
    awayFieldTiltPct: 46,
    fieldTiltLeader: 'HOME' as const,
    homeFirstGoalWinPct: 75,
    homeFirstGoalUnbeatenPct: 88,
    awayFirstGoalWinPct: 62,
    awayFirstGoalUnbeatenPct: 78,
    winFactorVerdict: '기대 득점 및 파이널 서드 장악력 우세',
    keyWinFactorAdvantage: '홈팀 공격 찬스 창출력 우세'
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 shadow-xl transition-all relative overflow-hidden ${
      isLight 
        ? 'bg-white border-amber-300 shadow-amber-100/50' 
        : 'bg-slate-950 border-amber-500/50 text-slate-100'
    }`}>
      {/* 👑 VVIP Header & Key Advantage Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
        isLight 
          ? 'bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-amber-300 text-amber-950' 
          : 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-amber-500/60 text-amber-200'
      }`}>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />
          <div>
            <span className="text-xs font-black tracking-wide flex items-center gap-1.5">
              <span>👑 [VVIP 전용 모드] 5대 핵심 승패 지표 분석</span>
              {!isVvip && (
                <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> 잠김
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold opacity-90 block mt-0.5">
              {isVvip ? safeMetrics.keyWinFactorAdvantage : '🔥 [VVIP 전용 팩트] 파이널 서드 장악률 & 1:1 빅찬스 및 선제골 승점 확보율'}
            </span>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-md font-black bg-amber-500 text-slate-950 shrink-0 self-end sm:self-center shadow flex items-center gap-1">
          <Crown className="w-3 h-3 text-slate-950" />
          <span>VVIP EXCLUSIVE</span>
        </span>
      </div>

      {/* NON-VVIP PAYWALL OVERLAY */}
      {!isVvip && (
        <div className="absolute inset-0 top-16 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-sm sm:text-base text-amber-300 flex items-center justify-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>5대 핵심 승패 지표는 VVIP 전용 분석입니다</span>
            </h4>
            <p className="text-xs text-slate-300 max-w-md">
              xG 기대득점 · 빅찬스 · 박스 안 슈팅 비중 · 필드 틸트 · 선제골 승률 등 단판 승패를 가르는 5대 핵심 팩트를 VVIP 구독으로 즉시 확인하세요.
            </p>
          </div>
          <button
            onClick={onOpenPaywall}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer border border-yellow-200"
          >
            <Crown className="w-4 h-4 text-slate-950" />
            <span>VVIP 5대 핵심 지표 잠금 해제하기 💳</span>
          </button>
        </div>
      )}

      {/* 5대 핵심 지표 그리드 (2열 / 1열 반응형) */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 text-xs ${!isVvip ? 'filter blur-sm select-none pointer-events-none opacity-60' : ''}`}>
        
        {/* 1. xG (기대 득점) & xGA (기대 실점) */}
        <div className={`p-3.5 rounded-xl border space-y-2.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between font-black">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <Target className="w-4 h-4" />
              <span>1. xG (기대 득점) & xGA (기대 실점)</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
              safeMetrics.xgMarginDiff > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              xG 마진 {safeMetrics.xgMarginDiff > 0 ? `+${safeMetrics.xgMarginDiff}` : safeMetrics.xgMarginDiff}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-emerald-400">[홈] {safeMetrics.homeXg}골 (xGA {safeMetrics.homeXga})</span>
              <span className="text-cyan-400">(xGA {safeMetrics.awayXga}) {safeMetrics.awayXg}골 [원정]</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all duration-700" 
                style={{ width: `${(safeMetrics.homeXg / (safeMetrics.homeXg + safeMetrics.awayXg || 1)) * 100}%` }}
              />
              <div 
                className="bg-cyan-500 h-full transition-all duration-700" 
                style={{ width: `${(safeMetrics.awayXg / (safeMetrics.homeXg + safeMetrics.awayXg || 1)) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              ※ 슈팅 위치/각도/수비압박을 0~1로 환산한 실질 득점 기대 가치입니다.
            </p>
          </div>
        </div>

        {/* 2. 빅 찬스 (Big Chance) 창출/허용 */}
        <div className={`p-3.5 rounded-xl border space-y-2.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between font-black">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>2. 빅 찬스 (1:1 결정적 기회)</span>
            </span>
            <span className="text-[10px] text-slate-400">골키퍼 1:1 찬스 빈도</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className={`p-2 rounded-lg border ${
              isLight ? 'bg-white border-emerald-200' : 'bg-slate-950 border-emerald-500/30'
            }`}>
              <span className="text-slate-400 text-[10px] block">[홈] {homeName}</span>
              <span className="font-black text-emerald-400 text-sm mt-0.5 block">
                {safeMetrics.homeBigChances}회 창출
              </span>
              <span className="text-[9px] text-slate-400 block">허용 {safeMetrics.homeBigChancesConceded}회</span>
            </div>
            <div className={`p-2 rounded-lg border ${
              isLight ? 'bg-white border-cyan-200' : 'bg-slate-950 border-cyan-500/30'
            }`}>
              <span className="text-slate-400 text-[10px] block">[원정] {awayName}</span>
              <span className="font-black text-cyan-400 text-sm mt-0.5 block">
                {safeMetrics.awayBigChances}회 창출
              </span>
              <span className="text-[9px] text-slate-400 block">허용 {safeMetrics.awayBigChancesConceded}회</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            ※ 오픈 찬스/1대1처럼 득점 성공률이 극도로 높은 결정적 기회 횟수입니다.
          </p>
        </div>

        {/* 3. 박스 안 슈팅 비율 (Inside Box Shot %) */}
        <div className={`p-3.5 rounded-xl border space-y-2.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between font-black">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Crosshair className="w-4 h-4 text-purple-400" />
              <span>3. 박스 안 슈팅 비율</span>
            </span>
            <span className="text-[10px] text-purple-300 font-bold">성공률 15~20% 고효율</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-emerald-400">[홈] {safeMetrics.homeInsideBoxShotPct}% ({safeMetrics.homeInsideBoxShots}/{safeMetrics.homeTotalShots}개)</span>
              <span className="text-cyan-400">({safeMetrics.awayInsideBoxShots}/{safeMetrics.awayTotalShots}개) {safeMetrics.awayInsideBoxShotPct}% [원정]</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className="bg-purple-500 h-full transition-all duration-700" 
                style={{ width: `${(safeMetrics.homeInsideBoxShotPct / (safeMetrics.homeInsideBoxShotPct + safeMetrics.awayInsideBoxShotPct || 1)) * 100}%` }}
              />
              <div 
                className="bg-indigo-500 h-full transition-all duration-700" 
                style={{ width: `${(safeMetrics.awayInsideBoxShotPct / (safeMetrics.homeInsideBoxShotPct + safeMetrics.awayInsideBoxShotPct || 1)) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              ※ 중거리슛(성공률 3~5%) 대비 페널티 박스 안 고확률 슈팅 비중입니다.
            </p>
          </div>
        </div>

        {/* 4. 필드 틸트 (Field Tilt % - 위험지역 패스 점유율) */}
        <div className={`p-3.5 rounded-xl border space-y-2.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between font-black">
            <span className="flex items-center gap-1.5 text-blue-400">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>4. 필드 틸트 (위험지역 점유율)</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
              {safeMetrics.fieldTiltLeader === 'HOME' ? `${homeName} 주도 🟢` : (safeMetrics.fieldTiltLeader === 'AWAY' ? `${awayName} 주도 🔵` : '대등 🤝')}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-emerald-400">[홈] {safeMetrics.homeFieldTiltPct}%</span>
              <span className="text-cyan-400">{safeMetrics.awayFieldTiltPct}% [원정]</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all duration-700" 
                style={{ width: `${safeMetrics.homeFieldTiltPct}%` }}
              />
              <div 
                className="bg-cyan-500 h-full transition-all duration-700" 
                style={{ width: `${safeMetrics.awayFieldTiltPct}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              ※ 무의미한 후방 패스를 제외하고, 상대편 위험 지역(파이널 서드)에서 발생한 패스 점유율입니다.
            </p>
          </div>
        </div>

      </div>

      {/* 5. 선제골 성공률 (First Goal Win %) 와이드 카드 */}
      <div className={`p-3.5 rounded-xl border space-y-2 ${
        !isVvip ? 'filter blur-sm select-none pointer-events-none opacity-60' : ''
      } ${
        isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-900/90 border-amber-500/30'
      }`}>
        <div className="flex items-center justify-between font-black text-xs">
          <span className="flex items-center gap-1.5 text-amber-500">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>5. 선제골 득점 시 승리 확률 & 승점 확보율</span>
          </span>
          <span className="text-[10px] text-slate-400">현대 축구 통계 기준</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
          <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div>
              <span className="font-bold text-emerald-400 block">[홈] {homeName}</span>
              <span className="text-[10px] text-slate-400">선제골 넣을 시 승점 확보율: {safeMetrics.homeFirstGoalUnbeatenPct}%</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-400 block">승률 {safeMetrics.homeFirstGoalWinPct}%</span>
              <span className="text-[9px] text-emerald-500/90 font-bold">압도적 우세</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div>
              <span className="font-bold text-cyan-400 block">[원정] {awayName}</span>
              <span className="text-[10px] text-slate-400">선제골 넣을 시 승점 확보율: {safeMetrics.awayFirstGoalUnbeatenPct}%</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-cyan-400 block">승률 {safeMetrics.awayFirstGoalWinPct}%</span>
              <span className="text-[9px] text-cyan-500/90 font-bold">강력한 방어력</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 font-medium bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 leading-relaxed mt-2">
          {safeMetrics.winFactorVerdict}
        </p>
      </div>
    </div>
  );
};
