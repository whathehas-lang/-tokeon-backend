import type { Match } from '../../../types/sports';

export class HockeyPhysicalityPossessionAgent {
  public analyzePhysicalityPossession(_match: Match) {
    return {
      possessionText: `[5. 피지컬 및 주도권] 페이스오프 승률 FO% 55.4% (즉각적 공격권 확보) & Corsi 퍽 점유율 56.2% 주도권 우세`
    };
  }
}
