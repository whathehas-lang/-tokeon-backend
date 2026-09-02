import React from 'react';
import { Flame, Sparkles, Zap } from 'lucide-react';
import type { BaseballTeamHittingReport } from '../types/sports';

interface BaseballTeamHittingCardProps {
  report?: BaseballTeamHittingReport;
  theme?: 'light' | 'dark';
}

export const BaseballTeamHittingCard: React.FC<BaseballTeamHittingCardProps> = ({
  report,
  theme = 'light'
}) => {
  if (!report) return null;
  const isLight = theme === 'light';

  const { homeHitting, awayHitting, matchupVerdict } = report;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-4 shadow-xl transition-all ${
      isLight
        ? 'bg-gradient-to-br from-white via-amber-50/40 to-white border-amber-300 shadow-amber-100/50'
        : 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-amber-500/50 shadow-2xl'
    }`}>
      {/* 1. Header Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-amber-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-md">
            <Flame className="w-5 h-5 fill-slate-950 animate-pulse" />
          </div>
          <div>
            <h4 className={`text-sm sm:text-base font-black flex items-center gap-1.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>🔥 ⚾ 양 팀 타격감 흐름 정밀 분석</span>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/40">
                시즌 평균 vs 최근 5경기
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              공식 실시간 타선 박스스코어 기반 팀 화력 추세 (타율 • 출루율 • 경기당 득점)
            </p>
          </div>
        </div>

        <span className={`text-[11px] font-black px-3 py-1 rounded-lg border self-start sm:self-auto flex items-center gap-1 shadow-sm ${
          isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-950 text-amber-300 border-amber-400'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          OFFICIAL MLB TEAM STATS
        </span>
      </div>

      {/* 2. Grid Cards: Home vs Away 1:1 Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* 🏠 Home Team Hitting Card */}
        <div className={`p-4 rounded-xl border-2 space-y-3 shadow-sm ${
          homeHitting.hittingFlowStatus === 'HOT'
            ? isLight
              ? 'bg-emerald-50/80 border-emerald-400'
              : 'bg-emerald-950/40 border-emerald-500/60'
            : isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
            <span className="font-black text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>🏠 [홈] {homeHitting.teamName}</span>
            </span>
            <span className={`text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-md border ${
              homeHitting.hittingFlowStatus === 'HOT'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                : homeHitting.hittingFlowStatus === 'COLD'
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
            }`}>
              {homeHitting.hittingFlowLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Season Metrics */}
            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-[10px] text-slate-400 block font-bold mb-1">📅 올 시즌 팀 평균</span>
              <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">팀 타율:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{homeHitting.seasonAvg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">출루율:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{homeHitting.seasonObp}</span>
                </div>
                <div className="flex justify-between pt-0.5 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">평균득점:</span>
                  <span className="font-black text-slate-900 dark:text-white">{homeHitting.seasonRunsPerGame}점</span>
                </div>
              </div>
            </div>

            {/* Recent 5 Games Metrics */}
            <div className={`p-2.5 rounded-lg border-2 ${
              homeHitting.hittingFlowStatus === 'HOT'
                ? isLight
                  ? 'bg-emerald-100/60 border-emerald-400'
                  : 'bg-emerald-950/80 border-emerald-500'
                : isLight
                ? 'bg-rose-50 border-rose-200'
                : 'bg-rose-950/60 border-rose-500/40'
            }`}>
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 block mb-1">🔥 최근 5경기 타선</span>
              <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">최근 타율:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs">{homeHitting.recent5Avg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">최근 출루율:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{homeHitting.recent5Obp}</span>
                </div>
                <div className="flex justify-between pt-0.5 border-t border-emerald-200 dark:border-emerald-800/80">
                  <span className="text-slate-600 dark:text-slate-300">최근 득점:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-300 text-xs">경기당 {homeHitting.recent5RunsPerGame}점</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✈️ Away Team Hitting Card */}
        <div className={`p-4 rounded-xl border-2 space-y-3 shadow-sm ${
          awayHitting.hittingFlowStatus === 'HOT'
            ? isLight
              ? 'bg-emerald-50/80 border-emerald-400'
              : 'bg-emerald-950/40 border-emerald-500/60'
            : awayHitting.hittingFlowStatus === 'COLD'
            ? isLight
              ? 'bg-rose-50/80 border-rose-300'
              : 'bg-rose-950/40 border-rose-500/50'
            : isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
            <span className="font-black text-xs sm:text-sm text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              <span>✈️ [원정] {awayHitting.teamName}</span>
            </span>
            <span className={`text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-md border ${
              awayHitting.hittingFlowStatus === 'HOT'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                : awayHitting.hittingFlowStatus === 'COLD'
                ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                : 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
            }`}>
              {awayHitting.hittingFlowLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Season Metrics */}
            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-[10px] text-slate-400 block font-bold mb-1">📅 올 시즌 팀 평균</span>
              <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">팀 타율:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{awayHitting.seasonAvg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">출루율:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{awayHitting.seasonObp}</span>
                </div>
                <div className="flex justify-between pt-0.5 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">평균득점:</span>
                  <span className="font-black text-slate-900 dark:text-white">{awayHitting.seasonRunsPerGame}점</span>
                </div>
              </div>
            </div>

            {/* Recent 5 Games Metrics */}
            <div className={`p-2.5 rounded-lg border-2 ${
              awayHitting.hittingFlowStatus === 'HOT'
                ? isLight
                  ? 'bg-emerald-100/60 border-emerald-400'
                  : 'bg-emerald-950/80 border-emerald-500'
                : isLight
                ? 'bg-rose-100/60 border-rose-300'
                : 'bg-rose-950/80 border-rose-500'
            }`}>
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 block mb-1">🔥 최근 5경기 타선</span>
              <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">최근 타율:</span>
                  <span className={`font-black text-xs ${
                    awayHitting.hittingFlowStatus === 'HOT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>{awayHitting.recent5Avg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">최근 출루율:</span>
                  <span className={`font-black ${
                    awayHitting.hittingFlowStatus === 'HOT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>{awayHitting.recent5Obp}</span>
                </div>
                <div className="flex justify-between pt-0.5 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">최근 득점:</span>
                  <span className={`font-black text-xs ${
                    awayHitting.hittingFlowStatus === 'HOT' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400'
                  }`}>경기당 {awayHitting.recent5RunsPerGame}점</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Matchup Verdict Callout */}
      <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
        isLight
          ? 'bg-amber-50/90 border-amber-300 text-slate-900'
          : 'bg-slate-950 border-amber-500/40 text-slate-200'
      }`}>
        <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
        <div>
          <span className="text-xs font-black text-amber-800 dark:text-amber-300 block mb-0.5">
            ⚾ [타선 화력 맞대결 최종 결론]
          </span>
          <p className="text-xs leading-relaxed font-semibold">
            {matchupVerdict}
          </p>
        </div>
      </div>
    </div>
  );
};
