import type { Match } from '../../../types/sports';

export class FootballTacticalCompatAgent {
  public analyzeTacticalCompatibility(_match: Match) {
    return {
      tacticalCompatRating: `[전술 상성 데이터] 점유율 빌드업축구 vs 선수비 후역습 상성 시뮬레이션 완료`
    };
  }
}
