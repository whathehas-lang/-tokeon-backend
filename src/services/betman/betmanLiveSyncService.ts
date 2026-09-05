/**
 * 🎰 [베트맨(betman.co.kr) 오피셜 실시간 라이브 동기화 서비스]
 */

import type { Match } from '../../types/sports';
import cachedSeedMatches from '../../mock/cachedLiveMatches.json';
import { verifiedMatchDatabase } from '../db/verifiedMatchDatabase';

export const RENDER_BACKEND_URL = 'https://tokeon-backend.onrender.com';

const OFFICIAL_CACHE_VERSION = 'v20260905_official_sync_v5';

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
          lastKnownLiveMatches = data.matches;
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('tokeon_cached_live_matches', JSON.stringify(data.matches));
            }
            verifiedMatchDatabase.ingestAndVerifyMatches(data.matches);
          } catch (storageErr) {
            console.warn('[BetmanLiveSyncService] Storage cache write error:', storageErr);
          }
          return data.matches;
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

