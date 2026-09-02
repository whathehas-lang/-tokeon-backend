import type { Match } from '../../../types/sports';

export interface H2HReport {
  homeRecentForm: string;
  awayRecentForm: string;
  h2hSummary: string;
  homeWinRatio: number;
}

export class FootballH2HAgent {
  public analyzeH2HAndRecentResults(match: Match): H2HReport {
    const homeFormStr = match.homeTeam.recent3Form === 'GREEN' ? '🟢 상승' : match.homeTeam.recent3Form === 'RED' ? '🔴 하강' : '➡️ 보통';
    const awayFormStr = match.awayTeam.recent3Form === 'GREEN' ? '🟢 상승' : match.awayTeam.recent3Form === 'RED' ? '🔴 하강' : '➡️ 보통';

    return {
      homeRecentForm: `[홈] ${match.homeTeam.name}: 최근 3경기 (${homeFormStr})`,
      awayRecentForm: `[원정] ${match.awayTeam.name}: 최근 3경기 (${awayFormStr})`,
      h2hSummary: `최근 맞대결 5경기 ${match.homeTeam.name} 3승 1무 1패 우세`,
      homeWinRatio: 60
    };
  }
}
