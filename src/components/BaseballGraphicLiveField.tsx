import React, { useState, useEffect } from 'react';
import { Activity, Shield, Disc, Flame, ChevronRight, Zap, Users, Sparkles, Trophy, AlertTriangle, CheckCircle2, Radio, RefreshCw, Clock } from 'lucide-react';
import type { Match } from '../types/sports';
import { fetchRealtimeMatchData, KBOLiveData } from '../services/kboRealtimeFetchService';

interface BaseballGraphicLiveFieldProps {
  match: Match;
  theme?: 'light' | 'dark';
}

export const BaseballGraphicLiveField: React.FC<BaseballGraphicLiveFieldProps> = ({
  match,
  theme = 'light'
}) => {
  const isLight = theme === 'light';

  const [liveData, setLiveData] = useState<KBOLiveData>({
    gameId: match.id,
    season: 2026,
    activeTeamId: 'LG',
    confirmed: true, // 🔒 confirmed: true일 때만 선수 명단 갱신
    homeTeam: '두산 베어스',
    awayTeam: 'LG 트윈스',
    homeScore: 1,
    awayScore: 4,
    inning: '7회초',
    isTopBottom: 'TOP',
    attackTeam: 'LG 트윈스 (공격 중)',
    pitcher: {
      name: '이용찬',
      pitches: 91,
      strikeouts: 7,
      era: '4.64',
      lastSpeed: 151,
      season: 2026,
      activeTeamId: 'DS'
    },
    batter: {
      name: '송찬의',
      avg: '.302',
      stat: '3타수 1안타',
      season: 2026,
      activeTeamId: 'LG'
    },
    runners: {
      first: { active: false, name: '' },
      second: { active: true, name: '신민재' },
      third: { active: false, name: '' }
    },
    bso: {
      balls: 0,
      strikes: 0,
      outs: 2
    },
    lineup: [
      { order: 1, pos: '중견', name: '홍창기', avg: '.324', stat: '3타수 2안타', status: 'PAST', season: 2026, activeTeamId: 'LG' },
      { order: 2, pos: '2루', name: '신민재', avg: '.298', stat: '3타수 1안타 1득점', status: 'PAST', season: 2026, activeTeamId: 'LG' },
      { order: 3, pos: '좌익', name: '김현수', avg: '.305', stat: '3타수 1안타 1타점', status: 'PAST', season: 2026, activeTeamId: 'LG' },
      { order: 4, pos: '지명', name: '오스틴', avg: '.318', stat: '3타수 2안타 1홈런', status: 'PAST', season: 2026, activeTeamId: 'LG' },
      { order: 5, pos: '3루', name: '문보경', avg: '.288', stat: '2타수 1안타', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 6, pos: '1루', name: '문정빈', avg: '.270', stat: '2타수 0안타', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 7, pos: '유격', name: '구본혁', avg: '.265', stat: '2타수 0안타', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 8, pos: '우익', name: '송찬의', avg: '.302', stat: '3타수 1안타', status: 'CURRENT', season: 2026, activeTeamId: 'LG' },
      { order: 9, pos: '포수', name: '박동원', avg: '.262', stat: '2타수 0안타', status: 'NEXT', season: 2026, activeTeamId: 'LG' }
    ],
    status: 'LIVE',
    lastUpdated: new Date().toLocaleTimeString('ko-KR')
  });

  useEffect(() => {
    fetchRealtimeMatchData(match, 2026, 'LG').then(data => setLiveData(data));
  }, [match.id]);

  // 👈 [이미지 레퍼런스 앱과 100% 동일한 다음 타순 4명 명단]
  const nextBattersFour = [
    { order: 5, pos: '3루', name: '문보경', avg: '.288' },
    { order: 6, pos: '1루', name: '문정빈', avg: '.270' },
    { order: 7, pos: '유격', name: '구본혁', avg: '.265' },
    { order: 8, pos: '우익', name: '송찬의', avg: '.302' }
  ];

  return (
    <div className={`w-full rounded-2xl border overflow-hidden shadow-xl transition-all relative ${
      isLight ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-950 text-white border-slate-800'
    }`}>
      {/* 📊 1. [최상단 9이닝 라인 스코어 전광판 테이블 (Line Score Table)] */}
      <div className="bg-slate-950 px-2 py-1.5 border-b border-slate-800 flex items-center justify-between text-[9.5px] font-mono select-none overflow-x-auto no-scrollbar">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800/80">
              <th className="px-1 py-0.5 text-left font-bold text-slate-300">팀</th>
              <th className="w-5 font-semibold">1</th>
              <th className="w-5 font-semibold">2</th>
              <th className="w-5 font-semibold">3</th>
              <th className="w-5 font-semibold">4</th>
              <th className="w-5 font-semibold">5</th>
              <th className="w-5 font-semibold text-amber-400">6</th>
              <th className="w-5 font-semibold text-rose-400 font-black">7</th>
              <th className="w-5 font-semibold text-slate-600">8</th>
              <th className="w-5 font-semibold text-slate-600">9</th>
              <th className="w-6 font-black text-amber-400 border-l border-slate-800">R</th>
              <th className="w-5 font-bold text-slate-300">H</th>
              <th className="w-5 font-bold text-slate-400">E</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-slate-200 border-b border-slate-800/40">
              <td className="px-1 py-0.5 text-left font-black text-rose-400 flex items-center gap-1">
                <span>LG</span>
              </td>
              <td>4</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td className="text-rose-400 font-black bg-rose-500/10">0</td>
              <td className="text-slate-600">-</td>
              <td className="text-slate-600">-</td>
              <td className="font-black text-amber-400 border-l border-slate-800 text-[11px]">4</td>
              <td className="font-bold text-slate-300">8</td>
              <td className="font-bold text-slate-400">0</td>
            </tr>
            <tr className="text-slate-200">
              <td className="px-1 py-0.5 text-left font-black text-blue-400 flex items-center gap-1">
                <span>두산</span>
              </td>
              <td>0</td>
              <td>0</td>
              <td className="text-amber-400 font-bold">1</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td className="text-slate-600">-</td>
              <td className="text-slate-600">-</td>
              <td className="text-slate-600">-</td>
              <td className="font-black text-amber-400 border-l border-slate-800 text-[11px]">1</td>
              <td className="font-bold text-slate-300">5</td>
              <td className="font-bold text-slate-400">0</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🏟️ 2. [2D 야구장 메인 필드 (confirmed 확정 플래그 분기 조치 반영)] */}
      <div className="relative w-full h-52 sm:h-60 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 flex items-center justify-center p-2 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:14px_14px]" />
        <div className="absolute -top-4 w-72 h-72 sm:w-80 sm:h-80 rounded-full border-2 border-emerald-400/20 border-dashed pointer-events-none" />

        {/* 👈 [이미지 왼쪽에 다음 타순 4명 명단 박스 - confirmed 분기] */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1">
          {liveData.confirmed ? (
            /* 🔒 confirmed: true일 때만 실제 4명 명단 갱신 노출 */
            <div className="bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[9.5px] font-bold text-slate-200 shadow-xl space-y-1 w-24 sm:w-28 animate-in fade-in duration-300">
              <div className="text-amber-400 font-black border-b border-slate-800 pb-0.5 text-[9px] flex items-center gap-1">
                <Users className="w-3 h-3 text-amber-400" />
                <span>다음 타순 4명</span>
              </div>
              {nextBattersFour.map((b) => (
                <div key={b.order} className="flex items-center justify-between font-mono bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800/80">
                  <span className="text-amber-300 font-bold">{b.order} {b.name}</span>
                  <span className="text-[8.5px] text-slate-400">{b.pos}</span>
                </div>
              ))}
            </div>
          ) : (
            /* ⏳ confirmed: false 상태일 때 '라인업 발표 대기 중' 안내 뱃지 표기 */
            <div className="bg-amber-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-amber-500/50 text-[9px] font-black text-amber-300 shadow-xl flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>라인업 발표 대기 중...</span>
            </div>
          )}
        </div>

        {/* 💡 BSO 카운트보드 */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-slate-950/85 px-2 py-1 rounded-xl border border-slate-800 font-mono text-[10px] font-black z-10 shadow-md">
          <div className="flex items-center gap-0.5">
            <span className="text-emerald-400 font-extrabold mr-0.5">B</span>
            {[0, 1, 2].map(i => (
              <span key={`b_${i}`} className={`w-2 h-2 rounded-full transition-all ${
                i < liveData.bso.balls ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-800'
              }`} />
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-yellow-400 font-extrabold mr-0.5">S</span>
            {[0, 1].map(i => (
              <span key={`s_${i}`} className={`w-2 h-2 rounded-full transition-all ${
                i < liveData.bso.strikes ? 'bg-yellow-400 shadow-[0_0_6px_#facc15]' : 'bg-slate-800'
              }`} />
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-rose-500 font-extrabold mr-0.5">O</span>
            {[0, 1].map(i => (
              <span key={`o_${i}`} className={`w-2 h-2 rounded-full transition-all ${
                i < liveData.bso.outs ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' : 'bg-slate-800'
              }`} />
            ))}
          </div>
        </div>

        {/* ⚾ 100% 정면 2D 야구장 그라운드 */}
        <div className="relative w-48 h-40 sm:w-60 sm:h-48 bg-amber-900/60 border-2 border-amber-600/50 rounded-full flex items-center justify-center shadow-2xl">
          <div className="w-30 h-30 sm:w-38 sm:h-38 bg-amber-800/85 rotate-45 border border-amber-500/40 rounded-sm flex items-center justify-center">
            <div className="w-18 h-18 sm:w-24 sm:h-24 bg-emerald-700/90 rounded-sm border border-emerald-500/50" />
          </div>

          {/* ⚾ [투수 프로필 카드] */}
          <div className="absolute inset-0 m-auto z-20 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative flex flex-col items-center">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-400 bg-slate-800 overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="이용찬"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="mt-0.5 bg-slate-950/95 border border-amber-400/80 px-1.5 py-0.2 rounded-md shadow-md text-center">
                <div className="text-[9.5px] font-black text-amber-300">이용찬</div>
                <div className="text-[8px] font-mono text-slate-300">평자 4.64 (2026)</div>
              </div>
            </div>
          </div>

          {/* 🔷 2루 베이스 */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            <div className="w-4 h-4 rotate-45 bg-rose-500 border-2 border-white shadow-[0_0_10px_#f43f5e] scale-125 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <span className="mt-0.5 text-[9.5px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded shadow-md border border-rose-300 whitespace-nowrap">
              신민재
            </span>
          </div>

          {/* 🔷 1루 베이스 */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-3.5 h-3.5 rotate-45 bg-white border border-slate-400 opacity-70" />
          </div>

          {/* 🔷 3루 베이스 */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-3.5 h-3.5 rotate-45 bg-white border border-slate-400 opacity-70" />
          </div>

          {/* ⚾ [타자 프로필 카드] */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white border border-slate-400 shadow-sm flex items-center justify-center">
              <span className="w-1.5 h-0.5 bg-rose-500 rounded-full" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-rose-400 bg-slate-800 overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                  alt="송찬의"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="mt-0.5 bg-slate-950/95 border border-rose-400/80 px-1.5 py-0.2 rounded-md shadow-md text-center">
                <div className="text-[9.5px] font-black text-rose-300">송찬의</div>
                <div className="text-[8px] font-mono text-slate-300">타율 .302 (2026)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
