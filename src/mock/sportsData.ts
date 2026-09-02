import type { Match, CommunityPost } from '../types/sports';
import { OFFICIAL_260103_MATCHES } from './official260103Schedule';

export const INITIAL_MATCHES: Match[] = OFFICIAL_260103_MATCHES;
export const LEGACY_INITIAL_MATCHES: Match[] = [
  {
    id: 'm0',
    betmanRound: '야구 승5패 8회차',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 1,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: true,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '15분 전 (경기 2시간 전)',
      alertText: '🚨 [관심 경기 라인업 공개 알림] 1번 경기 (삼성 vs KIA) 오피셜 선발 팩트 발표!',
      keyAbsenceNotice: '⚠️ [라인업 팩트] 삼성 1선발 원태인 확정 vs KIA 정해영 연투 과부하(26구 🔴) 발표!'
    },
    headToHeadRecord: {
      summaryText: '상대전적 기록이 없습니다.',
      homeWins: 0,
      draws: 0,
      awayWins: 0,
      last5Matches: []
    },
    homeTeam: {
      id: 'ssg',
      name: '삼성 라이온즈',
      logo: '⚾',
      countryName: '대한민국 🇰🇷',
      rank: 2,
      homeSeasonRecord: '홈 18승 10패',
      awaySeasonRecord: '원정 14승 14패',
      seasonRemainingGames: '잔여 16경기',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 0,
      totalMarketValue: 'KBO 2위',
      totalMarketValueNum: 2,
      bullpenStatus: 'GREEN',
      starterPitcherInfo: {
        name: '원태인',
        era: '3.12',
        winLoss: '9승 4패',
        seasonInningsPitched: '142.1이닝',
        vsOpponentEra: 'ERA 2.89',
        vsOpponentInnings: '19.0이닝',
        vsOpponentWinLoss: '2승 1패',
        comparisonAnalysisText: '🟢 [상대 강세] 시즌 ERA 대비 해당 상대팀 방어율 우수 및 이닝당 자책점 감소!',
        vsOpponentSummary: '상대전적 날짜별 기록 3경기 2승 1패 (평균 6.1이닝 2실점)',
        vsOpponentLogs: [
          { dateStr: '07.12', opponentName: 'KIA', decisionStr: '승', inningsPitched: '7.0이닝', runsAllowed: 2, earnedRuns: 2, strikeouts: 6, pitchesCount: 98, gameEra: 'ERA 2.57' },
          { dateStr: '06.02', opponentName: 'KIA', decisionStr: '패', inningsPitched: '6.0이닝', runsAllowed: 4, earnedRuns: 3, strikeouts: 5, pitchesCount: 92, gameEra: 'ERA 4.50' },
          { dateStr: '05.14', opponentName: 'KIA', decisionStr: '승', inningsPitched: '6.0이닝', runsAllowed: 1, earnedRuns: 1, strikeouts: 7, pitchesCount: 88, gameEra: 'ERA 1.50' }
        ]
      },
      recentGamesLog: [
        { dateStr: '08.26', opponentName: '한화', homeOrAway: 'HOME', teamScore: 7, opponentScore: 3, resultStr: '승' },
        { dateStr: '08.25', opponentName: '한화', homeOrAway: 'HOME', teamScore: 4, opponentScore: 2, resultStr: '승' },
        { dateStr: '08.23', opponentName: '롯데', homeOrAway: 'AWAY', teamScore: 5, opponentScore: 3, resultStr: '승' },
        { dateStr: '08.21', opponentName: '롯데', homeOrAway: 'AWAY', teamScore: 2, opponentScore: 4, resultStr: '패' },
        { dateStr: '08.20', opponentName: '두산', homeOrAway: 'HOME', teamScore: 8, opponentScore: 1, resultStr: '승' },
        { dateStr: '08.18', opponentName: '두산', homeOrAway: 'HOME', teamScore: 6, opponentScore: 5, resultStr: '승' },
        { dateStr: '08.16', opponentName: 'LG', homeOrAway: 'AWAY', teamScore: 1, opponentScore: 3, resultStr: '패' },
        { dateStr: '08.15', opponentName: 'LG', homeOrAway: 'AWAY', teamScore: 9, opponentScore: 4, resultStr: '승' },
        { dateStr: '08.13', opponentName: 'KT', homeOrAway: 'HOME', teamScore: 7, opponentScore: 2, resultStr: '승' },
        { dateStr: '08.11', opponentName: 'KT', homeOrAway: 'HOME', teamScore: 3, opponentScore: 5, resultStr: '패' }
      ]
    },
    awayTeam: {
      id: 'kia',
      name: 'KIA 타이거즈',
      logo: '🐯',
      countryName: '대한민국 🇰🇷',
      rank: 1,
      homeSeasonRecord: '홈 20승 8패',
      awaySeasonRecord: '원정 16승 12패',
      seasonRemainingGames: '잔여 15경기',
      recent3Form: 'GREEN',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 0,
      totalMarketValue: 'KBO 1위',
      totalMarketValueNum: 1,
      bullpenStatus: 'RED',
      starterPitcherInfo: {
        name: '양현종',
        era: '3.85',
        winLoss: '8승 5패',
        seasonInningsPitched: '138.0이닝',
        vsOpponentEra: 'ERA 6.55',
        vsOpponentInnings: '11.0이닝',
        vsOpponentWinLoss: '0승 1패',
        comparisonAnalysisText: '🔴 [상대 약세] 시즌 ERA 대비 해당 상대팀 방어율 상승 (피홈런 위험)',
        vsOpponentSummary: '상대전적 날짜별 기록 2경기 0승 1패 (평균 5.2이닝 4실점)',
        vsOpponentLogs: [
          { dateStr: '07.12', opponentName: '삼성', decisionStr: '패', inningsPitched: '5.1이닝', runsAllowed: 6, earnedRuns: 5, strikeouts: 4, pitchesCount: 94, gameEra: 'ERA 8.44' },
          { dateStr: '05.14', opponentName: '삼성', decisionStr: '노디시전', inningsPitched: '5.2이닝', runsAllowed: 3, earnedRuns: 3, strikeouts: 3, pitchesCount: 89, gameEra: 'ERA 4.76' }
        ]
      },
      recentGamesLog: [
        { dateStr: '08.26', opponentName: 'NC', homeOrAway: 'AWAY', teamScore: 3, opponentScore: 5, resultStr: '패' },
        { dateStr: '08.25', opponentName: 'NC', homeOrAway: 'AWAY', teamScore: 6, opponentScore: 4, resultStr: '승' },
        { dateStr: '08.23', opponentName: '키움', homeOrAway: 'HOME', teamScore: 8, opponentScore: 2, resultStr: '승' },
        { dateStr: '08.21', opponentName: '키움', homeOrAway: 'HOME', teamScore: 5, opponentScore: 1, resultStr: '승' },
        { dateStr: '08.20', opponentName: 'SSG', homeOrAway: 'AWAY', teamScore: 4, opponentScore: 7, resultStr: '패' },
        { dateStr: '08.18', opponentName: 'SSG', homeOrAway: 'AWAY', teamScore: 9, opponentScore: 3, resultStr: '승' },
        { dateStr: '08.16', opponentName: '한화', homeOrAway: 'HOME', teamScore: 2, opponentScore: 4, resultStr: '패' },
        { dateStr: '08.15', opponentName: '한화', homeOrAway: 'HOME', teamScore: 7, opponentScore: 1, resultStr: '승' },
        { dateStr: '08.13', opponentName: '롯데', homeOrAway: 'AWAY', teamScore: 6, opponentScore: 5, resultStr: '승' },
        { dateStr: '08.11', opponentName: '롯데', homeOrAway: 'AWAY', teamScore: 1, opponentScore: 8, resultStr: '패' }
      ]
    },
    homeScore: 0,
    awayScore: 0,
    status: 'SCHEDULED',
    matchTime: '08.28(목) 18:30',
    closingTime: '마감 02:45:10 남음',
    venue: '대구 삼성 라이온즈 파크 (라팍)',
    underOverFact: {
      last10OverRatio: 70,
      last10UnderRatio: 30,
      avgScoredGoals: 6.8,
      avgConcededGoals: 5.2,
      isFiveBack: false,
      tacticDescription: '대구 라팍 우외야 바람 5.4m/s ➔ 타자 친화 파크 팩터 1.25 적용 (최근 10경기 중 7경기 2.5 오버 발생)'
    },
    homeOfficialLineup: {
      formation: '야구 9인 타순 포메이션 (1선발 원태인)',
      starting11Value: 'KBO 2위',
      starting11ValueNum: 2,
      players: [
        { id: 'b_sp1', name: '원태인', number: 18, position: 'SP (선발)', marketValue: '1선발', marketValueNum: 1, seasonAvgStat: 'ERA 3.12 (9승 4패)', recent3FormStat: '최근 3경기 평균 6.1이닝 1.3자책', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'b_c1', name: '강민호', number: 47, position: 'C (포수)', marketValue: '주전포수', marketValueNum: 2, seasonAvgStat: '타율 .295 16홈런 62타점', recent3FormStat: '최근 3경기 타율 .364 2홈런', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'b_1b1', name: '디아즈', number: 38, position: '1B (1루수)', marketValue: '외국인타자', marketValueNum: 3, seasonAvgStat: '타율 .310 7홈런 24타점', recent3FormStat: '최근 3경기 타율 .400 3홈런', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'b_2b1', name: '류지혁', number: 42, position: '2B (2루수)', marketValue: '내야주전', marketValueNum: 4, seasonAvgStat: '타율 .268 2홈런 28타점', recent3FormStat: '최근 3경기 타율 .273', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_3b1', name: '김영웅', number: 5, position: '3B (3루수)', marketValue: '내야주전', marketValueNum: 5, seasonAvgStat: '타율 .262 25홈런 72타점', recent3FormStat: '최근 3경기 2홈런 6타점', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_ss1', name: '이재현', number: 7, position: 'SS (유격수)', marketValue: '내야주전', marketValueNum: 6, seasonAvgStat: '타율 .260 12홈런 45타점', recent3FormStat: '최근 3경기 타율 .300', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_lf1', name: '구자욱', number: 65, position: 'LF (좌익수)', marketValue: '외야주전', marketValueNum: 7, seasonAvgStat: '타율 .335 26홈런 92타점', recent3FormStat: '최근 3경기 타율 .417 2홈런', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'b_cf1', name: '김지찬', number: 58, position: 'CF (중견수)', marketValue: '외야주전', marketValueNum: 8, seasonAvgStat: '타율 .312 38도루 92득점', recent3FormStat: '최근 3경기 4도루 5득점', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_rf1', name: '윤정빈', number: 39, position: 'RF (우익수)', marketValue: '대체선발', marketValueNum: 9, seasonAvgStat: '타율 .285 5홈런 18타점', recent3FormStat: '최근 3경기 타율 .333 1홈런', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '2GUN_SUBSTITUTE', substituteReason: '기존 외야 주전 김헌곤 담 증세 휴식으로 2군 대체선발 윤정빈 9번 우익수 라인업 출전' }
      ]
    },
    awayOfficialLineup: {
      formation: '야구 9인 타순 포메이션 (선발 양현종)',
      starting11Value: 'KBO 1위',
      starting11ValueNum: 1,
      players: [
        { id: 'b_sp2', name: '양현종', number: 54, position: 'SP (선발)', marketValue: '선발', marketValueNum: 1, seasonAvgStat: 'ERA 3.85 (8승 5패)', recent3FormStat: '최근 3경기 평균 5.1이닝 3.0자책', formStatus: 'RED', stamina: 'YELLOW', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_c2', name: '김태군', number: 42, position: 'C (포수)', marketValue: '주전포수', marketValueNum: 2, seasonAvgStat: '타율 .262 6홈런 34타점', recent3FormStat: '최근 3경기 타율 .250', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_1b2', name: '우성혁', number: 10, position: '1B (1루수)', marketValue: '내야주전', marketValueNum: 3, seasonAvgStat: '타율 .288 12홈런 48타점', recent3FormStat: '최근 3경기 타율 .300 1홈런', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_2b2', name: '김선빈', number: 3, position: '2B (2루수)', marketValue: '내야주전', marketValueNum: 4, seasonAvgStat: '타율 .315 8홈런 52타점', recent3FormStat: '최근 3경기 타율 .333', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_3b2', name: '김도영', number: 5, position: '3B (3루수)', marketValue: '내야주전', marketValueNum: 5, seasonAvgStat: '타율 .347 38홈런 40도루 105타점', recent3FormStat: '최근 3경기 3홈런 2도루 MVP급', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'b_ss2', name: '박찬호', number: 1, position: 'SS (유격수)', marketValue: '내야주전', marketValueNum: 6, seasonAvgStat: '타율 .305 22도루 85득점', recent3FormStat: '최근 3경기 타율 .364 3도루', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_lf2', name: '소크라테스', number: 30, position: 'LF (좌익수)', marketValue: '외국인타자', marketValueNum: 7, seasonAvgStat: '타율 .300 24홈런 90타점', recent3FormStat: '최근 3경기 타율 .333 2홈런', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_cf2', name: '최원준', number: 2, position: 'CF (중견수)', marketValue: '외야주전', marketValueNum: 8, seasonAvgStat: '타율 .290 9홈런 21도루', recent3FormStat: '최근 3경기 타율 .286', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' },
        { id: 'b_rf2', name: '나성범', number: 47, position: 'RF (우익수)', marketValue: '외야주전', marketValueNum: 9, seasonAvgStat: '타율 .298 18홈런 70타점', recent3FormStat: '최근 3경기 타율 .300 1홈런', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 0, tierCategory: '1GUN_STARTER' }
      ]
    },
    baseballParkReport: {
      parkName: '대구 삼성 라이온즈 파크 (라팍)',
      league: 'KBO 리그',
      parkFactor: 1.25,
      parkType: '타자 친화형 (Octagon 99m)',
      stadiumFeaturesDescription: '좌우 펜스 99m 및 팔각형 구조로 타구 뻗음 현상 극대화 (KBO 홈런 방출 1위 구장)',
      windDirectionSpeed: '당일 우외야 방향 바람 5.4m/s (타구 뻗음 우상향 🟢)',
      vvipSensitivityAlert: '🚨 [VVIP 라팍 팩트] 당일 바람 5.4m/s + 타자 친화 파크 팩터 1.25 적용 시 최근 10경기 중 7경기 2.5 오버 다득점 팩트 일치!'
    },
    baseballSeriesPitchTracker: {
      seriesName: '삼성 vs KIA 주중 3연전 (3차전 당일)',
      currentGameIndex: 3,
      totalGamesInSeries: 3,
      homeSeriesBullpenPitchesTotal: 42,
      awaySeriesBullpenPitchesTotal: 98,
      bullpenOverloadSummaryText: '🚨 [불펜 과부하 팩트 수치] KIA 불펜 3연전 총 98구 (정해영 26구 연투 과부하 🔴) vs 삼성 불펜 총 42구 (휴식 충분 🟢)',
      games: [
        {
          gameNumber: 1,
          gameDateStr: '08.26 (1차전)',
          homeStarterName: '코너',
          homeStarterPitches: 95,
          homeBullpenTotalPitches: 18,
          homeBullpenPitchersText: '김재윤(18구)',
          awayStarterName: '네일',
          awayStarterPitches: 88,
          awayBullpenTotalPitches: 46,
          awayBullpenPitchersText: '장현식(20구), 최지민(26구)'
        },
        {
          gameNumber: 2,
          gameDateStr: '08.27 (2차전)',
          homeStarterName: '레예스',
          homeStarterPitches: 102,
          homeBullpenTotalPitches: 24,
          homeBullpenPitchersText: '임창민(24구)',
          awayStarterName: '라우어',
          awayStarterPitches: 82,
          awayBullpenTotalPitches: 52,
          awayBullpenPitchersText: '전상현(26구), 정해영(26구 연투 🔴)'
        }
      ],
      todayMatchupInfo: {
        gameDateStr: '08.28 (3차전 당일)',
        homeStarterName: '원태인',
        homeStarterSeasonEra: 'ERA 3.12 (9승 4패)',
        homeStarterVsOpponentEra: '상대전적 ERA 2.89',
        homeStarterFormBadge: { label: '🟢 상승 (우세)', isUp: true },
        homeBullpenExpectation: '불펜 총 42구 (휴식 충분 🟢)',
        awayStarterName: '양현종',
        awayStarterSeasonEra: 'ERA 3.85 (8승 5패)',
        awayStarterVsOpponentEra: '상대전적 ERA 6.55',
        awayStarterFormBadge: { label: '🔴 하강 (약세)', isUp: false },
        awayBullpenExpectation: '불펜 총 98구 (정해영 연투 과부하 🔴)'
      }
    }
  },
  {
    id: 'm1',
    betmanRound: '축구 승무패 15회차',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 2,
    sport: 'football',
    league: '프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: false,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '방금 전 (경기 1시간 전)',
      alertText: '🚨 [관심 경기 라인업 공개 알림] 2번 경기 (맨체스터U vs 아스널) 오피셜 축구 라인업 발표!',
      keyAbsenceNotice: '⚠️ [라인업 팩트] 맨유 4-3-3 호일룬 선발 복귀 vs 아스널 4-4-2 투톱 사카-제수스 배치 발표!'
    },
    headToHeadRecord: {
      summaryText: '상대전적 기록이 없습니다.',
      homeWins: 0,
      draws: 0,
      awayWins: 0,
      last5Matches: []
    },
    homeTeam: {
      id: 'mun',
      name: '맨체스터U',
      logo: '🔴',
      countryName: '영국 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      rank: 4,
      homeSeasonRecord: '홈 10승 2무 2패',
      awaySeasonRecord: '원정 4승 3무 7패',
      seasonRemainingGames: '잔여 10경기',
      recent3Form: 'GREEN',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 380,
      totalMarketValue: '4,500억',
      totalMarketValueNum: 4500,
      recentGamesLog: [
        { dateStr: '08.24', opponentName: '토트넘', homeOrAway: 'AWAY', teamScore: 2, opponentScore: 1, resultStr: '승' },
        { dateStr: '08.18', opponentName: '리버풀', homeOrAway: 'HOME', teamScore: 3, opponentScore: 1, resultStr: '승' },
        { dateStr: '08.12', opponentName: '첼시', homeOrAway: 'AWAY', teamScore: 1, opponentScore: 1, resultStr: '무' },
        { dateStr: '08.05', opponentName: '뉴캐슬', homeOrAway: 'HOME', teamScore: 4, opponentScore: 1, resultStr: '승' },
        { dateStr: '07.28', opponentName: '에버턴', homeOrAway: 'AWAY', teamScore: 2, opponentScore: 0, resultStr: '승' },
        { dateStr: '07.21', opponentName: '풀럼', homeOrAway: 'HOME', teamScore: 1, opponentScore: 0, resultStr: '승' },
        { dateStr: '07.14', opponentName: '웨스트햄', homeOrAway: 'AWAY', teamScore: 2, opponentScore: 2, resultStr: '무' },
        { dateStr: '07.07', opponentName: '울버햄튼', homeOrAway: 'HOME', teamScore: 3, opponentScore: 0, resultStr: '승' },
        { dateStr: '06.30', opponentName: '브라이튼', homeOrAway: 'AWAY', teamScore: 1, opponentScore: 2, resultStr: '패' },
        { dateStr: '06.23', opponentName: '크리스탈팰리스', homeOrAway: 'HOME', teamScore: 2, opponentScore: 1, resultStr: '승' }
      ]
    },
    awayTeam: {
      id: 'ars',
      name: '아스널',
      logo: '🔴',
      countryName: '영국 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      rank: 2,
      homeSeasonRecord: '홈 12승 2무 0패',
      awaySeasonRecord: '원정 6승 4무 4패',
      seasonRemainingGames: '잔여 10경기',
      recent3Form: 'GREEN',
      staminaStatus: 'RED',
      minutesPlayed14d: 520,
      totalMarketValue: '1조 1,000억',
      totalMarketValueNum: 11000,
      recentGamesLog: [
        { dateStr: '08.24', opponentName: '애스턴빌라', homeOrAway: 'HOME', teamScore: 2, opponentScore: 0, resultStr: '승' },
        { dateStr: '08.17', opponentName: '울버햄튼', homeOrAway: 'HOME', teamScore: 2, opponentScore: 0, resultStr: '승' },
        { dateStr: '08.10', opponentName: '브라이튼', homeOrAway: 'AWAY', teamScore: 3, opponentScore: 1, resultStr: '승' },
        { dateStr: '08.03', opponentName: '첼시', homeOrAway: 'HOME', teamScore: 3, opponentScore: 2, resultStr: '승' },
        { dateStr: '07.27', opponentName: '맨시티', homeOrAway: 'AWAY', teamScore: 0, opponentScore: 1, resultStr: '패' },
        { dateStr: '07.20', opponentName: '본머스', homeOrAway: 'HOME', teamScore: 2, opponentScore: 1, resultStr: '승' },
        { dateStr: '07.13', opponentName: '노팅엄', homeOrAway: 'AWAY', teamScore: 1, opponentScore: 1, resultStr: '무' },
        { dateStr: '07.06', opponentName: '브렌트포드', homeOrAway: 'HOME', teamScore: 4, opponentScore: 0, resultStr: '승' },
        { dateStr: '06.29', opponentName: '셰필드', homeOrAway: 'AWAY', teamScore: 6, opponentScore: 0, resultStr: '승' },
        { dateStr: '06.22', opponentName: '번리', homeOrAway: 'HOME', teamScore: 5, opponentScore: 0, resultStr: '승' }
      ]
    },
    homeScore: 2,
    awayScore: 1,
    status: 'SCHEDULED',
    matchTime: '08.28(목) 22:30',
    closingTime: '마감 02:45:10 남음',
    venue: '올드 트래포드 (Old Trafford)',
    underOverFact: {
      last10OverRatio: 70,
      last10UnderRatio: 30,
      avgScoredGoals: 2.2,
      avgConcededGoals: 1.1,
      isFiveBack: false,
      tacticDescription: '4-3-3 공격 지향 전술 가동 (최근 10경기 중 7경기 2.5 오버 발생)'
    },
    homeOfficialLineup: {
      formation: '4-3-3 포메이션 (오피셜 라인업 팩트)',
      starting11Value: '맨체스터 UTD 주전',
      starting11ValueNum: 4500,
      players: []
    },
    awayOfficialLineup: {
      formation: '4-4-2 포메이션 (오피셜 라인업 팩트)',
      starting11Value: '아스널 주전',
      starting11ValueNum: 11000,
      players: []
    }
  },
  {
    id: 'm3',
    betmanRound: '승부식 / 프로토 72회차',
    betmanFolder: 'SEUNGBUSHIK',
    betmanMatchNo: 4,
    sport: 'basketball',
    league: 'NBA 농구',
    countryFlag: '🇺🇸',
    isFavorite: false,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '10분 전 (오피셜 라인업 팩트)',
      alertText: '🚨 [관심 경기 라인업 공개 알림] 4번 경기 (LA 레이커스 vs 골든스테이트) 오피셜 5인 주전 확정!',
      keyAbsenceNotice: '⚡ 🏀 [NBA 오피셜 라인업 팩트] 5명 주전 득점지분 68.5% 집중 (르브론+데이비스 50.4점 핫폼 👑🔥) vs 골스 탐슨 부상 로테이션 휴식 발표!'
    },
    headToHeadRecord: {
      summaryText: '상대전적 기록이 없습니다.',
      homeWins: 0,
      draws: 0,
      awayWins: 0,
      last5Matches: []
    },
    homeTeam: {
      id: 'lal',
      name: 'LA 레이커스',
      logo: '🏀',
      countryName: '미국 🇺🇸',
      rank: 5,
      homeSeasonRecord: '홈 22승 10패',
      awaySeasonRecord: '원정 15승 17패',
      seasonRemainingGames: '잔여 18경기',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 220,
      totalMarketValue: 'NBA 5위',
      totalMarketValueNum: 5,
      recentGamesLog: [
        { dateStr: '08.25', opponentName: '덴버', homeOrAway: 'HOME', teamScore: 118, opponentScore: 112, resultStr: '승' },
        { dateStr: '08.23', opponentName: '피닉스', homeOrAway: 'AWAY', teamScore: 122, opponentScore: 115, resultStr: '승' },
        { dateStr: '08.20', opponentName: '클리퍼스', homeOrAway: 'HOME', teamScore: 106, opponentScore: 103, resultStr: '승' },
        { dateStr: '08.16', opponentName: '미네소타', homeOrAway: 'AWAY', teamScore: 110, opponentScore: 114, resultStr: '패' },
        { dateStr: '08.12', opponentName: '새크라멘토', homeOrAway: 'HOME', teamScore: 125, opponentScore: 118, resultStr: '승' }
      ]
    },
    awayTeam: {
      id: 'gsw',
      name: '골든스테이트',
      logo: '🌉',
      countryName: '미국 🇺🇸',
      rank: 8,
      homeSeasonRecord: '홈 18승 14패',
      awaySeasonRecord: '원정 16승 16패',
      seasonRemainingGames: '잔여 18경기',
      recent3Form: 'YELLOW',
      staminaStatus: 'RED',
      minutesPlayed14d: 240,
      totalMarketValue: 'NBA 3위',
      totalMarketValueNum: 3,
      recentGamesLog: [
        { dateStr: '08.25', opponentName: '오클라호마', homeOrAway: 'AWAY', teamScore: 102, opponentScore: 110, resultStr: '패' },
        { dateStr: '08.23', opponentName: '휴스턴', homeOrAway: 'HOME', teamScore: 115, opponentScore: 108, resultStr: '승' },
        { dateStr: '08.20', opponentName: '유타', homeOrAway: 'AWAY', teamScore: 118, opponentScore: 114, resultStr: '승' },
        { dateStr: '08.16', opponentName: '포틀랜드', homeOrAway: 'HOME', teamScore: 120, opponentScore: 105, resultStr: '승' },
        { dateStr: '08.12', opponentName: '댈러스', homeOrAway: 'AWAY', teamScore: 108, opponentScore: 116, resultStr: '패' }
      ]
    },
    homeScore: 115,
    awayScore: 108,
    status: 'SCHEDULED',
    matchTime: '08.29(금) 11:30',
    closingTime: '마감 15:45:10 남음',
    venue: '크립토닷컴 아레나 (Crypto.com Arena)',
    underOverFact: {
      last10OverRatio: 75,
      last10UnderRatio: 25,
      avgScoredGoals: 118.5,
      avgConcededGoals: 112.0,
      isFiveBack: false,
      tacticDescription: '스몰볼 페이스 고속 전개 (최근 10경기 중 7경기 225.5 오버 발생)'
    },
    homeOfficialLineup: {
      formation: '농구 5인 주전 포메이션',
      starting11Value: '1조 6,500억',
      starting11ValueNum: 16500,
      players: [
        { id: 'b_lal1', name: '러셀', number: 1, position: 'PG', marketValue: '400억', marketValueNum: 400, seasonAvgStat: '18.0점 6.3어시', recent3FormStat: '최근 3경기 3점슛 4.0개', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 210, tierCategory: '1GUN_STARTER' },
        { id: 'b_lal2', name: '리브스', number: 15, position: 'SG', marketValue: '500억', marketValueNum: 500, seasonAvgStat: '15.8점 5.5어시', recent3FormStat: '최근 3경기 야투 51%', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 220, tierCategory: '1GUN_STARTER' },
        { id: 'b_lal3', name: '르브론', number: 23, position: 'SF', marketValue: '1,200억', marketValueNum: 1200, seasonAvgStat: '25.4점 7.3리바 8.1어시', recent3FormStat: '최근 3경기 28.5점 핫폼', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 240, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'b_lal4', name: '하치무라', number: 28, position: 'PF', marketValue: '350억', marketValueNum: 350, seasonAvgStat: '13.5점 4.2리바', recent3FormStat: '최근 3경기 15.0점', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 190, tierCategory: '1GUN_STARTER' },
        { id: 'b_lal5', name: '데이비스', number: 3, position: 'C', marketValue: '1,400억', marketValueNum: 1400, seasonAvgStat: '24.8점 12.6리바 2.3블록', recent3FormStat: '최근 3경기 26.0점 14리바', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 250, tierCategory: '1GUN_STARTER', isHotForm: true }
      ]
    },
    awayOfficialLineup: {
      formation: '농구 5인 주전 포메이션',
      starting11Value: '1조 5,000억',
      starting11ValueNum: 15000,
      players: [
        { id: 'b_gsw1', name: '커리', number: 30, position: 'PG', marketValue: '1,600억', marketValueNum: 1600, seasonAvgStat: '26.8점 5.0어시', recent3FormStat: '최근 3경기 3점 5.2개 핫폼', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 250, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'b_gsw2', name: '탐슨', number: 11, position: 'SG', marketValue: '800억', marketValueNum: 800, seasonAvgStat: '17.2점 3.5리바', recent3FormStat: '최근 3경기 18.0점', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 220, tierCategory: '1GUN_STARTER' },
        { id: 'b_gsw3', name: '위긴스', number: 22, position: 'SF', marketValue: '700억', marketValueNum: 700, seasonAvgStat: '13.2점 4.5리바', recent3FormStat: '최근 3경기 14.0점', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 210, tierCategory: '1GUN_STARTER' },
        { id: 'b_gsw4', name: '그린', number: 23, position: 'PF', marketValue: '600억', marketValueNum: 600, seasonAvgStat: '8.6점 7.2리바 6.0어시', recent3FormStat: '최근 3경기 8.0리바 7어시', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 230, tierCategory: '1GUN_STARTER' },
        { id: 'b_gsw5', name: '루니', number: 5, position: 'C', marketValue: '300억', marketValueNum: 300, seasonAvgStat: '5.2점 7.0리바', recent3FormStat: '최근 3경기 6.5리바', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 180, tierCategory: '1GUN_STARTER' }
      ]
    },
    basketballTravelFatigueTracker: {
      summaryText: '🚨 [NBA 이동거리 & 백투백 수치 팩트] 원정팀 골든스테이트 백투백 20시간 연투 + 3,850km 비행 과부하 (4쿼터 야투율 -18.5% 급감 🔴)',
      homeFatigue: {
        teamName: 'LA 레이커스',
        isBackToBack: false,
        fatigueLevel: 'GREEN',
        travelDistanceKm: 450,
        restDaysLabel: '2일 휴식 (68시간 🟢)',
        restHours: 68,
        timeZoneChanges: 0,
        recentScheduleNotice: '최근 7일간 홈 3연전 자택 휴식 (체력 충전 100%)',
        fatigueStatusText: '🟢 [체력 최상] 2일 휴식으로 4쿼터 야투율 및 기획 수비 유지력 극상'
      },
      awayFatigue: {
        teamName: '골든스테이트',
        isBackToBack: true,
        fatigueLevel: 'RED',
        travelDistanceKm: 3850,
        restDaysLabel: '0일 (20시간 백투백 연투 🔴)',
        restHours: 20,
        timeZoneChanges: 3,
        recentScheduleNotice: '최근 6일간 대륙횡단 비행 강행군 🔴',
        fatigueStatusText: '🔴 [백투백 비행 과부하] 24시간 미만 연투 + 시차 이동으로 4쿼터 야투 성공률 -18.5% 급감 팩트'
      },
      vvipSensitivityAlert: '🚨 [VVIP NBA 팩트] 백투백 20시간 연투 + 3,850km 비행 여파로 원정팀 4쿼터 야투 성공률 -18.5% 급감 수치 검증!'
    }
  },
  {
    id: 'm4',
    betmanRound: '농구 승1패 14회차',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 5,
    sport: 'basketball',
    league: 'KBL 프로농구',
    countryFlag: '🇰🇷',
    isFavorite: false,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '실시간 팩트',
      alertText: '🚨 [농구 승1패 5번 경기] 부산 KCC vs 원주 DB 오피셜 팩트',
      keyAbsenceNotice: '⚠️ [라인업 팩트] KCC 허웅 3점 야투 성공률 42.5% 핫폼 확정!'
    },
    headToHeadRecord: {
      summaryText: '상대전적 기록이 없습니다.',
      homeWins: 0,
      draws: 0,
      awayWins: 0,
      last5Matches: []
    },
    homeTeam: {
      id: 'kcc',
      name: '부산 KCC',
      logo: '🏀',
      countryName: '대한민국 🇰🇷',
      rank: 3,
      homeSeasonRecord: '홈 15승 8패',
      awaySeasonRecord: '원정 12승 11패',
      seasonRemainingGames: '잔여 10경기',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: 'KBL 2위',
      totalMarketValueNum: 2,
      recentGamesLog: [
        { dateStr: '08.24', opponentName: 'SK', homeOrAway: 'HOME', teamScore: 85, opponentScore: 80, resultStr: '승' },
        { dateStr: '08.20', opponentName: 'KT', homeOrAway: 'AWAY', teamScore: 90, opponentScore: 82, resultStr: '승' },
        { dateStr: '08.16', opponentName: 'LG', homeOrAway: 'HOME', teamScore: 78, opponentScore: 81, resultStr: '패' }
      ]
    },
    awayTeam: {
      id: 'db',
      name: '원주 DB',
      logo: '🏀',
      countryName: '대한민국 🇰🇷',
      rank: 1,
      homeSeasonRecord: '홈 18승 5패',
      awaySeasonRecord: '원정 14승 9패',
      seasonRemainingGames: '잔여 10경기',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 190,
      totalMarketValue: 'KBL 1위',
      totalMarketValueNum: 1,
      recentGamesLog: [
        { dateStr: '08.24', opponentName: '현대모비스', homeOrAway: 'AWAY', teamScore: 92, opponentScore: 85, resultStr: '승' },
        { dateStr: '08.21', opponentName: '한국가스공사', homeOrAway: 'HOME', teamScore: 88, opponentScore: 79, resultStr: '승' },
        { dateStr: '08.17', opponentName: '소노', homeOrAway: 'AWAY', teamScore: 94, opponentScore: 86, resultStr: '승' }
      ]
    },
    homeScore: 88,
    awayScore: 84,
    status: 'SCHEDULED',
    matchTime: '08.29(금) 19:00',
    closingTime: '마감 05:20:00 남음',
    venue: '부산 사직실내체육관',
    underOverFact: {
      last10OverRatio: 60,
      last10UnderRatio: 40,
      avgScoredGoals: 85.4,
      avgConcededGoals: 82.1,
      isFiveBack: false,
      tacticDescription: 'KBL 승1패 박빙 경기 팩트 데이터'
    },
    homeOfficialLineup: {
      formation: '농구 5인 주전 포메이션',
      starting11Value: 'KBL 2위',
      starting11ValueNum: 2,
      players: [
        { id: 'b_kcc1', name: '이호현', number: 1, position: 'PG', marketValue: '1.5억', marketValueNum: 15, seasonAvgStat: '8.2점 4.1어시', recent3FormStat: '최근 3경기 4.5어시', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 180, tierCategory: '1GUN_STARTER' },
        { id: 'b_kcc2', name: '허웅', number: 3, position: 'SG', marketValue: '8.0억', marketValueNum: 80, seasonAvgStat: '16.5점 3.5어시', recent3FormStat: '최근 3경기 3점 3.5개 핫폼', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 210, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'b_kcc3', name: '최준용', number: 2, position: 'SF', marketValue: '7.0억', marketValueNum: 70, seasonAvgStat: '14.2점 5.8리바', recent3FormStat: '최근 3경기 15.0점 6리바', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 200, tierCategory: '1GUN_STARTER' },
        { id: 'b_kcc4', name: '송교창', number: 77, position: 'PF', marketValue: '7.5억', marketValueNum: 75, seasonAvgStat: '12.8점 5.2리바', recent3FormStat: '최근 3경기 13.0점', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 190, tierCategory: '1GUN_STARTER' },
        { id: 'b_kcc5', name: '라건아', number: 20, position: 'C', marketValue: '10.0억', marketValueNum: 100, seasonAvgStat: '17.5점 10.2리바', recent3FormStat: '최근 3경기 18.5점 11리바', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 220, tierCategory: '1GUN_STARTER', isHotForm: true }
      ]
    },
    awayOfficialLineup: {
      formation: '농구 5인 주전 포메이션',
      starting11Value: 'KBL 1위',
      starting11ValueNum: 1,
      players: [
        { id: 'b_db1', name: '유현준', number: 0, position: 'PG', marketValue: '4.0억', marketValueNum: 40, seasonAvgStat: '6.5점 3.8어시', recent3FormStat: '최근 3경기 4.0어시', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 170, tierCategory: '1GUN_STARTER' },
        { id: 'b_db2', name: '알바노', number: 1, position: 'SG', marketValue: '9.0억', marketValueNum: 90, seasonAvgStat: '15.9점 6.8어시', recent3FormStat: '최근 3경기 18.0점 핫폼', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 230, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'b_db3', name: '강상재', number: 13, position: 'SF', marketValue: '7.0억', marketValueNum: 70, seasonAvgStat: '14.0점 6.2리바', recent3FormStat: '최근 3경기 14.5점', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 210, tierCategory: '1GUN_STARTER' },
        { id: 'b_db4', name: '김종규', number: 15, position: 'PF', marketValue: '6.0억', marketValueNum: 60, seasonAvgStat: '11.8점 6.0리바', recent3FormStat: '최근 3경기 12.0점 1.5블록', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 200, tierCategory: '1GUN_STARTER' },
        { id: 'b_db5', name: '로슨', number: 5, position: 'C', marketValue: '12.0억', marketValueNum: 120, seasonAvgStat: '21.8점 9.8리바 4.5어시', recent3FormStat: '최근 3경기 24.0점 핫폼', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 240, tierCategory: '1GUN_STARTER', isHotForm: true }
      ]
    }
  },
  {
    id: 'm5',
    betmanRound: '기록식 38회차',
    betmanFolder: 'GIROKSIK',
    betmanMatchNo: 6,
    sport: 'football',
    league: '챔피언스리그 (UCL)',
    countryFlag: '🇪🇺',
    isFavorite: false,
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '실시간 팩트',
      alertText: '🚨 [기록식 6번 경기] 바이에른 뮌헨 vs PSG 최종 스코어 팩트',
      keyAbsenceNotice: '⚠️ [기록식 팩트] 해리 케인 최근 5경기 6골 득점 기록 팩트!'
    },
    headToHeadRecord: {
      summaryText: '상대전적 기록이 없습니다.',
      homeWins: 0,
      draws: 0,
      awayWins: 0,
      last5Matches: []
    },
    homeTeam: {
      id: 'fcb',
      name: '바이에른 뮌헨',
      logo: '🔴',
      countryName: '독일 🇩🇪',
      rank: 1,
      homeSeasonRecord: '홈 14승 1무 0패',
      awaySeasonRecord: '원정 10승 2무 2패',
      seasonRemainingGames: '잔여 6경기',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 340,
      totalMarketValue: '1조 2,000억',
      totalMarketValueNum: 12000,
      recentGamesLog: [
        { dateStr: '08.24', opponentName: '볼프스부르크', homeOrAway: 'AWAY', teamScore: 3, opponentScore: 2, resultStr: '승' },
        { dateStr: '08.17', opponentName: '울름', homeOrAway: 'AWAY', teamScore: 4, opponentScore: 0, resultStr: '승' },
        { dateStr: '08.11', opponentName: '토트넘', homeOrAway: 'HOME', teamScore: 3, opponentScore: 2, resultStr: '승' }
      ]
    },
    awayTeam: {
      id: 'psg',
      name: 'PSG',
      logo: '🔵',
      countryName: '프랑스 🇫🇷',
      rank: 1,
      homeSeasonRecord: '홈 13승 2무 0패',
      awaySeasonRecord: '원정 9승 4무 1패',
      seasonRemainingGames: '잔여 6경기',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 350,
      totalMarketValue: '1조 1,000억',
      totalMarketValueNum: 11000,
      recentGamesLog: [
        { dateStr: '08.24', opponentName: '몽펠리에', homeOrAway: 'HOME', teamScore: 6, opponentScore: 0, resultStr: '승' },
        { dateStr: '08.17', opponentName: '르아브르', homeOrAway: 'AWAY', teamScore: 4, opponentScore: 1, resultStr: '승' },
        { dateStr: '08.10', opponentName: '라이프치히', homeOrAway: 'AWAY', teamScore: 1, opponentScore: 1, resultStr: '무' }
      ]
    },
    homeScore: 3,
    awayScore: 1,
    status: 'SCHEDULED',
    matchTime: '08.30(토) 04:00',
    closingTime: '마감 28:10:00 남음',
    venue: '알리안츠 아레나 (Allianz Arena)',
    underOverFact: {
      last10OverRatio: 80,
      last10UnderRatio: 20,
      avgScoredGoals: 3.1,
      avgConcededGoals: 1.0,
      isFiveBack: false,
      tacticDescription: '기록식 최종 스코어 팩트 분석 3-1, 2-1 집중 방출'
    },
    homeOfficialLineup: {
      formation: '4-2-3-1 포메이션',
      starting11Value: '1조 2,000억',
      starting11ValueNum: 12000,
      players: [
        { id: 'f_fcb1', name: '해리케인', number: 9, position: 'FW', marketValue: '1,500억', marketValueNum: 1500, seasonAvgStat: '28골 8도움', recent3FormStat: '최근 3경기 4골 핫폼', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 270, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'f_fcb2', name: '무시알라', number: 42, position: 'FW', marketValue: '1,600억', marketValueNum: 1600, seasonAvgStat: '12골 7도움', recent3FormStat: '최근 3경기 2골 2도움', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 260, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'f_fcb3', name: '자네', number: 10, position: 'FW', marketValue: '1,000억', marketValueNum: 1000, seasonAvgStat: '9골 11도움', recent3FormStat: '최근 3경기 1골 1도움', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 240, tierCategory: '1GUN_STARTER' },
        { id: 'f_fcb4', name: '키미히', number: 6, position: 'MF', marketValue: '1,200억', marketValueNum: 1200, seasonAvgStat: '5골 10도움', recent3FormStat: '최근 3경기 패스 94%', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 270, tierCategory: '1GUN_STARTER' },
        { id: 'f_fcb5', name: '고레츠카', number: 8, position: 'MF', marketValue: '800억', marketValueNum: 800, seasonAvgStat: '6골 4도움', recent3FormStat: '최근 3경기 1골', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 250, tierCategory: '1GUN_STARTER' },
        { id: 'f_fcb6', name: '파블로비치', number: 45, position: 'MF', marketValue: '500억', marketValueNum: 500, seasonAvgStat: '2골 3도움', recent3FormStat: '최근 3경기 차단 10회', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 220, tierCategory: '1GUN_STARTER' },
        { id: 'f_fcb7', name: '데일리스', number: 19, position: 'DF', marketValue: '1,000억', marketValueNum: 1000, seasonAvgStat: '3골 6도움', recent3FormStat: '최근 3경기 오버랩 12회', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 260, tierCategory: '1GUN_STARTER' },
        { id: 'f_fcb8', name: '김민재', number: 3, position: 'DF', marketValue: '900억', marketValueNum: 900, seasonAvgStat: '2골 1도움', recent3FormStat: '최근 3경기 차단 18회 핫폼', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 270, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'f_fcb9', name: '우파메카노', number: 2, position: 'DF', marketValue: '800억', marketValueNum: 800, seasonAvgStat: '1골 1도움', recent3FormStat: '최근 3경기 경합 82%', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 250, tierCategory: '1GUN_STARTER' },
        { id: 'f_fcb10', name: '마즈라위', number: 40, position: 'DF', marketValue: '600억', marketValueNum: 600, seasonAvgStat: '1골 3도움', recent3FormStat: '최근 3경기 태클 7회', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 230, tierCategory: '1GUN_STARTER' },
        { id: 'f_fcb11', name: '노이어', number: 1, position: 'GK', marketValue: '400억', marketValueNum: 400, seasonAvgStat: '클린시트 11회', recent3FormStat: '최근 3경기 선방 12회', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 270, tierCategory: '1GUN_STARTER' }
      ]
    },
    awayOfficialLineup: {
      formation: '4-3-3 포메이션',
      starting11Value: '1조 1,000억',
      starting11ValueNum: 11000,
      players: [
        { id: 'f_psg1', name: '뎀벨레', number: 10, position: 'FW', marketValue: '1,100억', marketValueNum: 1100, seasonAvgStat: '11골 14도움', recent3FormStat: '최근 3경기 2골 1도움', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 260, tierCategory: '1GUN_STARTER' },
        { id: 'f_psg2', name: '하무스', number: 9, position: 'FW', marketValue: '800억', marketValueNum: 800, seasonAvgStat: '12골 3도움', recent3FormStat: '최근 3경기 2골', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 230, tierCategory: '1GUN_STARTER' },
        { id: 'f_psg3', name: '바르콜라', number: 29, position: 'FW', marketValue: '900억', marketValueNum: 900, seasonAvgStat: '10골 8도움', recent3FormStat: '최근 3경기 3골 핫폼', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 250, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'f_psg4', name: '비티냐', number: 17, position: 'MF', marketValue: '1,000억', marketValueNum: 1000, seasonAvgStat: '9골 6도움', recent3FormStat: '최근 3경기 2골 핫폼', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 270, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'f_psg5', name: '에메리', number: 33, position: 'MF', marketValue: '1,100억', marketValueNum: 1100, seasonAvgStat: '6골 7도움', recent3FormStat: '최근 3경기 1도움', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 260, tierCategory: '1GUN_STARTER' },
        { id: 'f_psg6', name: '루이스', number: 8, position: 'MF', marketValue: '700억', marketValueNum: 700, seasonAvgStat: '5골 5도움', recent3FormStat: '최근 3경기 패스 92%', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 240, tierCategory: '1GUN_STARTER' },
        { id: 'f_psg7', name: '멘데스', number: 25, position: 'DF', marketValue: '900억', marketValueNum: 900, seasonAvgStat: '2골 5도움', recent3FormStat: '최근 3경기 오버랩 10회', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 250, tierCategory: '1GUN_STARTER' },
        { id: 'f_psg8', name: '마르키뇨스', number: 5, position: 'DF', marketValue: '850억', marketValueNum: 850, seasonAvgStat: '3골 1도움', recent3FormStat: '최근 3경기 차단 14회', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 270, tierCategory: '1GUN_STARTER' },
        { id: 'f_psg9', name: '에르난데스', number: 21, position: 'DF', marketValue: '750억', marketValueNum: 750, seasonAvgStat: '1골 2도움', recent3FormStat: '최근 3경기 태클 9회', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 240, tierCategory: '1GUN_STARTER' },
        { id: 'f_psg10', name: '하키미', number: 2, position: 'DF', marketValue: '1,200억', marketValueNum: 1200, seasonAvgStat: '5골 7도움', recent3FormStat: '최근 3경기 1골 1도움', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 270, tierCategory: '1GUN_STARTER', isHotForm: true },
        { id: 'f_psg11', name: '돈나룸마', number: 99, position: 'GK', marketValue: '800억', marketValueNum: 800, seasonAvgStat: '클린시트 14회', recent3FormStat: '최근 3경기 선방 16회', formStatus: 'GREEN', stamina: 'GREEN', minutesPlayed14d: 270, tierCategory: '1GUN_STARTER' }
      ]
    }
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    category: 'BASEBALL',
    title: '🚨 [VVIP 팩트 알림] 대구 라팍 구장 & 날씨 팩터 공개',
    content: `안녕하세요. 토큰(Tokeon) 오피셜 팩트 분석팀입니다.

오늘 진행되는 야구 승5패 회차 [대구 삼성 라이온즈 파크 (라팍)] 구장 팩트 분석입니다.

1. **대구 삼성 라이온즈 파크 (라팍)**:
   - 좌우 펜스 99m 팔각형 구조 (타자 친화 Park Factor 1.25 적용)
   - 당일 우외야 방향 바람 5.4m/s ➔ 홈런 및 다득점(오버) 발생 확률 +38% 우상향 팩트!

*AI 주관적 예측 없이 오직 100% 팩트 데이터로 승부합니다.*`,
    authorName: '토큰공식리포터',
    authorAvatar: '🎟️',
    attachedMatchNo: 1,
    isVvipOnly: false,
    createdAt: '15분 전',
    views: 2450,
    likes: 310,
    commentsCount: 24,
    tags: ['토큰', 'tokeon.co.kr', '라팍', '대구구장', '야구VVIP'],
    comments: [
      {
        id: 'c1',
        authorName: '야구마니아',
        authorBadge: 'VVIP구독자',
        authorAvatar: '⚾',
        content: '라팍 바람 팩트 데이터 정말 유용하네요! 100% 오피셜 팩트 앱 토큰(Tokeon) 최고입니다.',
        createdAt: '5분 전',
        likes: 12
      }
    ]
  }
];
