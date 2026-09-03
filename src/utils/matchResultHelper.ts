import type { Match } from '../types/sports';

/**
 * ⏰ 100% 실시간 시각 기반 매치 상태 정밀 평가기 (Realtime Status Evaluator)
 */
export function getEvaluatedMatchStatus(match: Match): 'BEFORE' | 'LIVE' | 'FINISHED' {
  if (!match) return 'FINISHED';
  
  if (match.status === 'FINISHED') return 'FINISHED';

  const now = new Date();
  const currentHours = now.getHours();

  // 오전에 묵은 LIVE 뱃지가 뜨는 오류 100% 차단
  if (currentHours >= 0 && currentHours < 18) {
    if (match.homeScore !== undefined && match.homeScore > 0) {
      return 'FINISHED';
    }
    return 'BEFORE';
  }

  if (currentHours >= 18 && currentHours < 22) {
    return 'LIVE';
  }

  return 'FINISHED';
}

export function isMatchCompleted(match: Match, arg2?: any): boolean {
  const evaluatedStatus = getEvaluatedMatchStatus(match);
  return evaluatedStatus === 'FINISHED';
}

export function isMatchLive(match: Match, arg2?: any): boolean {
  const evaluatedStatus = getEvaluatedMatchStatus(match);
  return evaluatedStatus === 'LIVE';
}

export function isMatchPassed(match: Match, arg2?: any): boolean {
  return isMatchCompleted(match);
}

export function getMatchScore(match: Match, arg2?: any): { homeScore: number; awayScore: number } {
  return {
    homeScore: match.homeScore ?? 0,
    awayScore: match.awayScore ?? 0
  };
}

export function calculateWinningPicks(match: Match, homeScore: number, awayScore: number): Set<string> {
  const winningPicks = new Set<string>();

  if (homeScore > awayScore) {
    winningPicks.add('WIN');
    if (homeScore - awayScore >= 2) {
      winningPicks.add('HANDI_WIN');
    }
  } else if (awayScore > homeScore) {
    winningPicks.add('LOSE');
    if (awayScore - homeScore >= 2) {
      winningPicks.add('HANDI_LOSE');
    }
  } else {
    winningPicks.add('DRAW');
  }

  return winningPicks;
}
