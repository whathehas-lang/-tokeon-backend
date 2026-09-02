import type { Match } from '../../../types/sports';

export class FootballDefensiveAbsenceAgent {
  public analyzeDefensiveAbsence(match: Match) {
    const isAwayRisk = match.awayTeam.staminaStatus === 'RED';
    return {
      defensiveAbsenceRating: isAwayRisk 
        ? `[원정팀 수비 결장/과부하] 핵심 주전 센터백/골키퍼 체력 과부하 (실점 확률 가중치 +1.2)` 
        : `[홈/원정 수비 라인] 주전 센터백 및 GK 정상 출전 가동`
    };
  }
}
