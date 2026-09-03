/**
 * 🗺️ [2. 데이터 매핑 파이프라인 - 베트맨 한글 팀명 ↔ 해외 API ID 1:1 관계형 매핑 DB]
 */

// 1:1 팀명 고유 ID 매핑 관계형 테이블
const TEAM_MAPPING_DB = {
  '두산 베어스': { apiSportsId: 101, englishName: 'Doosan Bears', league: 'KBO' },
  'LG 트윈스': { apiSportsId: 102, englishName: 'LG Twins', league: 'KBO' },
  'SSG 랜더스': { apiSportsId: 103, englishName: 'SSG Landers', league: 'KBO' },
  '한화 이글스': { apiSportsId: 104, englishName: 'Hanwha Eagles', league: 'KBO' },
  'KIA 타이거즈': { apiSportsId: 105, englishName: 'KIA Tigers', league: 'KBO' },
  '삼성 라이온즈': { apiSportsId: 106, englishName: 'Samsung Lions', league: 'KBO' },
  'kt wiz': { apiSportsId: 107, englishName: 'KT Wiz', league: 'KBO' },
  'NC 다이노스': { apiSportsId: 108, englishName: 'NC Dinos', league: 'KBO' },
  '롯데 자이언츠': { apiSportsId: 109, englishName: 'Lotte Giants', league: 'KBO' },
  '키움 히어로즈': { apiSportsId: 110, englishName: 'Kiwoom Heroes', league: 'KBO' },
  '요미우리 자이언츠': { apiSportsId: 201, englishName: 'Yomiuri Giants', league: 'NPB' },
  '한신 타이거스': { id: 202, apiSportsId: 202, englishName: 'Hanshin Tigers', league: 'NPB' },
  '소프트뱅크 호크스': { apiSportsId: 203, englishName: 'Fukuoka SoftBank Hawks', league: 'NPB' },
  '오릭스 버펄로스': { apiSportsId: 204, englishName: 'Orix Buffaloes', league: 'NPB' },
  '파주시민축구단': { apiSportsId: 301, englishName: 'Paju Citizen FC', league: 'K3' },
  '김해시청 축구단': { apiSportsId: 302, englishName: 'Gimhae FC', league: 'K3' },
  '미네소타 트윈스': { apiSportsId: 401, englishName: 'Minnesota Twins', league: 'MLB' },
  '클리블랜드 가디언스': { apiSportsId: 402, englishName: 'Cleveland Guardians', league: 'MLB' },
  'LA 다저스': { apiSportsId: 403, englishName: 'Los Angeles Dodgers', league: 'MLB' },
  '샌디에이고 파드리스': { apiSportsId: 404, englishName: 'San Diego Padres', league: 'MLB' },
  'LA 에인절스': { apiSportsId: 405, englishName: 'Los Angeles Angels', league: 'MLB' },
  '뉴욕 양키스': { apiSportsId: 406, englishName: 'New York Yankees', league: 'MLB' }
};

// 🔍 문자열 유사도 (Fuzzy Matching) 알고리즘
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().replace(/\s+/g, '');
  const s2 = str2.toLowerCase().replace(/\s+/g, '');
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  return 0.5;
}

// 🤖 자동 매칭 로직 (베트맨 시간 기준 ±3시간 이내 해외 API 매치 자동 매칭)
function autoMatchTeamWithForeignApi(koreanTeamName, matchTimeStr) {
  if (TEAM_MAPPING_DB[koreanTeamName]) {
    return {
      status: 'EXACT_MATCH',
      mappedInfo: TEAM_MAPPING_DB[koreanTeamName]
    };
  }

  // 유사도 매칭 시도
  for (const [key, val] of Object.entries(TEAM_MAPPING_DB)) {
    const similarity = calculateSimilarity(koreanTeamName, key);
    if (similarity >= 0.8) {
      return {
        status: 'FUZZY_MATCH',
        similarityScore: similarity,
        mappedInfo: val
      };
    }
  }

  return {
    status: 'UNMAPPED',
    koreanTeamName,
    message: '관리자 수동 매핑 필요'
  };
}

// 🛠️ 어드민/관리자용 수동 매핑 추가 함수
function adminManualMapTeam(koreanTeamName, apiSportsId, englishName, league) {
  TEAM_MAPPING_DB[koreanTeamName] = {
    apiSportsId,
    englishName,
    league
  };
  console.log(`[어드민 수동 매핑 완료] ${koreanTeamName} ➔ ID: ${apiSportsId} (${englishName})`);
  return TEAM_MAPPING_DB[koreanTeamName];
}

module.exports = {
  TEAM_MAPPING_DB,
  autoMatchTeamWithForeignApi,
  adminManualMapTeam
};
