import type { Match, BetmanFolderCategory } from '../../types/sports';
import { betmanLiveSyncService } from './betmanLiveSyncService';

export interface BetmanGameTypeInfo {
  gmId: string;
  name: string;
  category: BetmanFolderCategory;
  defaultRoundTs: string;
  roundsList: string[];
}

export interface BetmanGameTypeInfo {
  gmId: string;
  name: string;
  category: BetmanFolderCategory;
  defaultRoundTs: string;
  roundsList: string[];
}

/**
 * Calculate dynamic Betman G101 (프로토 승부식) gmTs based on official release schedule:
 * Updates occur 3 times a week:
 * 1. Monday 08:00 AM KST
 * 2. Wednesday 08:00 AM KST
 * 3. Friday 08:00 AM KST
 */
export function calculateActiveSeungbushikRoundTs(refDate: Date = new Date()): number {
  // Known reference: 2026-08-31 08:00 KST (Monday) corresponds to active round sequence 260103
  const baseTsDate = new Date('2026-08-31T08:00:00+09:00');
  const baseRoundNum = 260103;
  let roundOffset = 0;

  if (refDate < baseTsDate) {
    // Reverse calculation
    let temp = new Date(baseTsDate);
    while (temp > refDate) {
      const day = temp.getDay();
      const hours = temp.getHours();
      // Move backwards slot
      if (day === 1 && hours >= 8) { // Monday 8am -> Friday 8am (prev week)
        temp.setDate(temp.getDate() - 3);
      } else if (day === 5 && hours >= 8) { // Friday 8am -> Wednesday 8am
        temp.setDate(temp.getDate() - 2);
      } else if (day === 3 && hours >= 8) { // Wednesday 8am -> Monday 8am
        temp.setDate(temp.getDate() - 2);
      } else {
        temp.setTime(temp.getTime() - 3600 * 1000);
      }
      roundOffset--;
    }
  } else {
    // Forward calculation counting 08:00 AM slots (Mon, Wed, Fri)
    let temp = new Date(baseTsDate);
    while (true) {
      // Find next slot boundary
      let nextSlot = new Date(temp);
      const day = temp.getDay();
      if (day === 1) { // Mon 8am -> Wed 8am (+2 days)
        nextSlot.setDate(nextSlot.getDate() + 2);
      } else if (day === 3) { // Wed 8am -> Fri 8am (+2 days)
        nextSlot.setDate(nextSlot.getDate() + 2);
      } else { // Fri 8am -> Mon 8am (+3 days)
        nextSlot.setDate(nextSlot.getDate() + 3);
      }
      nextSlot.setHours(8, 0, 0, 0);

      if (refDate >= nextSlot) {
        temp = nextSlot;
        roundOffset++;
      } else {
        break;
      }
    }
  }

  return baseRoundNum + roundOffset;
}

export function getDynamicBetmanGamesMetadata(now: Date = new Date()): Record<string, BetmanGameTypeInfo> {
  const currentG101 = calculateActiveSeungbushikRoundTs(now);
  const roundsListG101 = [
    String(currentG101),
    String(currentG101 + 1),
    String(currentG101 + 2),
    String(currentG101 + 3),
    String(currentG101 + 4)
  ];

  return {
    G101: {
      gmId: 'G101',
      name: '프로토 승부식',
      category: 'SEUNGBUSHIK',
      defaultRoundTs: String(currentG101),
      roundsList: roundsListG101
    },
    G011: {
      gmId: 'G011',
      name: '축구 승무패',
      category: 'SEUNGMUBAE',
      defaultRoundTs: '260049',
      roundsList: ['260049', '260050', '260051', '260052']
    },
    G024: {
      gmId: 'G024',
      name: '야구 승1패',
      category: 'SEUNG1PAE',
      defaultRoundTs: '260063',
      roundsList: ['260063', '260064', '260065', '260066']
    },
    G102: {
      gmId: 'G102',
      name: '프로토 기록식',
      category: 'GIROKSIK',
      defaultRoundTs: '90',
      roundsList: ['90', '91', '92', '93']
    }
  };
}

export const BETMAN_GAMES_METADATA: Record<string, BetmanGameTypeInfo> = getDynamicBetmanGamesMetadata();

export class BetmanRoundRegistryService {
  /**
   * Get matches for a specific game code (gmId) & round sequence (gmTs)
   */
  public getMatchesByGameAndRound(gmId: string = 'G101', gmTs: string = '260102'): Match[] {
    return betmanLiveSyncService.getMatches(gmId, gmTs);
  }

  /**
   * Get official Betman game slip URL for any gmId & gmTs
   */
  public getOfficialBetmanSlipUrl(gmId: string = 'G101', gmTs: string = '260102'): string {
    return `https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=${gmId}&gmTs=${gmTs}`;
  }

  /**
   * Get sale status label for a specific gmTs relative to current active gmTs
   */
  public getRoundSaleStatusStr(gmId: string, gmTs: string): { statusText: string; isLive: boolean } {
    const meta = getDynamicBetmanGamesMetadata();
    const activeTsStr = meta[gmId]?.defaultRoundTs || '260102';
    const numTarget = parseInt(gmTs, 10);
    const numActive = parseInt(activeTsStr, 10);

    if (numTarget === numActive) {
      return { statusText: '🔥 베트맨 오피셜 현재 [발매중]', isLive: true };
    } else if (numTarget > numActive) {
      return { statusText: `⏳ [발매예정] (${gmTs}회차는 차기 발매 회차입니다)`, isLive: false };
    } else {
      return { statusText: `🏁 [발매마감] (${gmTs}회차는 마감된 회차입니다)`, isLive: false };
    }
  }
}

export const betmanRoundRegistry = new BetmanRoundRegistryService();

