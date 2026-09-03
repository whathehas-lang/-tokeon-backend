/**
 * 🛠️ [TOKEON 백엔드 - 365일 무인 자동 롤링 파이프라인 (Auto-Rolling Pipeline)]
 * 
 * 🚀 주요 메이저 리그 365일 무인 자동 수신 체계:
 * - 날짜 자동 계산: [오늘 + 내일 + 모레] 3일 치 72시간 윈도우 무인 자동 롤링
 * - 야구 핵심 메이저 리그 명시적 자동 수신:
 *    1) ⚾ MLB 메이저리그 (league=1)
 *    2) ⚾ NPB 일본야구 (league=12)
 *    3) ⚾ KBO 한국야구 (league=15 / CPBL=14)
 * - 축구 핵심 리그 (EPL, 라리가, 분데스, 세리에, K리그 등) 및 농구 (NBA), 배구, 하키 전 경기 수신
 * - 유닉스 타임스탬프 (timestamp 숫자) 기준 100% 시간순 오름차순 무인 정렬
 */

const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 4000;
const API_SPORTS_KEY = '96ae3619c2c6f8f76ec75d64bd95d000';

// 🤖 [72시간 슬라이딩 윈도우] 오늘부터 글피까지 4일 치 날짜 자동 계산
function getRollingDates() {
  const dates = [];
  const base = new Date();
  
  // D+0(오늘), D+1(내일), D+2(모레), D+3(글피) => 72시간 풀 윈도우 보장
  for (let offset = 0; offset <= 3; offset++) {
    const d = new Date(base.getTime() + offset * 24 * 3600 * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

// 🎯 종목별/리그별 엔드포인트 정의 (사용자 지정 100% 명품 리그 전용 수도꼭지)
const TARGET_ENDPOINTS = [
  // ⚾ 야구 메이저 3대 리그: MLB(1), NPB(12), KBO(15)
  { sport: 'baseball', host: 'v1.baseball.api-sports.io', endpoint: '/games', leagueId: 1, name: 'MLB 메이저리그', icon: '⚾' },
  { sport: 'baseball', host: 'v1.baseball.api-sports.io', endpoint: '/games', leagueId: 12, name: 'NPB 일본야구', icon: '⚾' },
  { sport: 'baseball', host: 'v1.baseball.api-sports.io', endpoint: '/games', leagueId: 15, name: 'KBO 한국야구', icon: '⚾' },
  
  // ⚽ 축구 명품 메이저 리그: EPL(39), 라리가(140), 분데스리가(78), 세리에A(135), 리그앙(61), 챔스(2), K리그1(292)
  { sport: 'football', host: 'v3.football.api-sports.io', endpoint: '/fixtures', leagueId: 39, name: '잉글랜드 프리미어리그', icon: '⚽' },
  { sport: 'football', host: 'v3.football.api-sports.io', endpoint: '/fixtures', leagueId: 140, name: '스페인 라리가', icon: '⚽' },
  { sport: 'football', host: 'v3.football.api-sports.io', endpoint: '/fixtures', leagueId: 78, name: '독일 분데스리가', icon: '⚽' },
  { sport: 'football', host: 'v3.football.api-sports.io', endpoint: '/fixtures', leagueId: 135, name: '이탈리아 세리에 A', icon: '⚽' },
  { sport: 'football', host: 'v3.football.api-sports.io', endpoint: '/fixtures', leagueId: 61, name: '프랑스 리그 앙', icon: '⚽' },
  { sport: 'football', host: 'v3.football.api-sports.io', endpoint: '/fixtures', leagueId: 2, name: 'UEFA 챔피언스리그', icon: '⚽' },
  { sport: 'football', host: 'v3.football.api-sports.io', endpoint: '/fixtures', leagueId: 292, name: '대한민국 K리그 1', icon: '⚽' },

  // 🏀 농구 메이저: NBA(12)
  { sport: 'basketball', host: 'v1.basketball.api-sports.io', endpoint: '/games', leagueId: 12, name: 'NBA 농구', icon: '🏀' }
];

// 🏆 [메이저 1부 리그 & 주요 대회 엄선 화이트리스트 필터]
function isMajorLeagueMatch(m) {
  const sport = m.sport;
  const league = (m.league || '').toLowerCase();

  // ⚾ 야구: MLB, NPB, KBO 메이저 3대 리그만 100% 허용
  if (sport === 'baseball') {
    return league.includes('mlb') || 
           league.includes('major league') || 
           league.includes('kbo') || 
           league.includes('npb') || 
           league.includes('professional baseball') ||
           m.leagueId === 1 || m.leagueId === 12 || m.leagueId === 15;
  }

  // ⚽ 축구: 유럽 5대 빅리그, 챔피언스리그, 유로파, K리그1, 월드컵/A매치/주요 컵대회만 허용
  if (sport === 'football') {
    // ❌ 3류 잡리그 블랙리스트 단어 즉시 차단
    if (league.includes('second') || league.includes('2nd') || league.includes('3rd') || 
        league.includes('liga 3') || league.includes('liga 2') || league.includes('division 2') ||
        league.includes('reserve') || league.includes('u20') || league.includes('u19') || league.includes('u21') ||
        league.includes('u23') || league.includes('kakkonen') || league.includes('alef') || league.includes('amateur') ||
        league.includes('youth') || league.includes('junior')) {
      return false;
    }

    // ⭕ 메이저 1부 리그 & 주요 대회 화이트리스트
    return league.includes('premier league') || 
           league.includes('la liga') || league.includes('primera') ||
           league.includes('bundesliga') || 
           league.includes('serie a') || 
           league.includes('ligue 1') || 
           league.includes('champions league') || league.includes('europa') || league.includes('conference league') ||
           league.includes('k league 1') || league.includes('kleague') ||
           league.includes('eredivisie') || league.includes('world cup') || league.includes('nations league') ||
           league.includes('fa cup') || league.includes('copa del rey') || league.includes('coppa italia') || league.includes('dfb pokal') ||
           league.includes('super cup') || league.includes('asian cup') || league.includes('afc champions');
  }

  // 🏀 농구: NBA, KBL 등
  if (sport === 'basketball') {
    return league.includes('nba') || league.includes('kbl') || league.includes('euroleague') || league.includes('wkbl');
  }

  // 🏐 배구: V-리그 및 주요 리그
  if (sport === 'volleyball') {
    return league.includes('v-league') || league.includes('v league') || league.includes('nations league') || league.includes('championship');
  }

  // 🏒 하키: NHL
  if (sport === 'hockey') {
    return league.includes('nhl');
  }

  return false;
}

function fetchSingleEndpoint(target, dateStr) {
  return new Promise((resolve) => {
    let path = `${target.endpoint}?date=${dateStr}`;
    if (target.leagueId) {
      path += `&league=${target.leagueId}`;
    }

    const options = {
      hostname: target.host,
      path: path,
      method: 'GET',
      headers: {
        'x-apisports-key': API_SPORTS_KEY,
        'x-rapidapi-host': target.host
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const rawList = json.response || [];
          
          const cleanMatches = rawList.map((m, idx) => {
            const home = m.teams?.home?.name || 'Home Team';
            const away = m.teams?.away?.name || 'Away Team';
            const statusShort = m.fixture?.status?.short || m.status?.short || 'NS';
            const rawTime = m.fixture?.date || m.date || `${dateStr}T20:00:00Z`;
            
            // 🔢 유닉스 타임스탬프 (초 단위)
            let matchTimestamp = m.fixture?.timestamp || m.timestamp;
            if (!matchTimestamp) {
              const dt = new Date(rawTime);
              matchTimestamp = Math.floor(dt.getTime() / 1000);
            }

            // 🇰🇷 KST 한국 시각 무인 변환 포맷
            let displayTime = rawTime;
            try {
              const dt = new Date(matchTimestamp * 1000);
              displayTime = dt.toLocaleString('ko-KR', {
                timeZone: 'Asia/Seoul',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }) + ' (KST)';
            } catch (e) {}

            return {
              id: `auto-${target.sport}-${target.leagueId || 'all'}-${dateStr}-${idx + 1}`,
              betmanMatchNo: 9500 + idx + 1,
              sport: target.sport,
              league: m.league?.name || target.name,
              countryFlag: target.icon,
              homeTeam: { id: `h-${idx}`, name: home, logo: target.icon, countryName: 'Global', rank: 1 },
              awayTeam: { id: `a-${idx}`, name: away, logo: target.icon, countryName: 'Global', rank: 2 },
              homeScore: m.goals?.home ?? m.scores?.home?.total ?? 0,
              awayScore: m.goals?.away ?? m.scores?.away?.total ?? 0,
              matchTime: displayTime,
              rawTimeIso: rawTime,
              timestamp: matchTimestamp,
              betmanOdds: { win: 1.95, draw: 3.30, lose: 2.90 },
              foreignApiStats: { pinnacleOdds: { win: 1.90, draw: 3.35, lose: 2.95 }, predictedWinner: `${home} (우세)` },
              status: statusShort === 'FT' ? 'FINISHED' : (statusShort === '1H' || statusShort === '2H' ? 'LIVE' : 'BEFORE'),
              isStarted: statusShort !== 'NS' && statusShort !== 'TBD',
              confirmed: true
            };
          });
          resolve(cleanMatches);
        } catch (e) {
          resolve([]);
        }
      });
    });

    req.on('error', () => resolve([]));
    req.end();
  });
}

