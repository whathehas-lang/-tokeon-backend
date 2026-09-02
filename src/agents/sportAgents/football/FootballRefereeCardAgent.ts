import type { Match } from '../../../types/sports';

export class FootballRefereeCardAgent {
  public analyzeRefereeCard(_match: Match) {
    return {
      refereeCardRating: `[주심 성향] 경기당 평균 카드 4.8장 (엄격한 파울 콜 ➔ 세트피스 기회 증가 예상)`
    };
  }
}
