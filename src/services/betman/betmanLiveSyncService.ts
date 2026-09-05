/**
 * 🎰 [베트맨(betman.co.kr) 오피셜 실시간 라이브 동기화 서비스]
 */

import type { Match } from '../../types/sports';
import cachedSeedMatches from '../../mock/cachedLiveMatches.json';
import { verifiedMatchDatabase } from '../db/verifiedMatchDatabase';

export const RENDER_BACKEND_URL = 'https://tokeon-backend.onrender.com';

const OFFICIAL_CACHE_VERSION = 'v20260905_official_sync_v8';

// 🚀 초기 메모리 상태를 localStorage 캐시 또는 번들된 최신 시드(118+ 경기)로 즉시 하이드레이션
function getInitialMatches(): Match[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const currentVer = localStorage.getItem('tokeon_cache_version');
      if (currentVer !== OFFICIAL_CACHE_VERSION) {
        localStorage.removeItem('tokeon_cached_live_matches');
        localStorage.setItem('tokeon_cache_version', OFFICIAL_CACHE_VERSION);
      } else {
        const saved = localStorage.getItem('tokeon_cached_live_matches');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    }
  } catch (e) {
    console.warn('[BetmanLiveSyncService] localStorage cache read error:', e);
  }
  return (cachedSeedMatches as unknown as Match[]) || [];
}


let lastKnownLiveMatches: Match[] = getInitialMatches();

// 초기 시드가 존재하면 verifiedMatchDatabase에도 즉시 등록하여 일관성 유지
if (lastKnownLiveMatches.length > 0) {
  try {
    verifiedMatchDatabase.ingestAndVerifyMatches(lastKnownLiveMatches);
  } catch (e) {
    // ignore
  }
}

export class BetmanLiveSyncService {
  private static instance: BetmanLiveSyncService;

  public static getInstance(): BetmanLiveSyncService {
    if (!BetmanLiveSyncService.instance) {
      BetmanLiveSyncService.instance = new BetmanLiveSyncService();
    }
    return BetmanLiveSyncService.instance;
  }

  public static getAllLiveMatches(_arg1?: any, _arg2?: any): Match[] {
    if (lastKnownLiveMatches.length === 0) {
      lastKnownLiveMatches = getInitialMatches();
    }
    return lastKnownLiveMatches;
  }

  public static async getMatchesAsync(_arg1?: any, _arg2?: any): Promise<Match[]> {
    try {
      const res = await fetch(`${RENDER_BACKEND_URL}/api/live-all`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.matches) && data.matches.length > 0) {
          // 🛡️ 과거/오전/종료 경기 100% 보존 머지 파이프라인:
          // 백엔드가 제공하지 않는 이전 경기(오전 MLB, 14:00 NPB, 17:00 KBO 등)가 삭제되지 않도록 기존 시드 및 캐시와 안전하게 병합
          const mergedMap = new Map<string, Match>();
          
          // 1. 기존 시드 등록 (오전/낮 경기 포함)
          const seedList = (cachedSeedMatches as unknown as Match[]) || [];
          for (const m of seedList) {
            if (m && m.id) mergedMap.set(m.id, m);
          }

          // 2. 현재 메모리에 있는 경기 등록
          for (const m of lastKnownLiveMatches) {
            if (m && m.id) mergedMap.set(m.id, m);
          }

          // 3. 대진 인덱스 생성 (ID 불일치 시에도 팀명+일시 기준 100% 안전 매칭)
          const getMatchupKey = (match: Match): string => {
            const sport = match.sport || '';
            const h = (match.homeTeam?.name || '').replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
            const a = (match.awayTeam?.name || '').replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
            const dateStr = (match.matchTime || match.rawTimeIso || '').slice(0, 10);
            return `${sport}_${h}_${a}_${dateStr}`;
          };

          const matchupIndex = new Map<string, string>();
          for (const [id, m] of mergedMap.entries()) {
            matchupIndex.set(getMatchupKey(m), id);
          }

          // 4. 백엔드 실시간 최신 정보 오버레이 (진행 중 스코어, 최신 선발투수 등 덮어쓰기)
          for (const m of data.matches) {
            if (!m) continue;
            let targetId = m.id;
            if (!mergedMap.has(targetId)) {
              const mKey = getMatchupKey(m);
              if (matchupIndex.has(mKey)) {
                targetId = matchupIndex.get(mKey)!;
              }
            }

            const prev = mergedMap.get(targetId);
            if (prev) {
              const homeStarter = (m.homeTeam?.starterPitcherInfo && !m.homeTeam.starterPitcherInfo.name?.includes('미정'))
                ? m.homeTeam.starterPitcherInfo
                : prev.homeTeam?.starterPitcherInfo;
              const awayStarter = (m.awayTeam?.starterPitcherInfo && !m.awayTeam.starterPitcherInfo.name?.includes('미정'))
                ? m.awayTeam.starterPitcherInfo
                : prev.awayTeam?.starterPitcherInfo;

              mergedMap.set(targetId, {
                ...prev,
                ...m,
                id: targetId,
                homeTeam: { ...prev.homeTeam, ...m.homeTeam, starterPitcherInfo: homeStarter },
                awayTeam: { ...prev.awayTeam, ...m.awayTeam, starterPitcherInfo: awayStarter }
              });
            } else {
              mergedMap.set(m.id, m);
              matchupIndex.set(getMatchupKey(m), m.id);
            }
          }

          const mergedMatches = Array.from(mergedMap.values()).sort((a, b) => {
            const tsA = (a as any).timestamp || 0;
            const tsB = (b as any).timestamp || 0;
            return tsA - tsB;
          });

          lastKnownLiveMatches = mergedMatches;
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('tokeon_cached_live_matches', JSON.stringify(mergedMatches));
            }
            verifiedMatchDatabase.ingestAndVerifyMatches(mergedMatches);
          } catch (storageErr) {
            console.warn('[BetmanLiveSyncService] Storage cache write error:', storageErr);
          }
          return mergedMatches;
        }
      }
    } catch (e) {
      console.warn('[렌더 백엔드 수신 지연 - 캐시 데이터 유지]', e);
    }
    return lastKnownLiveMatches;
  }

  public async getMatchesAsync(arg1?: any, arg2?: any): Promise<Match[]> {
    return BetmanLiveSyncService.getMatchesAsync(arg1, arg2);
  }

  public getMatches(_arg1?: any, _arg2?: any): Match[] {
    return BetmanLiveSyncService.getAllLiveMatches();
  }
}

export const betmanLiveSyncService = BetmanLiveSyncService.getInstance();