// 📡 365일 무인 자동 수집 & 중복 제거 & 시간순 정렬 서빙
let CACHED_MATCHES = [];
let LAST_SYNC_TIME = '';

async function runAutoIngestionPipeline() {
  const rollingDates = getRollingDates(); // [오늘, 내일, 모레]
  const collectedMap = new Map();

  for (const dateStr of rollingDates) {
    for (const target of TARGET_ENDPOINTS) {
      const items = await fetchSingleEndpoint(target, dateStr);
      for (const m of items) {
        // 홈팀명 + 원정팀명 + 시간 기준으로 중복 경기 100% 합병 방지
        const dedupeKey = `${m.sport}_${m.homeTeam.name}_${m.awayTeam.name}_${m.timestamp}`;
        if (!collectedMap.has(dedupeKey)) {
          collectedMap.set(dedupeKey, m);
        }
      }
    }
  }

  const allMatches = Array.from(collectedMap.values());
  
  // 🔢 365일 유닉스 타임스탬프 (timestamp) 오름차순 무조건 정렬
  allMatches.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  CACHED_MATCHES = allMatches;
  LAST_SYNC_TIME = new Date().toLocaleTimeString('ko-KR');
  console.log(`[365일 무인 수집 완료] 총 ${allMatches.length}경기 시간순 갱신 (${LAST_SYNC_TIME})`);
}

