/**
 * 🚨 PitcherDataAlertService
 * 데이터 수집 이상치, 파싱 예외, 수치 왜곡 발생 시 즉시 개발자 채널(Slack/Webhook/Console)로 알림을 발송하는 전담 관제 서비스
 */
export interface PitcherAlertPayload {
  gameId: string;
  matchTitle: string;
  playerName: string;
  detectedField: string;
  detectedValue: string | number;
  reason: string;
  fallbackApplied: boolean;
}

export class PitcherDataAlertService {
  private static webhookUrl: string = process.env.VITE_ALERT_WEBHOOK_URL || '';

  public static async sendAlert(payload: PitcherAlertPayload): Promise<void> {
    const alertMessage = `[🚨 데이터 정합성 이상 감지 알림]
` +
      `• 경기: ${payload.matchTitle} (${payload.gameId})
` +
      `• 선수명: ${payload.playerName}
` +
      `• 이상 필드: ${payload.detectedField} = ${payload.detectedValue}
` +
      `• 이상 사유: ${payload.reason}
` +
      `• 안전 조치: ${payload.fallbackApplied ? '검증된 공식 팩트 데이터로 자동 보호 복구 완료 🛡️' : '조치 필요 ⚠️'}
` +
      `• 발생 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`;

    console.warn(alertMessage);

    if (this.webhookUrl) {
      try {
        await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: alertMessage,
            attachments: [
              {
                color: '#FF0000',
                title: `KBO 선발투수 데이터 이상치 감지: ${payload.playerName}`,
                text: payload.reason,
                fields: [
                  { title: '경기', value: payload.matchTitle, short: true },
                  { title: '이상 수치', value: `${payload.detectedField}: ${payload.detectedValue}`, short: true }
                ]
              }
            ]
          })
        });
      } catch (err) {
        console.error('[AlertService] Webhook 발송 실패:', err);
      }
    }
  }
}
