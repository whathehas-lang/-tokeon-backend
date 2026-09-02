import { BasketballSynthesisAgent } from './basketball/BasketballSynthesisAgent';
import type { Match } from '../../types/sports';

export class BasketballAgent {
  private synthesisAgent = new BasketballSynthesisAgent();

  public analyzeMatch(match: Match) {
    const report = this.synthesisAgent.synthesizeBasketballFactReport(match);

    return {
      factSummaryList: report.factSummaryList,
      paceReportText: report.factSummaryList[0],
      fatigueReportText: report.factSummaryList[2]
    };
  }
}
