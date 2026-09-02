import { VolleyballSynthesisAgent } from './volleyball/VolleyballSynthesisAgent';
import type { Match } from '../../types/sports';

export class VolleyballAgent {
  private synthesisAgent = new VolleyballSynthesisAgent();

  public analyzeMatch(match: Match) {
    const report = this.synthesisAgent.synthesizeVolleyballFactReport(match);

    return {
      factSummaryList: report.factSummaryList,
      setterReportText: report.factSummaryList[0],
      foreignerReportText: report.factSummaryList[1]
    };
  }
}
