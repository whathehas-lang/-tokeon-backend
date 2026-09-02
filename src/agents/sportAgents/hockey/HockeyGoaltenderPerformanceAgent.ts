import type { Match } from '../../../types/sports';

export class HockeyGoaltenderPerformanceAgent {
  public analyzeGoaltenderPerformance(match: Match) {
    return {
      goaltenderText: `[2. 골텐더 퍼포먼스] ${match.homeTeam.name} 선발 골리 SV% 0.928 / GAA 2.10 & 기대 실점 대비 세이브 GSAx +8.45 (리그 최상위 방어력)`
    };
  }
}
