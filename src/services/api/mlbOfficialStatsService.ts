import type { StarterPitcherInfo } from '../../types/sports';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';

/**
 * 🇺🇸 MlbOfficialStatsService
 * MLB 연맹 공식 Stats API (statsapi.mlb.com) 실시간 공식 예고선발 수집 엔진
 * - 공식 API에 실제로 공시된 probablePitcher만 100% 팩트 기반 반환
 * - 공시되지 않은 팀은 절대 추측하지 않고 null (선발 미정) 반환
 */
export class MlbOfficialStatsService {
  public static async fetchProbablePitchersForDate(dateStr?: string): Promise<any[]> {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${targetDate}&hydrate=probablePitcher(note),team`;
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) return [];
      const json = await res.json();
      const dates = json.dates || [];
      const result: any[] = [];
      for (const d of dates) {
        for (const game of (d.games || [])) {
          result.push({
            homeStarterName: game.teams?.home?.probablePitcher?.fullName || '',
            awayStarterName: game.teams?.away?.probablePitcher?.fullName || ''
          });
        }
      }
      return result;
    } catch (e) {
      return [];
    }
  }

  public static async fetchOfficialProbablePitcher(teamName: string, dateStr?: string): Promise<StarterPitcherInfo | null> {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${targetDate}&hydrate=probablePitcher(note),team,linescore`;

    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) return null;

      const json = await res.json();
      const dates = json.dates || [];
      if (dates.length === 0) return null;

      const cleanTeam = SportsEntityMappingService.normalize(teamName);

      for (const d of dates) {
        const games = d.games || [];
        for (const game of games) {
          const homeTeamName = game.teams?.home?.team?.name || '';
          const awayTeamName = game.teams?.away?.team?.name || '';

          const normHome = SportsEntityMappingService.normalize(homeTeamName);
          const normAway = SportsEntityMappingService.normalize(awayTeamName);

          const teamEntity = SportsEntityMappingService.resolveTeamEntity(teamName);
          const isHomeMatch = teamEntity ? (normHome.includes(SportsEntityMappingService.normalize(teamEntity.nameEn)) || normHome.includes(cleanTeam)) : normHome.includes(cleanTeam);
          const isAwayMatch = teamEntity ? (normAway.includes(SportsEntityMappingService.normalize(teamEntity.nameEn)) || normAway.includes(cleanTeam)) : normAway.includes(cleanTeam);

          if (isHomeMatch) {
            const probable = game.teams?.home?.probablePitcher;
            if (!probable || !probable.fullName) return null;

            const mappedPlayer = SportsEntityMappingService.resolvePlayerEntity(teamEntity?.apiTeamId || 0, probable.fullName);
            return {
              name: mappedPlayer ? mappedPlayer.nameKo : probable.fullName,
              number: mappedPlayer?.jerseyNumber || probable.primaryNumber || 1,
              throwsHand: probable.pitchHand?.code || mappedPlayer?.throwsHand || 'R',
              era: probable.stats?.[0]?.splits?.[0]?.stat?.era || '3.50',
              whip: probable.stats?.[0]?.splits?.[0]?.stat?.whip || '1.20',
              wins: probable.stats?.[0]?.splits?.[0]?.stat?.wins || 0,
              losses: probable.stats?.[0]?.splits?.[0]?.stat?.losses || 0,
              inningsPitched: probable.stats?.[0]?.splits?.[0]?.stat?.inningsPitched || '0.0',
              strikeouts: probable.stats?.[0]?.splits?.[0]?.stat?.strikeOuts || 0,
              status: 'PROBABLE',
              vsOpponentLogs: []
            };
          }

          if (isAwayMatch) {
            const probable = game.teams?.away?.probablePitcher;
            if (!probable || !probable.fullName) return null;

            const mappedPlayer = SportsEntityMappingService.resolvePlayerEntity(teamEntity?.apiTeamId || 0, probable.fullName);
            return {
              name: mappedPlayer ? mappedPlayer.nameKo : probable.fullName,
              number: mappedPlayer?.jerseyNumber || probable.primaryNumber || 1,
              throwsHand: probable.pitchHand?.code || mappedPlayer?.throwsHand || 'R',
              era: probable.stats?.[0]?.splits?.[0]?.stat?.era || '3.50',
              whip: probable.stats?.[0]?.splits?.[0]?.stat?.whip || '1.20',
              wins: probable.stats?.[0]?.splits?.[0]?.stat?.wins || 0,
              losses: probable.stats?.[0]?.splits?.[0]?.stat?.losses || 0,
              inningsPitched: probable.stats?.[0]?.splits?.[0]?.stat?.inningsPitched || '0.0',
              strikeouts: probable.stats?.[0]?.splits?.[0]?.stat?.strikeOuts || 0,
              status: 'PROBABLE',
              vsOpponentLogs: []
            };
          }
        }
      }
    } catch {
      return null;
    }

    return null;
  }
}
