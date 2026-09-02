import { sportsApiClient } from './sportsApiClient';
import type { ApiResponseWrapper } from './types';

export interface ApiBaseballTeam {
  id: number;
  name: string;
  logo: string;
  national: boolean;
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
}

export interface ApiBaseballInningScores {
  innings?: {
    1?: { home: number | null; away: number | null };
    2?: { home: number | null; away: number | null };
    3?: { home: number | null; away: number | null };
    4?: { home: number | null; away: number | null };
    5?: { home: number | null; away: number | null };
    6?: { home: number | null; away: number | null };
    7?: { home: number | null; away: number | null };
    8?: { home: number | null; away: number | null };
    9?: { home: number | null; away: number | null };
    extra?: { home: number | null; away: number | null };
  };
  home: {
    total: number | null;
  };
  away: {
    total: number | null;
  };
}

export interface ApiBaseballGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  status: {
    long: string;
    short: string;
  };
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
    season: number;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  scores: ApiBaseballInningScores;
}

export interface ProcessedBaseballGameState {
  gameId: number;
  statusCode: string;
  statusCategory: 'LIVE' | 'FINISHED' | 'SCHEDULED' | 'POSTPONED';
  statusLabel: string;
  homeScore: number;
  awayScore: number;
  isCompleted: boolean;
  currentInningText: string;
}

// Official API-Baseball Team ID Dictionary
export const KBO_API_TEAM_MAP: Record<string, { id: number; nameKo: string; logo: string }> = {
  '두산': { id: 88, nameKo: '두산 베어스', logo: 'https://media.api-sports.io/baseball/teams/88.png' },
  '두산 베어스': { id: 88, nameKo: '두산 베어스', logo: 'https://media.api-sports.io/baseball/teams/88.png' },
  'LG': { id: 93, nameKo: 'LG 트윈스', logo: 'https://media.api-sports.io/baseball/teams/93.png' },
  'LG 트윈스': { id: 93, nameKo: 'LG 트윈스', logo: 'https://media.api-sports.io/baseball/teams/93.png' },
  '삼성': { id: 97, nameKo: '삼성 라이온즈', logo: 'https://media.api-sports.io/baseball/teams/97.png' },
  '삼성 라이온즈': { id: 97, nameKo: '삼성 라이온즈', logo: 'https://media.api-sports.io/baseball/teams/97.png' },
  '롯데': { id: 94, nameKo: '롯데 자이언츠', logo: 'https://media.api-sports.io/baseball/teams/94.png' },
  '롯데 자이언츠': { id: 94, nameKo: '롯데 자이언츠', logo: 'https://media.api-sports.io/baseball/teams/94.png' },
  'KT': { id: 91, nameKo: 'KT 위즈', logo: 'https://media.api-sports.io/baseball/teams/91.png' },
  'KT 위즈': { id: 91, nameKo: 'KT 위즈', logo: 'https://media.api-sports.io/baseball/teams/91.png' },
  '한화': { id: 89, nameKo: '한화 이글스', logo: 'https://media.api-sports.io/baseball/teams/89.png' },
  '한화 이글스': { id: 89, nameKo: '한화 이글스', logo: 'https://media.api-sports.io/baseball/teams/89.png' },
  'NC': { id: 95, nameKo: 'NC 다이노스', logo: 'https://media.api-sports.io/baseball/teams/95.png' },
  'NC 다이노스': { id: 95, nameKo: 'NC 다이노스', logo: 'https://media.api-sports.io/baseball/teams/95.png' },
  'KIA': { id: 90, nameKo: 'KIA 타이거즈', logo: 'https://media.api-sports.io/baseball/teams/90.png' },
  'KIA 타이거즈': { id: 90, nameKo: 'KIA 타이거즈', logo: 'https://media.api-sports.io/baseball/teams/90.png' },
  '키움': { id: 92, nameKo: '키움 히어로즈', logo: 'https://media.api-sports.io/baseball/teams/92.png' },
  '키움 히어로즈': { id: 92, nameKo: '키움 히어로즈', logo: 'https://media.api-sports.io/baseball/teams/92.png' },
  'SSG': { id: 647, nameKo: 'SSG 랜더스', logo: 'https://media.api-sports.io/baseball/teams/647.png' },
  'SSG 랜더스': { id: 647, nameKo: 'SSG 랜더스', logo: 'https://media.api-sports.io/baseball/teams/647.png' }
};

import { LiveScoreDefenseParser } from './liveScoreDefenseParser';