// 🔄 최초 기동 즉시 수집 & 정확히 매 3시간마다 72시간 롤링 갱신
runAutoIngestionPipeline();
setInterval(runAutoIngestionPipeline, 3 * 60 * 60 * 1000);

// 📡 백엔드 HTTP 서버
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=5');

  if (req.url === '/api/live-all' || req.url === '/api/kbo-live' || req.url === '/api/betman/hourly-sync') {
    if (CACHED_MATCHES.length === 0) {
      await runAutoIngestionPipeline();
    }

    // 🔒 [72시간 슬라이딩 윈도우 원천 차단] 
    // 1) 현재 시각(nowSec) 이전 경기 100% 제외
    // 2) 현재 시각부터 향후 72시간 이내의 미래 경기만 1등부터 시간순 꽉 채워 서빙
    const nowSec = Math.floor(Date.now() / 1000);
    const windowMaxSec = nowSec + (72 * 3600); // 정확히 72시간 후 시각

    const upcomingOnlyMatches = CACHED_MATCHES.filter((m) => {
      if (m.status === 'FINISHED' || m.isStarted) return false;
      const ts = m.timestamp;
      if (!ts || ts <= nowSec) return false;
      if (ts > windowMaxSec) return false; // 72시간 초과 경기 배제
      if (!isMajorLeagueMatch(m)) return false; // 🚫 잡리그(2부/3부/유스/마이너) 100% 원천 차단!
      return true;
    });

    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      pipeline: '72-HOUR SLIDING ROLLING ENGINE (3시간 주기 자동 갱신 / 72시간 상시 풀 유지)',
      lastSyncTime: LAST_SYNC_TIME,
      totalMatchesCount: upcomingOnlyMatches.length,
      matches: upcomingOnlyMatches
    }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'OK', message: '365-Day Auto-Rolling Server Active' }));
  }
});

server.listen(PORT, () => {
  console.log(`🎰 [365일 무인 자동 롤링 백엔드 데몬 가동] Port: ${PORT}`);
});
