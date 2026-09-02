import type { Match } from '../../../types/sports';

export class VolleyballClutchPerformanceAgent {
  public analyzeClutchPerformance(match: Match) {
    return {
      clutchText: `[5. 클러치 상황] 20점 이후 접전 및 듀스(Deuce) 상황 ${match.homeTeam.name} 주포 클러치 성공률 Clutch 58.4% (리그 1위 해결사)`
    };
  }
}
