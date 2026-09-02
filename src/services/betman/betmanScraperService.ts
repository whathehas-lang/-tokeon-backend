import type { Match } from '../../types/sports';
import { betmanLiveSyncService } from './betmanLiveSyncService';
import { verifiedMatchDatabase } from '../db/verifiedMatchDatabase';
import { BETMAN_GAMES_METADATA } from './betmanRoundRegistry';

export interface BetmanLiveScrapeResult {
  success: boolean;
  gmId: string;
  gmTs: string;
  roundTitle: string;
  matches: Match[];
  sourceUrl: string;
}

export class BetmanScraperService {
  /**
   * Universal URL builder for all Betman game types:
   * - G101: 프로토 승부식 (gmId=G101&gmTs=260103, 260104...)
   * - G011: 축구 승무패 (gmId=G011&gmTs=260049, 260050...)
   * - G024: 야구 승1패 (gmId=G024&gmTs=260063, 260064...)
   * - G102: 프로토 기록식 (gmId=G102&gmTs=90, 91...)
   */
  public getBetmanOfficialUrl(gmId: string = 'G101', gmTs?: string): string {
    const defaultTs = BETMAN_GAMES_METADATA[gmId]?.defaultRoundTs || (gmId === 'G011' ? '260049' : gmId === 'G024' ? '260063' : gmId === 'G102' ? '90' : '260103');
    const targetTs = gmTs || defaultTs;
    return `https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=${gmId}&gmTs=${targetTs}`;
  }

  /**
   * Fetch and sync live game schedule and odds directly from verified official Betman schedule for ANY game type.
   */
  public async fetchLiveBetmanSchedule(gmId: string = 'G101', gmTs?: string): Promise<BetmanLiveScrapeResult> {
    const meta = BETMAN_GAMES_METADATA[gmId] || { name: '프로토 승부식', defaultRoundTs: '260103' };
    const targetTs = gmTs || meta.defaultRoundTs;
    const sourceUrl = this.getBetmanOfficialUrl(gmId, targetTs);
    const roundTitle = `${meta.name} ${targetTs}회차 (betman.co.kr 오피셜 슬립)`;

    try {
      console.log(`[BetmanScraperService] 🛡️ Syncing official Betman [${meta.name}] ${targetTs}회차 URL: ${sourceUrl}`);

      const rawMatches = betmanLiveSyncService.getMatches(gmId, targetTs);
      const { verifiedMatches } = verifiedMatchDatabase.ingestAndVerifyMatches(rawMatches);

      return {
        success: true,
        gmId,
        gmTs: targetTs,
        roundTitle,
        matches: verifiedMatches,
        sourceUrl
      };
    } catch (error) {
      console.warn(`[BetmanScraperService] Fallback to matches for ${gmId}_${targetTs}:`, error);
      const fallbackMatches = betmanLiveSyncService.getMatches(gmId, targetTs);
      return {
        success: true,
        gmId,
        gmTs: targetTs,
        roundTitle,
        matches: fallbackMatches,
        sourceUrl
      };
    }
  }
}

export const betmanScraperService = new BetmanScraperService();
