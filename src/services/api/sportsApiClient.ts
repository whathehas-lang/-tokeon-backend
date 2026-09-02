import type { ApiResponseWrapper } from './types';
import type { RecentMatchLog } from '../../types/sports';

export class SportsApiClient {
  private footballBaseUrl: string;
  private baseballBaseUrl: string;
  private apiKey: string;
  private useMockData: boolean;

  constructor() {
    const env = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {};
    const isBrowser = typeof window !== 'undefined';

    // 브라우저에서는 CORS 차단 방지를 위해 Vite 프록시(/api/...) 사용
    this.footballBaseUrl = isBrowser ? '/api/football' : (env.VITE_FOOTBALL_API_URL || 'https://v3.football.api-sports.io');
    this.baseballBaseUrl = isBrowser ? '/api/baseball' : (env.VITE_BASEBALL_API_URL || 'https://v1.baseball.api-sports.io');
    this.apiKey = env.VITE_SPORTS_API_KEY || '02cbc5113771eefb4A3F6D14606C2af9';
    this.useMockData = env.VITE_USE_MOCK_DATA === 'true';
  }

  public isMockMode(): boolean {
    return this.useMockData;
  }

  public async get<T>(
    endpoint: string,
    params?: Record<string, string>,
    sportType: 'football' | 'baseball' = 'football'
  ): Promise<ApiResponseWrapper<T> | null> {
    if (this.useMockData) {
      console.warn('[SportsApiClient] Running in MOCK mode.');
      return null;
    }

    try {
      const baseUrl = sportType === 'baseball' ? this.baseballBaseUrl : this.footballBaseUrl;
      const fullPath = `${baseUrl}${endpoint}`;
      const url = typeof window !== 'undefined'
        ? new URL(fullPath, window.location.origin)
        : new URL(fullPath);

      if (params) {
        Object.entries(params).forEach(([key, val]) => url.searchParams.append(key, val));
      }

      // 🔍 [디버깅 로그 1] API-Sports 실제 Request URL 전체 출력
      console.log(`[SportsApiClient] 🌐 Request URL: ${url.toString()}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-apisports-key': this.apiKey,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponseWrapper<T> = await response.json();

      // 📥 [디버깅 로그 2] API-Sports 응답 데이터 백엔드 콘솔 출력
      console.log(`[SportsApiClient] 📥 API Response [${endpoint}]:`, {
        status: response.status,
        results: data?.results ?? (Array.isArray(data?.response) ? (data.response as any[]).length : 0),
        data: data?.response
      });

      return data;
    } catch (error) {
      console.error(`[SportsApiClient] Request failed for ${endpoint}:`, error);
      return null;
    }
  }

  /**
   * ⚔️ 상대전적(H2H) 20경기 전체 이력 조회 (단일 시즌/리그 제한 없이 순수 team/h2h 기준)
   */
  public async fetchH2H(team1Id: number, team2Id: number, sportType: 'football' | 'baseball' = 'football') {
    const endpoint = sportType === 'baseball' ? '/games/h2h' : '/fixtures/headtohead';
    return this.get<any[]>(endpoint, { h2h: `${team1Id}-${team2Id}` }, sportType);
  }

  /**
   * 🛡️ 상대전적(H2H) 조회 + 개별 팀 최근 경기 교차 필터링 Fallback
   * 1. H2H API 호출 (단일 season/league 파라미터 제외하여 과거 전체 조회)
   * 2. H2H 응답이 빈 배열([])일 경우, 각 팀의 최근 경기(/games?team={id} 또는 /fixtures?team={id})를 조회하여 두 팀 간의 맞대결을 직접 필터링
   */
  public async fetchH2HWithRecentLogsFallback(
    team1Id: number,
    team2Id: number,
    sportType: 'football' | 'baseball' = 'football'
  ): Promise<any[]> {
    console.log(`[SportsApiClient] 🔍 [Team ID Mapping Check] (${sportType}) team1_id: ${team1Id}, team2_id: ${team2Id}`);
    
    // 1. Direct H2H Endpoint (All seasons, no league filter)
    const directRes = await this.fetchH2H(team1Id, team2Id, sportType);
    const directFixtures = directRes?.response || [];
    if (Array.isArray(directFixtures) && directFixtures.length > 0) {
      console.log(`[SportsApiClient] ✅ Direct H2H API returned ${directFixtures.length} matches.`);
      return directFixtures;
    }

    console.warn(`[SportsApiClient] ⚠️ Direct H2H returned empty. Activating Fallback: Cross-filtering from each team's recent fixtures...`);

    // 2. Fallback: Query both teams' recent fixtures and cross-filter (단독 team={id} 파라미터 호출)
    try {
      const [team1Logs, team2Logs] = await Promise.all([
        this.fetchTeamRecentLogs(team1Id, 20, sportType),
        this.fetchTeamRecentLogs(team2Id, 20, sportType)
      ]);

      const allFixtures: any[] = [
        ...((team1Logs?.response || []) as any[]),
        ...((team2Logs?.response || []) as any[])
      ];

      // Filter matches where home/away matches team1 and team2
      const matchedMap = new Map<number | string, any>();
      for (const f of allFixtures) {
        if (!f) continue;
        const hId = f.teams?.home?.id;
        const aId = f.teams?.away?.id;
        if ((hId === team1Id && aId === team2Id) || (hId === team2Id && aId === team1Id)) {
          const fId = f.fixture?.id || f.id || `${f.fixture?.date || f.date}_${hId}_${aId}`;
          if (!matchedMap.has(fId)) {
            matchedMap.set(fId, f);
          }
        }
      }

      const fallbackMatches = Array.from(matchedMap.values());
      console.log(`[SportsApiClient] 🎯 Cross-filtered ${fallbackMatches.length} H2H matches from individual team recent logs.`);
      return fallbackMatches;
    } catch (err) {
      console.warn(`[SportsApiClient] Fallback cross-filtering error:`, err);
      return [];
    }
  }

  /**
   * ⚡ 개별 팀 최근 경기 조회 (API-Sports 규격 준수: 최신 시즌 데이터 자동 조회 및 다년도 보강)
   */
  public async fetchTeamRecentLogs(teamId: number, _count: number = 20, sportType: 'football' | 'baseball' = 'football') {
    const endpoint = sportType === 'baseball' ? '/games' : '/fixtures';
    const currentYear = new Date().getFullYear().toString();

    // 1차: 현재 시즌(2026) 조회
    let res = await this.get<any[]>(endpoint, { team: `${teamId}`, season: currentYear }, sportType);
    let games = res?.response || [];

    // 2차: 응답이 없을 경우 2025 -> 2024 순차 보강
    if (!Array.isArray(games) || games.length === 0) {
      res = await this.get<any[]>(endpoint, { team: `${teamId}`, season: '2025' }, sportType);
      games = res?.response || [];
    }
    if (!Array.isArray(games) || games.length === 0) {
      res = await this.get<any[]>(endpoint, { team: `${teamId}`, season: '2024' }, sportType);
    }

    return res;
  }

  public async fetchFixtureLineup(fixtureId: number) {
    return this.get<any[]>('/fixtures/lineups', { fixture: `${fixtureId}` }, 'football');
  }

  public async fetchFixturePlayerStats(fixtureId: number) {
    return this.get<any[]>('/fixtures/players', { fixture: `${fixtureId}` }, 'football');
  }

  public async fetchBaseballGameLineup(gameId: number) {
    return this.get<any[]>('/games/lineups', { game: `${gameId}` }, 'baseball');
  }

  /**
   * 🛡️ 상대전적 및 최근 경기 파싱 방어 코드 (Zero-Trust Defensive Parser)
   * 1. 실제로 정상 종료(FT, AET, PEN 등)된 경기만 필터링
   * 2. 날짜(date) 기준 최신순(내림차순) 정렬
   * 3. 20경기 미만(8경기, 13경기 등)일 경우 배열 개수를 강제로 맞추지 않고 실존 수량 그대로 반환
   * 4. UI 및 Direct API와 100% 호환되는 JSON 규격(dateStr, homeScore, awayScore, scores, teams, fixture) 통합 매핑
   */
  public static parseRecentMatches(apiResponseList: any[], limit: number = 20): Array<{
    date: string;
    dateStr: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    winnerName: string;
    teams: { home: { name: string }; away: { name: string } };
    scores: { home: { total: number }; away: { total: number } };
    goals: { home: number; away: number };
    fixture: { date: string; status: { short: string } };
  }> {
    if (!Array.isArray(apiResponseList) || apiResponseList.length === 0) {
      console.log("H2H Response: [] (Empty/No records)");
      return []; // 빈 데이터일 때 에러 방지
    }

    const parsedResults = apiResponseList
      // 1. 실제로 정상 완결(FT, AET, PEN 등)된 공식 경기만 필터링
      .filter(match => {
        const shortStatus = (match.fixture?.status?.short || match.status?.short || '').toUpperCase();
        return ['FT', 'AET', 'PEN', 'AOT', 'POST', 'FINISHED', 'FINAL', 'GAME OVER'].includes(shortStatus);
      })
      // 2. 날짜(date) 기준 최신순 (내림차순) 정렬
      .sort((a, b) => {
        const dateA = new Date(a.fixture?.date || a.date || 0).getTime();
        const dateB = new Date(b.fixture?.date || b.date || 0).getTime();
        return dateB - dateA;
      })
      // 3. 필요한 최근 최대 N개만 추출 (실제 경기가 8경기면 8경기 그대로 반환)
      .slice(0, limit)
      .map(match => {
        const homeTeam = match.teams?.home?.name || match.teams?.home || match.homeTeam || '홈팀';
        const awayTeam = match.teams?.away?.name || match.teams?.away || match.awayTeam || '원정팀';
        const rawHomeScore = match.scores?.home?.total ?? match.goals?.home ?? match.homeScore ?? match.scores?.home ?? 0;
        const rawAwayScore = match.scores?.away?.total ?? match.goals?.away ?? match.awayScore ?? match.scores?.away ?? 0;
        const homeScore = typeof rawHomeScore === 'number' && !isNaN(rawHomeScore) ? rawHomeScore : 0;
        const awayScore = typeof rawAwayScore === 'number' && !isNaN(rawAwayScore) ? rawAwayScore : 0;
        const rawDate = match.fixture?.date || match.date || '';
        
        let dateStr = match.dateStr;
        if (!dateStr && rawDate) {
          const parts = rawDate.slice(0, 10).split('-');
          if (parts.length === 3) {
            dateStr = `${parts[0].slice(2)}.${parts[1]}.${parts[2]}`;
          } else {
            dateStr = rawDate.slice(0, 10).replace(/-/g, '.');
          }
        }

        return {
          date: rawDate,
          dateStr: dateStr || '최근',
          homeTeam,
          awayTeam,
          homeScore, // null 방지
          awayScore,
          winnerName: homeScore > awayScore ? homeTeam : (awayScore > homeScore ? awayTeam : '무승부'),
          teams: {
            home: { name: homeTeam },
            away: { name: awayTeam }
          },
          scores: {
            home: { total: homeScore },
            away: { total: awayScore }
          },
          goals: {
            home: homeScore,
            away: awayScore
          },
          fixture: {
            date: rawDate,
            status: { short: 'FT' }
          }
        };
      });

    console.log("H2H Response:", parsedResults);
    return parsedResults;
  }

  /**
   * 🛡️ 홈팀/원정팀 최근 경기 파싱 방어 코드 (Zero-Trust Defensive Parser)
   * 1. 실제로 정상 종료(FT, AET, PEN 등)된 경기만 필터링
   * 2. 특정 연도(season) 고정 없이 최신 날짜 기준 내림차순 정렬 (2024년 이전 구버전 데이터 제외)
   * 3. 상위 N개(기본 10개) 추출
   * 4. RecentMatchLog 규격 매핑
   */
  public static parseTeamRecentMatches(
    apiResponseList: any[],
    targetTeamIdOrName: number | string,
    limit: number = 10
  ): RecentMatchLog[] {
    if (!Array.isArray(apiResponseList) || apiResponseList.length === 0) {
      return [];
    }

    const filtered = apiResponseList
      .filter(match => {
        const shortStatus = (match.fixture?.status?.short || match.status?.short || '').toUpperCase();
        const rawDate = match.fixture?.date || match.date || '';
        const year = parseInt(rawDate.slice(0, 4), 10);
        if (!isNaN(year) && year < 2024) {
          return false;
        }
        return ['FT', 'AET', 'PEN', 'AOT', 'POST', 'FINISHED', 'FINAL', 'GAME OVER'].includes(shortStatus);
      })
      .sort((a, b) => {
        const dateA = new Date(a.fixture?.date || a.date || 0).getTime();
        const dateB = new Date(b.fixture?.date || b.date || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);

    return filtered.map(match => {
      const homeId = match.teams?.home?.id;
      const homeName = match.teams?.home?.name || match.teams?.home || match.homeTeam || '홈팀';
      const awayName = match.teams?.away?.name || match.teams?.away || match.awayTeam || '원정팀';
      
      const isTargetHome = typeof targetTeamIdOrName === 'number' 
        ? homeId === targetTeamIdOrName 
        : (homeName === targetTeamIdOrName || homeName.includes(String(targetTeamIdOrName)));

      const rawHomeScore = match.scores?.home?.total ?? match.goals?.home ?? match.homeScore ?? match.scores?.home ?? 0;
      const rawAwayScore = match.scores?.away?.total ?? match.goals?.away ?? match.awayScore ?? match.scores?.away ?? 0;
      const homeScore = typeof rawHomeScore === 'number' && !isNaN(rawHomeScore) ? rawHomeScore : 0;
      const awayScore = typeof rawAwayScore === 'number' && !isNaN(rawAwayScore) ? rawAwayScore : 0;

      const teamScore = isTargetHome ? homeScore : awayScore;
      const opponentScore = isTargetHome ? awayScore : homeScore;
      const opponentName = isTargetHome ? awayName : homeName;
      const resultStr: '승' | '무' | '패' = teamScore > opponentScore ? '승' : (teamScore < opponentScore ? '패' : '무');

      const rawDate = match.fixture?.date || match.date || '';
      const dateStr = match.dateStr || (rawDate ? rawDate.slice(5, 10).replace('-', '.') : '최근');

      return {
        dateStr,
        opponentName,
        homeOrAway: isTargetHome ? 'HOME' : 'AWAY',
        teamScore,
        opponentScore,
        resultStr
      };
    });
  }
}

export const parseRecentMatches = SportsApiClient.parseRecentMatches;
export const parseTeamRecentMatches = SportsApiClient.parseTeamRecentMatches;
export const sportsApiClient = new SportsApiClient();
