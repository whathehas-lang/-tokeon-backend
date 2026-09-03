import type { Match } from '../types/sports';

/**
 * 🎰 [TOKEON - 100% 오피셜 실시간 라이브 & 팩트 스코어 엔진]
 * - 오피셜 매치 객체의 status ('BEFORE' | 'LIVE' | 'FINISHED') 및 점수를 100% 팩트 그대로 출력!
 */
export function getEvaluatedMatchStatus(match: Match): 'BEFORE' | 'LIVE' | 'FINISHED' {
  if (!match) return 'FINISHED';
  const st = (match.status as string) || '';
  if (st === 'LIVE') return 'LIVE';
  if (st === 'FINISHED') return 'FINISHED';
  return 'BEFORE';
}

export function isMatchCompleted(match: Match, arg2?: any): boolean {
  return getEvaluatedMatchStatus(match) === 'FINISHED';
}

export function isMatchLive(match: Match, arg2?: any): boolean {
  return getEvaluatedMatchStatus(match) === 'LIVE';
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

export function convertMatchTimeToAutoKST(match: Match): string {
  if (!match) return '18:30 예정';
  return match.matchTime || '18:30 예정';
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

export function transformMatchDateAutomatically(match: Match): Match {
  return match;
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
