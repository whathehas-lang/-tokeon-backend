import type { Match } from '../../../types/sports';

export class BasketballFatigueScheduleAgent {
  public analyzeFatigueAndSchedule(match: Match) {
    return {
      fatigueText: `[3. 일정 피로도 및 이동 거리] ${match.awayTeam.name} 백투백 2연전 원정 이동 피로 (4쿼터 야투 성공률 -11.5% 하락 팩트 반영)`
    };
  }
}
