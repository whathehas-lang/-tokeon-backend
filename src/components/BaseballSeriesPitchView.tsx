import React, { useState } from 'react';
import { Flame, Clock, Zap, Shield, AlertTriangle, Lock, Crown } from 'lucide-react';
import type { BaseballSeriesPitchTracker, Team, IndividualPitcherRecord, MembershipTier } from '../types/sports';
import { BaseballSeriesFatigueEngine } from '../services/enricher/baseballSeriesFatigueEngine';

interface BaseballSeriesPitchViewProps {
  tracker: BaseballSeriesPitchTracker;
  homeTeam: Team;
  awayTeam: Team;
  membershipTier?: MembershipTier;
  onOpenPaywall?: () => void;
  theme?: 'light' | 'dark';
}

export const BaseballSeriesPitchView = ({ 
  tracker, 
  homeTeam, 
  awayTeam,
  membershipTier = 'VVIP',
  onOpenPaywall,
  theme = 'dark'
}: BaseballSeriesPitchViewProps) => {
  const [selectedRound, setSelectedRound] = useState<'GAME_1' | 'GAME_2' | 'GAME_3'>(tracker?.seriesRoundType || 'GAME_1');
  const isVvip = membershipTier === 'VVIP';

  if (!homeTeam || !awayTeam) return null;

  const homeStarter = homeTeam.starterPitcherInfo || {
    name: '홈 선발투수',
    number: 1,
    throwsHand: 'R',
    era: '3.50',
    whip: '1.20',
    wins: 0,
    losses: 0,
    inningsPitched: '0.0',
    strikeouts: 0,
    vsOpponentLogs: []
  };

  const awayStarter = awayTeam.starterPitcherInfo || {
    name: '원정 선발투수',
    number: 1,
    throwsHand: 'R',
    era: '3.50',
    whip: '1.20',
    wins: 0,
    losses: 0,
    inningsPitched: '0.0',
    strikeouts: 0,
    vsOpponentLogs: []
  };

  // 선택된 연전 차수(1차전/2차전/3차전)에 맞게 다이내믹 트래커 생성
  const activeTracker = BaseballSeriesFatigueEngine.buildSeriesTracker(
    selectedRound,
    homeTeam,
    awayTeam,
    homeStarter,
    awayStarter
  );

  const games = activeTracker.games || [];
  const homeBullpenTotal = activeTracker.homeSeriesBullpenPitchesTotal || 0;
  const awayBullpenTotal = activeTracker.awaySeriesBullpenPitchesTotal || 0;
  const bullpenDiff = awayBullpenTotal - homeBullpenTotal;
  const todayMatchup = activeTracker.todayMatchupInfo;

  // 🎨 2. UI 화면 구성 및 컬러 프론트엔드 렌더러
  // • VERIFIED: 검증 통과 정상 데이터 ➡️ 🔴 필승조 / ⚫ 추격조 정상 표출
  // • FLAGGED / RAW: 수치 미확정 상태 ➡️ '경기 데이터 정산 중 ⏳' 또는 '공식 기록 집계 중' 안전 표출
  const renderPitcherChip = (pitcher: IndividualPitcherRecord) => {
    // ⏳ FLAGGED or RAW (수치 미확정 / 이상 감지 / 검증 대기): 안전한 대기 표시 표출
    if (pitcher.sourceStatus === 'FLAGGED' || pitcher.sourceStatus === 'RAW' || pitcher.pitches < 0) {
      return (
        <div
          key={pitcher.id}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-950/40 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse"
        >
          <span className="text-slate-200 font-bold">{pitcher.name}</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black border border-amber-500/30 flex items-center gap-1">
            <span>경기 데이터 정산 중</span>
            <span>⏳</span>
          </span>
        </div>
      );
    }

    if (pitcher.role === 'VICTORY') {
      return (
        <div
          key={pitcher.id}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-sm transition-all hover:bg-rose-500/25"
        >
          <span className="text-xs">🔴</span>
          <span className="font-extrabold text-rose-200">{pitcher.name}</span>
          <span className="font-mono text-amber-300 font-black">{pitcher.pitches}구</span>
          {pitcher.isConsecutivePitching && (
            <span className="px-1 py-0.2 rounded bg-rose-900/60 text-rose-300 text-[9px] font-black border border-rose-500/50 flex items-center gap-0.5">
              <span>{pitcher.consecutiveDays > 1 ? `${pitcher.consecutiveDays}연투` : '연투'}</span>
              <span>⚠️</span>
            </span>
          )}
        </div>
      );
    }

    if (pitcher.role === 'PURSUIT') {
      return (
        <div
          key={pitcher.id}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-700/80 shadow-sm hover:bg-slate-800"
        >
          <span className="text-xs">⚫</span>
          <span className="text-slate-200">{pitcher.name}</span>
          <span className="font-mono text-slate-300 font-bold">{pitcher.pitches}구</span>
        </div>
      );
    }

    return (
      <div
        key={pitcher.id}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40"
      >
        <span className="text-xs">👑</span>
        <span className="font-black text-amber-200">{pitcher.name}</span>
        <span className="font-mono text-amber-300">{pitcher.pitches}구</span>
      </div>
    );
  };

  // 👑 당일 경기 불펜 대기조 전용: 1차전+2차전 시리즈 누적 투구수 및 연투 상태 정밀 표출
  const renderTodayBullpenChip = (pitcher: IndividualPitcherRecord) => {
    const isOverworked = pitcher.pitches >= 30 || pitcher.consecutiveDays >= 2;
    const isFresh = pitcher.pitches === 0 && pitcher.consecutiveDays === 0;

    return (
      <div
        key={pitcher.id}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border shadow-sm transition-all ${
          pitcher.role === 'VICTORY'
            ? isOverworked
              ? 'bg-rose-950/60 text-rose-200 border-rose-500/60'
              : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
            : isOverworked
              ? 'bg-slate-900 text-amber-200 border-amber-500/40'
              : 'bg-slate-900 text-slate-300 border-slate-700/80'
        }`}
      >
        <span className="text-xs">{pitcher.role === 'VICTORY' ? '🔴' : '⚫'}</span>
        <span className="font-extrabold text-white">{pitcher.name}</span>
        
        {/* 1차전 + 2차전 시리즈 누적 투구수 */}
        <span className={`font-mono px-1.5 py-0.5 rounded text-[10px] font-black ${
          pitcher.pitches > 0
            ? isOverworked
              ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        }`}>
          {selectedRound === 'GAME_1' ? `직전 ${pitcher.pitches}구` : selectedRound === 'GAME_2' ? `1차전 ${pitcher.pitches}구` : `1·2차 누적 ${pitcher.pitches}구`}
        </span>
        {pitcher.consecutiveDays >= 2 ? (
          <span className="px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200 text-[9px] font-black border border-rose-500 flex items-center gap-0.5 animate-pulse">
            <span>{pitcher.consecutiveDays}연투 과부하</span>
            <span>⚠️</span>
          </span>
        ) : pitcher.consecutiveDays === 1 ? (
          <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 text-[9px] font-bold border border-amber-500/40">
            1일 등판
          </span>
        ) : isFresh ? (
          <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[9px] font-bold border border-emerald-500/40">
            휴식 🟢
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div className={`p-3.5 sm:p-5 rounded-2xl border space-y-4 sm:space-y-5 shadow-xl relative overflow-hidden ${
      theme === 'light'
        ? 'bg-white border-amber-300 shadow-amber-100/50'
        : 'bg-slate-950 border-amber-500/40 text-slate-100'
    }`}>
      {/* 👑 VVIP Header & Key Advantage Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
        theme === 'light' 
          ? 'bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-amber-300 text-amber-950' 
          : 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-amber-500/60 text-amber-200'
      }`}>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />
          <div>
            <span className="text-xs font-black tracking-wide flex items-center gap-1.5">
              <span>👑 [VVIP 전용 모드] 시리즈(1·2·3차전) 마운드 피로도 & 투구수 분석</span>
              {!isVvip && (
                <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> 잠김
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold opacity-90 block mt-0.5">
              {isVvip ? activeTracker.bullpenOverloadSummaryText : '🔥 [VVIP 전용 팩트] 1·2·3차전 선발/불펜 누적 투구수, 2연투 과부하 및 당일 9이닝 마운드 인수인계 예측'}
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
        <div className="absolute inset-0 top-20 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md text-center space-y-3 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-sm sm:text-base text-amber-300 flex items-center justify-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>시리즈(1·2·3차전) 마운드 피로도 분석은 VVIP 전용입니다</span>
            </h4>
            <p className="text-xs text-slate-300 max-w-md">
              1차전·2차전·3차전 선발 및 불펜 실시간 투구수, 2연투 과부하 지수, 당일 9이닝 마운드 인수인계 예측은 VVIP 구독으로 즉시 확인하세요.
            </p>
          </div>
          <button
            onClick={onOpenPaywall}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer border border-yellow-200"
          >
            <Crown className="w-4 h-4 text-slate-950" />
            <span>VVIP 시리즈 마운드 지표 잠금 해제하기 💳</span>
          </button>
        </div>
      )}

      {/* 3연전 상세 지표 콘텐츠 영역 (VVIP 아닐 시 블러 처리) */}
      <div className={`space-y-4 sm:space-y-5 ${!isVvip ? 'filter blur-sm select-none pointer-events-none opacity-40' : ''}`}>
        {/* Header & 3-Tier Series Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm shrink-0">
              ⚾
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 flex-wrap">
                <span>{activeTracker.seriesName || '3연전 선발 & 불펜 피로도 분석'}</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  {activeTracker.seriesRoundLabel}
                </span>
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                직전 경기 선발·불펜 투구수/볼수 누적 집계 & 개별 투수 역할(필승조🔴 / 추격조⚫) 연투 분석
              </p>
            </div>
          </div>

          {/* 1차전 / 2차전 / 3차전 연전 탭 */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setSelectedRound('GAME_1')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                selectedRound === 'GAME_1'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                  : 'text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800'
              }`}
            >
              📅 이틀전 경기 (전전경기)
            </button>
            <button
              onClick={() => setSelectedRound('GAME_2')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                selectedRound === 'GAME_2'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                  : 'text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800'
              }`}
            >
              📅 어제 경기 (전경기)
            </button>
            <button
              onClick={() => setSelectedRound('GAME_3')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                selectedRound === 'GAME_3'
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                  : 'text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800'
              }`}
            >
              ⚾ 오늘 경기 (선발/피로도)
            </button>
          </div>
        </div>

        {/* 불펜 과부하 듀얼 비교 바 */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-emerald-400 flex items-center gap-1">
              🏠 [홈] 불펜 누적 {homeBullpenTotal}구 {homeBullpenTotal <= awayBullpenTotal ? '🟢 (휴식 충분·우세)' : '🟡'}
            </span>
            <span className="text-rose-400 flex items-center gap-1">
              ✈️ [원정] 불펜 누적 {awayBullpenTotal}구 {awayBullpenTotal > homeBullpenTotal ? `🔴 (+${Math.abs(bullpenDiff)}구 과부하)` : '🟢'}
            </span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-l-full transition-all duration-500" 
              style={{ width: `${(homeBullpenTotal / (homeBullpenTotal + awayBullpenTotal || 1)) * 100}%` }}
            />
            <div 
              className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-r-full transition-all duration-500" 
              style={{ width: `${(awayBullpenTotal / (homeBullpenTotal + awayBullpenTotal || 1)) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-300 font-semibold mt-1">
            {activeTracker.bullpenOverloadSummaryText}
          </p>
        </div>

        {/* 3단계 타임라인 카드: [전전경기 / 1차전] ⬇️ [전경기 / 2차전] (세로 형태 순차 배치) */}
        <div className="space-y-3">
          <h5 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{selectedRound === 'GAME_1' ? '1차전 기준: 직전 시리즈 투구수 & 역할별 불펜 소모 흐름' : selectedRound === 'GAME_2' ? '2차전 기준: 1차전(어제) 포함 투구수 흐름' : '3차전 기준: 1·2차전 누적 투구수 & 개별 투수 연투 흐름'}</span>
          </h5>

          <div className="flex flex-col space-y-3">
            {games.map((game, idx) => (
              <div key={idx} className="bg-slate-900/90 rounded-xl border border-slate-800 p-3 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="font-black text-amber-400 text-xs flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {game.gameLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{game.gameDateStr}</span>
                </div>

                {/* 🏠 홈팀 & ✈️ 원정팀 나란히(가로 2단) 동시 비교 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {/* 홈팀 선발 및 등판 불펜진 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-emerald-500/20 space-y-1.5 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-bold gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-emerald-400 font-black">[홈] {homeTeam.name}</span>
                          {game.homeMatchOpponentInfo && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                              {game.homeMatchOpponentInfo}
                            </span>
                          )}
                        </div>
                        <span className="text-white flex items-center gap-1 shrink-0">
                          <span className="px-1 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40">선발</span>
                          {game.homeStarterName} ({game.homeStarterPitches}구 / S:{game.homeStarterStrikes} B:{game.homeStarterBalls})
                        </span>
                      </div>

                      {/* 홈 등판 불펜 개별 객체 칩 렌더러 */}
                      <div className="pt-1.5 border-t border-slate-900 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-emerald-300 font-bold">불펜 총계: {game.homeBullpenTotalPitches}구 (S:{game.homeBullpenTotalStrikes} B:{game.homeBullpenTotalBalls})</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {game.homeBullpenPitchers?.map((p) => renderPitcherChip(p))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 원정팀 선발 및 등판 불펜진 */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-cyan-500/20 space-y-1.5 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-bold gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-cyan-400 font-black">[원정] {awayTeam.name}</span>
                          {game.awayMatchOpponentInfo && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-black border border-cyan-500/30">
                              {game.awayMatchOpponentInfo}
                            </span>
                          )}
                        </div>
                        <span className="text-white flex items-center gap-1 shrink-0">
                          <span className="px-1 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40">선발</span>
                          {game.awayStarterName} ({game.awayStarterPitches}구 / S:{game.awayStarterStrikes} B:{game.awayStarterBalls})
                        </span>
                      </div>

                      {/* 원정 등판 불펜 개별 객체 칩 렌더러 */}
                      <div className="pt-1.5 border-t border-slate-900 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-cyan-300 font-bold">불펜 총계: {game.awayBullpenTotalPitches}구 (S:{game.awayBullpenTotalStrikes} B:{game.awayBullpenTotalBalls})</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {game.awayBullpenPitchers?.map((p) => renderPitcherChip(p))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 👑 당일 경기 선발투수 상세 비교 (시즌 vs 홈/원정 vs 최근5경기 vs 최근3경기 + 상승/하강 추세) & 불펜 출격 대기 */}
        {todayMatchup && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 rounded-2xl border-2 border-amber-500/50 p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                <h4 className="font-black text-amber-300 text-xs sm:text-base">
                  👑 [당일 경기 선발투수 방어율(ERA) 정밀 비교 & 폼 추세 분석]
                </h4>
              </div>
              <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded shadow">
                시즌 vs 최근 폼 추세
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* 홈팀 선발투수 카드 */}
              <div className="bg-slate-950/90 p-4 rounded-xl border border-emerald-500/40 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-400 text-sm">[홈] {homeTeam.name}</span>
                    <span className="text-white font-black text-sm">{todayMatchup.homeStarterName}</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow ${
                    todayMatchup.homeStarterFormTrend === 'UP'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-red-500/20 text-rose-300 border border-red-500/50'
                  }`}>
                    {todayMatchup.homeStarterTrendBadge || '🟢 폼 상승세'}
                  </span>
                </div>

                {/* 5대 방어율 지표 그리드 */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">시즌 ERA</span>
                    <span className="font-black text-emerald-300 text-sm mt-0.5 block">
                      {todayMatchup.homeStarterSeasonEra}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">홈 경기 ERA</span>
                    <span className="font-black text-emerald-300 text-sm mt-0.5 block">
                      {todayMatchup.homeStarterHomeEra || todayMatchup.homeStarterSeasonEra}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">맞대결 ERA</span>
                    <span className="font-black text-emerald-300 text-sm mt-0.5 block">
                      {todayMatchup.homeStarterVsOpponentEra}
                    </span>
                  </div>
                </div>

                {/* 최근 5경기 vs 최근 3경기 비교 바 */}
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-emerald-500/30 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-300">최근 5경기 ERA: <strong className="text-emerald-400">{todayMatchup.homeStarterLast5Era || todayMatchup.homeStarterSeasonEra}</strong></span>
                    <span className="text-slate-300">최근 3경기 ERA: <strong className="text-amber-300">{todayMatchup.homeStarterLast3Era || todayMatchup.homeStarterSeasonEra}</strong></span>
                  </div>
                  <div className="text-[10px] text-emerald-300 font-bold">
                    📈 {todayMatchup.homeStarterComparisonText || `시즌 ${todayMatchup.homeStarterSeasonEra} ➔ 최근 3경기 ${todayMatchup.homeStarterLast3Era || todayMatchup.homeStarterSeasonEra}`}
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 font-medium">
                  ⚾ 예상 소화 이닝: <strong className="text-white">{todayMatchup.homeStarterAvgIp}이닝</strong> (잔여 {todayMatchup.homeBullpenRemainingIp}이닝 불펜 담당)
                </p>

                {/* 홈 불펜진 출격 대기 상태 */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block">🛡️ 당일 불펜 대기조 (1·2차전 누적 투구수 & 연투 현황):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {todayMatchup.homeBullpenRoster?.map((p) => renderTodayBullpenChip(p))}
                  </div>
                </div>
              </div>

              {/* 원정팀 선발투수 카드 */}
              <div className="bg-slate-950/90 p-4 rounded-xl border border-cyan-500/40 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-cyan-400 text-sm">[원정] {awayTeam.name}</span>
                    <span className="text-white font-black text-sm">{todayMatchup.awayStarterName}</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow ${
                    todayMatchup.awayStarterFormTrend === 'UP'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-red-500/20 text-rose-300 border border-red-500/50'
                  }`}>
                    {todayMatchup.awayStarterTrendBadge || '🔴 폼 하강세'}
                  </span>
                </div>

                {/* 5대 방어율 지표 그리드 */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">시즌 ERA</span>
                    <span className="font-black text-cyan-300 text-sm mt-0.5 block">
                      {todayMatchup.awayStarterSeasonEra}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">원정 경기 ERA</span>
                    <span className="font-black text-cyan-300 text-sm mt-0.5 block">
                      {todayMatchup.awayStarterAwayEra || todayMatchup.awayStarterSeasonEra}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">맞대결 ERA</span>
                    <span className="font-black text-cyan-300 text-sm mt-0.5 block">
                      {todayMatchup.awayStarterVsOpponentEra}
                    </span>
                  </div>
                </div>

                {/* 최근 5경기 vs 최근 3경기 비교 바 */}
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-cyan-500/30 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-300">최근 5경기 ERA: <strong className="text-cyan-400">{todayMatchup.awayStarterLast5Era || todayMatchup.awayStarterSeasonEra}</strong></span>
                    <span className="text-slate-300">최근 3경기 ERA: <strong className="text-rose-400">{todayMatchup.awayStarterLast3Era || todayMatchup.awayStarterSeasonEra}</strong></span>
                  </div>
                  <div className="text-[10px] text-cyan-300 font-bold">
                    📉 {todayMatchup.awayStarterComparisonText || `시즌 ${todayMatchup.awayStarterSeasonEra} ➔ 최근 3경기 ${todayMatchup.awayStarterLast3Era || todayMatchup.awayStarterSeasonEra}`}
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 font-medium">
                  ⚾ 예상 소화 이닝: <strong className="text-white">{todayMatchup.awayStarterAvgIp}이닝</strong> (잔여 {todayMatchup.awayBullpenRemainingIp}이닝 불펜 담당)
                </p>

                {/* 원정 불펜진 출격 대기 상태 */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block">🛡️ 당일 불펜 대기조 (1·2차전 누적 투구수 & 연투 현황):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {todayMatchup.awayBullpenRoster?.map((p) => renderTodayBullpenChip(p))}
                  </div>
                </div>
              </div>
            </div>

            {/* VVIP 마운드 결론 */}
            <div className="bg-slate-950/95 p-3 rounded-lg border border-amber-500/40 text-[11px] text-slate-200 leading-relaxed font-medium space-y-1">
              <p className="text-amber-300 font-bold">{todayMatchup.bullpenHandoverVerdict}</p>
              <p className="text-slate-400">{todayMatchup.earlyKnockoutScenarioAnalysis}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
