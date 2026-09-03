/**
 * 🎰 [베트맨(betman.co.kr) 오피셜 실시간 라이브 동기화 서비스]
 */

import type { Match } from '../../types/sports';
import { OFFICIAL_260103_MATCHES } from '../../mock/official260103Schedule';

export const RENDER_BACKEND_URL = 'https://tokeon-backend.onrender.com';

let lastKnownLiveMatches: Match[] = OFFICIAL_260103_MATCHES;

export class BetmanLiveSyncService {
  private static instance: BetmanLiveSyncService;

  public static getInstance(): BetmanLiveSyncService {
    if (!BetmanLiveSyncService.instance) {
      BetmanLiveSyncService.instance = new BetmanLiveSyncService();
    }
    return BetmanLiveSyncService.instance;
  }

  public static getAllLiveMatches(_arg1?: any, _arg2?: any): Match[] {
    return lastKnownLiveMatches;
  }

  public static async getMatchesAsync(_arg1?: any, _arg2?: any): Promise<Match[]> {
    try {
      const res = await fetch(`${RENDER_BACKEND_URL}/api/live-all`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.matches) && data.matches.length > 0) {
          lastKnownLiveMatches = data.matches;
          return data.matches;
        }
      }
    } catch (e) {
      console.warn('[렌더 백엔드 수신 지연]', e);
    }
    return lastKnownLiveMatches;
  }

  public async getMatchesAsync(arg1?: any, arg2?: any): Promise<Match[]> {
    return BetmanLiveSyncService.getMatchesAsync(arg1, arg2);
  }

  public getMatches(_arg1?: any, _arg2?: any): Match[] {
    return lastKnownLiveMatches;
  }
}

export const betmanLiveSyncService = BetmanLiveSyncService.getInstance();
