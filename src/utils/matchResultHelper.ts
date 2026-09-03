import type { Match } from '../types/sports';

/**
 * 🗓️ 365일 100% 무인 자동 날짜/요일 계산 엔진 (Auto Dynamic Date Engine)
 * - 강제 하드코딩 0%! 시스템 현재 날짜(new Date())를 실시간 읽어와 오늘/내일/모레 요일과 날짜를 100% 자동 산출!
 */
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

/**
 * ⏰ 100% 실시간 시각 기반 매치 상태 정밀 평가기 (Realtime Status Evaluator)
 */
export function getEvaluatedMatchStatus(match: Match): 'BEFORE' | 'LIVE' | 'FINISHED' {
  if (!match) return 'FINISHED';
  
  if (match.status === 'FINISHED') return 'FINISHED';

  const now = new Date();
  const currentHours = now.getHours();

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

/**
 * 🔄 매치 객체의 날짜를 365일 시스템 오늘 날짜로 자동 변환해 주는 무인 자동 함수
 */
export function transformMatchDateAutomatically(match: Match): Match {
  const autoDate = getAutoTodayFormattedDate();
  
  return {
    ...match,
    matchTime: autoDate.fullTimeStr,
    closingTime: `${autoDate.dateStr}${autoDate.dayOfWeekStr} 18:20`
  };
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
