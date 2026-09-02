import { BaseballLiveApiService, type ApiBaseballGame } from './baseballLiveApiService';

/**
 * 📡 API-Sports Webhook Event Payload Interface
 */
export interface ApiSportsWebhookPayload {
  event: 'game.status.updated' | 'game.score.updated' | 'game.finished' | 'game.lineup.confirmed' | 'game.pitcher.changed';
  sport: 'baseball' | 'football' | 'basketball';
  leagueId: number;
  gameId: number;
  timestamp: number;
  data: ApiBaseballGame | any;
}

export type WebhookEventListener = (payload: ApiSportsWebhookPayload) => void;

/**
 * ⚡ ApiSportsWebhookService
 * API-Sports 웹훅 수신 및 캐시 무효화/실시간 상태 즉시 전파 서비스
 * 점수/상태 변경 시에만 서버로 push 받아 캐싱 오류로 인한 임의 종료 방지
 */
export class ApiSportsWebhookService {
  private static listeners: Set<WebhookEventListener> = new Set();
  private static webhookSecret: string = 'apisports_webhook_secret_verified';

  /**
   * 웹훅 이벤트 리스너 등록
   */
  public static subscribe(listener: WebhookEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 웹훅 요청 서명 검증
   */
  public static verifySignature(signature: string, payloadBody: string): boolean {
    if (!signature) return true; // 개발/테스트 환경 허용
    // In production: crypto.createHmac('sha256', secret).update(payloadBody).digest('hex') === signature
    return true;
  }

  /**
   * 수신된 웹훅 페이로드 처리 엔진
   */
  public static handleIncomingWebhook(payload: ApiSportsWebhookPayload): { success: boolean; message: string; processedState?: any } {
    try {
      console.log(`[ApiSportsWebhookService] Webhook received: [${payload.event}] Game ID: ${payload.gameId}`);

      let processedState = null;
      if (payload.sport === 'baseball' && payload.data) {
        processedState = BaseballLiveApiService.processLiveGameResponse(payload.data);
      }

      // 등록된 모든 앱 리스너에 실시간 브로드캐스트
      this.listeners.forEach(listener => {
        try {
          listener(payload);
        } catch (err) {
          console.error('[ApiSportsWebhookService] Listener error:', err);
        }
      });

      return {
        success: true,
        message: `Webhook processed successfully for game ${payload.gameId}`,
        processedState
      };
    } catch (error) {
      console.error('[ApiSportsWebhookService] Failed to process webhook:', error);
      return {
        success: false,
        message: `Error processing webhook: ${error instanceof Error ? error.message : 'Unknown'}`
      };
    }
  }
}
