import { BaseballSynthesisAgent } from './baseball/BaseballSynthesisAgent';
import type { Match } from '../../types/sports';

export class BaseballAgent {
  private synthesisAgent = new BaseballSynthesisAgent();

  public analyzeMatch(match: Match) {
    const report = this.synthesisAgent.synthesizeBaseballFactReport(match);

    return {
      factSummaryList: report.factSummaryList,
      parkReportText: report.factSummaryList[0],
      starterReportText: report.factSummaryList[1]
    };
  }
}
