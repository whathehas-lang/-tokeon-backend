import type { Match } from '../../../types/sports';

export class BaseballOddsMovementAgent {
  public analyzeOddsMovement(_match: Match) {
    return {
      oddsTrend: `[해외 배당 흐름] 초기 1.85 ➔ 마감 1.72 (홈팀 승리 배당 폭락 징후 감지)`
    };
  }
}
