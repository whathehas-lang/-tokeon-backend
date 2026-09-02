import type { Match } from '../../../types/sports';

export class FootballRefereeSetpieceAgent {
  public analyzeRefereeSetpiece(match: Match) {
    return {
      refereeSetpieceText: `[5. 심판 성향 및 세트피스] 오늘 배정된 심판은 파울 콜이 매우 엄격하며, 세트피스 득점률이 높인 ${match.homeTeam.name}에게 프리킥 기회가 다수 창출될 유리한 환경입니다.`
    };
  }
}
