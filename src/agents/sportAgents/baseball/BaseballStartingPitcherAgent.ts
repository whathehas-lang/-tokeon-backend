import type { Match } from '../../../types/sports';

export class BaseballStartingPitcherAgent {
  public analyzeStartingPitcher(match: Match) {
    return {
      starterText: `[2. 선발 투수 정밀 지표] ${match.homeTeam.name} 선발 FIP 3.12 / xERA 2.95 (ERA 착시 제거 실제 구위 상위 5% & 체인지업 Whiff% 34.5%)`
    };
  }
}
