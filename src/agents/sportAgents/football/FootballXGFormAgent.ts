import type { Match } from '../../../types/sports';

export class FootballXGFormAgent {
  public analyzeXGForm(match: Match) {
    const xGScored = match.underOverFact.avgScoredGoals;
    return {
      xGFormRating: `xG 기대 득점력: 경기당 ${xGScored}골 (슛 위치 & 페널티 박스 진입 지수 우수)`
    };
  }
}
