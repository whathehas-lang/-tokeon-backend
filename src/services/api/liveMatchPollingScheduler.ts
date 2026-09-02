import { sportsApiClient } from './sportsApiClient';
import { BaseballLiveApiService, type ApiBaseballGame } from './baseballLiveApiService';
import { MlbLiveGameSyncService } from './mlbLiveGameSyncService';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';
import type { Match } from '../../types/sports';

export type LiveScoreUpdateCallback = (matchId: string, homeScore: number, awayScore: number, statusLabel: string, isFinished: boolean) => void;

/**
 * ⏱️ LiveMatchPollingScheduler
 * 실시간 경기 진행 중(INP) 항목 전용 15초~30초 적응형 폴링 스케줄러
 * MLB 공식 실시간 Stats API + API-Sports 이원화 실시간 동기화
 */
export class LiveMatchPollingScheduler {
  private static timerId: NodeJS.Timeout | null = null;
  private static isRunning: boolean = false;
  private static activeLiveGameIds: Set<string> = new Set();
  private static currentMatches: Match[] = [];
  private static updateCallbacks: Set<LiveScoreUpdateCallback> = new Set();

  // 15초 ~ 30초 적응형 간격 설정
  private static readonly LIVE_POLL_INTERVAL_MS = 15 * 1000; // 15초
  private static readonly IDLE_POLL_INTERVAL_MS = 60 * 1000; // 진행 중 경기 없을 때 1분 대기

  /**
   * 스코어 업데이트 리스너 등록
   */
  public static onScoreUpdate(cb: LiveScoreUpdateCallback): () => void {
    this.updateCallbacks.add(cb);
    return () => this.updateCallbacks.delete(cb);
  }

  /**
   * 현재 진행 중인 경기 목록 갱신
   */
  public static syncActiveMatches(matches: Match[]) {
    this.currentMatches = matches;
    const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'SCHEDULED');
    this.activeLiveGameIds.clear();
    liveMatches.forEach(m => this.activeLiveGameIds.add(m.id));

