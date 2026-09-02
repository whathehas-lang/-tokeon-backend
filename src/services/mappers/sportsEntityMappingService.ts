/**
 * 🗺️ SportsEntityMappingService (Entity Mapping Engine)
 * 외부 데이터원(KBO/NPB 크롤러, MLB Stats API, 배트맨 슬립)의 팀/선수명을
 * API-Sports의 고유 DB ID와 1:1로 완벽하게 연결하고 정규화하는 데이터 매핑 계층
 */

export interface TeamEntity {
  apiTeamId: number;
  mlbStatsId?: number;
  nameKo: string;
  nameEn: string;
  aliases: string[];
  league: 'KBO' | 'NPB' | 'MLB' | 'EPL' | 'LA_LIGA' | 'SERIE_A' | 'K_LEAGUE' | 'OTHER';
  logo: string;
}

export interface PlayerEntity {
  apiPlayerId: number;
  teamId: number;
  nameKo: string;
  nameEn: string;
  aliases: string[];
  position: 'P' | 'C' | 'IF' | 'OF' | 'DH';
  throwsHand: 'R' | 'L';
  jerseyNumber: number;
}

// 1. 구단 1:1 엔터티 매핑 테이블 (Team ID Mapping Table)
export const TEAM_ENTITY_TABLE: TeamEntity[] = [
  // === EPL (잉글랜드 프리미어리그) ===
  { apiTeamId: 42, nameKo: '아스널', nameEn: 'Arsenal', aliases: ['아스날', 'Arsenal', 'ARS', '아스널FC'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/42.png' },
  { apiTeamId: 49, nameKo: '첼시', nameEn: 'Chelsea', aliases: ['첼시', 'Chelsea', 'CHE', '첼시FC'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/49.png' },
  { apiTeamId: 50, nameKo: '맨체스터 시티', nameEn: 'Manchester City', aliases: ['맨시티', 'Man City', 'MCI', '맨체스터시티', '맨체스C'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/50.png' },
  { apiTeamId: 40, nameKo: '리버풀', nameEn: 'Liverpool', aliases: ['리버풀', 'Liverpool', 'LIV', '리버풀FC'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/40.png' },
  { apiTeamId: 47, nameKo: '토트넘', nameEn: 'Tottenham Hotspur', aliases: ['토트넘', 'Tottenham', 'TOT', '토트넘홋스퍼', '스퍼스'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/47.png' },
  { apiTeamId: 33, nameKo: '맨체스터 유나이티드', nameEn: 'Manchester United', aliases: ['맨유', 'Man United', 'MUN', '맨체스터유나이티드', '맨체스U'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/33.png' },
  { apiTeamId: 66, nameKo: '애스턴 빌라', nameEn: 'Aston Villa', aliases: ['아스톤빌라', 'Aston Villa', 'AVL', '애스턴빌라', 'A빌라', '애스턴V'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/66.png' },
  { apiTeamId: 34, nameKo: '뉴캐슬', nameEn: 'Newcastle', aliases: ['뉴캐슬', 'Newcastle', 'NEW', '뉴캐슬유나이티드'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/34.png' },
  { apiTeamId: 51, nameKo: '브라이튼', nameEn: 'Brighton', aliases: ['브라이튼', 'Brighton', 'BHA', '브라이턴'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/51.png' },
  { apiTeamId: 48, nameKo: '웨스트햄', nameEn: 'West Ham', aliases: ['웨스트햄', 'West Ham', 'WHU', '웨스트햄유나이티드'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/48.png' },
  { apiTeamId: 39, nameKo: '울버햄튼', nameEn: 'Wolves', aliases: ['울버햄튼', 'Wolves', 'WOL', '울브스', '울버햄프턴'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/39.png' },
  { apiTeamId: 52, nameKo: '크리스탈 팰리스', nameEn: 'Crystal Palace', aliases: ['크리스탈팰리스', 'Crystal Palace', 'CRY', '팰리스'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/52.png' },
  { apiTeamId: 45, nameKo: '에버턴', nameEn: 'Everton', aliases: ['에버튼', 'Everton', 'EVE', '에버턴FC'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/45.png' },
  { apiTeamId: 55, nameKo: '브렌트포드', nameEn: 'Brentford', aliases: ['브렌트포드', 'Brentford', 'BRE', '브렌트퍼드'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/55.png' },
  { apiTeamId: 36, nameKo: '풀럼', nameEn: 'Fulham', aliases: ['풀럼', 'Fulham', 'FUL', '풀럼FC'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/36.png' },

  // === LA LIGA (스페인 라리가) ===
  { apiTeamId: 541, nameKo: '레알 마드리드', nameEn: 'Real Madrid', aliases: ['레알', 'Real Madrid', 'RMA', '레알마드리드'], league: 'LA_LIGA', logo: 'https://media.api-sports.io/football/teams/541.png' },
  { apiTeamId: 529, nameKo: '바르셀로나', nameEn: 'Barcelona', aliases: ['바르샤', 'Barcelona', 'BAR', '바르셀로나', '바르셀로'], league: 'LA_LIGA', logo: 'https://media.api-sports.io/football/teams/529.png' },
  { apiTeamId: 530, nameKo: 'AT 마드리드', nameEn: 'Atletico Madrid', aliases: ['아틀레티코', 'Atletico Madrid', 'ATM', 'AT마드리드', '아틀레티코마드리드'], league: 'LA_LIGA', logo: 'https://media.api-sports.io/football/teams/530.png' },
  { apiTeamId: 533, nameKo: '비야레알', nameEn: 'Villarreal', aliases: ['비야레알', 'Villarreal', 'VIL'], league: 'LA_LIGA', logo: 'https://media.api-sports.io/football/teams/533.png' },
  { apiTeamId: 548, nameKo: '레알 소시에다드', nameEn: 'Real Sociedad', aliases: ['소시에다드', 'Real Sociedad', 'RSO', '레알소시에다드'], league: 'LA_LIGA', logo: 'https://media.api-sports.io/football/teams/548.png' },

  // === SERIE A (이탈리아 세리에 A) ===
  { apiTeamId: 505, nameKo: '인터 밀란', nameEn: 'Inter', aliases: ['인테르', 'Inter', 'INT', '인터밀란', 'FC인터밀란'], league: 'SERIE_A', logo: 'https://media.api-sports.io/football/teams/505.png' },
  { apiTeamId: 489, nameKo: 'AC 밀란', nameEn: 'AC Milan', aliases: ['밀란', 'AC Milan', 'MIL', 'AC밀란'], league: 'SERIE_A', logo: 'https://media.api-sports.io/football/teams/489.png' },
  { apiTeamId: 496, nameKo: '유벤투스', nameEn: 'Juventus', aliases: ['유베', 'Juventus', 'JUV', '유벤투스FC'], league: 'SERIE_A', logo: 'https://media.api-sports.io/football/teams/496.png' },
  { apiTeamId: 492, nameKo: '나폴리', nameEn: 'Napoli', aliases: ['나폴리', 'Napoli', 'NAP', 'SSC나폴리'], league: 'SERIE_A', logo: 'https://media.api-sports.io/football/teams/492.png' },
  { apiTeamId: 497, nameKo: 'AS 로마', nameEn: 'AS Roma', aliases: ['로마', 'AS Roma', 'ROM', 'AS로마'], league: 'SERIE_A', logo: 'https://media.api-sports.io/football/teams/497.png' },

  // === CHAMPIONSHIP (잉글랜드 챔피언십 24개 구단) ===
  { apiTeamId: 1379, nameKo: '링컨 시티', nameEn: 'Lincoln', aliases: ['링컨', '링컨시티', 'Lincoln', 'Lincoln City'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/1379.png' },
  { apiTeamId: 67, nameKo: '블랙번 로버스', nameEn: 'Blackburn', aliases: ['블랙번', '블랙번로버스', 'Blackburn', 'Blackburn Rovers'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/67.png' },
  { apiTeamId: 1355, nameKo: '포츠머스', nameEn: 'Portsmouth', aliases: ['포츠머스', 'Portsmouth', '폼피'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/1355.png' },
  { apiTeamId: 69, nameKo: '더비 카운티', nameEn: 'Derby', aliases: ['더비', '더비카운티', 'Derby', 'Derby County'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/69.png' },
  { apiTeamId: 63, nameKo: '리즈 유나이티드', nameEn: 'Leeds', aliases: ['리즈', '리즈유나이티드', 'Leeds', 'Leeds United'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/63.png' },
  { apiTeamId: 71, nameKo: '노리치 시티', nameEn: 'Norwich', aliases: ['노리치', '노리치시티', 'Norwich', 'Norwich City'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/71.png' },
  { apiTeamId: 44, nameKo: '번리', nameEn: 'Burnley', aliases: ['번리', 'Burnley', '번리FC'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/44.png' },
  { apiTeamId: 62, nameKo: '셰필드 유나이티드', nameEn: 'Sheffield Utd', aliases: ['셰필드', '셰필드U', 'Sheffield Utd', 'Sheffield United'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/62.png' },
  { apiTeamId: 75, nameKo: '스토크 시티', nameEn: 'Stoke City', aliases: ['스토크', '스토크시티', 'Stoke', 'Stoke City'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/75.png' },
  { apiTeamId: 746, nameKo: '선덜랜드', nameEn: 'Sunderland', aliases: ['선덜랜드', 'Sunderland'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/746.png' },
  { apiTeamId: 38, nameKo: '왓포드', nameEn: 'Watford', aliases: ['왓포드', 'Watford', '왓포드FC'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/38.png' },
  { apiTeamId: 60, nameKo: '웨스트 브롬위치', nameEn: 'West Brom', aliases: ['웨스트브롬', '웨스트브롬위치', 'WBA', 'West Brom'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/60.png' },
  { apiTeamId: 70, nameKo: '미들즈브러', nameEn: 'Middlesbrough', aliases: ['미들즈브러', 'Middlesbrough', '보로'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/70.png' },
  { apiTeamId: 76, nameKo: '스완지 시티', nameEn: 'Swansea', aliases: ['스완지', '스완지시티', 'Swansea', 'Swansea City'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/76.png' },
  { apiTeamId: 1346, nameKo: '코번트리 시티', nameEn: 'Coventry', aliases: ['코번트리', '코번트리시티', 'Coventry', 'Coventry City'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/1346.png' },
  { apiTeamId: 58, nameKo: '밀월', nameEn: 'Millwall', aliases: ['밀월', 'Millwall', '밀월FC'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/58.png' },
  { apiTeamId: 72, nameKo: 'QPR', nameEn: 'QPR', aliases: ['QPR', '퀸즈파크', '퀸즈파크레인저스', 'Queens Park Rangers'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/72.png' },
  { apiTeamId: 59, nameKo: '프레스턴 노스 엔드', nameEn: 'Preston', aliases: ['프레스턴', 'Preston', '프레스턴노스엔드'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/59.png' },
  { apiTeamId: 64, nameKo: '헐 시티', nameEn: 'Hull City', aliases: ['헐시티', 'Hull City', 'Hull'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/64.png' },
  { apiTeamId: 56, nameKo: '브리스톨 시티', nameEn: 'Bristol City', aliases: ['브리스톨', '브리스톨시티', '브리스틀', '브리스틀시티', '브리스틀 시티', 'Bristol City'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/56.png' },
  { apiTeamId: 43, nameKo: '카디프 시티', nameEn: 'Cardiff', aliases: ['카디프', '카디프시티', 'Cardiff', 'Cardiff City'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/43.png' },
  { apiTeamId: 1359, nameKo: '루턴 타운', nameEn: 'Luton', aliases: ['루턴', '루턴타운', 'Luton', 'Luton Town'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/1359.png' },
  { apiTeamId: 1338, nameKo: '옥스퍼드 유나이티드', nameEn: 'Oxford United', aliases: ['옥스퍼드', '옥스포드', 'Oxford United', 'Oxford'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/1338.png' },
  { apiTeamId: 1357, nameKo: '플리머스 아가일', nameEn: 'Plymouth', aliases: ['플리머스', '플리머스아가일', 'Plymouth', 'Plymouth Argyle'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/1357.png' },
  { apiTeamId: 74, nameKo: '셰필드 웬즈데이', nameEn: 'Sheffield Wednesday', aliases: ['셰필드W', '셰필드웬즈데이', 'Sheffield Wednesday'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/74.png' },
  { apiTeamId: 68, nameKo: '볼턴 원더러스', nameEn: 'Bolton', aliases: ['볼턴', '볼튼', '볼턴원더러스', 'Bolton', 'Bolton Wanderers'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/68.png' },
  { apiTeamId: 747, nameKo: '반슬리', nameEn: 'Barnsley', aliases: ['반슬리', 'Barnsley'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/747.png' },
  { apiTeamId: 41, nameKo: '사우샘프턴', nameEn: 'Southampton', aliases: ['사우샘프턴', 'Southampton', '소튼'], league: 'EPL', logo: 'https://media.api-sports.io/football/teams/41.png' },
  { apiTeamId: 54, nameKo: '버밍엄 시티', nameEn: 'Birmingham', aliases: ['버밍엄', '버밍엄시티', 'Birmingham City'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/54.png' },

  // === SERIE A & COPPA ITALIA (이탈리아) ===
  { apiTeamId: 503, nameKo: '토리노', nameEn: 'Torino', aliases: ['토리노', 'Torino', '토리노FC'], league: 'SERIE_A', logo: 'https://media.api-sports.io/football/teams/503.png' },
  { apiTeamId: 1579, nameKo: 'AC 몬차', nameEn: 'Monza', aliases: ['AC몬차', '몬차', 'Monza'], league: 'SERIE_A', logo: 'https://media.api-sports.io/football/teams/1579.png' },
  { apiTeamId: 488, nameKo: 'US 사수올로', nameEn: 'Sassuolo', aliases: ['US사수올로', '사수올로', 'Sassuolo'], league: 'SERIE_A', logo: 'https://media.api-sports.io/football/teams/488.png' },
  { apiTeamId: 512, nameKo: '프로시노네', nameEn: 'Frosinone', aliases: ['프로시노네', 'Frosinone'], league: 'SERIE_A', logo: 'https://media.api-sports.io/football/teams/512.png' },

  // === J1/J2 LEAGUE (일본 J리그 구단) ===
  { apiTeamId: 290, nameKo: '가시마 앤틀러스', nameEn: 'Kashima Antlers', aliases: ['가시마', '가시마앤틀러스', 'Kashima', 'Kashima Antlers'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/290.png' },
  { apiTeamId: 289, nameKo: '비셀 고베', nameEn: 'Vissel Kobe', aliases: ['비셀고베', '고베', 'Vissel Kobe', 'Vissel'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/289.png' },
  { apiTeamId: 294, nameKo: '가와사키 프론탈레', nameEn: 'Kawasaki Frontale', aliases: ['가와사키', '가와사키프론탈레', '가와사키F', 'Kawasaki Frontale'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/294.png' },
  { apiTeamId: 296, nameKo: '요코하마 F.마리노스', nameEn: 'Yokohama F. Marinos', aliases: ['요코하마FM', '요코하마F마리노스', '요코하마마리노스', 'Yokohama F. Marinos', 'Yokohama F.Marinos'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/296.png' },
  { apiTeamId: 292, nameKo: 'FC 도쿄', nameEn: 'FC Tokyo', aliases: ['FC도쿄', '도쿄', 'FC Tokyo'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/292.png' },
  { apiTeamId: 291, nameKo: '세레소 오사카', nameEn: 'Cerezo Osaka', aliases: ['세레소', '세레소오사카', 'Cerezo Osaka', 'Cerezo'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/291.png' },
  { apiTeamId: 281, nameKo: '가시와 레이솔', nameEn: 'Kashiwa Reysol', aliases: ['가시와', '가시와레이솔', 'Kashiwa Reysol', 'Kashiwa'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/281.png' },
  { apiTeamId: 282, nameKo: '산프레체 히로시마', nameEn: 'Sanfrecce Hiroshima', aliases: ['산프레체', '산프레체히로시마', '히로시마산프레체', 'Sanfrecce Hiroshima', 'Sanfrecce'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/282.png' },
  { apiTeamId: 288, nameKo: '나고야 그램퍼스', nameEn: 'Nagoya Grampus', aliases: ['나고야', '나고야그램퍼스', '나고야G', 'Nagoya Grampus'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/288.png' },
  { apiTeamId: 316, nameKo: '아비스파 후쿠오카', nameEn: 'Avispa Fukuoka', aliases: ['후쿠오카', '아비스파', '아비스파후쿠오카', 'Avispa Fukuoka'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/316.png' },
  { apiTeamId: 287, nameKo: '우라와 레즈', nameEn: 'Urawa Red Diamonds', aliases: ['우라와', '우라와레즈', '우라와레드', 'Urawa Red Diamonds', 'Urawa Reds'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/287.png' },
  { apiTeamId: 293, nameKo: '감바 오사카', nameEn: 'Gamba Osaka', aliases: ['감바', '감바오사카', 'Gamba Osaka', 'Gamba'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/293.png' },
  { apiTeamId: 306, nameKo: '도쿄 베르디', nameEn: 'Tokyo Verdy', aliases: ['도쿄베르디', '베르디', 'Tokyo Verdy'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/306.png' },
  { apiTeamId: 303, nameKo: 'FC 마치다 젤비아', nameEn: 'Machida Zelvia', aliases: ['마치다', '마치다젤비아', 'FC마치다', 'FC마치다젤비아', 'Machida Zelvia'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/303.png' },
  { apiTeamId: 302, nameKo: '교토 상가 FC', nameEn: 'Kyoto Sanga', aliases: ['교토', '교토상가', '교토상가FC', 'Kyoto Sanga'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/302.png' },
  { apiTeamId: 285, nameKo: '시미즈 에스펄스', nameEn: 'Shimizu S-Pulse', aliases: ['시미즈', '시미즈에스펄스', 'Shimizu S-Pulse'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/285.png' },
  { apiTeamId: 304, nameKo: 'V-바렌 나가사키', nameEn: 'V-Varen Nagasaki', aliases: ['나가사키', 'V바렌나가사키', 'V바렌', 'V-Varen Nagasaki'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/304.png' },
  { apiTeamId: 301, nameKo: '제프 유나이티드', nameEn: 'JEF United Chiba', aliases: ['제프유나이티드', '제프', 'JEF United', 'JEF United Chiba'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/301.png' },
  { apiTeamId: 310, nameKo: '파지아노 오카야마', nameEn: 'Fagiano Okayama', aliases: ['오카야마', '파지아노', '파지아노오카야마', 'Fagiano Okayama'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/310.png' },
  { apiTeamId: 305, nameKo: '미토 홀리호크', nameEn: 'Mito Hollyhock', aliases: ['미토', '미토홀리호크', 'Mito Hollyhock'], league: 'OTHER', logo: 'https://media.api-sports.io/football/teams/305.png' },

  // === K LEAGUE (K리그1) ===
  { apiTeamId: 2942, nameKo: '울산 HD', nameEn: 'Ulsan HD', aliases: ['울산', '울산현대', 'Ulsan', '울산HD'], league: 'K_LEAGUE', logo: 'https://media.api-sports.io/football/teams/2942.png' },
  { apiTeamId: 2941, nameKo: '전북 현대', nameEn: 'Jeonbuk Motors', aliases: ['전북', '전북현대', 'Jeonbuk', '전북현대모터스'], league: 'K_LEAGUE', logo: 'https://media.api-sports.io/football/teams/2941.png' },
  { apiTeamId: 2943, nameKo: '포항 스틸러스', nameEn: 'Pohang Steelers', aliases: ['포항', '포항스틸러스', 'Pohang'], league: 'K_LEAGUE', logo: 'https://media.api-sports.io/football/teams/2943.png' },
  { apiTeamId: 2940, nameKo: 'FC 서울', nameEn: 'FC Seoul', aliases: ['서울', 'FC서울', 'Seoul'], league: 'K_LEAGUE', logo: 'https://media.api-sports.io/football/teams/2940.png' },
  { apiTeamId: 2944, nameKo: '광주 FC', nameEn: 'Gwangju FC', aliases: ['광주', '광주FC', 'Gwangju'], league: 'K_LEAGUE', logo: 'https://media.api-sports.io/football/teams/2944.png' },
  { apiTeamId: 2936, nameKo: '강원 FC', nameEn: 'Gangwon FC', aliases: ['강원', '강원FC', 'Gangwon'], league: 'K_LEAGUE', logo: 'https://media.api-sports.io/football/teams/2936.png' },
  // === KBO (한국프로야구) 10개 구단 ===
  { apiTeamId: 88, nameKo: '두산 베어스', nameEn: 'Doosan Bears', aliases: ['두산', '두산베어스', 'OB', 'Doosan Bears', 'Doosan'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/88.png' },
  { apiTeamId: 93, nameKo: 'LG 트윈스', nameEn: 'LG Twins', aliases: ['LG', '엘지', 'LG트윈스', 'LGT', 'LG Twins'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/93.png' },
  { apiTeamId: 97, nameKo: '삼성 라이온즈', nameEn: 'Samsung Lions', aliases: ['삼성', '삼성라이온즈', 'SL', 'Samsung Lions', 'Samsung'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/97.png' },
  { apiTeamId: 94, nameKo: '롯데 자이언츠', nameEn: 'Lotte Giants', aliases: ['롯데', '롯데자이언츠', 'LOT', 'Lotte Giants', 'Lotte'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/94.png' },
  { apiTeamId: 89, nameKo: '한화 이글스', nameEn: 'Hanwha Eagles', aliases: ['한화', '한화이글스', 'HH', '빙그레', 'Hanwha Eagles', 'Hanwha'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/89.png' },
  { apiTeamId: 90, nameKo: 'KIA 타이거즈', nameEn: 'KIA Tigers', aliases: ['KIA', '기아', 'KIA타이거즈', '기아타이거즈', '해태', 'KIA Tigers'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/90.png' },
  { apiTeamId: 91, nameKo: 'KT 위즈', nameEn: 'KT Wiz', aliases: ['KT', '케이티', 'KT위즈', 'KT Wiz'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/91.png' },
  { apiTeamId: 95, nameKo: 'NC 다이노스', nameEn: 'NC Dinos', aliases: ['NC', '엔씨', 'NC다이노스', 'NC Dinos'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/95.png' },
  { apiTeamId: 92, nameKo: '키움 히어로즈', nameEn: 'Kiwoom Heroes', aliases: ['키움', '키움히어로즈', '넥센', 'Kiwoom Heroes', 'Kiwoom'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/92.png' },
  { apiTeamId: 647, nameKo: 'SSG 랜더스', nameEn: 'SSG Landers', aliases: ['SSG', '쓱', 'SSG랜더스', 'SK', 'SSG Landers'], league: 'KBO', logo: 'https://media.api-sports.io/baseball/teams/647.png' },

  // === NPB (일본프로야구) 12개 구단 (API-Sports Official IDs) ===
  { apiTeamId: 66, nameKo: '요미우리 자이언츠', nameEn: 'Yomiuri Giants', aliases: ['요미우리', '요미우리자이언츠', '교진', 'Yomiuri Giants', 'Yomiuri'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/66.png' },
  { apiTeamId: 65, nameKo: '요코하마 DeNA베이스타스', nameEn: 'Yokohama DeNA BayStars', aliases: ['요코하마', 'DeNA', '디엔에이', '요코하마DeNA', 'Yokohama DeNA BayStars', 'Yokohama BayStars', 'Yokohama'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/65.png' },
  { apiTeamId: 64, nameKo: '야쿠르트 스왈로즈', nameEn: 'Tokyo Yakult Swallows', aliases: ['야쿠르트', '도쿄야쿠르트', '야쿠르트스왈로즈', 'Tokyo Yakult Swallows', 'Yakult Swallows', 'Yakult'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/64.png' },
  { apiTeamId: 58, nameKo: '한신 타이거즈', nameEn: 'Hanshin Tigers', aliases: ['한신', '한신타이거즈', 'Hanshin Tigers', 'Hanshin'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/58.png' },
  { apiTeamId: 56, nameKo: '주니치 드래건스', nameEn: 'Chunichi Dragons', aliases: ['주니치', '주니치드래건스', '주니치드래곤즈', 'Chunichi Dragons', 'Chunichi'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/56.png' },
  { apiTeamId: 59, nameKo: '히로시마 도요카프', nameEn: 'Hiroshima Toyo Carp', aliases: ['히로시마', '히로시마도요카프', '도요카프', 'Hiroshima Toyo Carp', 'Hiroshima Carp', 'Hiroshima'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/59.png' },
  { apiTeamId: 60, nameKo: '닛폰햄 파이터스', nameEn: 'Hokkaido Nippon-Ham Fighters', aliases: ['닛폰햄', '니혼햄', '닛폰햄파이터스', '니혼햄파이터스', 'Hokkaido Nippon-Ham Fighters', 'Nippon-Ham Fighters', 'Nippon Ham Fighters', 'Nippon-Ham'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/60.png' },
  { apiTeamId: 57, nameKo: '소프트뱅크 호크스', nameEn: 'Fukuoka SoftBank Hawks', aliases: ['소프트뱅크', '소뱅', '소프트뱅크호크스', 'Fukuoka SoftBank Hawks', 'Fukuoka S. Hawks', 'SoftBank Hawks', 'SoftBank', 'Fukuoka'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/57.png' },
  { apiTeamId: 62, nameKo: '라쿠텐 골든이글스', nameEn: 'Tohoku Rakuten Golden Eagles', aliases: ['라쿠텐', '라쿠텐골든이글스', 'Tohoku Rakuten Golden Eagles', 'Rakuten Gold. Eagles', 'Rakuten'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/62.png' },
  { apiTeamId: 61, nameKo: '오릭스 버팔로스', nameEn: 'Orix Buffaloes', aliases: ['오릭스', '오릭스버팔로스', '오릭스버팔로즈', 'Orix Buffaloes', 'Orix'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/61.png' },
  { apiTeamId: 55, nameKo: '지바롯데 마린스', nameEn: 'Chiba Lotte Marines', aliases: ['지바롯데', '지바 롯데', '치바롯데', '지바롯데마린스', 'Chiba Lotte Marines', 'Chiba Lotte', 'Chiba'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/55.png' },
  { apiTeamId: 63, nameKo: '세이부 라이온즈', nameEn: 'Saitama Seibu Lions', aliases: ['세이부', '세이부라이온즈', '사이타마세이부', 'Saitama Seibu Lions', 'Seibu Lions', 'Seibu'], league: 'NPB', logo: 'https://media.api-sports.io/baseball/teams/63.png' },

  // === MLB (메이저리그) 30개 전체 구단 (API-Sports Official ID Mapping) ===
  { apiTeamId: 17, mlbStatsId: 108, nameKo: 'LA 에인절스', nameEn: 'Los Angeles Angels', aliases: ['LA 에인절스', 'LA에인절스', '에인절스', 'LAA', 'Angels', 'Los Angeles Angels'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/17.png' },
  { apiTeamId: 25, mlbStatsId: 147, nameKo: '뉴욕 양키스', nameEn: 'New York Yankees', aliases: ['뉴욕 양키스', '뉴욕양키스', '양키스', 'NYY', 'Yankees', 'New York Yankees'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/25.png' },
  { apiTeamId: 2, mlbStatsId: 109, nameKo: '애리조나 다이아몬드백스', nameEn: 'Arizona Diamondbacks', aliases: ['애리조나', 'ARI', 'D-backs', '디백스', '애리조나 다이아몬드백스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/2.png' },
  { apiTeamId: 3, mlbStatsId: 144, nameKo: '애틀랜타 브레이브스', nameEn: 'Atlanta Braves', aliases: ['애틀랜타', 'ATL', 'Braves', '애틀랜타 브레이브스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/3.png' },
  { apiTeamId: 4, mlbStatsId: 110, nameKo: '볼티모어 오리올스', nameEn: 'Baltimore Orioles', aliases: ['볼티모어', 'BAL', 'Orioles', '볼티모어 오리올스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/4.png' },
  { apiTeamId: 5, mlbStatsId: 111, nameKo: '보스턴 레드삭스', nameEn: 'Boston Red Sox', aliases: ['보스턴', 'BOS', 'Red Sox', '보스턴 레드삭스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/5.png' },
  { apiTeamId: 6, mlbStatsId: 112, nameKo: '시카고 컵스', nameEn: 'Chicago Cubs', aliases: ['시카고 컵스', 'CHC', 'Cubs'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/6.png' },
  { apiTeamId: 7, mlbStatsId: 145, nameKo: '시카고 화이트삭스', nameEn: 'Chicago White Sox', aliases: ['시카고 화이트삭스', 'CWS', '화이트삭스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/7.png' },
  { apiTeamId: 8, mlbStatsId: 113, nameKo: '신시내티 레즈', nameEn: 'Cincinnati Reds', aliases: ['신시내티', 'CIN', 'Reds', '신시내티 레즈'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/8.png' },
  { apiTeamId: 9, mlbStatsId: 114, nameKo: '클리블랜드 가디언스', nameEn: 'Cleveland Guardians', aliases: ['클리블랜드', 'CLE', 'Guardians', '인디언스', '클리블랜드 가디언스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/9.png' },
  { apiTeamId: 10, mlbStatsId: 115, nameKo: '콜로라도 로키스', nameEn: 'Colorado Rockies', aliases: ['콜로라도', 'COL', 'Rockies', '콜로라도 로키스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/10.png' },
  { apiTeamId: 12, mlbStatsId: 116, nameKo: '디트로이트 타이거스', nameEn: 'Detroit Tigers', aliases: ['디트로이트', 'DET', 'Tigers', '디트로이트 타이거즈'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/12.png' },
  { apiTeamId: 15, mlbStatsId: 117, nameKo: '휴스턴 애스트로스', nameEn: 'Houston Astros', aliases: ['휴스턴', 'HOU', 'Astros', '휴스턴 애스트로스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/15.png' },
  { apiTeamId: 16, mlbStatsId: 118, nameKo: '캔자스시티 로열스', nameEn: 'Kansas City Royals', aliases: ['캔자스시티', 'KC', 'Royals', '캔자스시티 로얄스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/16.png' },
  { apiTeamId: 18, mlbStatsId: 119, nameKo: 'LA 다저스', nameEn: 'Los Angeles Dodgers', aliases: ['다저스', 'LAD', 'Dodgers', 'LA 다저스', 'LA다저스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/18.png' },
  { apiTeamId: 19, mlbStatsId: 146, nameKo: '마이애미 말린스', nameEn: 'Miami Marlins', aliases: ['마이애미', 'MIA', 'Marlins', '마이애미 말린스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/19.png' },
  { apiTeamId: 20, mlbStatsId: 158, nameKo: '밀워키 브루어스', nameEn: 'Milwaukee Brewers', aliases: ['밀워키', 'MIL', 'Brewers', '밀워키 브루어스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/20.png' },
  { apiTeamId: 22, mlbStatsId: 142, nameKo: '미네소타 트윈스', nameEn: 'Minnesota Twins', aliases: ['미네소타', 'MIN', 'Twins', '미네소타 트윈스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/22.png' },
  { apiTeamId: 24, mlbStatsId: 121, nameKo: '뉴욕 메츠', nameEn: 'New York Mets', aliases: ['뉴욕 메츠', 'NYM', 'Mets', '뉴욕메츠'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/24.png' },
  { apiTeamId: 26, mlbStatsId: 133, nameKo: '애슬레틱스', nameEn: 'Oakland Athletics', aliases: ['오클랜드', 'OAK', 'Athletics', 'A\'s', '애슬레틱스', '오클랜드 애슬레틱스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/26.png' },
  { apiTeamId: 27, mlbStatsId: 143, nameKo: '필라델피아 필리스', nameEn: 'Philadelphia Phillies', aliases: ['필라델피아', 'PHI', 'Phillies', '필라델피아 필리스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/27.png' },
  { apiTeamId: 28, mlbStatsId: 134, nameKo: '피츠버그 파이리츠', nameEn: 'Pittsburgh Pirates', aliases: ['피츠버그', 'PIT', 'Pirates', '피츠버그 파이어리츠'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/28.png' },
  { apiTeamId: 30, mlbStatsId: 135, nameKo: '샌디에이고 파드리스', nameEn: 'San Diego Padres', aliases: ['샌디에이고', 'SD', 'Padres', '샌디에이고 파드리스', '샌디에고'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/30.png' },
  { apiTeamId: 31, mlbStatsId: 137, nameKo: '샌프란시스코 자이언츠', nameEn: 'San Francisco Giants', aliases: ['샌프란시스코', 'SF', 'San Francisco Giants'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/31.png' },
  { apiTeamId: 32, mlbStatsId: 136, nameKo: '시애틀 매리너스', nameEn: 'Seattle Mariners', aliases: ['시애틀', 'SEA', 'Mariners', '시애틀 매리너스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/32.png' },
  { apiTeamId: 33, mlbStatsId: 138, nameKo: '세인트루이스 카디널스', nameEn: 'St. Louis Cardinals', aliases: ['세인트루이스', 'STL', 'Cardinals', '세인트루이스 카디널스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/33.png' },
  { apiTeamId: 34, mlbStatsId: 139, nameKo: '탬파베이 레이스', nameEn: 'Tampa Bay Rays', aliases: ['탬파베이', 'TB', 'Rays', '탬파베이 레이스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/34.png' },
  { apiTeamId: 35, mlbStatsId: 140, nameKo: '텍사스 레인저스', nameEn: 'Texas Rangers', aliases: ['텍사스', 'TEX', 'Rangers', '텍사스 레인저스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/35.png' },
  { apiTeamId: 36, mlbStatsId: 141, nameKo: '토론토 블루제이스', nameEn: 'Toronto Blue Jays', aliases: ['토론토', 'TOR', 'Blue Jays', '토론토 블루제이스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/36.png' },
  { apiTeamId: 37, mlbStatsId: 120, nameKo: '워싱턴 내셔널스', nameEn: 'Washington Nationals', aliases: ['워싱턴', 'WSH', 'Nationals', '워싱턴 내셔널스'], league: 'MLB', logo: 'https://media.api-sports.io/baseball/teams/37.png' }
];

// 2. 선수 1:1 엔터티 매핑 테이블 (Player Entity Mapping Table)
export const PLAYER_ENTITY_TABLE: PlayerEntity[] = [
  // KBO
  { apiPlayerId: 1001, teamId: 88, nameKo: '잭로그', nameEn: 'Jack Logue', aliases: ['Jack Logue', 'Logue', '로그', '잭로그'], position: 'P', throwsHand: 'R', jerseyNumber: 40 },
  { apiPlayerId: 1002, teamId: 93, nameKo: '임찬규', nameEn: 'Chan-kyu Lim', aliases: ['Lim Chan-kyu', 'Im Chan-kyu', 'Chan-kyu Im', '임찬규'], position: 'P', throwsHand: 'R', jerseyNumber: 1 },
  { apiPlayerId: 1003, teamId: 97, nameKo: '보스', nameEn: 'Austin Voth', aliases: ['Austin Voth', 'Voth', '보스', '오스틴 보스'], position: 'P', throwsHand: 'R', jerseyNumber: 28 },
  { apiPlayerId: 1004, teamId: 94, nameKo: '로드리게스', nameEn: 'Dereck Rodriguez', aliases: ['Dereck Rodriguez', 'Rodriguez', '로드리게스'], position: 'P', throwsHand: 'R', jerseyNumber: 30 },
  { apiPlayerId: 1005, teamId: 91, nameKo: '대니엘', nameEn: 'Daniel', aliases: ['Daniel', '대니엘'], position: 'P', throwsHand: 'R', jerseyNumber: 35 },
  { apiPlayerId: 1006, teamId: 89, nameKo: '화이트', nameEn: 'White', aliases: ['White', '화이트'], position: 'P', throwsHand: 'R', jerseyNumber: 33 },
  { apiPlayerId: 1007, teamId: 95, nameKo: '구창모', nameEn: 'Chang-mo Koo', aliases: ['Chang-mo Koo', 'Koo Chang-mo', '구창모'], position: 'P', throwsHand: 'L', jerseyNumber: 59 },
  { apiPlayerId: 1008, teamId: 90, nameKo: '네일', nameEn: 'James Nail', aliases: ['James Nail', 'Nail', '네일'], position: 'P', throwsHand: 'R', jerseyNumber: 40 },
  { apiPlayerId: 1009, teamId: 92, nameKo: '알칸타라', nameEn: 'Raul Alcantara', aliases: ['Raul Alcantara', 'Alcantara', '알칸타라'], position: 'P', throwsHand: 'R', jerseyNumber: 44 },
  { apiPlayerId: 1010, teamId: 647, nameKo: '최민준', nameEn: 'Min-jun Choi', aliases: ['Min-jun Choi', 'Choi Min-jun', '최민준'], position: 'P', throwsHand: 'R', jerseyNumber: 38 },
  { apiPlayerId: 1011, teamId: 89, nameKo: '류현진', nameEn: 'Hyun-jin Ryu', aliases: ['Hyun-jin Ryu', 'Ryu Hyun-jin', 'Ryu', '류현진', '코리안 몬스터'], position: 'P', throwsHand: 'L', jerseyNumber: 99 },
  { apiPlayerId: 1012, teamId: 88, nameKo: '곽빈', nameEn: 'Been Kwak', aliases: ['Been Kwak', 'Kwak Been', 'Kwak Bin', '곽빈'], position: 'P', throwsHand: 'R', jerseyNumber: 47 },

  // MLB
  { apiPlayerId: 2001, teamId: 1, nameKo: '게릿 콜', nameEn: 'Gerrit Cole', aliases: ['Gerrit Cole', 'Cole', '게릿 콜', '콜'], position: 'P', throwsHand: 'R', jerseyNumber: 45 },
  { apiPlayerId: 2002, teamId: 3, nameKo: '호세 소리아노', nameEn: 'Jose Soriano', aliases: ['Jose Soriano', 'Soriano', '호세 소리아노', '소리아노'], position: 'P', throwsHand: 'R', jerseyNumber: 59 },
  { apiPlayerId: 2003, teamId: 2, nameKo: '잭 갤런', nameEn: 'Zac Gallen', aliases: ['Zac Gallen', 'Gallen', '잭 갤런', '갤런'], position: 'P', throwsHand: 'R', jerseyNumber: 23 },
  { apiPlayerId: 2004, teamId: 4, nameKo: '잭 휠러', nameEn: 'Zack Wheeler', aliases: ['Zack Wheeler', 'Wheeler', '잭 휠러', '휠러'], position: 'P', throwsHand: 'R', jerseyNumber: 45 },

  // NPB
  { apiPlayerId: 3001, teamId: 66, nameKo: '토고 쇼세이', nameEn: 'Shosei Togo', aliases: ['Shosei Togo', 'Togo', '토고 쇼세이', '토고'], position: 'P', throwsHand: 'R', jerseyNumber: 20 },
  { apiPlayerId: 3002, teamId: 65, nameKo: '이시다 유타로', nameEn: 'Yutaro Ishida', aliases: ['Yutaro Ishida', 'Ishida', '이시다 유타로', '이시다'], position: 'P', throwsHand: 'R', jerseyNumber: 54 },
  { apiPlayerId: 3003, teamId: 64, nameKo: '요시무라 코지로', nameEn: 'Kojiro Yoshimura', aliases: ['Kojiro Yoshimura', 'Yoshimura', '요시무라 코지로', '요시무라'], position: 'P', throwsHand: 'R', jerseyNumber: 21 },
  { apiPlayerId: 3004, teamId: 58, nameKo: '타카하시 하루토', nameEn: 'Haruto Takahashi', aliases: ['Haruto Takahashi', 'Takahashi', '타카하시 하루토', '타카하시'], position: 'P', throwsHand: 'L', jerseyNumber: 29 },
  { apiPlayerId: 3005, teamId: 56, nameKo: '오노 유다이', nameEn: 'Yudai Ohno', aliases: ['Yudai Ohno', 'Ohno', '오노 유다이', '오노'], position: 'P', throwsHand: 'L', jerseyNumber: 22 },
  { apiPlayerId: 3006, teamId: 59, nameKo: '토코다 히로키', nameEn: 'Hiroki Tokoda', aliases: ['Hiroki Tokoda', 'Tokoda', '토코다 히로키', '토코다'], position: 'P', throwsHand: 'L', jerseyNumber: 28 },
  { apiPlayerId: 3007, teamId: 60, nameKo: '야마사키 사치야', nameEn: 'Sachiya Yamasaki', aliases: ['Sachiya Yamasaki', 'Yamasaki', '야마사키 사치야', '야마사키'], position: 'P', throwsHand: 'L', jerseyNumber: 18 },
  { apiPlayerId: 3008, teamId: 57, nameKo: '리반 모이넬로', nameEn: 'Livan Moinelo', aliases: ['Livan Moinelo', 'Moinelo', '리반 모이넬로', '모이넬로'], position: 'P', throwsHand: 'L', jerseyNumber: 47 },
  { apiPlayerId: 3009, teamId: 62, nameKo: '이토 이츠키', nameEn: 'Itsuki Ito', aliases: ['Itsuki Ito', 'Ito', '이토 이츠키', '이토'], position: 'P', throwsHand: 'R', jerseyNumber: 17 },
  { apiPlayerId: 3010, teamId: 61, nameKo: '쿠리 아렌', nameEn: 'Aren Kuri', aliases: ['Aren Kuri', 'Kuri', '쿠리 아렌', '쿠리'], position: 'P', throwsHand: 'R', jerseyNumber: 11 },
  { apiPlayerId: 3011, teamId: 55, nameKo: '타카노 슈타', nameEn: 'Shuta Takano', aliases: ['Shuta Takano', 'Takano', '타카노 슈타', '타카노'], position: 'P', throwsHand: 'R', jerseyNumber: 34 },
  { apiPlayerId: 3012, teamId: 63, nameKo: '타이라 카이마', nameEn: 'Kaima Taira', aliases: ['Kaima Taira', 'Taira', '타이라 카이마', '타이라'], position: 'P', throwsHand: 'R', jerseyNumber: 61 }
];

export class SportsEntityMappingService {
  /**
   * 문자열 정규화 (소문자 변환, 공백/하이픈/특수문자 제거)
   */
  public static normalize(input: string): string {
    return input.toLowerCase().replace(/[^a-z0-9가-힣]/g, '').trim();
  }

  /**
   * 다양한 형태의 구단 입력값(한글명, 영문명, 약어, ID)을 TeamEntity로 정밀 매핑
   */
  public static resolveTeamEntity(input: string | number, sport?: 'football' | 'baseball'): TeamEntity | null {
    const candidateTable = sport
      ? TEAM_ENTITY_TABLE.filter(t => sport === 'baseball' ? ['KBO', 'NPB', 'MLB'].includes(t.league) : ['EPL', 'LA_LIGA', 'SERIE_A', 'K_LEAGUE', 'OTHER'].includes(t.league))
      : TEAM_ENTITY_TABLE;

    if (typeof input === 'number') {
      return candidateTable.find(t => t.apiTeamId === input || t.mlbStatsId === input) 
        || TEAM_ENTITY_TABLE.find(t => t.apiTeamId === input || t.mlbStatsId === input) 
        || null;
    }

    const clean = this.normalize(input);
    if (!clean) return null;

    // 1. Exact match on nameKo or nameEn
    for (const team of candidateTable) {
      if (this.normalize(team.nameKo) === clean || this.normalize(team.nameEn) === clean) {
        return team;
      }
    }

    // 2. Exact match on aliases
    for (const team of candidateTable) {
      for (const alias of team.aliases) {
        if (this.normalize(alias) === clean) {
          return team;
        }
      }
    }

    // 3. Distinctive prefix match (e.g. '두산' in '두산베어스' or '요미우리' in '요미우리자이언츠')
    for (const team of candidateTable) {
      for (const alias of team.aliases) {
        const normAlias = this.normalize(alias);
        if (normAlias.length >= 2 && (clean.startsWith(normAlias) || normAlias.startsWith(clean))) {
          return team;
        }
      }
    }

    // Fallback to global search if sport filter restricted too much
    if (sport) {
      return this.resolveTeamEntity(input);
    }

    return null;
  }

  /**
   * 선수 이름(한글/영문/약칭)을 PlayerEntity로 정밀 매핑
   */
  public static resolvePlayerEntity(teamId: number, rawPlayerName: string): PlayerEntity | null {
    const clean = this.normalize(rawPlayerName);
    if (!clean) return null;

    // 1. 해당 팀 내에서 우선 탐색
    const teamPlayers = PLAYER_ENTITY_TABLE.filter(p => p.teamId === teamId);
    for (const player of teamPlayers) {
      if (this.normalize(player.nameKo) === clean || this.normalize(player.nameEn) === clean) {
        return player;
      }
      for (const alias of player.aliases) {
        if (this.normalize(alias) === clean) {
          return player;
        }
      }
    }

    // 2. 팀 ID가 불일치하더라도 전역 별칭 탐색 (트레이드나 이적 대비)
    for (const player of PLAYER_ENTITY_TABLE) {
      if (this.normalize(player.nameKo) === clean || this.normalize(player.nameEn) === clean) {
        return player;
      }
      for (const alias of player.aliases) {
        if (this.normalize(alias) === clean) {
          return player;
        }
      }
    }

    return null;
  }

  /**
   * 두 팀명이 동일한 팀인지 한/영/별칭/ID 기반으로 엄밀하게 판별
   */
  public static isSameTeam(teamA?: string | number | null, teamB?: string | number | null, sport?: 'football' | 'baseball'): boolean {
    if (!teamA || !teamB) return false;
    if (teamA === teamB) return true;
    const entA = this.resolveTeamEntity(teamA, sport);
    const entB = this.resolveTeamEntity(teamB, sport);
    if (entA && entB) {
      return entA.apiTeamId === entB.apiTeamId && entA.league === entB.league;
    }
    const cleanA = this.normalize(String(teamA));
    const cleanB = this.normalize(String(teamB));
    return cleanA === cleanB;
  }
}
