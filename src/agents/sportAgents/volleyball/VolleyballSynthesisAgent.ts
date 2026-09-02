import { VolleyballSetterDistributionAgent } from './VolleyballSetterDistributionAgent';
import { VolleyballForeignerUsageAgent } from './VolleyballForeignerUsageAgent';
import { VolleyballServeErrorsAgent } from './VolleyballServeErrorsAgent';
import { VolleyballHeightBlockingAgent } from './VolleyballHeightBlockingAgent';
import { VolleyballClutchPerformanceAgent } from './VolleyballClutchPerformanceAgent';
import type { Match } from '../../../types/sports';

export class VolleyballSynthesisAgent {
  private setterAgent = new VolleyballSetterDistributionAgent();
  private foreignerAgent = new VolleyballForeignerUsageAgent();
  private serveAgent = new VolleyballServeErrorsAgent();
  private heightAgent = new VolleyballHeightBlockingAgent();
  private clutchAgent = new VolleyballClutchPerformanceAgent();

  public synthesizeVolleyballFactReport(match: Match) {
    const setter = this.setterAgent.analyzeSetterDistribution(match);
    const foreigner = this.foreignerAgent.analyzeForeignerUsage(match);
    const serve = this.serveAgent.analyzeServeErrors(match);
    const height = this.heightAgent.analyzeHeightBlocking(match);
    const clutch = this.clutchAgent.analyzeClutchPerformance(match);

    return {
      matchNo: match.betmanMatchNo,
      homeName: match.homeTeam.name,
      awayName: match.awayTeam.name,
      factSummaryList: [
        setter.setterText,
        foreigner.foreignerText,
        serve.serveText,
        height.heightText,
        clutch.clutchText
      ]
    };
  }
}
