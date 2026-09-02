import { FootballSynthesisAgent } from './football/FootballSynthesisAgent';
import type { Match } from '../../types/sports';

export class FootballAgent {
  private synthesisAgent = new FootballSynthesisAgent();

  public analyzeMatch(match: Match) {
    const report = this.synthesisAgent.synthesizeFootballFactReport(match);

    return {
      factSummaryList: report.factSummaryList,
      h2hReportText: report.factSummaryList[0],
      lineupReportText: report.factSummaryList[1]
    };
  }
}
