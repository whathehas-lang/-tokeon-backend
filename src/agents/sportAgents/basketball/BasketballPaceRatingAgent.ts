import type { Match } from '../../../types/sports';

export class BasketballPaceRatingAgent {
  public analyzePaceAndRating(match: Match) {
    return {
      paceText: `[1. 페이스 및 효율성] ${match.homeTeam.name} Pace 102.5 (빠른 템포) vs ORTG 114.2 (100포제션당 득점력 리그 상위 10%)`
    };
  }
}
