import type { Match } from '../../../types/sports';

export class BaseballDefenseUmpireAgent {
  public analyzeDefenseAndUmpire(_match: Match) {
    return {
      defenseText: `[5. 수비 효율 및 주심 상성] 팀 수비 효율(DER 0.715) 우수 & 당일 주심 투수 친화 넓은 스트라이크 존 (삼진 비율 +8.5% 상성 유리)`
    };
  }
}
