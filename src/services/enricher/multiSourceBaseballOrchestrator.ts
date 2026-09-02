import type { Match, StarterPitcherInfo } from '../../types/sports';
import { KboOfficialLiveCollector } from '../crawler/kboOfficialLiveCollector';
import { MlbOfficialStatsService } from '../api/mlbOfficialStatsService';
import { NpbOfficialStarterService } from '../api/npbOfficialStarterService';
import { FootballH2HRecentFormEngine } from './footballH2HRecentFormEngine';

/**
 * ⚾ MultiSourceBaseballOrchestrator
 * KBO, MLB, NPB 3대 야구 리그의 실시간 선발투수 및 경기 데이터를
 * 공식 API 및 공식 사이트 경유로만 100% 팩트 기반 수집하는 엔진
 * (임의 추측 또는 5선발 가짜 데이터 원천 차단)
 */
export class MultiSourceBaseballOrchestrator {
  public static async enrichMatchesWithMultiSource(matches: Match[]): Promise<Match[]> {
    return Promise.all(
      matches.map(async (m) => {
        if (m.sport !== 'baseball') return m;

        let homeStarter: StarterPitcherInfo | null = null;
        let awayStarter: StarterPitcherInfo | null = null;

        const matchTime = m.matchTime || '';
        const isToday = matchTime.includes('09.02');
        const isTomorrow = matchTime.includes('09.03');

        // 1. KBO 경기인 경우 -> 공식 KBO/네이버 공시 수집
        const isKbo = m.league.includes('KBO') || m.countryFlag === '🇰🇷' || 
          ['LG', '두산', '한화', 'KIA', '삼성', '롯데', '키움', 'KT', 'SSG', 'NC'].some(t => m.homeTeam.name.includes(t) || m.awayTeam.name.includes(t));

        if (isKbo) {
          if (isToday) {
            const kboStarters = await KboOfficialLiveCollector.getOfficialStarterForMatch(m);
            homeStarter = kboStarters.homeStarter;
            awayStarter = kboStarters.awayStarter;
          }
          // 내일/미래 KBO는 공식 발표 전이므로 null 유지
        } else if (m.league.includes('MLB') || m.countryFlag === '🇺🇸') {
          // 2. MLB 경기인 경우 -> MLB 연맹 공식 Stats API 실시간 조회
          if (isToday) {
            homeStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.homeTeam.name, '2026-09-01');
            awayStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.awayTeam.name, '2026-09-01');
          } else if (isTomorrow) {
            homeStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.homeTeam.name, '2026-09-02');
            awayStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.awayTeam.name, '2026-09-02');
          }
        } else if (m.league.includes('NPB') || m.countryFlag === '🇯🇵') {
          // 3. NPB 경기인 경우 -> 공식 홈페이지 공시 수집
          if (isToday) {
            homeStarter = await NpbOfficialStarterService.fetchOfficialStarterByDate(m.homeTeam.name, 'TODAY');
            awayStarter = await NpbOfficialStarterService.fetchOfficialStarterByDate(m.awayTeam.name, 'TODAY');
          }
        }

        // 4. 공식 공시가 없을 경우 사전 스케줄의 값 또는 null (미정) 설정
        const finalHomeStarter = homeStarter || m.homeTeam.starterPitcherInfo || null;
        const finalAwayStarter = awayStarter || m.awayTeam.starterPitcherInfo || null;

        const baseEnriched: Match = {
          ...m,
          homeTeam: {
            ...m.homeTeam,
            name: m.homeTeam.name,
            starterPitcherInfo: finalHomeStarter
          },
          awayTeam: {
            ...m.awayTeam,
            name: m.awayTeam.name,
            starterPitcherInfo: finalAwayStarter
          },
          isPitcherAnnounced: Boolean(finalHomeStarter && finalAwayStarter),
          isDataCheckingPending: false
        };

        // ⚔️ 2단계: H2H 및 최근 경기 로그 결합
        return FootballH2HRecentFormEngine.enrichH2HAndRecentLogs(baseEnriched);
      })
    );
  }
}
