import { sportsApiClient } from './sportsApiClient';
import { apiCacheService } from './apiCacheService';
import { betmanRoundRegistry, BETMAN_GAMES_METADATA } from '../betman/betmanRoundRegistry';
import type { Match, BetmanFolderCategory } from '../../types/sports';
import type { RawApiMatchResponse } from './types';
import { mapRawApiMatchToMatch } from '../mappers/matchDataMapper';
import { INITIAL_MATCHES } from '../../mock/sportsData';
import { verifiedMatchDatabase } from '../db/verifiedMatchDatabase';
import { betmanLiveSyncService } from '../betman/betmanLiveSyncService';

export class SportsApiService {
  public async fetchMatches(leagueId?: string, season: number = 2026): Promise<Match[]> {
    const cacheKey = `matches_${leagueId || 'default'}_${season}`;
    const cachedMatches = apiCacheService.get<Match[]>(cacheKey);
    if (cachedMatches && cachedMatches.length > 0) {
      return cachedMatches;
    }

    if (sportsApiClient.isMockMode()) {
      const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(INITIAL_MATCHES);
      return verifiedMatches;
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
      if (!response || !response.response || response.response.length === 0) {
        const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(INITIAL_MATCHES);
        return verifiedMatches;
      }

      const mappedMatches = response.response.map((raw, idx) => mapRawApiMatchToMatch(raw, idx));
      const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(mappedMatches);
      apiCacheService.set(cacheKey, verifiedMatches);
      return verifiedMatches;
    } catch (error) {
      console.error('[SportsApiService] Error fetching live matches:', error);
      const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(INITIAL_MATCHES);
      return verifiedMatches;
    }
  }

  /**
   * 📡 렌더 24시간 백엔드에서 오피셜 베트맨 경기 목록 직통 네트워크 fetch 수신
   */
  public async fetchBetmanMatchesByRound(
    roundName: string,
    folderCategory: BetmanFolderCategory = 'ALL',
    _searchMatchNo?: number,
    _limit: number = 999999
  ): Promise<Match[]> {
    // 🌐 렌더 24시간 백엔드 직통 네트워크 수신
    const liveMatches = await betmanLiveSyncService.getMatchesAsync();
    if (liveMatches && liveMatches.length > 0) {
      return liveMatches;
    }
    
    // Fallback
    const gmId = folderCategory === 'SEUNGMUBAE' ? 'G011' : folderCategory === 'SEUNG1PAE' ? 'G024' : folderCategory === 'GIROKSIK' ? 'G102' : 'G101';
    const metadata = BETMAN_GAMES_METADATA[gmId];
    const defaultTs = metadata?.defaultRoundTs || '260103';
    const gmTs = roundName.includes('회차') ? (roundName.match(/\d+/) || [defaultTs])[0] : defaultTs;
    
    return betmanRoundRegistry.getMatchesByGameAndRound(gmId, gmTs);
  }
}

export const sportsApiService = new SportsApiService();
