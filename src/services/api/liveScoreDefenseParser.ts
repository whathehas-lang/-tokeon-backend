/**
 * 🛡️ LiveScoreDefenseParser
 * 야구(API-Baseball) / 축구(API-Football) 공통 방어 파싱 로직
 * 1) total 정상 수치(number) 검증
 * 2) total이 null인 경우 이닝별/하프별 세부 점수 직접 합산 (Fallback)
 * 3) 끝까지 null인 경우 null을 반환하여 DB/UI의 기존 점수를 보존하고 덮어쓰지 않음
 */

export interface ExtractedLiveScoreResult {
  homeScore: number | null; // null이면 DB 업데이트 스킵 및 기존 점수 보존
  awayScore: number | null;
  isFullyParsed: boolean;
  scoreSource: 'DIRECT_TOTAL' | 'INNING_HALF_SUM' | 'PRESERVED_PREV';
}

export class LiveScoreDefenseParser {
  /**
   * 야구/축구/농구 공통 방어적 실시간 스코어 추출기
   */
  public static extractLiveScore(apiGameData: any, prevScore?: { home?: number; away?: number }): ExtractedLiveScoreResult {
    if (!apiGameData || !apiGameData.scores) {
      return {
        homeScore: prevScore?.home ?? null,
        awayScore: prevScore?.away ?? null,
        isFullyParsed: false,
        scoreSource: 'PRESERVED_PREV'
      };
    }

    const scores = apiGameData.scores;

    // ─────────────────────────────────────────────────────────────
    // 1️⃣ total 점수가 정상 수치(number)인지 검증
    // ─────────────────────────────────────────────────────────────
    let homeScore: number | null = (typeof scores?.home?.total === 'number' && !isNaN(scores.home.total))
      ? scores.home.total
      : null;

    let awayScore: number | null = (typeof scores?.away?.total === 'number' && !isNaN(scores.away.total))
      ? scores.away.total
      : null;

    let scoreSource: ExtractedLiveScoreResult['scoreSource'] = 'DIRECT_TOTAL';

    // ─────────────────────────────────────────────────────────────
    // 2️⃣ 만약 total이 null이면 이닝별/반별 점수의 합산을 직접 구함 (Fallback)
    // ─────────────────────────────────────────────────────────────
    // 야구: scores.home.innings = { "1": 0, "2": 1, ... }
    // 축구: scores.halftime, scores.fulltime, scores.extratime
    if (homeScore === null && scores?.home?.innings && typeof scores.home.innings === 'object') {
      const inningValues = Object.values(scores.home.innings).filter(v => typeof v === 'number' && !isNaN(v as number)) as number[];
      if (inningValues.length > 0) {
        homeScore = inningValues.reduce((a, b) => a + b, 0);
        scoreSource = 'INNING_HALF_SUM';
      }
    }

    if (awayScore === null && scores?.away?.innings && typeof scores.away.innings === 'object') {
      const inningValues = Object.values(scores.away.innings).filter(v => typeof v === 'number' && !isNaN(v as number)) as number[];
      if (inningValues.length > 0) {
        awayScore = inningValues.reduce((a, b) => a + b, 0);
        scoreSource = 'INNING_HALF_SUM';
      }
    }

    // 축구 하프타임/풀타임 세부 스코어 합산 폴백 (API-Football 구조: scores.halftime.home, scores.fulltime.home)
    if (homeScore === null && scores?.halftime?.home !== undefined && scores?.fulltime?.home !== undefined) {
      const ht = typeof scores.halftime.home === 'number' ? scores.halftime.home : 0;
      const ft = typeof scores.fulltime.home === 'number' ? scores.fulltime.home : 0;
      homeScore = Math.max(ht, ft);
      scoreSource = 'INNING_HALF_SUM';
    }

    if (awayScore === null && scores?.halftime?.away !== undefined && scores?.fulltime?.away !== undefined) {
      const ht = typeof scores.halftime.away === 'number' ? scores.halftime.away : 0;
      const ft = typeof scores.fulltime.away === 'number' ? scores.fulltime.away : 0;
      awayScore = Math.max(ht, ft);
      scoreSource = 'INNING_HALF_SUM';
    }

    // ─────────────────────────────────────────────────────────────
    // 3️⃣ 끝까지 null인 경우 DB의 기존 점수(prevScore)를 유지하고 덮어쓰지 않음
    // ─────────────────────────────────────────────────────────────
    const isFullyParsed = (homeScore !== null && awayScore !== null);
    if (!isFullyParsed) {
      scoreSource = 'PRESERVED_PREV';
    }

    return {
      homeScore, // null이면 DB 업데이트 스킵
      awayScore,
      isFullyParsed,
      scoreSource
    };
  }
}
