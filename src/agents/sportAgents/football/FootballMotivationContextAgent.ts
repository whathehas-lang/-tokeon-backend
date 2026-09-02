import type { Match } from '../../../types/sports';

export class FootballMotivationContextAgent {
  public analyzeMotivationContext(match: Match) {
    return {
      motivationText: `[4. 상황 변수 및 동기부여] ${match.awayTeam.name}은 3일 뒤 대륙 컵대회 결승전이 있어 대규모 로테이션이 예상되며, ${match.homeTeam.name}은 승점이 필요한 동기부여가 최상입니다.`
    };
  }
}
