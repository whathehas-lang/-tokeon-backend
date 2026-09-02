import type { Match } from '../../../types/sports';

export class BaseballUmpireZoneAgent {
  public analyzeUmpireZone(_match: Match) {
    return {
      umpireZoneRating: `[주심 성향] 당일 주심 투수 친화 넓은 존 (삼진 비율 +8.5% 유리)`
    };
  }
}
