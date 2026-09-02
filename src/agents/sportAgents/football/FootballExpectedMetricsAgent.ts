import type { Match } from '../../../types/sports';

export class FootballExpectedMetricsAgent {
  public analyzeExpectedMetrics(match: Match) {
    const scored = match.underOverFact.avgScoredGoals;
    return {
      xGText: `[1. 기대 지표 (xG/xA)] ${match.homeTeam.name}은 최근 3경기 xG 수치 ${scored}로 득점 생산성 및 페널티 박스 터치 횟수가 매우 높습니다.`
    };
  }
}
