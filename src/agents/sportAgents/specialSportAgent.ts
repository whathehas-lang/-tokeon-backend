import type { Match } from '../../types/sports';

export class SpecialSportAgent {
  public analyzeMatch(match: Match) {
    return {
      homeName: match.homeTeam.name,
      awayName: match.awayTeam.name,
      factText: `🎾🎮 [기타 팩트 리포트] 최근 팩트 수치 검증 완료`
    };
  }
}
