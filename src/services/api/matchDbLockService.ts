import { sportsApiClient } from './sportsApiClient';
import { LiveScoreDefenseParser } from './liveScoreDefenseParser';
import type { Match } from '../../types/sports';

export interface ScoreValidationResult {
  isValid: boolean;
  rejectReason?: string;
  finalHomeScore: number | null;
  finalAwayScore: number | null;
  shouldLock: boolean;
}

/**
 * 🔒 MatchDbLockService
 * 1. 상태값 기반 DB Lock (경기 종료 판정 시 실시간 API 유입 완전 차단)
 * 2. 종료 직후 1회 단발성 오피셜 최종 상세 조회(GET /games?id={id})
 * 3. Null Check & 점수 감소(Score Decrement) 이상치 차단 Fallback
 */
export class MatchDbLockService {
  // 종료 후 단발성 상세 조회가 이미 실행되었거나 진행 중인 경기 ID Set (중복 호출 원천 차단)
  private static finalizedGamePks: Set<string> = new Set();
  private static lockedGameIds: Set<string> = new Set();

  /**
   * 공식 경기 종료 코드 화이트리스트
   */
  private static readonly OFFICIAL_FINISHED_STATUSES = new Set([
    'FT', 'AET', 'PEN', 'AOT', 'POST', 'FINISHED', 'FINAL', 'GAME OVER'
  ]);

  /**
   * 🔒 1. 경기 상태 기반 락(Lock) 확인
   */
  public static isGameLocked(gameId: string | number, currentStatus?: string): boolean {
    const key = String(gameId);
    if (this.lockedGameIds.has(key)) return true;
    if (currentStatus && this.OFFICIAL_FINISHED_STATUSES.has(currentStatus.toUpperCase())) {
      this.lockedGameIds.add(key);
      return true;
    }
    return false;
  }

  /**
   * 🛡️ 2. Null Check & 점수 감소(Score Decrement Outlier) 검증
   */
  public static validateScoreTransition(
    existingHome: number | null | undefined,
    existingAway: number | null | undefined,
    newHomeRaw: any,
    newAwayRaw: any,
    statusCode?: string
  ): ScoreValidationResult {
    const isFinished = statusCode ? this.OFFICIAL_FINISHED_STATUSES.has(statusCode.toUpperCase()) : false;

    // 1) Null/NaN/음수 기본 검사
    const hasValidHome = typeof newHomeRaw === 'number' && !isNaN(newHomeRaw) && newHomeRaw >= 0;
    const hasValidAway = typeof newAwayRaw === 'number' && !isNaN(newAwayRaw) && newAwayRaw >= 0;

    if (!hasValidHome || !hasValidAway) {
      return {
        isValid: false,
        rejectReason: `비정상 점수 유입 (Null/음수/NaN) - Home: ${newHomeRaw}, Away: ${newAwayRaw}. 기존 점수 보존.`,
        finalHomeScore: existingHome ?? null,
        finalAwayScore: existingAway ?? null,
        shouldLock: isFinished
      };
    }

    const newHome = newHomeRaw as number;
    const newAway = newAwayRaw as number;

    // 2) 🚨 점수 감소 이상치(Score Decrement Outlier) 차단
    // 스포츠 경기에서 진행 중 스코어가 이전 스코어보다 줄어드는 것은 명백한 데이터 오류/잡음
    if (typeof existingHome === 'number' && newHome < existingHome) {
      return {
        isValid: false,
        rejectReason: `점수 감소 이상치 감지 (홈팀: ${existingHome}점 -> ${newHome}점). DB 갱신 거부 및 기존 점수 보존.`,
        finalHomeScore: existingHome,
        finalAwayScore: existingAway ?? newAway,
        shouldLock: isFinished
      };
    }

    if (typeof existingAway === 'number' && newAway < existingAway) {
      return {
        isValid: false,
        rejectReason: `점수 감소 이상치 감지 (원정팀: ${existingAway}점 -> ${newAway}점). DB 갱신 거부 및 기존 점수 보존.`,
        finalHomeScore: existingHome ?? newHome,
        finalAwayScore: existingAway,
        shouldLock: isFinished
      };
    }

    return {
      isValid: true,
      finalHomeScore: newHome,
      finalAwayScore: newAway,
      shouldLock: isFinished
    };
  }

