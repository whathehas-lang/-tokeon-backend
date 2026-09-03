/**
 * 🎰 [베트맨(betman.co.kr) 렌더 백엔드 실시간 오피셜 직통 수신 서비스]
 */

import type { Match } from '../../types/sports';

export const RENDER_BACKEND_URL = 'https://tokeon-backend.onrender.com';

export class BetmanLiveSyncService {
  private static instance: BetmanLiveSyncService;

  public static getInstance(): BetmanLiveSyncService {
    if (!BetmanLiveSyncService.instance) {
      BetmanLiveSyncService.instance = new BetmanLiveSyncService();
    }
    return BetmanLiveSyncService.instance;
  }

  public static getAllLiveMatches(arg1?: any, arg2?: any): Match[] {
    return [];
  }

  public static async getMatchesAsync(arg1?: any, arg2?: any): Promise<Match[]> {
    try {
      const res = await fetch(`${RENDER_BACKEND_URL}/api/live-all`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.matches) && data.matches.length > 0) {
          return data.matches;
        }
      }
    } catch (e) {
      console.warn('[렌더 백엔드 직통 수신 경고]', e);
    }
    return [];
  }

  public async getMatchesAsync(arg1?: any, arg2?: any): Promise<Match[]> {
    return BetmanLiveSyncService.getMatchesAsync(arg1, arg2);
  }

  public getMatches(arg1?: any, arg2?: any): Match[] {
    return [];
  }
}

export const betmanLiveSyncService = BetmanLiveSyncService.getInstance();
