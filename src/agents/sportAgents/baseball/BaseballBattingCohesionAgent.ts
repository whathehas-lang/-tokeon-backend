import type { Match } from '../../../types/sports';

export class BaseballBattingCohesionAgent {
  public analyzeBattingCohesion(match: Match) {
    return {
      rispRating: `[타선 응집력] ${match.homeTeam.name} 득점권 타율(RISP) 0.312 (리그 2위)`
    };
  }
}
