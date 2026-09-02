import type { Match } from '../../../types/sports';

export class BaseballBatterSplitsAgent {
  public analyzeBatterSplits(match: Match) {
    return {
      splitsText: `[4. 타선 매치업 및 스플릿] ${match.homeTeam.name} 우완 선발 상대 팀 OPS 0.845 & 득점권 타율(RISP) 0.320 (초반 득점 생산력 우세)`
    };
  }
}
