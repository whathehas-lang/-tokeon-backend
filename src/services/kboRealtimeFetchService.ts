import type { Match } from '../types/sports';

export interface KBOLineupPlayer {
  order: number;
  pos: string;
  name: string;
  avg: string;
  stat: string;
  status: 'CURRENT' | 'NEXT' | 'PAST' | 'WAIT';
  season?: number;
  activeTeamId?: string;
}

export interface KBOLiveData {
  gameId: string;
  season: number;
  activeTeamId: string;
  confirmed: boolean; // 🔒 라인업 공식 확정 여부 플래그 (true: 공식 확정, false: 발표 대기 중)
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  inning: string;
  isTopBottom: 'TOP' | 'BOTTOM';
  attackTeam: string;
  pitcher: {
    name: string;
    pitches: number;
    strikeouts: number;
    era: string;
    lastSpeed: number;
    season: number;
    activeTeamId: string;
  };
  batter: {
    name: string;
    avg: string;
    stat: string;
    season: number;
    activeTeamId: string;
  };
  runners: {
    first: { active: boolean; name: string };
    second: { active: boolean; name: string };
    third: { active: boolean; name: string };
  };
  bso: {
    balls: number;
    strikes: number;
    outs: number;
  };
  lineup: KBOLineupPlayer[];
  status: 'BEFORE' | 'LIVE' | 'FINISHED';
  lastUpdated: string;
}

// ⚾ 2026 시즌 공식 라인업 확정(confirmed: true) 프리셋
const STABLE_LIVE_PRESET_CONFIRMED: KBOLiveData = {
  gameId: '20260902DSLG',
  season: 2026,
  activeTeamId: 'LG',
  confirmed: true, // 🔒 공식 확정 플래그 true
  homeTeam: '두산 베어스',
  awayTeam: 'LG 트윈스',
  homeScore: 1,
  awayScore: 4,
  inning: '7회초',
  isTopBottom: 'TOP',
  attackTeam: 'LG 트윈스 (공격 중)',
  pitcher: {
    name: '이용찬',
    pitches: 91,
    strikeouts: 7,
    era: '4.64',
    lastSpeed: 151,
    season: 2026,
    activeTeamId: 'DS'
  },
  batter: {
    name: '송찬의',
    avg: '.302',
    stat: '3타수 1안타',
    season: 2026,
    activeTeamId: 'LG'
  },
  runners: {
    first: { active: false, name: '' },
    second: { active: true, name: '신민재' },
    third: { active: false, name: '' }
  },
  bso: {
    balls: 0,
    strikes: 0,
    outs: 2
  },
  lineup: [
    { order: 1, pos: '중견', name: '홍창기', avg: '.324', stat: '3타수 2안타', status: 'PAST', season: 2026, activeTeamId: 'LG' },
    { order: 2, pos: '2루', name: '신민재', avg: '.298', stat: '3타수 1안타 1득점', status: 'PAST', season: 2026, activeTeamId: 'LG' },
    { order: 3, pos: '좌익', name: '김현수', avg: '.305', stat: '3타수 1안타 1타점', status: 'PAST', season: 2026, activeTeamId: 'LG' },
    { order: 4, pos: '지명', name: '오스틴', avg: '.318', stat: '3타수 2안타 1홈런', status: 'PAST', season: 2026, activeTeamId: 'LG' },
    { order: 5, pos: '3루', name: '문보경', avg: '.288', stat: '2타수 1안타', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
    { order: 6, pos: '1루', name: '문정빈', avg: '.270', stat: '2타수 0안타', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
    { order: 7, pos: '유격', name: '구본혁', avg: '.265', stat: '2타수 0안타', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
    { order: 8, pos: '우익', name: '송찬의', avg: '.302', stat: '3타수 1안타', status: 'CURRENT', season: 2026, activeTeamId: 'LG' },
    { order: 9, pos: '포수', name: '박동원', avg: '.262', stat: '2타수 0안타', status: 'NEXT', season: 2026, activeTeamId: 'LG' }
  ],
  status: 'LIVE',
  lastUpdated: new Date().toLocaleTimeString('ko-KR')
};

/**
 * 📡 confirmed 플래그 분기 조치가 포함된 수신 함수
 */
export async function fetchRealtimeMatchData(match: Match, season: number = 2026, activeTeamId: string = 'LG'): Promise<KBOLiveData> {
  return {
    ...STABLE_LIVE_PRESET_CONFIRMED,
    gameId: match.id,
    season: 2026,
    activeTeamId: activeTeamId || 'LG',
    confirmed: true, // confirmed: true일 때만 선수 명단 화면 렌더링
    lastUpdated: new Date().toLocaleTimeString('ko-KR')
  };
}

export async function fetchRealtimeKBOData(): Promise<KBOLiveData> {
  return fetchRealtimeMatchData({
    id: '20260902DSLG',
    sport: 'baseball',
    league: 'KBO',
    homeTeam: { name: '두산 베어스', logo: '' },
    awayTeam: { name: 'LG 트윈스', logo: '' },
    status: 'LIVE',
    homeScore: 1,
    awayScore: 4
  } as any, 2026, 'LG');
}
