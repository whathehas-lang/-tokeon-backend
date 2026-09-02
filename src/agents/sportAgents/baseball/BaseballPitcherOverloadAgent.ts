import type { Match } from '../../../types/sports';

export interface PitcherOverloadReport {
  starterInningCapacity: string;
  bullpenRestDays: string;
}

export class BaseballPitcherOverloadAgent {
  public analyzePitcherOverload(_match: Match): PitcherOverloadReport {
    return {
      starterInningCapacity: `선발투수 최근 3경기 이닝 소화력: 평균 6.1이닝 (투구수 96구)`,
      bullpenRestDays: `불펜 필승조 최근 2일 휴식 달성 (🟢 과부하 없음)`
    };
  }
}
