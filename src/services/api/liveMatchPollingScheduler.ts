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
  private static mlbTimerId: NodeJS.Timeout | null = null;
  private static apiBaseballTimerId: NodeJS.Timeout | null = null;
  private static isRunning: boolean = false;
  private static activeLiveGameIds: Set<string> = new Set();
  private static currentMatches: Match[] = [];
  private static updateCallbacks: Set<LiveScoreUpdateCallback> = new Set();

  // ⚡ 사용자 지정 주기:
  // 1. 🇺🇸 메이저리그(MLB): 공식 Stats API 무료 제공 ➔ 3초 주기 초고속 실시간 폴링
  // 2. 🇰🇷🇯🇵 한국야구(KBO) & 일본야구(NPB): API-Baseball ➔ 15초 정밀 라이브 동기화
  private static readonly MLB_POLL_INTERVAL_MS = 3 * 1000; // 3초
  private static readonly API_BASEBALL_POLL_INTERVAL_MS = 15 * 1000; // 15초

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
   * 폴링 스케줄러 시작 (MLB 3초 전용 루프 + API-Baseball 15초 루프 동시 가동)
   */
  public static start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[LiveMatchPollingScheduler] 🚀 Started Real-time Polling: MLB (Stats API, 3s) & KBO/NPB (API-Baseball, 15s)`);
    this.pollMlbLoop();
    this.pollApiBaseballLoop();
  }

  /**
   * 폴링 스케줄러 중지
   */
  public static stop() {
    if (this.mlbTimerId) {
      clearTimeout(this.mlbTimerId as any);
      this.mlbTimerId = null;
    }
    if (this.apiBaseballTimerId) {
      clearTimeout(this.apiBaseballTimerId as any);
      this.apiBaseballTimerId = null;
    }
    this.isRunning = false;
    console.log('[LiveMatchPollingScheduler] Stopped polling');
  }

  /**
   * ⚡ 1. [메이저리그 공식 사이트 API 3초 주기 초고속 루프]
   */
  private static async pollMlbLoop() {
    if (!this.isRunning) return;

    try {
      await this.fetchAndProcessMlbLive();
    } catch (err) {
      // Keep silent to avoid console spam
    } finally {
      if (this.isRunning) {
        this.mlbTimerId = setTimeout(() => this.pollMlbLoop(), this.MLB_POLL_INTERVAL_MS);
      }
    }
  }

  /**
   * ⚡ 2. [KBO 한국야구 & NPB 일본야구 API-Baseball 15초 주기 실시간 루프]
   */
  private static async pollApiBaseballLoop() {
    if (!this.isRunning) return;

    try {
      await this.fetchAndProcessApiBaseballLive();
    } catch (err) {
      // Keep silent
    } finally {
      if (this.isRunning) {
        this.apiBaseballTimerId = setTimeout(() => this.pollApiBaseballLoop(), this.API_BASEBALL_POLL_INTERVAL_MS);
      }
    }
  }

  /**
   * 🇺🇸 MLB 공식 Stats API (statsapi.mlb.com) 실시간 파싱 및 UI 콜백 처리 (3초 주기)
   */
  private static async fetchAndProcessMlbLive() {
    try {
      const mlbLiveGames = await MlbLiveGameSyncService.fetchActiveLiveGames();
      if (mlbLiveGames.length === 0 || this.currentMatches.length === 0) return;

      for (const mlbGame of mlbLiveGames) {
        const gHome = SportsEntityMappingService.normalize(mlbGame.homeTeamName);
        const gAway = SportsEntityMappingService.normalize(mlbGame.awayTeamName);

        const targetMatches = this.currentMatches.filter(m => {
          if (m.sport !== 'baseball') return false;
          const leagueUpper = (m.league || '').toUpperCase();
          if (!leagueUpper.includes('MLB') && !leagueUpper.includes('메이저리그')) return false;

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
              console.error('[LiveMatchPollingScheduler] MLB callback trigger error:', e);
            }
          });
        }
      }
    } catch (e) {
      // silent
    }
  }

  /**
   * 🇰🇷🇯🇵 API-Baseball (api-sports.io) KBO & NPB 실시간 경기 전수 동기화
   */
  private static async fetchAndProcessApiBaseballLive() {
    try {
      // 1. API-Baseball 당일 경기 일괄 조회 (/games?date=YYYY-MM-DD)
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      
      const res = await sportsApiClient.get<ApiBaseballGame[]>('/games', {
        date: todayStr
      }, 'baseball');

      if (res && Array.isArray(res.response) && res.response.length > 0) {
        for (const rawGame of res.response) {
          const game = rawGame as ApiBaseballGame;
          if (!game || !game.id || !game.teams) continue;

          // KBO(5) 또는 NPB(2) 리그만 추출
          const leagueId = game.league?.id;
          const isKboOrNpb = leagueId === 5 || leagueId === 2 || 
                             game.country?.name === 'South-Korea' || game.country?.name === 'Japan';
          if (!isKboOrNpb) continue;

          const processed = BaseballLiveApiService.processLiveGameResponse(game);
          const rawHome = game.teams.home?.name || '';
          const rawAway = game.teams.away?.name || '';

          const gHome = SportsEntityMappingService.normalize(rawHome);
          const gAway = SportsEntityMappingService.normalize(rawAway);

          // 현재 베트맨 목록 중 일치하는 KBO / NPB 경기 탐색
          const targetMatches = this.currentMatches.filter(m => {
            if (m.sport !== 'baseball') return false;
            const leagueUpper = (m.league || '').toUpperCase();
            const isTargetLeague = leagueUpper.includes('KBO') || leagueUpper.includes('NPB') || 
                                   leagueUpper.includes('한국') || leagueUpper.includes('일본');
            if (!isTargetLeague) return false;

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
                  processed.homeScore,
                  processed.awayScore,
                  processed.statusLabel,
                  processed.isCompleted
                );
              } catch (e) {
                console.error('[LiveMatchPollingScheduler] API-Baseball callback error:', e);
              }
            });
          }
        }
      }

      // 2. ⚽ API-Sports 축구 진행 중 경기 동기화 (/fixtures?live=all)
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
      // Fallback silently
    }
  }
}
