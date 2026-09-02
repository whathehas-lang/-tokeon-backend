import type { Match, BetmanFolderCategory } from '../../types/sports';
import { INITIAL_MATCHES } from '../../mock/sportsData';
import { betmanThousandSequenceService } from './betmanThousandSequenceService';

export interface BetmanRoundOption {
  id: string;
  roundName: string;
  folderCategory: BetmanFolderCategory;
  closingTimeStr: string;
  totalMatches: number;
}

export class BetmanMatchService {
  private availableRounds: BetmanRoundOption[] = [
    { id: 'r1', roundName: '야구 승5패 8회차', folderCategory: 'SEUNG5PAE', closingTimeStr: '08.28 (금) 18:20 마감', totalMatches: 14 },
    { id: 'r2', roundName: '축구 승무패 12회차', folderCategory: 'SEUNGMUPAE', closingTimeStr: '08.29 (토) 20:50 마감', totalMatches: 14 },
    { id: 'r3', roundName: '농구 승5패 15회차', folderCategory: 'SEUNG5PAE', closingTimeStr: '08.30 (일) 14:00 마감', totalMatches: 14 },
    { id: 'r4', roundName: '프로토 승부식 260102회차 (betman.co.kr 오피셜 슬립)', folderCategory: 'SEUNGBUSHIK', closingTimeStr: '08.29 (금) 23:40 마감', totalMatches: 957 },
    { id: 'r5', roundName: '프로토 승부식 98회차 (7121~8077번)', folderCategory: 'SEUNGBUSHIK', closingTimeStr: '08.29 (금) 23:40 마감', totalMatches: 957 }
  ];

  public getAvailableRounds(): BetmanRoundOption[] {
    return this.availableRounds;
  }

  /**
   * Filter and map matches for specific Betman round and folder.
   */
  public getBetmanMatchesByRound(matches: Match[], roundName: string, folderCategory: BetmanFolderCategory, searchMatchNo?: number, limit: number = 20): Match[] {
    // 1. Seungbushik (승부식 / 프로토): Serve 1번~1,000번+ sequence matches
    if (folderCategory === 'SEUNGBUSHIK' || roundName.includes('승부식')) {
      return betmanThousandSequenceService.getMatches(limit, searchMatchNo);
    }

    // 2. Otherwise map to round options
    const roundOpt = this.availableRounds.find(r => r.roundName === roundName) || this.availableRounds[0];
    const targetFolder = folderCategory === 'ALL' ? roundOpt.folderCategory : folderCategory;

    const baseMatches = matches && matches.length > 0 ? matches : INITIAL_MATCHES;

    const mappedMatches = baseMatches.map((m, idx) => ({
      ...m,
      betmanRound: roundName,
      betmanMatchNo: idx + 1,
      betmanFolder: targetFolder
    }));

    return mappedMatches;
  }
}

export const betmanMatchService = new BetmanMatchService();
