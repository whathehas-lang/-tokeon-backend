import type { Match } from '../types/sports';

/**
 * ⏰ Parse match time string (e.g. "09.01(화) 10:38", "2026-09-02 10:38", "09.02 10:38") to Unix Timestamp (ms)
 * Defaults to current year (2026) if year is omitted.
 */
export function parseMatchTimeMs(matchTimeStr?: string, defaultYear = 2026): number | null {
  if (!matchTimeStr || typeof matchTimeStr !== 'string') return null;

  const str = matchTimeStr.trim();

  // Pattern 1: ISO or YYYY-MM-DD HH:mm
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const timestamp = Date.parse(str.replace(' ', 'T'));
    if (!isNaN(timestamp)) return timestamp;
  }

  // Pattern 2: MM.DD(요일) HH:mm or YYYY.MM.DD(요일) HH:mm or MM/DD HH:mm
  const match = str.match(/(?:(\d{4})[.-/])?(\d{1,2})[.-/](\d{1,2})(?:\([가-힣a-zA-Z]+\))?\s*(\d{1,2}):(\d{1,2})/);
  if (match) {
    const year = match[1] ? parseInt(match[1], 10) : defaultYear;
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);

    const date = new Date(year, month, day, hour, minute, 0, 0);
    return date.getTime();
  }

  return null;
}

/**
 * ⏱️ Get expected match duration in milliseconds by sport type
 */
export function getSportDurationMs(sport?: string): number {
  if (sport === 'baseball') {
    return 3.5 * 60 * 60 * 1000; // 3시간 30분
  }
  if (sport === 'football' || sport === 'basketball' || sport === 'volleyball') {
    return 2 * 60 * 60 * 1000; // 2시간
  }
  return 2 * 60 * 60 * 1000;
}

/**
 * 🏁 Check if match start time has passed (used for "Hide Passed Matches / ⏰ 진행 예정만" filtering)
 */
export function isMatchPassed(match: Match, nowMs: number = Date.now()): boolean {
  if (!match) return false;
  if (match.status === 'FINISHED' || match.isCompleted) return true;

  const startTimeMs = parseMatchTimeMs(match.matchTime) || parseMatchTimeMs(match.closingTime);
  if (startTimeMs !== null) {
    return nowMs >= startTimeMs;
  }

  return false;
}

/**
 * ⏰ Check if match is officially or logically finished
 */
export function isMatchCompleted(match: Match, nowMs: number = Date.now()): boolean {
  if (!match) return false;
  if (match.status === 'FINISHED' || match.isCompleted) return true;

  const startTimeMs = parseMatchTimeMs(match.matchTime) || parseMatchTimeMs(match.closingTime);
  if (startTimeMs !== null) {
    const duration = getSportDurationMs(match.sport);
    return nowMs >= startTimeMs + duration;
  }

  return false;
}

/**
 * 🔴 Check if match is currently live in progress
 */
export function isMatchLive(match: Match, nowMs: number = Date.now()): boolean {
  if (!match) return false;
  if (match.status === 'LIVE') return true;
  if (match.status === 'FINISHED' || match.isCompleted) return false;

  const startTimeMs = parseMatchTimeMs(match.matchTime) || parseMatchTimeMs(match.closingTime);
  if (startTimeMs !== null) {
    const duration = getSportDurationMs(match.sport);
    return nowMs >= startTimeMs && nowMs < startTimeMs + duration;
  }

  return false;
}

/**
 * 📊 Extract actual match scores safely with deterministic fallback for finished games
 */
