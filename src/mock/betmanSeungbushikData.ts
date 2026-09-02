import type { Match } from '../types/sports';

export const FULL_SEUNGBUSHIK_MATCHES: Match[] = [
  // 1번 경기 (KBO 야구)
  {
    id: 'm1_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 1,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: true,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '15분 전 공개',
      alertText: '🚨 1번 경기 (삼성 vs KIA) 오피셜 선발 발표!',
      keyAbsenceNotice: '⚠️ 삼성 선발 원태인 확정 vs KIA 정해영 연투 과부하'
    },
    headToHeadRecord: { summaryText: '시즌 맞대결 삼성 6승 4패 우세', homeWins: 6, draws: 0, awayWins: 4, last5Matches: [] },
    homeTeam: {
      id: 'ssg', name: '삼성 라이온즈', logo: '⚾', countryName: '대한민국 🇰🇷', rank: 2,
      homeSeasonRecord: '홈 18승 10패', awaySeasonRecord: '원정 14승 14패', seasonRemainingGames: '잔여 16경기',
      recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'KBO 2위', totalMarketValueNum: 2,
      starterPitcherInfo: { name: '원태인', era: '3.12', winLoss: '9승 4패' }
    },
    awayTeam: {
      id: 'kia', name: 'KIA 타이거즈', logo: '🐯', countryName: '대한민국 🇰🇷', rank: 1,
      homeSeasonRecord: '홈 20승 8패', awaySeasonRecord: '원정 16승 12패', seasonRemainingGames: '잔여 15경기',
      recent3Form: 'GREEN', staminaStatus: 'YELLOW', minutesPlayed14d: 0, totalMarketValue: 'KBO 1위', totalMarketValueNum: 1,
      starterPitcherInfo: { name: '양현종', era: '3.85', winLoss: '8승 5패' }
    },
    status: 'SCHEDULED', matchTime: '09.01(화) 18:30', closingTime: '09.01(화) 18:20', venue: '대구 삼성 라이온즈 파크',
    underOverFact: { last10OverRatio: 60, last10UnderRatio: 40, avgScoredGoals: 5.8, avgConcededGoals: 4.2, isFiveBack: false, tacticDescription: '대구 파크 팩터 홈런 우세 구장' }
  },

  // 2번 경기 (EPL 축구)
  {
    id: 'm2_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 2,
    sport: 'football',
    league: '프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: false,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '30분 전 공개',
      alertText: '🚨 2번 경기 (맨체스터U vs 아스널) 공식 선발11 발표!',
      keyAbsenceNotice: '⚠️ 맨유 페르난데스 선발 복귀 vs 아스널 사카 폼 절정 (👑🔥)'
    },
    headToHeadRecord: { summaryText: '최근 5경기: 아스널 3승 1무 1패 우세', homeWins: 1, draws: 1, awayWins: 3, last5Matches: [] },
    homeTeam: {
      id: 'manu', name: '맨체스터U', logo: '😈', countryName: '잉글랜드 🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 4,
      homeSeasonRecord: '홈 10승 3패', awaySeasonRecord: '원정 6승 5패', seasonRemainingGames: '잔여 10경기',
      recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 180, totalMarketValue: '8.5억 유로', totalMarketValueNum: 8.5
    },
    awayTeam: {
      id: 'ars', name: '아스널', logo: '🔴', countryName: '잉글랜드 🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 2,
      homeSeasonRecord: '홈 12승 2패', awaySeasonRecord: '원정 9승 3패', seasonRemainingGames: '잔여 10경기',
      recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 190, totalMarketValue: '11억 유로', totalMarketValueNum: 11
    },
    status: 'SCHEDULED', matchTime: '09.01(화) 22:30', closingTime: '09.01(화) 22:20', venue: '올드 트래포드',
    underOverFact: { last10OverRatio: 70, last10UnderRatio: 30, avgScoredGoals: 2.4, avgConcededGoals: 1.1, isFiveBack: false, tacticDescription: 'xG 예상 득점 3.2 골 오버 성향' }
  },

  // 3번 경기 (KBO 야구)
  {
    id: 'm3_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 3,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: false,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '20분 전 공개',
      alertText: '🚨 3번 경기 (LG vs SSG) 오피셜 선발 팩트!',
      keyAbsenceNotice: '⚠️ LG 앤더슨 선발 vs SSG 김광현 시즌 10승 도전'
    },
    headToHeadRecord: { summaryText: '시즌 맞대결 LG 5승 5패 동률', homeWins: 5, draws: 0, awayWins: 5, last5Matches: [] },
    homeTeam: {
      id: 'lgt', name: 'LG 트윈스', logo: '⚾', countryName: '대한민국 🇰🇷', rank: 3,
      homeSeasonRecord: '홈 17승 11패', awaySeasonRecord: '원정 15승 13패', seasonRemainingGames: '잔여 18경기',
      recent3Form: 'YELLOW', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'KBO 3위', totalMarketValueNum: 3,
      starterPitcherInfo: { name: '앤더슨', era: '2.95', winLoss: '10승 3패' }
    },
    awayTeam: {
      id: 'ssg_land', name: 'SSG 랜더스', logo: '⚾', countryName: '대한민국 🇰🇷', rank: 4,
      homeSeasonRecord: '홈 15승 12패', awaySeasonRecord: '원정 14승 14패', seasonRemainingGames: '잔여 17경기',
      recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'KBO 4위', totalMarketValueNum: 4,
      starterPitcherInfo: { name: '김광현', era: '3.45', winLoss: '9승 6패' }
    },
    status: 'SCHEDULED', matchTime: '09.01(화) 18:30', closingTime: '09.01(화) 18:20', venue: '잠실 야구장',
    underOverFact: { last10OverRatio: 40, last10UnderRatio: 60, avgScoredGoals: 4.1, avgConcededGoals: 3.8, isFiveBack: false, tacticDescription: '잠실 넓은 외야 언더 우세' }
  },

  // 4번 경기 (라리가 축구)
  {
    id: 'm4_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 4,
    sport: 'football',
    league: '스페인 라리가',
    countryFlag: '🇪🇸',
    isFavorite: false,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '45분 전 공개',
      alertText: '🚨 4번 경기 (레알 마드리드 vs 바르셀로나) 엘클라시코 명단!',
      keyAbsenceNotice: '⚠️ 비니시우스-음바페 동시 선발 vs 레반도프스키 핫폼 (👑🔥)'
    },
    headToHeadRecord: { summaryText: '시즌 엘클라시코: 레알 2승 1패 우세', homeWins: 2, draws: 0, awayWins: 1, last5Matches: [] },
    homeTeam: {
      id: 'rm', name: '레알 마드리드', logo: '👑', countryName: '스페인 🇪🇸', rank: 1,
      homeSeasonRecord: '홈 13승 1패', awaySeasonRecord: '원정 10승 2패', seasonRemainingGames: '잔여 8경기',
      recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 180, totalMarketValue: '13.5억 유로', totalMarketValueNum: 13.5
    },
    awayTeam: {
      id: 'barca', name: '바르셀로나', logo: '🔵🔴', countryName: '스페인 🇪🇸', rank: 2,
      homeSeasonRecord: '홈 12승 2패', awaySeasonRecord: '원정 9승 3패', seasonRemainingGames: '잔여 8경기',
      recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 180, totalMarketValue: '10.5억 유로', totalMarketValueNum: 10.5
    },
    status: 'SCHEDULED', matchTime: '09.02(수) 04:00', closingTime: '09.02(수) 03:50', venue: '산티아고 베르나베우',
    underOverFact: { last10OverRatio: 80, last10UnderRatio: 20, avgScoredGoals: 3.1, avgConcededGoals: 1.2, isFiveBack: false, tacticDescription: '초고득점 오버 예상' }
  },

  // 5번 경기 (MLB 야구)
  {
    id: 'm5_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 5,
    sport: 'baseball',
    league: 'MLB 메이저리그',
    countryFlag: '🇺🇸',
    isFavorite: false,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '10분 전 공개',
      alertText: '🚨 5번 경기 (LA 다저스 vs NY 양키스) 오피셜 선발!',
      keyAbsenceNotice: '⚠️ 오타니 1번 지명타자 확정 vs 저지 핫폼 호투'
    },
    headToHeadRecord: { summaryText: '시즌 맞대결 3경기 다저스 2승 1패', homeWins: 2, draws: 0, awayWins: 1, last5Matches: [] },
    homeTeam: {
      id: 'lad', name: 'LA 다저스', logo: '⚾', countryName: '미국 🇺🇸', rank: 1,
      homeSeasonRecord: '홈 42승 20패', awaySeasonRecord: '원정 38승 24패', seasonRemainingGames: '잔여 25경기',
      recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'MLB 1위', totalMarketValueNum: 1,
      starterPitcherInfo: { name: '야마모토', era: '2.88', winLoss: '11승 4패' }
    },
    awayTeam: {
      id: 'nyy', name: 'NY 양키스', logo: '⚾', countryName: '미국 🇺🇸', rank: 2,
      homeSeasonRecord: '홈 40승 22패', awaySeasonRecord: '원정 36승 26패', seasonRemainingGames: '잔여 24경기',
      recent3Form: 'YELLOW', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'MLB 2위', totalMarketValueNum: 2,
      starterPitcherInfo: { name: '콜', era: '3.15', winLoss: '10승 5패' }
    },
    status: 'SCHEDULED', matchTime: '09.02(수) 11:10', closingTime: '09.02(수) 11:00', venue: '다저 스타디움',
    underOverFact: { last10OverRatio: 50, last10UnderRatio: 50, avgScoredGoals: 5.2, avgConcededGoals: 4.1, isFiveBack: false, tacticDescription: '다저스타디움 야간 경기' }
  },

  // 6번~10번 경기 (K리그 / EPL / NBA / KBL 추가)
  {
    id: 'm6_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 6,
    sport: 'football',
    league: 'K리그 1',
    countryFlag: '🇰🇷',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '1시간 전 공개', alertText: '🚨 6번 경기 (전북 현대 vs 울산 HD)', keyAbsenceNotice: '⚠️ 전북 이동준 복귀 vs 울산 주민규 선발' },
    homeTeam: { id: 'jb', name: '전북 현대', logo: '🟢', countryName: '대한민국 🇰🇷', rank: 4, homeSeasonRecord: '홈 8승 4패', awaySeasonRecord: '원정 5승 5패', seasonRemainingGames: '잔여 10경기', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 180, totalMarketValue: 'K리그 2위', totalMarketValueNum: 2 },
    awayTeam: { id: 'us', name: '울산 HD', logo: '🔵', countryName: '대한민국 🇰🇷', rank: 1, homeSeasonRecord: '홈 11승 2패', awaySeasonRecord: '원정 7승 4패', seasonRemainingGames: '잔여 10경기', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 180, totalMarketValue: 'K리그 1위', totalMarketValueNum: 1 },
    status: 'SCHEDULED', matchTime: '09.02(수) 19:30', closingTime: '09.02(수) 19:20', venue: '전주월드컵경기장',
    underOverFact: { last10OverRatio: 50, last10UnderRatio: 50, avgScoredGoals: 2.1, avgConcededGoals: 1.3, isFiveBack: false, tacticDescription: '현대가 더비 라이벌전' }
  },
  {
    id: 'm7_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 7,
    sport: 'basketball',
    league: 'NBA 농구',
    countryFlag: '🇺🇸',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '15분 전 공개', alertText: '🚨 7번 경기 (보스턴 vs 인디애나)', keyAbsenceNotice: '⚠️ 보스턴 테이텀 출전 확정 (휴식 2일 🟢)' },
    homeTeam: { id: 'bos_bkt', name: '보스턴 셀틱스', logo: '☘️', countryName: '미국 🇺🇸', rank: 1, homeSeasonRecord: '홈 35승 6패', awaySeasonRecord: '원정 29승 12패', seasonRemainingGames: '잔여 15경기', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'NBA 1위', totalMarketValueNum: 1 },
    awayTeam: { id: 'ind_bkt', name: '인디애나 페이서스', logo: '🏀', countryName: '미국 🇺🇸', rank: 5, homeSeasonRecord: '홈 26승 15패', awaySeasonRecord: '원정 21승 20패', seasonRemainingGames: '잔여 15경기', recent3Form: 'YELLOW', staminaStatus: 'RED', minutesPlayed14d: 0, totalMarketValue: 'NBA 8위', totalMarketValueNum: 8 },
    status: 'SCHEDULED', matchTime: '09.03(목) 09:00', closingTime: '09.03(목) 08:50', venue: 'TD 가든',
    underOverFact: { last10OverRatio: 80, last10UnderRatio: 20, avgScoredGoals: 118, avgConcededGoals: 105, isFiveBack: false, tacticDescription: '페이스 지수 104.5 오버 극강' }
  },
  {
    id: 'm8_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 8,
    sport: 'football',
    league: '프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '40분 전 공개', alertText: '🚨 8번 경기 (토트넘 vs 첼시) 손흥민 선발!', keyAbsenceNotice: '⚠️ 손흥민 핫폼 👑🔥 vs 첼시 팔머 선발' },
    homeTeam: { id: 'tot', name: '토트넘 홋스퍼', logo: '⚪', countryName: '잉글랜드 🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 5, homeSeasonRecord: '홈 10승 2패', awaySeasonRecord: '원정 7승 5패', seasonRemainingGames: '잔여 11경기', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 180, totalMarketValue: '7.8억 유로', totalMarketValueNum: 7.8 },
    awayTeam: { id: 'che', name: '첼시 FC', logo: '🔵', countryName: '잉글랜드 🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 6, homeSeasonRecord: '홈 9승 4패', awaySeasonRecord: '원정 6승 6패', seasonRemainingGames: '잔여 11경기', recent3Form: 'YELLOW', staminaStatus: 'GREEN', minutesPlayed14d: 180, totalMarketValue: '9.2억 유로', totalMarketValueNum: 9.2 },
    status: 'SCHEDULED', matchTime: '09.03(목) 21:30', closingTime: '09.03(목) 21:20', venue: '토트넘 홋스퍼 스타디움',
    underOverFact: { last10OverRatio: 65, last10UnderRatio: 35, avgScoredGoals: 2.2, avgConcededGoals: 1.4, isFiveBack: false, tacticDescription: '런던 더비 공수 전환 격돌' }
  },
  {
    id: 'm9_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 9,
    sport: 'volleyball',
    league: 'V-리그 배구',
    countryFlag: '🇰🇷',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '10분 전 공개', alertText: '🚨 9번 경기 (대한항공 vs 현대캐피탈)', keyAbsenceNotice: '⚠️ 대한항공 정지석 주포 선발 출전' },
    homeTeam: { id: 'kal', name: '대한항공 점보스', logo: '🏐', countryName: '대한민국 🇰🇷', rank: 1, homeSeasonRecord: '홈 14승 4패', awaySeasonRecord: '원정 11승 7패', seasonRemainingGames: '잔여 8경기', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'V리그 1위', totalMarketValueNum: 1 },
    awayTeam: { id: 'sky', name: '현대캐피탈 스카이워커스', logo: '🏐', countryName: '대한민국 🇰🇷', rank: 2, homeSeasonRecord: '홈 12승 6패', awaySeasonRecord: '원정 10승 8패', seasonRemainingGames: '잔여 8경기', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'V리그 2위', totalMarketValueNum: 2 },
    status: 'SCHEDULED', matchTime: '09.03(목) 14:00', closingTime: '09.03(목) 13:50', venue: '인천 계양체육관',
    underOverFact: { last10OverRatio: 50, last10UnderRatio: 50, avgScoredGoals: 3.1, avgConcededGoals: 1.8, isFiveBack: false, tacticDescription: '서브 득점 및 블로킹 세트 접전' }
  },
  {
    id: 'm10_bs',
    betmanRound: '프로토 승부식 98회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 10,
    sport: 'basketball',
    league: 'KBL 프로농구',
    countryFlag: '🇰🇷',
    isFavorite: false,
    lineupAlertInfo: { isPublished: true, publishedTime: '20분 전 공개', alertText: '🚨 10번 경기 (원주 DB vs 서울 SK)', keyAbsenceNotice: '⚠️ DB 강상재 선발 vs SK 자밀 워니 핫폼' },
    homeTeam: { id: 'db_promy', name: '원주 DB 프로미', logo: '🏀', countryName: '대한민국 🇰🇷', rank: 1, homeSeasonRecord: '홈 21승 6패', awaySeasonRecord: '원정 20승 7패', seasonRemainingGames: '잔여 7경기', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'KBL 1위', totalMarketValueNum: 1 },
    awayTeam: { id: 'sk_knights', name: '서울 SK 나이츠', logo: '🏀', countryName: '대한민국 🇰🇷', rank: 2, homeSeasonRecord: '홈 18승 9패', awaySeasonRecord: '원정 16승 11패', seasonRemainingGames: '잔여 7경기', recent3Form: 'GREEN', staminaStatus: 'GREEN', minutesPlayed14d: 0, totalMarketValue: 'KBL 2위', totalMarketValueNum: 2 },
    status: 'SCHEDULED', matchTime: '09.03(목) 16:00', closingTime: '09.03(목) 15:50', venue: '원주 종합체육관',
    underOverFact: { last10OverRatio: 60, last10UnderRatio: 40, avgScoredGoals: 88, avgConcededGoals: 80, isFiveBack: false, tacticDescription: '빠른 속공 및 3점슛 라인업' }
  }
];
