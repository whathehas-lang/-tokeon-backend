import { FootballExpectedMetricsAgent } from './FootballExpectedMetricsAgent';
import { FootballTacticsSpaceAgent } from './FootballTacticsSpaceAgent';
import { FootballRosterAbsenceAgent } from './FootballRosterAbsenceAgent';
import { FootballMotivationContextAgent } from './FootballMotivationContextAgent';
import { FootballRefereeSetpieceAgent } from './FootballRefereeSetpieceAgent';
import type { Match } from '../../../types/sports';

export class FootballSynthesisAgent {
  private expectedMetricsAgent = new FootballExpectedMetricsAgent();
  private tacticsSpaceAgent = new FootballTacticsSpaceAgent();
  private rosterAbsenceAgent = new FootballRosterAbsenceAgent();
  private motivationContextAgent = new FootballMotivationContextAgent();
  private refereeSetpieceAgent = new FootballRefereeSetpieceAgent();

  public synthesizeFootballFactReport(match: Match) {
    const xG = this.expectedMetricsAgent.analyzeExpectedMetrics(match);
    const tactics = this.tacticsSpaceAgent.analyzeTacticsAndSpace(match);
    const roster = this.rosterAbsenceAgent.analyzeRosterAbsence(match);
    const motivation = this.motivationContextAgent.analyzeMotivationContext(match);
    const referee = this.refereeSetpieceAgent.analyzeRefereeSetpiece(match);

    return {
      matchNo: match.betmanMatchNo,
      homeName: match.homeTeam.name,
      awayName: match.awayTeam.name,
      factSummaryList: [
        xG.xGText,
        tactics.tacticsText,
        roster.rosterText,
        motivation.motivationText,
        referee.refereeSetpieceText
      ]
    };
  }
}