export class BaseballLiveApiService {
  /**
   * ⚡ 야구(API-Baseball) 응답 데이터 상태별 정밀 파싱 처리 로직 (방어 파싱 적용)
   * @param game API-Baseball 경기 원시 객체 (apiResponse.response[0])
   * @param prevScores 기존 DB 점수 (Fallback용)
   */
  public static processLiveGameResponse(game: ApiBaseballGame, prevScores?: { home?: number; away?: number }): ProcessedBaseballGameState {
    const statusCode = game.status.short;
    const statusLong = game.status.long || '경기 대기';

    // 🛡️ 공통 방어 파싱: total 검증 ➡️ 이닝 합산 Fallback ➡️ DB 기존 점수 보존
    const extracted = LiveScoreDefenseParser.extractLiveScore(game, prevScores);
    const homeScore = extracted.homeScore ?? (prevScores?.home ?? 0);
    const awayScore = extracted.awayScore ?? (prevScores?.away ?? 0);

    // 1. 진행 중(INP / IN1 ~ IN9 / EXTRA / EI)일 때만 실시간 이닝 스코어 사용
    const inProgressCodes = ['INP', 'IN1', 'IN2', 'IN3', 'IN4', 'IN5', 'IN6', 'IN7', 'IN8', 'IN9', 'IN10', 'IN11', 'IN12', 'EXTRA', 'EI'];
    
    if (inProgressCodes.includes(statusCode)) {
      return {
        gameId: game.id,
        statusCode,
        statusCategory: 'LIVE',
        statusLabel: statusLong, // 예: '5회말 진행 중', '7th Inning'
        homeScore,
        awayScore,
        isCompleted: false,
        currentInningText: statusLong
      };
    }

    // 2. 최종 종료(FT / AOT / POST) 시에만 종료 처리
    const finishedCodes = ['FT', 'AOT', 'POST'];
    if (finishedCodes.includes(statusCode)) {
      return {
        gameId: game.id,
        statusCode,
        statusCategory: 'FINISHED',
        statusLabel: '경기종료 (최종결과)',
        homeScore,
        awayScore,
        isCompleted: true,
        currentInningText: '경기종료'
      };
    }

    // 3. 우천 취소 / 연기 (CANC / PST / DELAYED / SUSP)
    const delayedCodes = ['CANC', 'PST', 'DELAYED', 'SUSP', 'AWD'];
    if (delayedCodes.includes(statusCode)) {
      return {
        gameId: game.id,
        statusCode,
        statusCategory: 'POSTPONED',
        statusLabel: statusLong || '우천 순연 / 취소',
        homeScore: 0,
        awayScore: 0,
        isCompleted: false,
        currentInningText: '경기취소'
      };
    }

    // 4. 경기 시작 전 (NS / TBD)
    return {
      gameId: game.id,
      statusCode: statusCode || 'NS',
      statusCategory: 'SCHEDULED',
      statusLabel: '경기 전 (선발 예고)',
      homeScore: 0,
      awayScore: 0,
      isCompleted: false,
      currentInningText: '경기예정'
    };
  }

  /**
   * Fetch H2H historical matches between 2 baseball teams from API-Baseball
   */
  public async fetchBaseballH2H(team1Id: number, team2Id: number): Promise<ApiBaseballGame[]> {
    try {
      const res = await sportsApiClient.get<ApiBaseballGame[]>('/games/h2h', {
        h2h: `${team1Id}-${team2Id}`
      }, 'baseball');
      return (res?.response as any) || [];
    } catch (e) {
      console.warn('[BaseballLiveApiService] H2H fetch error:', e);
      return [];
    }
  }

  /**
   * Fetch baseball team statistics (Home/Away wins, runs) from API-Baseball
   */
  public async fetchTeamStatistics(leagueId: number = 5, season: number = 2024, teamId: number): Promise<any> {
    try {
      const res = await sportsApiClient.get<any>('/teams/statistics', {
        league: String(leagueId),
        season: String(season),
        team: String(teamId)
      }, 'baseball');
      return res?.response || null;
    } catch (e) {
      console.warn('[BaseballLiveApiService] Team statistics error:', e);
      return null;
    }
  }

  /**
   * Get official team logo and ID for KBO team
   */
  public getKboTeamMeta(teamName: string) {
    for (const [key, meta] of Object.entries(KBO_API_TEAM_MAP)) {
      if (teamName.includes(key)) {
        return meta;
      }
    }
    return null;
  }
}

export const baseballLiveApiService = new BaseballLiveApiService();