    // 진행 중 경기가 있으면 폴링 즉시 가동 / 간격 조정
    if (!this.isRunning) {
      this.start();
    }
  }

  /**
   * 폴링 스케줄러 시작
   */
  public static start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[LiveMatchPollingScheduler] Started adaptive polling (Interval: ${this.LIVE_POLL_INTERVAL_MS / 1000}s)`);
    this.pollLoop();
  }

  /**
   * 폴링 스케줄러 중지
   */
  public static stop() {
    if (this.timerId) {
      clearTimeout(this.timerId as any);
      this.timerId = null;
    }
    this.isRunning = false;
    console.log('[LiveMatchPollingScheduler] Stopped polling');
  }

  /**
   * 주기적 실행 루프 (live=all + MLB Stats API)
   */
  private static async pollLoop() {
    if (!this.isRunning) return;

    try {
      await this.fetchAndProcessLiveAll();
    } catch (err) {
      console.warn('[LiveMatchPollingScheduler] Polling request error:', err);
    } finally {
      if (this.isRunning) {
        this.timerId = setTimeout(() => this.pollLoop(), this.LIVE_POLL_INTERVAL_MS);
      }
    }
  }

  /**
   * MLB 공식 Stats API + API-Sports 이원화 실시간 파싱 및 UI 콜백 처리
   */
  private static async fetchAndProcessLiveAll() {
    try {
      // 1. ⚾ MLB 공식 Stats API 실시간 전수 동기화 (한-미 시차 보정)
      const mlbLiveGames = await MlbLiveGameSyncService.fetchActiveLiveGames();
      
      if (mlbLiveGames.length > 0 && this.currentMatches.length > 0) {
        for (const mlbGame of mlbLiveGames) {
          const gHome = SportsEntityMappingService.normalize(mlbGame.homeTeamName);
          const gAway = SportsEntityMappingService.normalize(mlbGame.awayTeamName);

          // 현재 베트맨 경기 목록 중 일치하는 경기 탐색
          const targetMatches = this.currentMatches.filter(m => {
            if (m.sport !== 'baseball') return false;
            const mHome = SportsEntityMappingService.normalize(m.homeTeam.name);
            const mAway = SportsEntityMappingService.normalize(m.awayTeam.name);
            return (gHome.includes(mHome) || mHome.includes(gHome)) &&
                   (gAway.includes(mAway) || mAway.includes(gAway));
          });

          for (const match of targetMatches) {
            this.updateCallbacks.forEach(cb => {
              try {
                cb(
                  match.id,
                  mlbGame.homeScore,
                  mlbGame.awayScore,
                  mlbGame.isLive ? mlbGame.currentInningText : mlbGame.statusDetailed,
                  mlbGame.isFinal
                );
              } catch (e) {
                console.error('[LiveMatchPollingScheduler] Callback trigger error:', e);
              }
            });
          }
        }
      }

      // 2. 🛡️ API-Sports 야구 실시간 진행 중 경기 보조 조회 (/games?live=all)
      try {
        const res = await sportsApiClient.get<ApiBaseballGame[]>('/games', {
          live: 'all'
        }, 'baseball');

        if (res && Array.isArray(res.response) && res.response.length > 0) {
          for (const rawGame of res.response) {
            const game = rawGame as any;
            if (!game || !game.id) continue;
            const processed = BaseballLiveApiService.processLiveGameResponse(game);
            this.updateCallbacks.forEach(cb => {
              try {
                cb(
                  String(processed.gameId),
                  processed.homeScore,
                  processed.awayScore,
                  processed.statusLabel,
                  processed.isCompleted
                );
              } catch (e) {
                console.error('[LiveMatchPollingScheduler] Callback trigger error:', e);
              }
            });
          }
        }
      } catch (err) {
        // Fallback silently
      }

      // 3. ⚽ API-Sports 축구 실시간 진행 중 경기 동기화 (/fixtures?live=all)
      try {
        const fbRes = await sportsApiClient.get<any[]>('/fixtures', {
          live: 'all'
        }, 'football');

        if (fbRes && Array.isArray(fbRes.response) && fbRes.response.length > 0) {
          for (const rawFix of fbRes.response) {
            const fix = rawFix as any;
            if (!fix || !fix.fixture || !fix.fixture.id) continue;
            const fixId = String(fix.fixture.id);
            const hScore = fix.goals?.home ?? 0;
            const aScore = fix.goals?.away ?? 0;
            const statusShort = fix.fixture.status?.short || '1H';
            const elapsed = fix.fixture.status?.elapsed ? `${fix.fixture.status.elapsed}'` : statusShort;
            const isCompleted = statusShort === 'FT' || statusShort === 'AET' || statusShort === 'PEN';

            const fbHome = SportsEntityMappingService.normalize(fix.teams?.home?.name || '');
            const fbAway = SportsEntityMappingService.normalize(fix.teams?.away?.name || '');

            const targetMatches = this.currentMatches.filter(m => {
              if (m.sport !== 'football') return false;
              if (m.id.includes(fixId) || String(m.betmanMatchNo) === fixId) return true;
              const mHome = SportsEntityMappingService.normalize(m.homeTeam.name);
              const mAway = SportsEntityMappingService.normalize(m.awayTeam.name);
              return (fbHome.includes(mHome) || mHome.includes(fbHome)) &&
                     (fbAway.includes(mAway) || mAway.includes(fbAway));
            });

            for (const match of targetMatches) {
              this.updateCallbacks.forEach(cb => {
                try {
                  cb(match.id, hScore, aScore, elapsed, isCompleted);
                } catch (e) {
                  console.error('[LiveMatchPollingScheduler] Football callback error:', e);
                }
              });
            }
          }
        }
      } catch (err) {
        // Fallback silently
      }
    } catch (error) {
      console.warn('[LiveMatchPollingScheduler] Failed to fetch live matches. Preserving existing states:', error);
    }
  }
}
