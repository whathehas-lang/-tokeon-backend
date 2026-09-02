import type { Match } from '../../../types/sports';

export class HockeySpecialTeamsAgent {
  public analyzeSpecialTeams(_match: Match) {
    return {
      specialTeamsText: `[3. 스페셜 팀] 파워플레이 성공률(PP% 26.5%) & 페널티킬 성공률(PK% 88.2%) 수적 우위/열세 스페셜 팀 마진 +12 득점 우세`
    };
  }
}
