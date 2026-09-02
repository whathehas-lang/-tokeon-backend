import { fetchRealtimeMatchData } from './kboRealtimeFetchService';
import type { Match } from '../types/sports';

export interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    isVip?: boolean;
    badge?: string;
  };
  text: string;
  timestamp: string;
  likes?: number;
}

/**
 * 📡 [경기별 실시간 자동 중계 톡 봇 서비스 (Match Event Broadcast Bot)]
 * 각 경기 톡방마다 실제 KBO/MLB 경기 이벤트(안타, 득점, 홈런, 3아웃 등)가 터지면
 * 해당 경기의 톡방에 전 자동으로 실시간 중계 메시지를 쏴줍니다.
 */

export type MatchMessageCallback = (matchId: string, message: ChatMessage) => void;

class KBOMatchBroadcastBotService {
  private activeSubscriptions: Map<string, any> = new Map();
  private lastScores: Map<string, { homeScore: number; awayScore: number; inning: string }> = new Map();

  /**
   * 특정 경기 톡방에 실시간 경기 봇 구독을 시작합니다.
   */
  public subscribeMatch(match: Match, onNewMessage: MatchMessageCallback) {
    if (this.activeSubscriptions.has(match.id)) {
      return;
    }

    // 초기 상태 등록
    this.lastScores.set(match.id, {
      homeScore: match.homeScore ?? 1,
      awayScore: match.awayScore ?? 4,
      inning: '6회말'
    });

    // 5초 간격으로 해당 경기의 실시간 데이터 감시 및 톡방 봇 메시지 전송
    const timer = setInterval(async () => {
      try {
        const live = await fetchRealtimeMatchData(match);
        const prev = this.lastScores.get(match.id);

        if (prev) {
          // 1. 득점 변화 감지 시 실시간 톡 자동 발송!
          if (live.homeScore !== prev.homeScore || live.awayScore !== prev.awayScore) {
            const botMsg: ChatMessage = {
              id: `bot_score_${Date.now()}`,
              user: {
                name: `⚡ KBO Live Bot (${match.homeTeam.name} vs ${match.awayTeam.name})`,
                avatar: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=100&auto=format&fit=crop&q=80',
                isVip: true,
                badge: '🔴 KBO 실시간 중계'
              },
              text: `🔥 [실시간 득점 터졌습니다!!] ${live.inning} ${live.homeTeam} ${live.homeScore} : ${live.awayScore} ${live.awayTeam}!! 현장 열기가 뜨겁습니다! ⚾🎉`,
              timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              likes: 12
            };
            onNewMessage(match.id, botMsg);
          }

          // 2. 이닝 변경 감지 시 실시간 톡 자동 발송!
          if (live.inning !== prev.inning) {
            const botMsg: ChatMessage = {
              id: `bot_inning_${Date.now()}`,
              user: {
                name: `📢 KBO 이닝 중계 봇`,
                avatar: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=100&auto=format&fit=crop&q=80',
                isVip: true,
                badge: '📢 공수교대'
              },
              text: `🚨 [이닝 공수교대!!] ${live.inning} 시작합니다! 현재 스코어 [${live.homeTeam} ${live.homeScore} : ${live.awayScore} ${live.awayTeam}]`,
              timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              likes: 5
            };
            onNewMessage(match.id, botMsg);
          }

          // 이전 상태 업데이트
          this.lastScores.set(match.id, {
            homeScore: live.homeScore,
            awayScore: live.awayScore,
            inning: live.inning
          });
        }
      } catch (e) {
        console.error('Bot fetch error:', e);
      }
    }, 5000);

    this.activeSubscriptions.set(match.id, timer);
  }

  /**
   * 경기 구독 해제
   */
  public unsubscribeMatch(matchId: string) {
    const timer = this.activeSubscriptions.get(matchId);
    if (timer) {
      clearInterval(timer);
      this.activeSubscriptions.delete(matchId);
    }
  }
}

export const kboMatchBroadcastBotService = new KBOMatchBroadcastBotService();
