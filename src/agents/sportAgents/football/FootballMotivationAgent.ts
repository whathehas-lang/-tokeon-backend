import type { Match } from '../../../types/sports';

export class FootballMotivationAgent {
  public analyzeMotivation(match: Match) {
    return {
      motivationRating: `[상황 변수/동기부여] ${match.homeTeam.name} 강등권 탈출 다급함 (동기부여 지수 95/100)`
    };
  }
}
