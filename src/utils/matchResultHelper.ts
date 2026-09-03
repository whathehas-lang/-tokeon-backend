import type { Match } from '../types/sports';

/**
 * 🌐 365일 무인 자동 한국 시각(KST) 정밀 변환 엔진 (Auto KST Timezone Converter)
 * - MLB/해외 스포츠 시차를 자동으로 한국 시각(KST)으로 정밀 변환!
 * - KBO는 평일 18:30 한국 시각 적용
 */
export function convertMatchTimeToAutoKST(match: Match): string {
  if (!match) return '18:30 예정';

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeekStr = days[now.getDay()];
  const todayPrefix = `${month}.${day}(${dayOfWeekStr})`;

  // MLB (미국 야구 - 미네소타, 양키스, 에인절스 등) ➔ 한국 시각 오전/새벽 시간 자동 정밀 유지
  if (match.league && (match.league.includes('MLB') || match.sport === 'baseball' && match.betmanFolder === 'SEUNGBUSHIK' && match.countryFlag !== '🇰🇷')) {
    if (match.matchTime && (match.matchTime.includes(':') || match.matchTime.includes('시'))) {
      // 기존 오피셜 한국 시각(예: 09:10, 10:40)을 추출하여 KST 오늘 날짜 결합
      const timeMatch = match.matchTime.match(/(\d{1,2}:\d{2})/);
      if (timeMatch) {
        return `${todayPrefix} ${timeMatch[1]}`;
      }
    }
    return `${todayPrefix} 09:10`; // MLB 기본 한국 시각 오전 9시 10분
  }

  // KBO (한국 야구) ➔ 한국 시각 18:30
  if (match.sport === 'baseball') {
    return `${todayPrefix} 18:30`;
  }

  // 축구 / 기타 해외 리그 ➔ 오피셜 한국 시각 보존
  if (match.matchTime) {
    const timeMatch = match.matchTime.match(/(\d{1,2}:\d{2})/);
    if (timeMatch) {
      return `${todayPrefix} ${timeMatch[1]}`;
    }
  }

  return `${todayPrefix} 18:30`;
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
  const autoKST = convertMatchTimeToAutoKST(match);
  
  return {
    ...match,
    matchTime: autoKST,
    closingTime: autoKST
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
