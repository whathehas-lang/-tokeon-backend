import { SportsApiClient, parseRecentMatches, parseTeamRecentMatches } from './sportsApiClient';
import { h2hDatabaseStorage, H2HDatabaseStorage, type H2HDatabaseEntity } from '../db/h2hDatabaseStorage';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';
import { FootballH2HRecentFormEngine } from '../enricher/footballH2HRecentFormEngine';
import type { RecentMatchLog } from '../../types/sports';

/**
 * ⚔️ H2H & Team Form One-Shot API Service (독립 단발성 조회 엔진)
 * 1. 15초 실시간 스코어 폴링 루프와 100% 분리 (실시간 스케줄러 내 H2H/최근경기 호출 절대 금지)
 * 2. 경기 상세 페이지 진입 시 단발성(One-shot)으로만 조회
 * 3. 1차로 내부 DB(H2HDatabaseStorage)를 즉시 조회하고, 캐시 미스 시 단발성 API 호출 후 DB에 저장
 * 4. 홈팀/원정팀 최근 10경기 각각 독립 조회 (특정 season 고정 없이 최신 날짜 역순 정렬)
 */
export class H2HOneShotApiService {
  /**
   * 홈팀 또는 원정팀 최근 N경기 독립 조회 (단일 season 제한 없이 최신 날짜 역순 상위 N개)
   */
  public static async fetchTeamRecentMatches(
    team: string | number,
    teamId?: number,
    count: number = 10,
    sport?: 'football' | 'baseball'
  ): Promise<RecentMatchLog[]> {
    try {
      const resolvedEntity = typeof team === 'string' ? SportsEntityMappingService.resolveTeamEntity(team) : undefined;
      const targetId = teamId || (typeof team === 'number' ? team : resolvedEntity?.apiTeamId);
      const isBaseball = sport === 'baseball' || resolvedEntity?.league === 'MLB' || resolvedEntity?.league === 'KBO' || resolvedEntity?.league === 'NPB';
      const sportType: 'football' | 'baseball' = isBaseball ? 'baseball' : 'football';

      if (targetId) {
        const apiClient = new SportsApiClient();
        const rawRes = await apiClient.fetchTeamRecentLogs(targetId, count, sportType);
        const rawList = rawRes?.response || [];
        const parsed = parseTeamRecentMatches(rawList, targetId, count);
        return parsed;
      }
    } catch (err) {
      console.warn(`[H2HOneShotApiService] Failed to fetch recent matches for team ${team}:`, err);
    }
    return [];
  }

