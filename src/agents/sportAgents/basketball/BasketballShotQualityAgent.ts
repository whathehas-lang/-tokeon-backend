import type { Match } from '../../../types/sports';

export class BasketballShotQualityAgent {
  public analyzeShotQuality(match: Match) {
    return {
      shotQualityText: `[4. 슛 퀄리티 및 공간 창출] ${match.homeTeam.name} 페인트존 득점 비중 52% (자유투 획득 비율 FTR 0.340 골밑 돌파 우수)`
    };
  }
}
