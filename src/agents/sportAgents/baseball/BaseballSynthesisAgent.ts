import { BaseballParkWeatherAgent } from './BaseballParkWeatherAgent';
import { BaseballStartingPitcherAgent } from './BaseballStartingPitcherAgent';
import { BaseballBullpenWorkloadAgent } from './BaseballBullpenWorkloadAgent';
import { BaseballBatterSplitsAgent } from './BaseballBatterSplitsAgent';
import { BaseballDefenseUmpireAgent } from './BaseballDefenseUmpireAgent';
import type { Match } from '../../../types/sports';

export class BaseballSynthesisAgent {
  private parkWeatherAgent = new BaseballParkWeatherAgent();
  private startingPitcherAgent = new BaseballStartingPitcherAgent();
  private bullpenWorkloadAgent = new BaseballBullpenWorkloadAgent();
  private batterSplitsAgent = new BaseballBatterSplitsAgent();
  private defenseUmpireAgent = new BaseballDefenseUmpireAgent();

  public synthesizeBaseballFactReport(match: Match) {
    const park = this.parkWeatherAgent.analyzeParkAndWeather(match);
    const starter = this.startingPitcherAgent.analyzeStartingPitcher(match);
    const bullpen = this.bullpenWorkloadAgent.analyzeBullpenWorkload(match);
    const splits = this.batterSplitsAgent.analyzeBatterSplits(match);
    const defense = this.defenseUmpireAgent.analyzeDefenseAndUmpire(match);

    return {
      matchNo: match.betmanMatchNo,
      homeName: match.homeTeam.name,
      awayName: match.awayTeam.name,
      factSummaryList: [
        park.parkText,
        starter.starterText,
        bullpen.bullpenText,
        splits.splitsText,
        defense.defenseText
      ]
    };
  }
}