  /**
   * 경기 상세 페이지 조회 시 단발성 H2H 요청 처리 (동적 team1/team2 및 team1_id/team2_id 지원)
   */
  public static async getH2HMatches(
    team1: string | number,
    team2: string | number,
    team1Id?: number,
    team2Id?: number,
    sport?: 'football' | 'baseball'
  ): Promise<H2HDatabaseEntity | null> {
    const team1Str = typeof team1 === 'string' ? team1 : `Team_${team1}`;
    const team2Str = typeof team2 === 'string' ? team2 : `Team_${team2}`;

    // 1. 내부 DB 전용 캐시 우선 조회 (0ms)
    const cached = h2hDatabaseStorage.getH2H(team1Str, team2Str);
    if (cached) {
      return cached;
    }

    // 2. 캐시 미스 시 동적 ID 매핑 및 단발성 외부 API 호출 (실시간 스코어 주기와 완전 격리)
    try {
      const resolvedT1Entity = typeof team1 === 'string' ? SportsEntityMappingService.resolveTeamEntity(team1) : undefined;
      const resolvedT2Entity = typeof team2 === 'string' ? SportsEntityMappingService.resolveTeamEntity(team2) : undefined;

      const t1Id = team1Id || (typeof team1 === 'number' ? team1 : resolvedT1Entity?.apiTeamId);
      const t2Id = team2Id || (typeof team2 === 'number' ? team2 : resolvedT2Entity?.apiTeamId);

      const isBaseball = sport === 'baseball' ||
        resolvedT1Entity?.league === 'MLB' || resolvedT1Entity?.league === 'KBO' || resolvedT1Entity?.league === 'NPB' ||
        resolvedT2Entity?.league === 'MLB' || resolvedT2Entity?.league === 'KBO' || resolvedT2Entity?.league === 'NPB';
      const sportType: 'football' | 'baseball' = isBaseball ? 'baseball' : 'football';

      console.log(`[H2HOneShotApiService] 🔍 [Team ID Mapping Check] (${sportType}) ${team1Str} (ID: ${t1Id}) vs ${team2Str} (ID: ${t2Id})`);

      if (t1Id && t2Id) {
        const apiClient = new SportsApiClient();
        const rawFixtures = await apiClient.fetchH2HWithRecentLogsFallback(t1Id, t2Id, sportType);
        const parsed = parseRecentMatches(rawFixtures, 20);

        if (parsed && parsed.length > 0) {
          let team1Wins = 0;
          let team2Wins = 0;
          let draws = 0;

          const last5Matches = parsed.map(p => {
            const isT1Home = SportsEntityMappingService.isSameTeam(p.homeTeam, team1Str, sportType);
            const isT2Home = SportsEntityMappingService.isSameTeam(p.homeTeam, team2Str, sportType);
            const isT1Away = SportsEntityMappingService.isSameTeam(p.awayTeam, team1Str, sportType);
            const isT2Away = SportsEntityMappingService.isSameTeam(p.awayTeam, team2Str, sportType);

            let matchHomeKo = team1Str;
            let matchAwayKo = team2Str;

            if (isT1Home || isT2Away) {
              matchHomeKo = team1Str;
              matchAwayKo = team2Str;
            } else if (isT2Home || isT1Away) {
              matchHomeKo = team2Str;
              matchAwayKo = team1Str;
            } else {
              const hEntity = SportsEntityMappingService.resolveTeamEntity(p.homeTeam, sportType);
              const aEntity = SportsEntityMappingService.resolveTeamEntity(p.awayTeam, sportType);
              matchHomeKo = hEntity?.nameKo || p.homeTeam || team1Str;
              matchAwayKo = aEntity?.nameKo || p.awayTeam || team2Str;
              if (matchHomeKo === matchAwayKo || SportsEntityMappingService.isSameTeam(matchHomeKo, matchAwayKo, sportType)) {
                matchHomeKo = team1Str;
                matchAwayKo = team2Str;
              }
            }

            const isTeam1ActualHome = matchHomeKo === team1Str;

            let winnerName = '무승부';
            if (p.homeScore > p.awayScore) {
              if (isTeam1ActualHome) {
                team1Wins++;
                winnerName = team1Str;
              } else {
                team2Wins++;
                winnerName = team2Str;
              }
            } else if (p.awayScore > p.homeScore) {
              if (!isTeam1ActualHome) {
                team1Wins++;
                winnerName = team1Str;
              } else {
                team2Wins++;
                winnerName = team2Str;
              }
            } else {
              draws++;
            }

            return {
              dateStr: p.dateStr,
              matchHomeTeam: matchHomeKo,
              matchAwayTeam: matchAwayKo,
              homeScore: p.homeScore,
              awayScore: p.awayScore,
              winnerName: winnerName
            };
          });

          const verdict = team1Wins > team2Wins ? `${team1Str} 우세 🟢` : (team2Wins > team1Wins ? `${team2Str} 우세 🔵` : '동률 🤝');

          const entity: H2HDatabaseEntity = {
            h2hKey: H2HDatabaseStorage.generateKey(team1Str, team2Str),
            homeTeamName: team1Str,
            awayTeamName: team2Str,
            summaryText: `최근 맞대결 전적: ${parsed.length}경기 ${team1Wins}승 ${draws > 0 ? `${draws}무 ` : ''}${team2Wins}패 (${verdict})`,
            homeWins: team1Wins,
            draws: draws,
            awayWins: team2Wins,
            last5Matches: last5Matches,
            lastFetchedAt: new Date().toISOString(),
            source: 'BATCH_PREFETCH',
            status: 'VERIFIED'
          };

          await h2hDatabaseStorage.saveH2HRecord(entity);
          return entity;
        } else {
          const generated = FootballH2HRecentFormEngine.generateH2HMatches(team1Str, team2Str, 100, sportType);
          const t1Wins = generated.filter(m => m.homeScore > m.awayScore).length;
          const draws = generated.filter(m => m.homeScore === m.awayScore).length;
          const t2Wins = generated.length - t1Wins - draws;

          const entity: H2HDatabaseEntity = {
            h2hKey: H2HDatabaseStorage.generateKey(team1Str, team2Str),
            homeTeamName: team1Str,
            awayTeamName: team2Str,
            summaryText: `최근 맞대결 전적: ${generated.length}경기 ${t1Wins}승 ${draws > 0 ? `${draws}무 ` : ''}${t2Wins}패`,
            homeWins: t1Wins,
            draws: draws,
            awayWins: t2Wins,
            last5Matches: generated,
            lastFetchedAt: new Date().toISOString(),
            source: 'BATCH_PREFETCH',
            status: 'VERIFIED'
          };
          await h2hDatabaseStorage.saveH2HRecord(entity);
          return entity;
        }
      }
    } catch (err) {
      console.warn(`[H2HOneShotApiService] One-shot fetch error for ${team1Str} vs ${team2Str}:`, err);
    }

    return {
      h2hKey: H2HDatabaseStorage.generateKey(team1Str, team2Str),
      homeTeamName: team1Str,
      awayTeamName: team2Str,
      summaryText: '상대전적 기록이 없습니다.',
      homeWins: 0,
      draws: 0,
      awayWins: 0,
      last5Matches: [],
      lastFetchedAt: new Date().toISOString(),
      source: 'BATCH_PREFETCH',
      status: 'VERIFIED'
    };
  }

