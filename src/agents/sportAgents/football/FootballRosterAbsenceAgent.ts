import type { Match } from '../../../types/sports';

export class FootballRosterAbsenceAgent {
  public analyzeRosterAbsence(match: Match) {
    const isOverload = match.awayTeam.staminaStatus === 'RED';
    return {
      rosterText: isOverload
        ? `[3. 로스터 및 결장자 타격도] 핵심 수비형 미드필더 및 주전 센터백 결장으로 ${match.awayTeam.name}의 포백 보호 능력이 급감하여 상대 2선 자원에게 공간을 내줄 위험이 높습니다.`
        : `[3. 로스터 및 결장자 타격도] 양 팀 주전 라인업 큰 누수 없이 정상 출전 가능 상태입니다.`
    };
  }
}
