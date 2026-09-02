import React from 'react';
import { BellRing, X, ChevronRight, Zap } from 'lucide-react';
import type { Match } from '../types/sports';

interface LineupPushToastProps {
  match: Match;
  onOpenDetail: (match: Match, targetSectionId?: string) => void;
  onDismiss: () => void;
}

export const LineupPushToast = ({ match, onOpenDetail, onDismiss }: LineupPushToastProps) => {
  const alertInfo = match.lineupAlertInfo;
  if (!alertInfo || !alertInfo.isPublished) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900/95 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
            <BellRing className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>🚨 관심 경기 오피셜 라인업 즉시 알림!</span>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Info */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              [{match.betmanMatchNo}번] {match.homeTeam.name} vs {match.awayTeam.name}
            </span>
            <span className="text-slate-400 text-[11px]">{alertInfo.publishedTime}</span>
          </div>

          <p className="text-xs text-slate-200 font-medium leading-tight">
            {alertInfo.alertText}
          </p>

          {alertInfo.keyAbsenceNotice && (
            <div className="text-[11px] text-amber-300 font-bold bg-amber-950/40 p-2 rounded-lg border border-amber-500/30 flex items-start gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{alertInfo.keyAbsenceNotice}</span>
            </div>
          )}
        </div>

        {/* Action Button: Opens Modal directly to 9-Position Lineup Section */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => {
              onOpenDetail(match, 'section-lineup');
              onDismiss();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-slate-950" />
            <span>⚡ 오피셜 9개 포지션 라인업 바로가기 (클릭)</span>
            <ChevronRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
