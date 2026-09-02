import type { Match } from '../../../types/sports';

export class HockeyFatigueRotationAgent {
  public analyzeFatigueRotation(match: Match) {
    const isAwayRed = match.awayTeam.staminaStatus === 'RED';
    return {
      fatigueText: isAwayRed
        ? `[4. 체력 및 로테이션] ${match.awayTeam.name} 4일간 3경기 가혹한 스케줄 & 백업 골리 등판 🔴 (3피리어드 후반 실점 리스크 가중)`
        : `[4. 체력 및 로테이션] ${match.homeTeam.name} 주전 골리 휴식 달성 (🟢 3피리어드 체력 우위)`
    };
  }
}
