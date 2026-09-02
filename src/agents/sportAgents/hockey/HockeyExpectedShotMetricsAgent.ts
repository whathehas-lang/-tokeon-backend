import type { Match } from '../../../types/sports';

export class HockeyExpectedShotMetricsAgent {
  public analyzeExpectedShotMetrics(_match: Match) {
    return {
      shotText: `[1. 득점 기대치 및 슛 효율] 유효슈팅 SOG 34.5개 & 슬롯 고위험 지역 찬스(High-Danger Chances 14회) 득점 성공률 우수`
    };
  }
}
