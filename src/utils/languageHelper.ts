export type AppLanguage = 'ko' | 'en' | 'ja';

// 팀명 한/영/일 사전
export const TEAM_NAME_DICT: Record<string, { en: string; ja: string; ko: string }> = {
  // MLB
  'LA 에인절스': { ko: 'LA 에인절스', en: 'LA Angels', ja: 'LAエンゼルス' },
  '뉴욕 양키스': { ko: '뉴욕 양키스', en: 'NY Yankees', ja: 'NYヤン키ース' },
  'LA 다저스': { ko: 'LA 다저스', en: 'LA Dodgers', ja: 'LAドジャース' },
  '샌프란시스코': { ko: '샌프란시스코', en: 'San Francisco', ja: 'サンフランシスコ' },
  '보스턴': { ko: '보스턴', en: 'Boston Red Sox', ja: 'ボストン' },
  '휴스턴': { ko: '휴스턴', en: 'Houston Astros', ja: 'ヒューストン' },
  '샌디에이고': { ko: '샌디에이고', en: 'San Diego Padres', ja: 'サンディエゴ' },
  '토론토': { ko: '토론토', en: 'Toronto Blue Jays', ja: 'トロント' },
  '텍사스': { ko: '텍사스', en: 'Texas Rangers', ja: 'テキサス' },
  '필라델피아': { ko: '필라델피아', en: 'Philadelphia Phillies', ja: 'フィラデルフィア' },
  '애틀랜타': { ko: '애틀랜타', en: 'Atlanta Braves', ja: 'アトランタ' },
  '시카고 컵스': { ko: '시카고 컵스', en: 'Chicago Cubs', ja: 'シカゴ・カブス' },
  '시카고 화이트삭스': { ko: '시카고 화이트삭스', en: 'Chicago White Sox', ja: 'ホワイトソックス' },
  '볼티모어': { ko: '볼티모어', en: 'Baltimore Orioles', ja: 'ボルチモア' },
  '탬파베이': { ko: '탬파베이', en: 'Tampa Bay Rays', ja: 'タンパベイ' },
  '미네소타': { ko: '미네소타', en: 'Minnesota Twins', ja: 'ミネソタ' },
  '디트로이트': { ko: '디트로이트', en: 'Detroit Tigers', ja: 'デトロイト' },
  '클리블랜드': { ko: '클리블랜드', en: 'Cleveland Guardians', ja: 'クリーブランド' },
  '캔자스시티': { ko: '캔자스시티', en: 'Kansas City Royals', ja: 'カンザスシティ' },
  '밀워키': { ko: '밀워키', en: 'Milwaukee Brewers', ja: 'ミルウォーキー' },
  '세인트루이스': { ko: '세인트루이스', en: 'St. Louis Cardinals', ja: 'セントルイス' },
  '신시내티': { ko: '신시내티', en: 'Cincinnati Reds', ja: 'シンシナティ' },
  '피츠버그': { ko: '피츠버그', en: 'Pittsburgh Pirates', ja: 'ピッツバーグ' },
  '애리조나': { ko: '애리조나', en: 'Arizona D-backs', ja: 'アリゾナ' },
  '콜로라도': { ko: '콜로라도', en: 'Colorado Rockies', ja: 'コロラド' },
  '시애틀': { ko: '시애틀', en: 'Seattle Mariners', ja: 'シアトル' },
  '오클랜드': { ko: '오클랜드', en: 'Oakland Athletics', ja: 'オークランド' },
  '워싱턴': { ko: '워싱턴', en: 'Washington Nationals', ja: 'ワシントン' },
  '마이애미': { ko: '마이애미', en: 'Miami Marlins', ja: 'マイアミ' },
  '뉴욕 메츠': { ko: '뉴욕 메츠', en: 'NY Mets', ja: 'NYメッツ' },

  // KBO
  '삼성 라이온즈': { ko: '삼성 라이온즈', en: 'Samsung Lions', ja: 'サムスン・ライオンズ' },
  'KIA 타이거즈': { ko: 'KIA 타이거즈', en: 'KIA Tigers', ja: 'KIAタイガース' },
  'LG 트윈스': { ko: 'LG 트윈스', en: 'LG Twins', ja: 'LGツインズ' },
  '두산 베어스': { ko: '두산 베어스', en: 'Doosan Bears', ja: 'トゥサン・ベアーズ' },
  'KT 위즈': { ko: 'KT 위즈', en: 'KT Wiz', ja: 'KTウィズ' },
  'SSG 랜더스': { ko: 'SSG 랜더스', en: 'SSG Landers', ja: 'SSGランダース' },
  '한화 이글스': { ko: '한화 이글스', en: 'Hanwha Eagles', ja: 'ハンファ・イーグルス' },
  '롯데 자이언츠': { ko: '롯데 자이언츠', en: 'Lotte Giants', ja: 'ロッテ・ジャイアンツ' },
  'NC 다이노스': { ko: 'NC 다이노스', en: 'NC Dinos', ja: 'NCダイノス' },
  '키움 히어로즈': { ko: '키움 히어로즈', en: 'Kiwoom Heroes', ja: 'キウム・ヒーローズ' },

  // NPB
  '요미우리': { ko: '요미우리', en: 'Yomiuri Giants', ja: '読売ジャイアンツ' },
  '한신': { ko: '한신', en: 'Hanshin Tigers', ja: '阪神タイガース' },
  '소프트뱅크': { ko: '소프트뱅크', en: 'SoftBank Hawks', ja: 'ソフトバンク' },
  '오릭스': { ko: '오릭스', en: 'Orix Buffaloes', ja: 'オリックス' },
  '요코하마': { ko: '요코하마', en: 'DeNA BayStars', ja: '横浜DeNA' },
  '히로시마': { ko: '히로시마', en: 'Hiroshima Carp', ja: '広島東洋カープ' },
  '야쿠르트': { ko: '야쿠르트', en: 'Yakult Swallows', ja: '東京ヤクルト' },
  '주니치': { ko: '주니치', en: 'Chunichi Dragons', ja: '中日ドラゴンズ' },
  '지바롯데': { ko: '지바롯데', en: 'Chiba Lotte Marines', ja: '千葉ロッテ' },
  '라쿠텐': { ko: '라쿠텐', en: 'Tohoku Rakuten', ja: '東北楽天' },
  '세이부': { ko: '세이부', en: 'Saitama Seibu Lions', ja: '埼玉西武' },
  '니혼햄': { ko: '니혼햄', en: 'Nippon-Ham Fighters', ja: '日本ハム' },

  // Soccer
  '맨체스터 시티': { ko: '맨체스터 시티', en: 'Man City', ja: 'マンチェスター・C' },
  '아스널': { ko: '아스널', en: 'Arsenal', ja: 'アーセナル' },
  '리버풀': { ko: '리버풀', en: 'Liverpool', ja: 'リヴァプール' },
  '레알 마드리드': { ko: '레알 마드리드', en: 'Real Madrid', ja: 'レアル・マドリード' },
  '바르셀로나': { ko: '바르셀로나', en: 'Barcelona', ja: 'バルセロナ' },
  '바이에른 뮌헨': { ko: '바이에른 뮌헨', en: 'Bayern Munich', ja: 'バイエルン' },
  '파리 생제르맹': { ko: '파리 생제르맹', en: 'PSG', ja: 'PSG' },
  '토트넘': { ko: '토트넘', en: 'Tottenham', ja: 'トッテナム' }
};

