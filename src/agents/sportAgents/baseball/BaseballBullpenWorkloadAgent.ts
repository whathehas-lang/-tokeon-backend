import type { Match } from '../../../types/sports';

export class BaseballBullpenWorkloadAgent {
  public analyzeBullpenWorkload(match: Match) {
    const isAwayRed = match.awayTeam.staminaStatus === 'RED';
    return {
      bullpenText: isAwayRed
        ? `[3. 불펜 과부하 및 뎁스] ${match.awayTeam.name} 필승조 최근 3일간 85구 투구 🔴 과부하 (7~9회 피OPS 0.890 붕괴 위험도 높음)`
        : `[3. 불펜 과부하 및 뎁스] ${match.homeTeam.name} 필승조 2일 휴식 달성 (🟢 7~9회 피OPS 0.520 리드 수성 우수)`
    };
  }
}
