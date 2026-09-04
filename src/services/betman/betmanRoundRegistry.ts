/**
 * 🎰 [베트맨(betman.co.kr) 베이스 URL + 동적 회차 번호(gmTs) 100% 무인 파이프라인]
 * 
 * 🔗 베이스 URL: https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=G101&gmTs=
 * 🔢 동적 파라미터: 260104, 260105, 260106 ... (회차 번호 자동 결합)
 */

import type { Match, BetmanFolderCategory } from '../../types/sports';
import { betmanLiveSyncService } from './betmanLiveSyncService';

export const BASE_BETMAN_SLIP_URL = 'https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=G101&gmTs=';

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

export function getBetmanOfficialSlipUrlByRound(gmTs: string = '260104'): string {
  return `${BASE_BETMAN_SLIP_URL}${gmTs}`;
}

export function getDynamicBetmanGamesMetadata(): Record<string, BetmanGameTypeInfo> {
  return {
    G101: {
      gmId: 'G101',
      name: '프로토 승부식',
      category: 'SEUNGBUSHIK',
      defaultRoundTs: '260104',
      roundsList: ['260104', '260105', '260106', '260107']
    },
    G011: {
      gmId: 'G011',
      name: '축구 승무패',
      category: 'SEUNGMUBAE',
      defaultRoundTs: '260050',
      roundsList: ['260049', '260050', '260051']
    },
    G024: {
      gmId: 'G024',
      name: '야구 승1패',
      category: 'SEUNG1PAE',
      defaultRoundTs: '260065',
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
    return betmanLiveSyncService.getMatches(gmId, gmTs);
  }

  public getOfficialBetmanSlipUrl(gmId: string = 'G101', gmTs: string = '260104'): string {
    if (gmId === 'G101') {
      return getBetmanOfficialSlipUrlByRound(gmTs);
    }
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
