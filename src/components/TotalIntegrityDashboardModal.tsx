import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, X, Activity, Wrench, Sparkles } from 'lucide-react';
import type { Match } from '../types/sports';
import { TotalMatchIntegrityAgent, type TotalIntegritySummaryReport } from '../services/inspector/totalMatchIntegrityAgent';

interface TotalIntegrityDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  theme?: 'light' | 'dark';
}

export const TotalIntegrityDashboardModal = ({
  isOpen,
  onClose,
  matches,
  theme = 'dark'
}: TotalIntegrityDashboardModalProps) => {
  const [report, setReport] = useState<TotalIntegritySummaryReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'MATCHES' | 'HEAL_LOGS'>('MATCHES');
  const [filterSport, setFilterSport] = useState<string>('ALL');

  const handleRunScanAndHeal = () => {
    setIsScanning(true);
    setTimeout(() => {
      try {
        const { report: res } = TotalMatchIntegrityAgent.scanAndHealMatches(matches || []);
        setReport(res);
      } catch (e) {
        console.error('Scan error:', e);
      } finally {
        setIsScanning(false);
      }
    }, 100);
  };

  useEffect(() => {
    if (isOpen && !report && !isScanning) {
      handleRunScanAndHeal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  const filteredItems = report?.items.filter(item => {
    if (filterSport === 'ALL') return true;
    return item.sport === filterSport;
  }) || [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border ${
        isLight ? 'bg-slate-50 border-amber-300 text-slate-900' : 'bg-slate-950 border-amber-500/40 text-slate-100'
      }`}>
        
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black flex items-center gap-2 flex-wrap">
                <span>🤖 감시관 & 🩹 수리관 듀얼 에이전트 대시보드</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  실시간 상호작용 가동 중
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                감시관이 오류를 실시간 적발하고, 수리관이 즉시 정상 데이터로 자동 교정합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunScanAndHeal}
              disabled={isScanning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>전수 자가치유 실행</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 요약 현황 통계 카드 */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-slate-900/60 border-b border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 font-bold">🔎 감시관 스캔 경기</span>
              <span className="text-xl font-black text-amber-400 font-mono mt-1">
                {report.totalMatchesScanned}개 매치
              </span>
              <span className="text-[10px] text-slate-500">야구 {report.baseballMatches} | 축구 {report.footballMatches}</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between">
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% 팩트 통과
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono mt-1">
                {report.authenticCount}건
              </span>
              <span className="text-[10px] text-emerald-500/80">공식 공시 100% 일치</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col justify-between">
              <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> 공식 발표 대기 (미정)
              </span>
              <span className="text-xl font-black text-amber-400 font-mono mt-1">
                {report.unannouncedPendingCount}건
              </span>
              <span className="text-[10px] text-amber-500/80">추측 없이 안전 대기</span>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col justify-between">
              <span className="text-[11px] text-cyan-400 font-bold flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> 🩹 수리관 자가치유
              </span>
              <span className="text-xl font-black text-cyan-300 font-mono mt-1">
                무결성 {report.integrityScore}% 🏆
              </span>
              <span className="text-[10px] text-cyan-400/80">오류율 0.0% 무인 유지</span>
            </div>
          </div>
        )}

        {/* 서브 탭 전환 바 */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('MATCHES')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'MATCHES'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>🔎 전 경기 검증 현황 ({report?.totalMatchesScanned || 0}개)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('HEAL_LOGS')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'HEAL_LOGS'
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🩹 실시간 자가치유(Self-Healing) 상호작용 로그 ({report?.healedActions.length || 0}건)</span>
            </button>
          </div>

          {activeSubTab === 'MATCHES' && (
            <div className="flex items-center gap-1 overflow-x-auto">
              {['ALL', 'baseball', 'football', 'basketball'].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setFilterSport(sp)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                    filterSport === sp ? 'bg-slate-800 text-amber-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sp === 'ALL' ? '전체' : sp === 'baseball' ? '야구' : sp === 'football' ? '축구' : '농구'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 내용 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {activeSubTab === 'MATCHES' ? (
            filteredItems.map((item, idx) => (
              <div
                key={`${item.matchNo}_${idx}`}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono font-bold text-slate-300">
                      #{item.matchNo}
                    </span>
                    <span className="text-amber-400 font-bold">[{item.league}]</span>
                    <span className="text-slate-400">{item.matchTime}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    item.overallStatus === '100% AUTHENTIC'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.overallStatus === '100% AUTHENTIC' ? '🟢 100% 공식 팩트 검증 완료' : '⏳ 공식 예고 발표 대기 중'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-black bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80">
                  <span className="text-emerald-400">{item.homeTeam}</span>
                  <span className="text-amber-500 font-mono font-bold">VS</span>
                  <span className="text-cyan-400">{item.awayTeam}</span>
                </div>

                {item.sport === 'baseball' && (
                  <div className="flex items-center justify-between text-[11px] bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 font-bold">
                    <span className="text-emerald-300 truncate">⚾ [홈] {item.homeStarter}</span>
                    <span className="text-cyan-300 text-right truncate">⚾ [원정] {item.awayStarter}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 text-[10px]">
                  {item.detailLogs.map((log, lIdx) => (
                    <span key={lIdx} className="px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-800">
                      {log}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {report?.healedActions && report.healedActions.length > 0 ? (
                report.healedActions.map((act, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-cyan-400 font-bold">{act.timestamp}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono font-bold">#{act.matchNo}</span>
                        <span className="text-slate-200 font-black">{act.teams}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-500/30">
                        {act.issueType}
                      </span>
                    </div>
                    <p className="font-bold text-emerald-400 text-[11px]">{act.actionTaken}</p>
                    <p className="text-slate-400 text-[10px]">{act.healedDetails}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2 bg-slate-900/40 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-black text-sm text-slate-200">현재 감지된 데이터 오류가 없습니다.</p>
                  <p className="text-xs text-slate-500">모든 경기가 100% 공식 팩트 기준에 맞게 무결하게 유지되고 있습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 rounded-b-2xl flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>감시관 ⇄ 수리관 듀얼 에이전트 실시간 상호작용 활성화</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
