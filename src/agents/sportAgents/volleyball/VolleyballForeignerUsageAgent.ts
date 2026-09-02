import type { Match } from '../../../types/sports';

export class VolleyballForeignerUsageAgent {
  public analyzeForeignerUsage(match: Match) {
    const isRed = match.awayTeam.staminaStatus === 'RED';
    return {
      foreignerText: isRed
        ? `[2. 외인 의존도 및 체력] ${match.awayTeam.name} 외국인 몰빵 점유율 46.5% 🔴 (4~5세트 진입 시 타점 저하 및 성공률 -14% 예상)`
        : `[2. 외인 의존도 및 체력] ${match.homeTeam.name} 주전 외인/국내 득점 분배 🟢 (풀세트 체력 우위)`
    };
  }
}
