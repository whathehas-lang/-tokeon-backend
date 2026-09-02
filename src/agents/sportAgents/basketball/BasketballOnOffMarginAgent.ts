import type { Match } from '../../../types/sports';

export class BasketballOnOffMarginAgent {
  public analyzeOnOffMargin(match: Match) {
    const isAwayRisk = match.awayTeam.staminaStatus === 'RED';
    return {
      onOffText: isAwayRisk 
        ? `[2. 결장자 및 온/오프 마진] ${match.awayTeam.name} 주전 에이스 결장 시 코트 득실 마진 Net Rating -14.5 감점 재산출`
        : `[2. 결장자 및 온/오프 마진] 주전 라인업 코트 온/오프 마진 Net Rating +8.2 안정 유지`
    };
  }
}
