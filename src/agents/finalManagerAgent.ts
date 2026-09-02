import { MainMasterAgent } from './mainMasterAgent';
import { FootballAgent } from './sportAgents/footballAgent';
import { BaseballAgent } from './sportAgents/baseballAgent';
import { BasketballAgent } from './sportAgents/basketballAgent';
import { SpecialSportAgent } from './sportAgents/specialSportAgent';
import { BetmanGameManagerAgent } from './betmanGameManagerAgent';
import type { Match } from '../types/sports';

export class FinalManagerAgent {
  private masterAgent: MainMasterAgent;
  private footballAgent: FootballAgent;
  private baseballAgent: BaseballAgent;
  private basketballAgent: BasketballAgent;
  private specialSportAgent: SpecialSportAgent;
  private betmanGameManagerAgent: BetmanGameManagerAgent;

  constructor(masterAgent: MainMasterAgent) {
    this.masterAgent = masterAgent;
    this.footballAgent = new FootballAgent();
    this.baseballAgent = new BaseballAgent();
    this.basketballAgent = new BasketballAgent();
    this.specialSportAgent = new SpecialSportAgent();
    this.betmanGameManagerAgent = new BetmanGameManagerAgent();
  }

  public processMatchFactReport(match: Match): Match {
    let subAgentInsight = {};

    if (match.league.includes('축구') || match.league.includes('EPL') || match.league.includes('LALIGA')) {
      subAgentInsight = this.footballAgent.analyzeMatch(match);
    } else if (match.league.includes('KBO') || match.league.includes('야구')) {
      subAgentInsight = this.baseballAgent.analyzeMatch(match);
    } else if (match.league.includes('NBA') || match.league.includes('농구')) {
      subAgentInsight = this.basketballAgent.analyzeMatch(match);
    } else {
      subAgentInsight = this.specialSportAgent.analyzeMatch(match);
    }

    const updatedMatch: Match = {
      ...match
    };

    console.log(this.betmanGameManagerAgent.formatFactReportHeader(updatedMatch), subAgentInsight);
    this.masterAgent.updateMatchRecord(updatedMatch);
    return updatedMatch;
  }
}
