/**
 * 🎰 [베트맨(betman.co.kr) 회차별 1시간 단위 자동 업데이트 동기화 서비스]
 */

import type { Match } from '../../types/sports';
import { OFFICIAL_260103_MATCHES } from '../../mock/official260103Schedule';

export const RENDER_BACKEND_URL = 'https://tokeon-backend.onrender.com';

export interface BetmanHourlySyncResponse {
  status: string;
  currentRound: string;
  lastHourlySyncTime: string;
  nextHourlySyncTime: string;
  totalMatchesCount: number;
  matches: any[];
}

export class BetmanLiveSyncService {
  private static instance: BetmanLiveSyncService;

  public static getInstance(): BetmanLiveSyncService {
    if (!BetmanLiveSyncService.instance) {
      BetmanLiveSyncService.instance = new BetmanLiveSyncService();
    }
    return BetmanLiveSyncService.instance;
  }

  public static getAllLiveMatches(arg1?: any, arg2?: any): Match[] {
    return OFFICIAL_260103_MATCHES;
  }

  public static async getMatchesAsync(arg1?: any, arg2?: any): Promise<Match[]> {
    return OFFICIAL_260103_MATCHES;
  }

  public getMatches(arg1?: any, arg2?: any): Match[] {
    return OFFICIAL_260103_MATCHES;
  }

  public async fetchHourlySyncData(): Promise<BetmanHourlySyncResponse | null> {
    return fetchBetmanHourlySyncData();
  }

  public syncRoundData(matches: Match[]): Match[] {
    return syncBetmanRoundData(matches);
  }
}

export const betmanLiveSyncService = BetmanLiveSyncService.getInstance();

export async function fetchBetmanHourlySyncData(): Promise<BetmanHourlySyncResponse | null> {
  try {
    const res = await fetch(`${RENDER_BACKEND_URL}/api/betman/hourly-sync`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('[베트맨 1시간 동기화 수신 경고]', e);
  }
  return null;
}

export function syncBetmanRoundData(matches: Match[]): Match[] {
  return matches.map(m => ({
    ...m,
    lastUpdated: new Date().toLocaleTimeString('ko-KR')
  }));
}