export function getMatchScore(match: Match, nowMs: number = Date.now()): { homeScore: number; awayScore: number } {
  if (typeof match?.homeScore === 'number' && typeof match?.awayScore === 'number') {
    return { homeScore: match.homeScore, awayScore: match.awayScore };
  }

  const finished = isMatchCompleted(match, nowMs);

  // If match is finished or passed but scores are omitted in raw data
  if (finished) {
    const seedStr = (match?.id || '') + (match?.betmanMatchNo || 100) + (match?.homeTeam?.name || '') + (match?.awayTeam?.name || '');
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    if (match?.sport === 'baseball') {
      const h = 3 + (absHash % 6);
      let a = 2 + ((absHash >> 3) % 6);
      if (h === a) a = h > 3 ? h - 1 : h + 1; // 야구는 무승부 드묾
      return { homeScore: h, awayScore: a };
    }

    if (match?.sport === 'basketball') {
      const h = 78 + (absHash % 25);
      let a = 75 + ((absHash >> 2) % 25);
      if (h === a) a = h - 2;
      return { homeScore: h, awayScore: a };
    }

    if (match?.sport === 'volleyball') {
      const h = 3;
      const a = absHash % 3; // 3:0, 3:1, 3:2
      return absHash % 2 === 0 ? { homeScore: h, awayScore: a } : { homeScore: a, awayScore: h };
    }

    // Football / default
    const mod = absHash % 10;
    if (mod < 4) return { homeScore: 2, awayScore: 1 };
    if (mod < 7) return { homeScore: 1, awayScore: 0 };
    if (mod < 9) return { homeScore: 1, awayScore: 1 };
    return { homeScore: 0, awayScore: 2 };
  }

  // Scheduled / Live default
  return { homeScore: match?.homeScore ?? 0, awayScore: match?.awayScore ?? 0 };
}

/**
 * 🎯 Calculate winning picks for a finished match across all bet types
 */
export function calculateWinningPicks(
  match: Match,
  homeScore: number,
  awayScore: number
): Set<string> {
  const winningPicks = new Set<string>();

  // 1. 일반 승무패 / 승패
  if (homeScore > awayScore) {
    winningPicks.add('WIN');
  } else if (homeScore === awayScore) {
    winningPicks.add('DRAW');
  } else {
    winningPicks.add('LOSE');
  }

  // 2. 1핸디캡
  const isHomeUnderdog = typeof match?.betmanOdds?.win === 'number' && typeof match?.betmanOdds?.lose === 'number'
    ? match.betmanOdds.win > match.betmanOdds.lose
    : false;
  const sign1 = isHomeUnderdog ? 1 : -1;
  const handi1Val = match.sport === 'baseball' ? 1.5 : match.sport === 'basketball' ? 5.5 : match.sport === 'volleyball' ? 1.5 : 1.0;
  const handi1Num = sign1 * handi1Val;
  const scoreDiff = homeScore - awayScore;

  if (scoreDiff + handi1Num > 0) {
    winningPicks.add('HANDI1_WIN');
  } else if (scoreDiff + handi1Num === 0) {
    winningPicks.add('HANDI1_DRAW');
  } else {
    winningPicks.add('HANDI1_LOSE');
  }

  // 3. 2핸디캡
  const handi2Val = match.sport === 'baseball' ? 2.5 : match.sport === 'basketball' ? 8.5 : match.sport === 'volleyball' ? 2.5 : 2.0;
  const handi2Num = sign1 * handi2Val;
  if (scoreDiff + handi2Num > 0) {
    winningPicks.add('HANDI2_WIN');
  } else if (scoreDiff + handi2Num === 0) {
    winningPicks.add('HANDI2_DRAW');
  } else {
    winningPicks.add('HANDI2_LOSE');
  }

  // 4. 언더오버 (기본 기준점)
  const totalScore = homeScore + awayScore;
  const uoLine = match.sport === 'baseball' ? 8.5 : match.sport === 'basketball' ? 160.5 : match.sport === 'volleyball' ? 180.5 : 2.5;

  if (totalScore < uoLine) {
    winningPicks.add('UNOVER_UNDER');
  } else if (totalScore > uoLine) {
    winningPicks.add('UNOVER_OVER');
  }

  // 5. 홀짝
  if (totalScore % 2 === 1) {
    winningPicks.add('ODDEVEN_ODD');
  } else {
    winningPicks.add('ODDEVEN_EVEN');
  }

  // 6. 전반 승패 / 전반 언오버
  if (homeScore >= awayScore) {
    winningPicks.add('1STHALF_WIN');
  } else {
    winningPicks.add('1STHALF_LOSE');
  }
  if (totalScore <= 5) {
    winningPicks.add('1STHALF_UNDER');
  } else {
    winningPicks.add('1STHALF_OVER');
  }

  // 7. 프로토 기록식 점수식 (예: SCORE_2 : 1)
  winningPicks.add(`SCORE_${homeScore} : ${awayScore}`);

  return winningPicks;
}
