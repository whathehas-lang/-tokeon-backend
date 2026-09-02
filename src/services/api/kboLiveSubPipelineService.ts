import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';
import { MatchDbLockService } from './matchDbLockService';
import type { Match } from '../../types/sports';

export interface KboLiveSubGameRecord {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  currentInning: string;
  isCompleted: boolean;
  statusCode: string;
  source: 'KBO_OFFICIAL_SUB_PIPELINE';
  timestamp: number;
}

/**
 * ⚡ KboLiveSubPipelineService
 * 국내 리그(KBO 등) 전용 10초 간격 독립 서브 파이프라인
 * API-Baseball 의존도를 낮추고 공식 사이트/오픈 API 기반 스코어 수집 및 교차 검증
 */
export class KboLiveSubPipelineService {
  private static timerId: NodeJS.Timeout | null = null;
  private static isRunning: boolean = false;
  private static readonly POLL_INTERVAL_MS = 10 * 1000; // 10초 간격 크롤링/조회
  private static listeners: Set<(game: KboLiveSubGameRecord) => void> = new Set();

  /**
   * 실시간 KBO 경기 수신 리스너 등록
   */
  public static subscribe(cb: (game: KboLiveSubGameRecord) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /**
   * 서브 파이프라인 가동
   */
  public static start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[KboLiveSubPipelineService] 🚀 Started KBO 10s sub-pipeline for domestic baseball`);
    this.subPollLoop();
  }

  /**
   * 서브 파이프라인 중지
   */
  public static stop() {
    if (this.timerId) {
      clearTimeout(this.timerId as any);
      this.timerId = null;
    }
    this.isRunning = false;
    console.log('[KboLiveSubPipelineService] ⏹️ Stopped KBO sub-pipeline');
  }

  /**
   * 10초 주기 독립 실행 루프
   */
  private static async subPollLoop() {
    if (!this.isRunning) return;

    try {
      await this.fetchKboOfficialLive();
    } catch (err) {
      console.warn('[KboLiveSubPipelineService] KBO sub-pipeline error:', err);
    } finally {
      if (this.isRunning) {
        this.timerId = setTimeout(() => this.subPollLoop(), this.POLL_INTERVAL_MS);
      }
    }
  }

  /**
   * KBO 공식 라이브 데이터 수집 및 정제
   */
  public static async fetchKboOfficialLive(): Promise<KboLiveSubGameRecord[]> {
    const liveKboGames: KboLiveSubGameRecord[] = [];
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    try {
      // 1. KBO 공식 센터 및 스포츠 오픈 API 10초 단발 엔드포인트 호출
      const baseUrl = typeof window !== 'undefined' ? '/api/kbo-naver' : 'https://api-gw.sports.naver.com';
      const url = `${baseUrl}/schedule/games?date=${today}&fields=basic,lineup,status&_t=${Date.now()}`;
      const res = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        const games = data?.result?.games || data?.games || [];

        for (const g of games) {
          if (g.sportsCategory !== 'kbo' && g.leagueName !== 'KBO') continue;

          const homeTeam = g.homeTeamName || g.home?.name || '';
          const awayTeam = g.awayTeamName || g.away?.name || '';
          const homeScore = Number(g.homeScore ?? g.home?.score ?? 0);
          const awayScore = Number(g.awayScore ?? g.away?.score ?? 0);
          const state = g.state || g.status || '';
          const isCompleted = state === 'FINISHED' || state === 'END' || state === 'RESULT' || state === '종료';
          const inningText = g.currentInning || (isCompleted ? '경기종료' : '진행 중');

          const record: KboLiveSubGameRecord = {
            gameId: String(g.gameId || `${homeTeam}_${awayTeam}`),
            homeTeam,
            awayTeam,
            homeScore,
            awayScore,
            currentInning: inningText,
            isCompleted,
            statusCode: isCompleted ? 'FT' : 'INP',
            source: 'KBO_OFFICIAL_SUB_PIPELINE',
            timestamp: Date.now()
          };

          liveKboGames.push(record);

          // 리스너에 10초 실시간 이벤트 발행
          this.listeners.forEach(cb => {
            try { cb(record); } catch (e) { console.error(e); }
          });
        }
      }
    } catch (err) {
      // Offline fallback: Maintain clean execution
    }

    return liveKboGames;
  }

  /**
   * 🛡️ KBO 서브 파이프라인 데이터와 API-Baseball 간 2차 교차 검증 (Cross-Validation)
   */
  public static crossValidateKboMatch(
    match: Match,
    kboSubRecord: KboLiveSubGameRecord,
    apiBaseballHomeScore?: number,
    apiBaseballAwayScore?: number
  ): Match {
    // 🔒 1. 이미 Lock 상태인 경우 추가 갱신 차단
    if (match.isLocked || match.status === 'FINISHED') {
      return match;
    }

    let finalHome = kboSubRecord.homeScore;
    let finalAway = kboSubRecord.awayScore;

    // 2. API-Baseball과 교차 비교
    if (typeof apiBaseballHomeScore === 'number' && typeof apiBaseballAwayScore === 'number') {
      const diffHome = Math.abs(kboSubRecord.homeScore - apiBaseballHomeScore);
      const diffAway = Math.abs(kboSubRecord.awayScore - apiBaseballAwayScore);

      if (diffHome > 0 || diffAway > 0) {
        console.warn(`[KboLiveSubPipelineService] ⚠️ Cross-validation discrepancy detected! KBO Sub: ${kboSubRecord.homeScore}:${kboSubRecord.awayScore} vs API-Baseball: ${apiBaseballHomeScore}:${apiBaseballAwayScore}. Prioritizing Official KBO Pipeline.`);
        // 국내 리그는 KBO 서브 파이프라인을 1순위 오피셜 소스로 확정
        finalHome = kboSubRecord.homeScore;
        finalAway = kboSubRecord.awayScore;
      }
    }

    // 3. DB Lock & 점수 감소 방지 가드 적용
    return MatchDbLockService.applyDbLockAndValidation(match, {
      homeScore: finalHome,
      awayScore: finalAway,
      statusCode: kboSubRecord.statusCode,
      statusLabel: kboSubRecord.currentInning,
      isCompleted: kboSubRecord.isCompleted
    });
  }
}
