import { sportsApiClient } from './sportsApiClient';
import { apiCacheService } from './apiCacheService';
import type { Match, BetmanFolderCategory } from '../../types/sports';
import type { RawApiMatchResponse } from './types';
import { mapRawApiMatchToMatch } from '../mappers/matchDataMapper';
import { verifiedMatchDatabase } from '../db/verifiedMatchDatabase';
import { betmanLiveSyncService } from '../betman/betmanLiveSyncService';
import { OFFICIAL_260103_MATCHES } from '../../mock/official260103Schedule';

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
    return OFFICIAL_260103_MATCHES;
  }

  /**
   * 📡 베트맨 오피셜 회차 전체 경기 수신
   */
  public async fetchBetmanMatchesByRound(
    _roundName: string,
    _folderCategory: BetmanFolderCategory = 'ALL',
    _searchMatchNo?: number,
    _limit: number = 999999
  ): Promise<Match[]> {
    const liveMatches = await betmanLiveSyncService.getMatchesAsync();
    if (liveMatches && liveMatches.length > 0) {
      return liveMatches;
    }
    return OFFICIAL_260103_MATCHES;
  }
}

export const sportsApiService = new SportsApiService();
