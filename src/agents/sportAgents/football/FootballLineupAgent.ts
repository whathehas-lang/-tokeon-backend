import type { Match } from '../../../types/sports';

export interface LineupStaminaReport {
  homeStaminaSignal: string;
  awayStaminaSignal: string;
  startingValueGapText: string;
}

export class FootballLineupAgent {
  public analyzeLineupAndStamina(match: Match): LineupStaminaReport {
    const homeVal = match.homeTeam.totalMarketValue;
    const awayVal = match.awayTeam.totalMarketValue;

    return {
      homeStaminaSignal: `홈 ${match.homeTeam.staminaStatus} (${match.homeTeam.minutesPlayed14d}분)`,
      awayStaminaSignal: `원정 ${match.awayTeam.staminaStatus} (${match.awayTeam.minutesPlayed14d}분)`,
      startingValueGapText: `선발 11명 몸값 체급: ${match.homeTeam.name} (${homeVal}) vs ${match.awayTeam.name} (${awayVal})`
    };
  }
}
