import { sportsApiClient } from './sportsApiClient';
import { apiCacheService } from './apiCacheService';
import type { Match, BetmanFolderCategory } from '../../types/sports';
import type { RawApiMatchResponse } from './types';
import { mapRawApiMatchToMatch } from '../mappers/matchDataMapper';
import { verifiedMatchDatabase } from '../db/verifiedMatchDatabase';
import { betmanLiveSyncService } from '../betman/betmanLiveSyncService';

export class SportsApiService {
  public async fetchMatches(leagueId?: string, season: number = 2026): Promise<Match[]> {
    const cacheKey = `matches_${leagueId || 'default'}_${season}`;
    const cachedMatches = apiCacheService.get<Match[]>(cacheKey);
    if (cachedMatches && cachedMatches.length > 0) {
      return cachedMatches;
    }

    try {
      const endpoint = '/fixtures';
      const params: Record<string, string> = { season: String(season) };
      if (leagueId) {
        params.league = leagueId;
      } else {
        params.next = '14';
      }

      const response = await sportsApiClient.get<RawApiMatchResponse>(endpoint, params);
      if (response && response.response && response.response.length > 0) {
        const mappedMatches = response.response.map((raw, idx) => mapRawApiMatchToMatch(raw, idx));
        const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(mappedMatches);
        apiCacheService.set(cacheKey, verifiedMatches);
        return verifiedMatches;
      }
    } catch (error) {
      console.error('[SportsApiService] Error fetching live matches:', error);
    }
    return [];
  }

  /**
   * 📡 렌더 24시간 백엔드에서 오피셜 베트맨 경기 목록 직통 네트워크 fetch 수신
   * (🔒 30초 백그라운드 갱신 시 과거 수요일 더미 데이터 폴백 덮어쓰기 100% 차단!)
   */
  public async fetchBetmanMatchesByRound(
    _roundName: string,
    _folderCategory: BetmanFolderCategory = 'ALL',
    _searchMatchNo?: number,
    _limit: number = 999999
  ): Promise<Match[]> {
    // 🌐 렌더 24시간 백엔드 오피셜 직통 네트워크 수신
    const liveMatches = await betmanLiveSyncService.getMatchesAsync();
    if (liveMatches && liveMatches.length > 0) {
      return liveMatches;
    }
    
    // 🔒 덮어쓰기 폴백 완전 차단 ➔ 라이브 데이터만 유지
    return liveMatches || [];
  }
}

export const sportsApiService = new SportsApiService();
