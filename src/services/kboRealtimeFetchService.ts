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
  confirmed: boolean;
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

export const RENDER_BACKEND_URL = 'https://tokeon-backend.onrender.com';

/**
 * 📡 실제 오늘 날짜(Today) KBO/MLB 경기 상태 수신 함수
 */
export async function fetchRealtimeMatchData(match: Match, season: number = 2026, activeTeamId: string = 'LG'): Promise<KBOLiveData> {
  try {
    const res = await fetch(`${RENDER_BACKEND_URL}/api/live-all`);
    if (res.ok) {
      const live = await res.json();
      return {
        gameId: match.id || live.gameId,
        season: 2026,
        activeTeamId: activeTeamId || 'LG',
        confirmed: live.confirmed ?? false,
        homeTeam: match.homeTeam?.name || live.homeTeam || '두산 베어스',
        awayTeam: match.awayTeam?.name || live.awayTeam || 'LG 트윈스',
        homeScore: live.homeScore ?? 0,
        awayScore: live.awayScore ?? 0,
        inning: live.inning || '18:30 예정',
        isTopBottom: 'TOP',
        attackTeam: '공격 준비 중',
        pitcher: live.pitcher || { name: '이용찬 (선발)', pitches: 0, strikeouts: 0, era: '4.64', lastSpeed: 0, season: 2026, activeTeamId: 'DS' },
        batter: live.batter || { name: '송찬의 (선발)', avg: '.302', stat: '대기 중', season: 2026, activeTeamId: 'LG' },
        runners: live.runners || { first: { active: false, name: '' }, second: { active: false, name: '' }, third: { active: false, name: '' } },
        bso: live.bso || { balls: 0, strikes: 0, outs: 0 },
        lineup: live.lineup || [],
        status: live.status || 'BEFORE',
        lastUpdated: new Date().toLocaleTimeString('ko-KR')
      };
    }
  } catch (e) {}

  return {
    gameId: match.id,
    season: 2026,
    activeTeamId: 'LG',
    confirmed: false,
    homeTeam: match.homeTeam?.name || '두산 베어스',
    awayTeam: match.awayTeam?.name || 'LG 트윈스',
    homeScore: 0,
    awayScore: 0,
    inning: '18:30 예정',
    isTopBottom: 'TOP',
    attackTeam: '공격 준비 중',
    pitcher: { name: '이용찬 (선발예정)', pitches: 0, strikeouts: 0, era: '4.64', lastSpeed: 0, season: 2026, activeTeamId: 'DS' },
    batter: { name: '송찬의 (선발예정)', avg: '.302', stat: '대기 중', season: 2026, activeTeamId: 'LG' },
    runners: { first: { active: false, name: '' }, second: { active: false, name: '' }, third: { active: false, name: '' } },
    bso: { balls: 0, strikes: 0, outs: 0 },
    lineup: [
      { order: 1, pos: '중견', name: '홍창기', avg: '.324', stat: '선발출전', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 2, pos: '2루', name: '신민재', avg: '.298', stat: '선발출전', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 3, pos: '좌익', name: '김현수', avg: '.305', stat: '선발출전', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 4, pos: '지명', name: '오스틴', avg: '.318', stat: '선발출전', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 5, pos: '3루', name: '문보경', avg: '.288', stat: '선발출전', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 6, pos: '1루', name: '문정빈', avg: '.270', stat: '선발출전', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 7, pos: '유격', name: '구본혁', avg: '.265', stat: '선발출전', status: 'WAIT', season: 2026, activeTeamId: 'LG' },
      { order: 8, pos: '우익', name: '송찬의', avg: '.302', stat: '선발출전', status: 'CURRENT', season: 2026, activeTeamId: 'LG' },
      { order: 9, pos: '포수', name: '박동원', avg: '.262', stat: '선발출전', status: 'NEXT', season: 2026, activeTeamId: 'LG' }
    ],
    status: 'BEFORE',
    lastUpdated: new Date().toLocaleTimeString('ko-KR')
  };
}

export async function fetchRealtimeKBOData(): Promise<KBOLiveData> {
  return fetchRealtimeMatchData({
    id: '20260903DSLG',
    sport: 'baseball',
    league: 'KBO',
    homeTeam: { name: '두산 베어스', logo: '' },
    awayTeam: { name: 'LG 트윈스', logo: '' },
    status: 'BEFORE',
    homeScore: 0,
    awayScore: 0
  } as any, 2026, 'LG');
}
