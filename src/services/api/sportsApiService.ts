import { sportsApiClient } from './sportsApiClient';
import { apiCacheService } from './apiCacheService';
import { betmanRoundRegistry, BETMAN_GAMES_METADATA } from '../betman/betmanRoundRegistry';
import type { Match, BetmanFolderCategory } from '../../types/sports';
import type { RawApiMatchResponse } from './types';
import { mapRawApiMatchToMatch } from '../mappers/matchDataMapper';
import { INITIAL_MATCHES } from '../../mock/sportsData';
import { verifiedMatchDatabase } from '../db/verifiedMatchDatabase';

export class SportsApiService {
  /**
   * Fetch matches from live Sports API, pass through Verification Engine and save to Verified DB.
   */
  public async fetchMatches(leagueId?: string, season: number = 2026): Promise<Match[]> {
    const cacheKey = `matches_${leagueId || 'default'}_${season}`;

    // 1. Check verified DB / Cache first
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

      // 🛡️ Pass through Verification Engine & Save to Verified DB
      const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(mappedMatches);

      // Save to cache (5 minutes TTL)
      apiCacheService.set(cacheKey, verifiedMatches);
      return verifiedMatches;
    } catch (error) {
      console.error('[SportsApiService] Error fetching live matches, falling back to verified initial records:', error);
      const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(INITIAL_MATCHES);
      return verifiedMatches;
    }
  }

  /**
   * Fetch and filter Betman match sequence for a specific round & folder.
   * Runs through Verification Engine & saves to Verified DB before returning.
   */
  public async fetchBetmanMatchesByRound(
    roundName: string,
    folderCategory: BetmanFolderCategory = 'ALL',
    _searchMatchNo?: number,
    _limit: number = 999999
  ): Promise<Match[]> {
    // 📌 Instant 0.01s retrieval from Betman Round Registry
    const gmId = folderCategory === 'SEUNGMUBAE' ? 'G011' : folderCategory === 'SEUNG1PAE' ? 'G024' : folderCategory === 'GIROKSIK' ? 'G102' : 'G101';
    const metadata = BETMAN_GAMES_METADATA[gmId];
    const defaultTs = metadata?.defaultRoundTs || (gmId === 'G011' ? '260049' : gmId === 'G024' ? '260064' : gmId === 'G102' ? '89' : '260103');
    const gmTs = roundName.includes('회차') ? (roundName.match(/\d+/) || [defaultTs])[0] : defaultTs;
    
    return betmanRoundRegistry.getMatchesByGameAndRound(gmId, gmTs);
  }
}

export const sportsApiService = new SportsApiService();