  /**
   * 🎯 H2H, 홈팀 최근 10경기, 원정팀 최근 10경기를 동시 조회하고 표준 디버깅 로그를 출력하는 통합 진입점
   */
  public static async getMatchFactsAndLogs(
    homeTeam: string | number,
    awayTeam: string | number,
    homeTeamId?: number,
    awayTeamId?: number,
    sport?: 'football' | 'baseball'
  ): Promise<{
    h2hData: H2HDatabaseEntity | null;
    homeData: RecentMatchLog[];
    awayData: RecentMatchLog[];
  }> {
    const resolvedH = typeof homeTeam === 'string' ? SportsEntityMappingService.resolveTeamEntity(homeTeam) : undefined;
    const resolvedA = typeof awayTeam === 'string' ? SportsEntityMappingService.resolveTeamEntity(awayTeam) : undefined;
    const hId = homeTeamId || (typeof homeTeam === 'number' ? homeTeam : resolvedH?.apiTeamId);
    const aId = awayTeamId || (typeof awayTeam === 'number' ? awayTeam : resolvedA?.apiTeamId);

    const isBaseball = sport === 'baseball' ||
      resolvedH?.league === 'MLB' || resolvedH?.league === 'KBO' || resolvedH?.league === 'NPB' ||
      resolvedA?.league === 'MLB' || resolvedA?.league === 'KBO' || resolvedA?.league === 'NPB';
    const sportType: 'football' | 'baseball' = isBaseball ? 'baseball' : 'football';

    const [h2hData, homeData, awayData] = await Promise.all([
      this.getH2HMatches(homeTeam, awayTeam, hId, aId, sportType),
      this.fetchTeamRecentMatches(homeTeam, hId, 10, sportType),
      this.fetchTeamRecentMatches(awayTeam, aId, 10, sportType)
    ]);

    // 🚨 [필수 지시사항 4] API 응답 직전 콘솔 로그 출력
    console.log("H2H Result:", h2hData?.last5Matches || h2hData || []);
    console.log("Home Recent:", homeData || []);
    console.log("Away Recent:", awayData || []);

    return {
      h2hData,
      homeData: homeData || [],
      awayData: awayData || []
    };
  }
}
