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

        // 📅 경기 일자 동적 추출 (하드코딩 09.02/09.03 원천 제거)
        let gameDateStr = new Date().toISOString().slice(0, 10);
        if (m.rawTimeIso && m.rawTimeIso.length >= 10) {
          gameDateStr = m.rawTimeIso.slice(0, 10);
        } else if (m.timestamp) {
          gameDateStr = new Date(m.timestamp * 1000).toISOString().slice(0, 10);
        }

        // 1. KBO 경기인 경우 -> 공식 KBO/네이버 공시 수집
        const isKbo = (m.league || '').includes('KBO') || m.countryFlag === '🇰🇷' || 
          ['LG', '두산', '한화', 'KIA', '삼성', '롯데', '키움', 'KT', 'SSG', 'NC'].some(t => m.homeTeam.name.includes(t) || m.awayTeam.name.includes(t));

        if (isKbo) {
          const kboStarters = await KboOfficialLiveCollector.getOfficialStarterForMatch(m);
          homeStarter = kboStarters.homeStarter;
          awayStarter = kboStarters.awayStarter;
        } else if ((m.league || '').includes('MLB') || m.countryFlag === '🇺🇸') {
          // 2. MLB 경기인 경우 -> MLB 연맹 공식 Stats API 실시간 조회 (지정 일자 팩트 기반)
          homeStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.homeTeam.name, gameDateStr);
          awayStarter = await MlbOfficialStatsService.fetchOfficialProbablePitcher(m.awayTeam.name, gameDateStr);
        } else if ((m.league || '').includes('NPB') || m.countryFlag === '🇯🇵') {
          // 3. NPB 경기인 경우 -> 공식 홈페이지 공시 수집
          homeStarter = await NpbOfficialStarterService.fetchOfficialStarterByDate(m.homeTeam.name, 'TODAY');
          awayStarter = await NpbOfficialStarterService.fetchOfficialStarterByDate(m.awayTeam.name, 'TODAY');
        }

        // 4. 공식 미발표 시 '선발 미정' 객체 할당 (가짜 더미 투수 원천 차단)
        const sanitize = (sp: StarterPitcherInfo | null | undefined): StarterPitcherInfo => {
          if (!sp || !sp.name || sp.name.includes('선발투수') || sp.name.includes('?') || sp.name.includes('i?') || sp.name === '선발' || sp.name.includes('미정')) {
            return {
              name: '선발 미정',
              number: 0,
              throwsHand: 'R',
              era: '발표대기',
              seasonEra: '미정',
              whip: '-',
              wins: 0,
              losses: 0,
              inningsPitched: '0.0',
              strikeouts: 0,
              vsOpponentLogs: []
            };
          }
          return sp;
        };

        const finalHomeStarter = sanitize(homeStarter || m.homeTeam.starterPitcherInfo);
        const finalAwayStarter = sanitize(awayStarter || m.awayTeam.starterPitcherInfo);
        const isBothAnnounced = finalHomeStarter.name !== '선발 미정' && finalAwayStarter.name !== '선발 미정';

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
          isPitcherAnnounced: isBothAnnounced,
          isDataCheckingPending: !isBothAnnounced
        };

        // ⚔️ 2단계: H2H 및 최근 경기 로그 결합
        return FootballH2HRecentFormEngine.enrichH2HAndRecentLogs(baseEnriched);
      })
    );
  }
}
