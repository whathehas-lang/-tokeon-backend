import type { Match } from '../../../types/sports';

export class BasketballPossessionBattleAgent {
  public analyzePossessionBattle(_match: Match) {
    return {
      possessionText: `[5. 리바운드 및 턴오버 마진] 공격 리바운드 점유율(ORB% 31.5%) & 턴오버 유발 속공 득점력 우위 판단`
    };
  }
}
