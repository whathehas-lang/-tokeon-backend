import type { Match } from '../../types/sports';
import { REAL_BETMAN_OFFICIAL_MATCHES } from '../../mock/realBetmanOfficialSchedule';

export class BetmanThousandSequenceService {
  private activeMatchesList: Match[] = [];

  constructor() {
    this.buildActiveMatchesList();
  }

  private buildActiveMatchesList(): void {
    const list: Match[] = [...REAL_BETMAN_OFFICIAL_MATCHES];

    // 📌 Sort matches strictly chronologically by Korea Standard Time KST (한국 시간별 나열)
    list.sort((a, b) => {
      // Compare time strings: 18:30 < 21:30 < 22:30 < 04:00(next day) < 10:40 < 11:10 < 23:50
      if (a.matchTime === b.matchTime) return a.betmanMatchNo - b.betmanMatchNo;
      return a.matchTime.localeCompare(b.matchTime);
    });

    this.activeMatchesList = list;
  }

  public getMatches(limit: number = 100, searchNo?: number): Match[] {
    if (searchNo && searchNo >= 1) {
      const match = this.activeMatchesList.find(m => m.betmanMatchNo === searchNo);
      return match ? [match] : [];
    }

    return this.activeMatchesList.slice(0, limit);
  }

  public getAllMatches(): Match[] {
    return this.activeMatchesList;
  }
}

export const betmanThousandSequenceService = new BetmanThousandSequenceService();
