/**
 * 🎰 [베트맨(betman.co.kr) 렌더 백엔드 실시간 오피셜 직통 수신 서비스]
 */

import type { Match } from '../../types/sports';

export const RENDER_BACKEND_URL = 'https://tokeon-backend.onrender.com';

let lastKnownLiveMatches: Match[] = [
  {
    id: 'bm-8198',
    betmanMatchNo: 8198,
    sport: 'baseball',
    league: 'KBO 리그',
    homeTeam: { id: 'ds', name: '두산 베어스', logo: '⚾', countryName: '대한민국', rank: 1, homeSeasonRecord: '', awaySeasonRecord: '', seasonRemainingGames: '', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: '', totalMarketValueNum: 1 },
    awayTeam: { id: 'lg', name: 'LG 트윈스', logo: '⚾', countryName: '대한민국', rank: 2, homeSeasonRecord: '', awaySeasonRecord: '', seasonRemainingGames: '', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: '', totalMarketValueNum: 2 },
    homeScore: 0,
    awayScore: 0,
    matchTime: '09.03(목) 18:30',
    betmanOdds: { win: 2.10, draw: 3.20, lose: 2.85 },
    status: 'SCHEDULED'
  },
  {
    id: 'bm-8199',
    betmanMatchNo: 8199,
    sport: 'baseball',
    league: 'MLB',
    homeTeam: { id: 'min', name: '미네소타 트윈스', logo: '⚾', countryName: '미국', rank: 1, homeSeasonRecord: '', awaySeasonRecord: '', seasonRemainingGames: '', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: '', totalMarketValueNum: 1 },
    awayTeam: { id: 'cle', name: '클리블랜드 가디언스', logo: '⚾', countryName: '미국', rank: 2, homeSeasonRecord: '', awaySeasonRecord: '', seasonRemainingGames: '', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: '', totalMarketValueNum: 2 },
    homeScore: 0,
    awayScore: 0,
    matchTime: '09.03(목) 10:38',
    betmanOdds: { win: 1.85, draw: 3.40, lose: 3.10 },
    status: 'SCHEDULED'
  }
] as Match[];

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