  /**
   * 🏆 3. 종료 직후 개별 경기 상세 조회 API (GET /games?id={id}) 딱 1회 단발성 호출 및 최종 마감
   */
  public static async executeSingleFinalDetailCheck(
    gameId: string | number,
    sport: string = 'baseball'
  ): Promise<{ homeScore: number | null; awayScore: number | null; isSuccess: boolean }> {
    const key = String(gameId);

    // 이미 단발성 조회가 완료된 경기는 재호출 일절 금지 (API 권한 보호 & Lock 보장)
    if (this.finalizedGamePks.has(key)) {
      return { homeScore: null, awayScore: null, isSuccess: false };
    }

    this.finalizedGamePks.add(key);
    this.lockedGameIds.add(key);
    console.log(`[MatchDbLockService] 🔒 Executing 1-time final detail audit for finished game: ${key}`);

    try {
      const endpoint = sport === 'football' ? '/fixtures' : '/games';
      const queryParam = sport === 'football' ? { id: key } : { id: key };

      const res = await sportsApiClient.get<any[]>(endpoint, queryParam, sport as any);

      if (res && Array.isArray(res.response) && res.response.length > 0) {
        const detailGame = res.response[0];
        const parsed = LiveScoreDefenseParser.extractLiveScore(detailGame, null as any);

        console.log(`[MatchDbLockService] 🏆 Final official score verified for game ${key}: ${parsed.homeScore} : ${parsed.awayScore}`);
        return {
          homeScore: parsed.homeScore,
          awayScore: parsed.awayScore,
          isSuccess: true
        };
      }
    } catch (err) {
      console.warn(`[MatchDbLockService] Failed 1-time final detail audit for game ${key}:`, err);
    }

    return { homeScore: null, awayScore: null, isSuccess: false };
  }

  /**
   * 🛡️ Match 객체 업데이트 시 종합 Lock & Validation 가드 적용
   */
  public static applyDbLockAndValidation(
    currentMatch: Match,
    incomingUpdate: {
      homeScore?: number | null;
      awayScore?: number | null;
      statusCode?: string;
      statusLabel?: string;
      isCompleted?: boolean;
    }
  ): Match {
    // 1. 이미 Lock 상태인 경우 모든 라이브 업데이트 즉시 차단
    if (currentMatch.isLocked || currentMatch.status === 'FINISHED') {
      return currentMatch;
    }

    // 2. 점수 유효성 및 점수 감소 이상치 검증
    const validation = this.validateScoreTransition(
      currentMatch.homeScore,
      currentMatch.awayScore,
      incomingUpdate.homeScore,
      incomingUpdate.awayScore,
      incomingUpdate.statusCode
    );

    if (!validation.isValid) {
      console.warn(`[MatchDbLockService] Validation warning for Match #${currentMatch.betmanMatchNo}:`, validation.rejectReason);
    }

    const isNowFinished = incomingUpdate.isCompleted || validation.shouldLock;

    if (isNowFinished) {
      // 🔒 경기 종료 확정 시 DB Lock 등록 및 1회 단발성 상세조회 비동기 트리거
      this.lockedGameIds.add(currentMatch.id);
      this.lockedGameIds.add(String(currentMatch.betmanMatchNo));

      // 비동기 1회 최종 검증 호출
      this.executeSingleFinalDetailCheck(currentMatch.id, currentMatch.sport);

      return {
        ...currentMatch,
        homeScore: validation.finalHomeScore ?? currentMatch.homeScore,
        awayScore: validation.finalAwayScore ?? currentMatch.awayScore,
        status: 'FINISHED',
        lineupAlertInfo: currentMatch.lineupAlertInfo ? {
          ...currentMatch.lineupAlertInfo,
          publishedTime: '경기 종료 (오피셜 최종 스코어 확정)'
        } : undefined,
        isLocked: true,
        isFinalized: true,
        finalizedAt: new Date().toISOString()
      };
    }

    return {
      ...currentMatch,
      homeScore: validation.finalHomeScore ?? currentMatch.homeScore,
      awayScore: validation.finalAwayScore ?? currentMatch.awayScore,
      status: 'LIVE',
      lineupAlertInfo: currentMatch.lineupAlertInfo ? {
        ...currentMatch.lineupAlertInfo,
        publishedTime: incomingUpdate.statusLabel || currentMatch.lineupAlertInfo.publishedTime
      } : undefined,
      isLocked: false
    };
  }
}
