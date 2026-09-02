import { HockeySynthesisAgent } from './hockey/HockeySynthesisAgent';
import type { Match } from '../../types/sports';

export class HockeyAgent {
  private synthesisAgent = new HockeySynthesisAgent();

  public analyzeMatch(match: Match) {
    const report = this.synthesisAgent.synthesizeHockeyFactReport(match);

    return {
      factSummaryList: report.factSummaryList,
      shotReportText: report.factSummaryList[0],
      goaltenderReportText: report.factSummaryList[1]
    };
  }
}
