import { HockeyExpectedShotMetricsAgent } from './HockeyExpectedShotMetricsAgent';
import { HockeyGoaltenderPerformanceAgent } from './HockeyGoaltenderPerformanceAgent';
import { HockeySpecialTeamsAgent } from './HockeySpecialTeamsAgent';
import { HockeyFatigueRotationAgent } from './HockeyFatigueRotationAgent';
import { HockeyPhysicalityPossessionAgent } from './HockeyPhysicalityPossessionAgent';
import type { Match } from '../../../types/sports';

export class HockeySynthesisAgent {
  private shotMetricsAgent = new HockeyExpectedShotMetricsAgent();
  private goaltenderAgent = new HockeyGoaltenderPerformanceAgent();
  private specialTeamsAgent = new HockeySpecialTeamsAgent();
  private fatigueRotationAgent = new HockeyFatigueRotationAgent();
  private possessionAgent = new HockeyPhysicalityPossessionAgent();

  public synthesizeHockeyFactReport(match: Match) {
    const shot = this.shotMetricsAgent.analyzeExpectedShotMetrics(match);
    const goalie = this.goaltenderAgent.analyzeGoaltenderPerformance(match);
    const st = this.specialTeamsAgent.analyzeSpecialTeams(match);
    const fatigue = this.fatigueRotationAgent.analyzeFatigueRotation(match);
    const possession = this.possessionAgent.analyzePhysicalityPossession(match);

    return {
      matchNo: match.betmanMatchNo,
      homeName: match.homeTeam.name,
      awayName: match.awayTeam.name,
      factSummaryList: [
        shot.shotText,
        goalie.goaltenderText,
        st.specialTeamsText,
        fatigue.fatigueText,
        possession.possessionText
      ]
    };
  }
}
