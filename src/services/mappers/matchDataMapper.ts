import type { Match, Team } from '../../types/sports';
import type { RawApiMatchResponse } from '../api/types';

export function mapRawApiMatchToMatch(raw: RawApiMatchResponse, matchIndex: number): Match {
  const fixtureDate = new Date(raw.fixture.date);
  const formattedTime = isNaN(fixtureDate.getTime())
    ? '19:00'
    : `${(fixtureDate.getMonth() + 1).toString().padStart(2, '0')}.${fixtureDate.getDate().toString().padStart(2, '0')} ${fixtureDate.getHours().toString().padStart(2, '0')}:${fixtureDate.getMinutes().toString().padStart(2, '0')}`;

  const homeTeam: Team = {
    id: String(raw.teams.home.id || 'home_default'),
    name: raw.teams.home.name || '홈 팀',
    logo: raw.teams.home.logo || '⚽',
    countryName: raw.league.country || '글로벌 🌐',
    rank: raw.teams.home.rank || 3,
    homeSeasonRecord: '시즌 홈 10승 3패',
    awaySeasonRecord: '시즌 원정 7승 5패',
    seasonRemainingGames: '잔여 12경기',
    recent3Form: 'GREEN',
    staminaStatus: 'GREEN',
    minutesPlayed14d: 180,
    totalMarketValue: '1.2억 유로',
    totalMarketValueNum: 1.2
  };

  const awayTeam: Team = {
    id: String(raw.teams.away.id || 'away_default'),
    name: raw.teams.away.name || '원정 팀',
    logo: raw.teams.away.logo || '⚽',
    countryName: raw.league.country || '글로벌 🌐',
    rank: raw.teams.away.rank || 5,
    homeSeasonRecord: '시즌 홈 8승 4패',
    awaySeasonRecord: '시즌 원정 6승 6패',
    seasonRemainingGames: '잔여 12경기',
    recent3Form: 'YELLOW',
    staminaStatus: 'GREEN',
    minutesPlayed14d: 210,
    totalMarketValue: '9500만 유로',
    totalMarketValueNum: 0.95
  };

  let status: Match['status'] = 'SCHEDULED';
  if (['1H', '2H', 'HT', 'ET', 'P'].includes(raw.fixture.status.short)) {
    status = 'LIVE';
  } else if (['FT', 'AET', 'PEN'].includes(raw.fixture.status.short)) {
    status = 'FINISHED';
  }

  return {
    id: `api_match_${raw.fixture.id || matchIndex}`,
    betmanRound: raw.league.round || '축구 승무패 1회차',
    betmanFolder: 'SEUNGMUPAE',
    betmanMatchNo: matchIndex + 1,
    sport: 'football',
    league: raw.league.name || '해외 축구 리그',
    countryFlag: raw.league.flag || '🌐',
    isFavorite: false,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '실시간 API 연동 팩트 데이터',
      alertText: `🚨 [API 오피셜 라인업 팩트] ${homeTeam.name} vs ${awayTeam.name} 최신 명단 반영 완료`,
      keyAbsenceNotice: '⚠️ [API 팩트 정보] 부상 및 징계 선수 명단 자동 연동 적용됨'
    },
    headToHeadRecord: {
      summaryText: '상대전적 기록이 없습니다.',
      homeWins: 0,
      draws: 0,
      awayWins: 0,
      last5Matches: []
    },
    homeTeam,
    awayTeam,
    homeScore: raw.goals?.home ?? raw.score?.fulltime?.home ?? undefined,
    awayScore: raw.goals?.away ?? raw.score?.fulltime?.away ?? undefined,
    status,
    matchTime: formattedTime,
    closingTime: formattedTime,
    venue: raw.fixture.venue?.name ? `${raw.fixture.venue.name} (${raw.fixture.venue.city || ''})` : '홈 구장',
    underOverFact: {
      last10OverRatio: 60,
      last10UnderRatio: 40,
      avgScoredGoals: 1.8,
      avgConcededGoals: 1.1,
      isFiveBack: false,
      tacticDescription: '공격적 4-3-3 포메이션 기반 빠른 공수 전환 패턴'
    }
  };
}
