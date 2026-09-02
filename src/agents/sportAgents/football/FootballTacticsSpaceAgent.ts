import type { Match } from '../../../types/sports';

export class FootballTacticsSpaceAgent {
  public analyzeTacticsAndSpace(match: Match) {
    const isFiveBack = match.underOverFact.isFiveBack;
    return {
      tacticsText: `[2. 전술 상성 및 공간 분석] 수비 라인을 높게 올리는 ${match.awayTeam.name}은 뒷공간 침투와 빠른 역습에 능한 ${match.homeTeam.name}에게 전술적으로 고전할 확률이 70%입니다. (${isFiveBack ? '5백 텐백 대응' : '4백 맞불 전술'})`
    };
  }
}
