import { BasketballPaceRatingAgent } from './BasketballPaceRatingAgent';
import { BasketballOnOffMarginAgent } from './BasketballOnOffMarginAgent';
import { BasketballFatigueScheduleAgent } from './BasketballFatigueScheduleAgent';
import { BasketballShotQualityAgent } from './BasketballShotQualityAgent';
import { BasketballPossessionBattleAgent } from './BasketballPossessionBattleAgent';
import type { Match } from '../../../types/sports';

export class BasketballSynthesisAgent {
  private paceRatingAgent = new BasketballPaceRatingAgent();
  private onOffMarginAgent = new BasketballOnOffMarginAgent();
  private fatigueScheduleAgent = new BasketballFatigueScheduleAgent();
  private shotQualityAgent = new BasketballShotQualityAgent();
  private possessionBattleAgent = new BasketballPossessionBattleAgent();

  public synthesizeBasketballFactReport(match: Match) {
    const pace = this.paceRatingAgent.analyzePaceAndRating(match);
    const onOff = this.onOffMarginAgent.analyzeOnOffMargin(match);
    const fatigue = this.fatigueScheduleAgent.analyzeFatigueAndSchedule(match);
    const shot = this.shotQualityAgent.analyzeShotQuality(match);
    const possession = this.possessionBattleAgent.analyzePossessionBattle(match);

    return {
      matchNo: match.betmanMatchNo,
      homeName: match.homeTeam.name,
      awayName: match.awayTeam.name,
      factSummaryList: [
        pace.paceText,
        onOff.onOffText,
        fatigue.fatigueText,
        shot.shotQualityText,
        possession.possessionText
      ]
    };
  }
}
