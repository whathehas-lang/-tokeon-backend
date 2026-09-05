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

/**
 * ⏰ [현시간 기준 최적 타겟 경기 탐색 엔진]
 * - 1순위: 현재 진행 중인 LIVE 경기
 * - 2순위: 3시간 이내 시작했거나 앞으로 시작할 예정인 경기 (!isFinished && timestamp >= nowSec - 3 * 3600)
 * - 3순위: 종료되지 않은 첫 번째 경기
 * - 4순위: 현재 시각과 가장 가까운 경기
 */
export function findCurrentTimeMatchId(matches: Match[], customNowSec?: number): string | null {
  if (!matches || matches.length === 0) return null;
  const nowSec = customNowSec ?? Math.floor(Date.now() / 1000);

  // 1. LIVE 경기 우선
  const liveMatch = matches.find(m => {
    const st = (m.status as string) || '';
    const code = (m as any).statusCode || '';
    return st === 'LIVE' || code === 'INP' || code === 'LIVE';
  });
  if (liveMatch) return liveMatch.id;

  // 2. 최근 3시간 이내 시작했거나 예정된 미종료 경기
  const activeOrUpcoming = matches.find(m => {
    const isFinished = m.status === 'FINISHED' || (m as any).statusCode === 'FT' || m.isCompleted === true;
    if (isFinished) return false;
    const ts = (m as any).timestamp || 0;
    return ts >= (nowSec - 3 * 3600);
  });
  if (activeOrUpcoming) return activeOrUpcoming.id;

  // 3. 종료되지 않은 첫 번째 예정 경기
  const notFinished = matches.find(m => {
    return m.status !== 'FINISHED' && (m as any).statusCode !== 'FT' && !m.isCompleted;
  });
  if (notFinished) return notFinished.id;

  // 4. 현재 시각과 차이가 가장 적은 경기
  let closest = matches[0];
  let minDiff = Math.abs(((closest as any).timestamp || 0) - nowSec);
  for (const m of matches) {
    const diff = Math.abs(((m as any).timestamp || 0) - nowSec);
    if (diff < minDiff) {
      minDiff = diff;
      closest = m;
    }
  }
  return closest ? closest.id : null;
}