export const getLocalizedTeamName = (rawName: string, lang: AppLanguage): string => {
  if (!rawName) return '';
  const trimmed = rawName.trim();
  const dict = TEAM_NAME_DICT[trimmed];
  if (dict) {
    return dict[lang] || dict.ko;
  }
  for (const [key, val] of Object.entries(TEAM_NAME_DICT)) {
    if (trimmed.includes(key) || key.includes(trimmed)) {
      return val[lang] || val.ko;
    }
  }
  return trimmed;
};

export const UI_TEXT_DICT: Record<string, Record<AppLanguage, string>> = {
  live_matches: { ko: '실시간 경기', en: 'Live Matches', ja: 'ライブ試合' },
  matches_count: { ko: '경기', en: 'Matches', ja: '試合' },
  home_team: { ko: '홈', en: 'Home', ja: 'ホーム' },
  away_team: { ko: '원정', en: 'Away', ja: 'アウェイ' },
  starter_label: { ko: '선발', en: 'Starter', ja: '先発' },
  login: { ko: '로그인', en: 'Sign In', ja: 'ログイン' },
  logout: { ko: '로그아웃', en: 'Sign Out', ja: 'ログアウト' },
  signup: { ko: '무료가입', en: 'Join Free', ja: '無料登録' },
  realtime_chat: { ko: '실시간 채팅방', en: 'Live Chat', ja: 'ライブチャット' },
  sports_blog: { ko: '스포츠 분석 블로그', en: 'Sports Analysis Blog', ja: 'スポーツ分析ブログ' },
  more_matches: { ko: '경기 더보기', en: 'Load More', ja: 'もっと見る' },
  tab_all: { ko: '전체', en: 'All', ja: '全体' },
  tab_football: { ko: '축구', en: 'Football', ja: 'サッカー' },
  tab_baseball: { ko: '야구', en: 'Baseball', ja: '野球' },
  tab_basketball: { ko: '농구', en: 'Basketball', ja: 'バスケ' },
  tab_volleyball: { ko: '배구', en: 'Volleyball', ja: 'バレー' },
  tab_hockey: { ko: '하키', en: 'Hockey', ja: 'ホッケー' },
  tab_seungmubae: { ko: '승무패', en: 'W/D/L (14)', ja: '勝分敗 (14)' },
  tab_seung1pae: { ko: '승1패', en: 'W/1/L (14)', ja: '勝1敗 (14)' },
  tab_seung5pae: { ko: '승5패', en: 'W/5/L (14)', ja: '勝5敗 (14)' }
};

export const getUiText = (key: string, lang: AppLanguage): string => {
  return UI_TEXT_DICT[key]?.[lang] || key;
};
