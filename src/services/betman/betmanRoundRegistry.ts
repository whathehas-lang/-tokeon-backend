/**
 * 🎰 [베트맨(betman.co.kr) 오피셜 회차 레지스트리 서비스]
 */

import type { Match, BetmanFolderCategory } from '../../types/sports';
import { betmanLiveSyncService } from './betmanLiveSyncService';
import { transformMatchDateAutomatically } from '../../utils/matchResultHelper';

export interface BetmanGameTypeInfo {
  gmId: string;
  name: string;
  category: BetmanFolderCategory;
  defaultRoundTs: string;
  roundsList: string[];
}

export function calculateActiveSeungbushikRoundTs(arg1?: any): string {
  return '260104';
}

export function getDynamicBetmanGamesMetadata(): Record<string, BetmanGameTypeInfo> {
  return {
    G101: {
      gmId: 'G101',
      name: '프로토 승부식',
      category: 'SEUNGBUSHIK',
      defaultRoundTs: '260104',
      roundsList: ['260104', '260105', '260106']
    },
    G011: {
      gmId: 'G011',
      name: '축구 승무패',
      category: 'SEUNGMUBAE',
      defaultRoundTs: '260049',
      roundsList: ['260049', '260050', '260051']
    },
    G024: {
      gmId: 'G024',
      name: '야구 승1패',
      category: 'SEUNG1PAE',
      defaultRoundTs: '260064',
      roundsList: ['260064', '260065', '260066']
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
  public getMatchesByGameAndRound(gmId: string = 'G101', gmTs: string = '260104'): Match[] {
    const rawMatches = betmanLiveSyncService.getMatches(gmId, gmTs);
    return rawMatches.map(m => transformMatchDateAutomatically(m));
  }

  public getOfficialBetmanSlipUrl(gmId: string = 'G101', gmTs: string = '260104'): string {
    return `https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=${gmId}&gmTs=${gmTs}`;
  }

  public getSaleStatusLabel(gmId: string, gmTs: string): 'ON_SALE' | 'SCHEDULED' | 'CLOSED' {
    const meta = BETMAN_GAMES_METADATA[gmId];
    if (!meta) return 'CLOSED';
    const activeTs = meta.defaultRoundTs;
    if (gmTs === activeTs) return 'ON_SALE';
    if (gmTs > activeTs) return 'SCHEDULED';
    return 'CLOSED';
  }
}

export const betmanRoundRegistry = new BetmanRoundRegistryService();
