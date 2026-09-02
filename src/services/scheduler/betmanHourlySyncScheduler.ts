import { BetmanLiveSyncService } from '../betman/betmanLiveSyncService';
import { calculateActiveSeungbushikRoundTs } from '../betman/betmanRoundRegistry';
import type { Match } from '../../types/sports';

type SyncCallback = (matches: Match[]) => void;

/**
 * ⏰ BetmanHourlySyncScheduler
 * 배트맨 오후 3시(15:00 KST)부터 1시간 단위 추가 경기 자동 동기화 스케줄러
 * - 15:00부터 내일 메이저리그(MLB) 및 해외 축구 등 추가 오픈 슬립을 매시간 자동 감지하여 갱신
 */
export class BetmanHourlySyncScheduler {
  private static timerId: NodeJS.Timeout | null = null;
  private static listeners: Set<SyncCallback> = new Set();
  private static lastSyncHour: number = -1;

  public static start(): void {
    if (this.timerId) return;

    console.log('[BetmanHourlySyncScheduler] ⏰ 오후 3시(15:00) 1시간 단위 자동 동기화 스케줄러 시작');

    // 1. 초기 1회 즉시 실행 점검
    this.checkAndTriggerHourlySync();

    // 2. 1분마다 정각 도달 여부 및 15시 이후 1시간 경과 체크
    this.timerId = setInterval(() => {
      this.checkAndTriggerHourlySync();
    }, 60 * 1000);
  }

  public static stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId as any);
      this.timerId = null;
    }
  }

  public static subscribe(callback: SyncCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private static async checkAndTriggerHourlySync(): Promise<void> {
    const now = new Date();
    const currentHour = now.getHours();

    // 오후 15:00 이후이고, 새로운 시(Hour)에 진입한 경우
    if (currentHour >= 15 && this.lastSyncHour !== currentHour) {
      console.log(`[BetmanHourlySyncScheduler] ⚡ 오후 ${currentHour}:00 배트맨 추가 경기(MLB/축구) 자동 갱신 트리거 가동!`);
      this.lastSyncHour = currentHour;

      try {
        const activeRound = String(calculateActiveSeungbushikRoundTs(now));
        const updatedMatches = await BetmanLiveSyncService.getMatchesAsync('G101', activeRound);

        if (updatedMatches && updatedMatches.length > 0) {
          console.log(`[BetmanHourlySyncScheduler] ✅ ${activeRound}회차 ${updatedMatches.length}개 경기 최신 동기화 완료`);
          this.listeners.forEach(cb => {
            try {
              cb(updatedMatches);
            } catch (e) {
              console.error('[BetmanHourlySyncScheduler] Listener callback error:', e);
            }
          });
        }
      } catch (err) {
        console.error('[BetmanHourlySyncScheduler] Failed to sync hourly Betman matches:', err);
      }
    }
  }

  /**
   * 사용자가 수동 새로고침 버튼을 눌렀을 때 강제 동기화 수행
   */
  public static async forceSyncNow(): Promise<Match[]> {
    const activeRound = String(calculateActiveSeungbushikRoundTs());
    const matches = await BetmanLiveSyncService.getMatchesAsync('G101', activeRound);
    this.listeners.forEach(cb => cb(matches));
    return matches;
  }
}
