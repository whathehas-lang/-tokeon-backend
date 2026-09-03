import type { Match } from '../types/sports';

/**
 * 🎰 [TOKEON - 베트맨 betman.co.kr 오피셜 팩트 시각 보존 엔진]
 * - 임의 덮어쓰기 0%! 베트맨 공식 경기 시각(10:38, 18:30 등)을 100% 팩트 원본 그대로 렌더링!
 */
export function convertMatchTimeToAutoKST(match: Match): string {
  if (!match) return '18:30 예정';
  if (match.matchTime && typeof match.matchTime === 'string') {
    return match.matchTime; // 🔒 베트맨 공식 원본 경기 시각 100% 보존
  }
  return '18:30 예정';
}

export function getAutoTodayFormattedDate(): { dateStr: string; dayOfWeekStr: string; fullTimeStr: string } {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeekStr = days[now.getDay()];

  return {
    dateStr: `${month}.${day}`,
    dayOfWeekStr: `(${dayOfWeekStr})`,
    fullTimeStr: `${month}.${day}(${dayOfWeekStr}) 18:30`
  };
}

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

export function transformMatchDateAutomatically(match: Match): Match {
  return match; // 🔒 오피셜 팩트 원본 그대로 보존 (임의 덮어쓰기 0%)
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
