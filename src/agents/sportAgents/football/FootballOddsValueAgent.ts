import type { Match } from '../../../types/sports';

export interface OddsValueReport {
  valueRating: string;
  riskIndex: string;
}

export class FootballOddsValueAgent {
  public analyzeOddsValue(match: Match): OddsValueReport {
    const isStaminaRisk = match.awayTeam.staminaStatus === 'RED';
    return {
      valueRating: isStaminaRisk ? '원정팀 체력 과부하(🔴)로 인한 상대팀 우세' : '정배당 형성',
      riskIndex: isStaminaRisk ? '주의필요' : '안정적'
    };
  }
}
