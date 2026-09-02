import type { Match } from '../../../types/sports';

export interface XGReport {
  xGHome: number;
  xGAway: number;
  underOverFactText: string;
}

export class FootballXGAgent {
  public analyzeXGAndEfficiency(match: Match): XGReport {
    const fact = match.underOverFact;
    return {
      xGHome: Number(fact.avgScoredGoals),
      xGAway: Number(fact.avgConcededGoals),
      underOverFactText: `최근 10경기 오버 ${fact.last10OverRatio}% / 언더 ${fact.last10UnderRatio}% (평균득점 ${fact.avgScoredGoals} / 실점 ${fact.avgConcededGoals})`
    };
  }
}
