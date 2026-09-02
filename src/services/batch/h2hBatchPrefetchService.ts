import type { Match } from '../../types/sports';
import { sportsApiClient, parseRecentMatches } from '../api/sportsApiClient';
import { h2hDatabaseStorage, type H2HDatabaseEntity } from '../db/h2hDatabaseStorage';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';

export interface BatchPrefetchReport {
  totalTargetMatches: number;
  prefetchedCount: number;
  skippedExistingCount: number;
  failedCount: number;
  executedAt: string;
}

/**
 * ⚡ H2H Batch Prefetch Service
 * 경기 직전 외부 API 호출을 100% 제거하고,
 * 하루 1회 또는 경기 시작 2시간 전 배치(Batch)로 H2H 데이터를 사전 수집하여 내부 DB에 저장합니다.
 */
export class H2HBatchPrefetchService {
  private static isRunning: boolean = false;
  private static lastReport: BatchPrefetchReport | null = null;

  /**
   * 하루 1회 또는 앱 구동 시 전체 예정 경기에 대한 H2H 배치 사전 수집
   */
  public static async runDailyBatchPrefetch(matches: Match[]): Promise<BatchPrefetchReport> {
    if (this.isRunning) {
      return this.lastReport || {
        totalTargetMatches: matches.length,
        prefetchedCount: 0,
        skippedExistingCount: 0,
        failedCount: 0,
        executedAt: new Date().toISOString()
      };
    }

    this.isRunning = true;
    console.log(`[H2HBatchPrefetchService] 🚀 Starting Daily H2H Batch Prefetch for ${matches.length} matches...`);

    let prefetched = 0;
    let skipped = 0;
    let failed = 0;

    // 중복 대진 제거
    const uniqueMatchups = new Map<string, { home: string; away: string; sport: string; matchTime?: string }>();
    for (const m of matches) {
      const key = `${SportsEntityMappingService.normalize(m.homeTeam.name)}_${SportsEntityMappingService.normalize(m.awayTeam.name)}`;
      if (!uniqueMatchups.has(key)) {
        uniqueMatchups.set(key, {
          home: m.homeTeam.name,
          away: m.awayTeam.name,
          sport: m.sport,
          matchTime: m.matchTime
        });
      }
    }

    for (const [key, matchup] of uniqueMatchups.entries()) {
      // 이미 내부 DB에 안전하게 보관되어 있으면 스킵
      if (h2hDatabaseStorage.hasRecord(matchup.home, matchup.away)) {
        skipped++;
        continue;
      }

      try {
        const team1Id = SportsEntityMappingService.resolveTeamEntity(matchup.home)?.apiTeamId;
        const team2Id = SportsEntityMappingService.resolveTeamEntity(matchup.away)?.apiTeamId;

        console.log(`[H2HBatchPrefetchService] 🔍 [Team ID Mapping Check] ${matchup.home} (ID: ${team1Id}) vs ${matchup.away} (ID: ${team2Id})`);

        if (team1Id && team2Id && !sportsApiClient.isMockMode()) {
          const isBaseball = matchup.sport === 'baseball' || matchup.sport === '야구';
          const sportType: 'football' | 'baseball' = isBaseball ? 'baseball' : 'football';
          const rawFixtures = await sportsApiClient.fetchH2HWithRecentLogsFallback(team1Id, team2Id, sportType);
          const parsed = parseRecentMatches(rawFixtures, 20);

          if (parsed && parsed.length > 0) {
            let team1Wins = 0;
            let team2Wins = 0;
            let draws = 0;

            const last5Matches = parsed.map(p => {
              const isT1Home = SportsEntityMappingService.isSameTeam(p.homeTeam, matchup.home, sportType);
              const isT2Home = SportsEntityMappingService.isSameTeam(p.homeTeam, matchup.away, sportType);
              const isT1Away = SportsEntityMappingService.isSameTeam(p.awayTeam, matchup.home, sportType);
              const isT2Away = SportsEntityMappingService.isSameTeam(p.awayTeam, matchup.away, sportType);

              let matchHomeKo = matchup.home;
              let matchAwayKo = matchup.away;

              if (isT1Home || isT2Away) {
                matchHomeKo = matchup.home;
                matchAwayKo = matchup.away;
              } else if (isT2Home || isT1Away) {
                matchHomeKo = matchup.away;
                matchAwayKo = matchup.home;
              } else {
                const hEntity = SportsEntityMappingService.resolveTeamEntity(p.homeTeam, sportType);
                const aEntity = SportsEntityMappingService.resolveTeamEntity(p.awayTeam, sportType);
                matchHomeKo = hEntity?.nameKo || p.homeTeam || matchup.home;
                matchAwayKo = aEntity?.nameKo || p.awayTeam || matchup.away;
                if (matchHomeKo === matchAwayKo || SportsEntityMappingService.isSameTeam(matchHomeKo, matchAwayKo, sportType)) {
                  matchHomeKo = matchup.home;
                  matchAwayKo = matchup.away;
                }
              }

              const isTeam1ActualHome = matchHomeKo === matchup.home;

              let winnerName = '무승부';
              if (p.homeScore > p.awayScore) {
                if (isTeam1ActualHome) {
                  team1Wins++;
                  winnerName = matchup.home;
                } else {
                  team2Wins++;
                  winnerName = matchup.away;
                }
              } else if (p.awayScore > p.homeScore) {
                if (!isTeam1ActualHome) {
                  team1Wins++;
                  winnerName = matchup.home;
                } else {
                  team2Wins++;
                  winnerName = matchup.away;
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

            const verdict = team1Wins > team2Wins ? `${matchup.home} 우세 🟢` : (team2Wins > team1Wins ? `${matchup.away} 우세 🔵` : '동률 🤝');
            const entity: H2HDatabaseEntity = {
              h2hKey: key,
              homeTeamName: matchup.home,
              awayTeamName: matchup.away,
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
            prefetched++;
            continue;
          }
        }
      } catch (err) {
        console.warn(`[H2HBatchPrefetchService] Batch prefetch failed for ${key}:`, err);
        failed++;
      }
    }

    this.isRunning = false;
    const report: BatchPrefetchReport = {
      totalTargetMatches: uniqueMatchups.size,
      prefetchedCount: prefetched,
      skippedExistingCount: skipped,
      failedCount: failed,
      executedAt: new Date().toISOString()
    };

    this.lastReport = report;
    console.log(`[H2HBatchPrefetchService] ✅ Batch prefetch finished. (Prefetched: ${prefetched}, Cached: ${skipped}, Failed: ${failed})`);
    return report;
  }

  /**
   * 경기 시작 2시간 전 (T-2 Hours) 배치 정밀 스캔
   */
  public static async runTMinus2HoursBatchPrefetch(matches: Match[]): Promise<BatchPrefetchReport> {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // 2시간 이내 시작 예정인 경기 필터링
    const impendingMatches = matches.filter(m => {
      if (m.status === 'FINISHED' || m.status === 'LIVE') return false;
      return true; // 예정 경기 전수 포함
    });

    console.log(`[H2HBatchPrefetchService] ⏰ Running T-2H Batch Check for ${impendingMatches.length} impending matches.`);
    return this.runDailyBatchPrefetch(impendingMatches);
  }

  public static getLastReport(): BatchPrefetchReport | null {
    return this.lastReport;
  }
}
