export type FormColorStatus = 'GREEN' | 'YELLOW' | 'RED';
export type BetmanFolderCategory = 'ALL' | 'football' | 'baseball' | 'basketball' | 'volleyball' | 'hockey' | 'SEUNG5PAE' | 'SEUNGMUBAE' | 'SEUNGBUSHIK' | 'SEUNGMUPAE' | 'SEUNG1PAE' | 'HANDICAP' | 'UNDER_OVER' | 'GIROKSIK';
export type MembershipTier = 'FREE' | 'VIP' | 'VVIP';
export type ViewMode = 'VERTICAL_LIST' | 'CARD_GRID' | 'APP' | 'PC_WEB';

export interface RecentGameLog {
  dateStr?: string;
  date?: string;
  opponentName?: string;
  opponent?: string;
  homeOrAway?: 'HOME' | 'AWAY';
  isHome?: boolean;
  teamScore?: number;
  opponentScore?: number;
  score?: string;
  resultStr?: '승' | '패' | '무' | string;
  result?: string;
  matchTitle?: string;
}

export type PitcherRole = 'VICTORY' | 'PURSUIT' | 'STARTER';

export type DataVerificationSourceStatus = 'RAW' | 'VERIFIED' | 'FLAGGED';

export interface IndividualPitcherRecord {
  id: string;
  name: string;
  jerseyNumber?: number;
  role: PitcherRole; // "VICTORY" (필승조 - 빨간색), "PURSUIT" (추격조/패전조 - 검정색), "STARTER" (선발)
  roleLabel: string; // '필승조' | '추격조' | '선발'
  pitches: number; // 투구수
  balls?: number; // 볼 수
  strikes?: number; // 스트라이크 수
  inningsPitched?: string; // 소화 이닝 (예: '1.0', '0.2')
  consecutiveDays: number; // 연투 일수 (0: 휴식, 1: 1일 등판, 2: 2일 연속 연투, 3: 3연투)
  isConsecutivePitching: boolean; // 연투 여부
  recent3DaysPitches?: number[]; // 최근 3일 일자별 투구수 [어제, 그저께, 3일전]
  accumulatedSeriesPitches?: number; // 시리즈 누적 투구수
  staminaStatus?: 'GREEN' | 'YELLOW' | 'RED'; // 체력 상태
  availabilityStatus?: 'AVAILABLE' | 'CAUTION' | 'REST_MANDATORY'; // 등판 가능 / 연투 주의 / 연투 제한(휴식 필수)
  sourceStatus?: DataVerificationSourceStatus; // RAW | VERIFIED | FLAGGED (집계 중 ⏳)
}

export interface PitcherOpponentGameLog {
  dateStr: string;
  opponentName: string;
  decisionStr?: '승' | '패' | '노디시전' | string;
  inningsPitched?: string;
  innings?: number | string;
  runsAllowed?: number;
  runs?: number;
  earnedRuns?: number;
  strikeouts?: number;
  pitchesCount?: number;
  gameEra?: string;
  result?: string;
  decision?: string;
}

export interface StarterPitcherInfo {
  name: string;
  era: string;
  status?: string;
  number?: number;
  throwsHand?: 'R' | 'L' | string;
  whip?: string;
  wins?: number;
  losses?: number;
  strikeouts?: number;
  inningsPitched?: string;
  winLoss?: string;
  seasonEra?: string; // 시즌 평균 방어율
  homeEra?: string; // 홈 경기 방어율 (예: "2.75")
  awayEra?: string; // 원정 경기 방어율 (예: "3.60")
  last5GamesEra?: string; // 최근 5경기 방어율 (예: "2.80")
  last3GamesEra?: string; // 최근 3경기 방어율 (예: "2.10")
  vsOpponentEra?: string; // 맞대결 방어율 (예: "2.45")
  formTrend?: 'UP' | 'DOWN' | 'STABLE'; // 상승 🟢, 하강 🔴, 보합 🟡
  formTrendBadge?: string; // 예: "🟢 폼 상승세 (ERA 하향 안정화)", "🔴 폼 하강세 (피안타/실점 증가)"
  formComparisonText?: string; // 예: "시즌 3.15 ➔ 최근 5경기 2.80 ➔ 최근 3경기 2.10 (상승 🟢)"
  walksAllowed?: number;
  hitsAllowed?: number;
  seasonInningsPitched?: string;
  vsOpponentInnings?: string;
  vsOpponentWinLoss?: string;
  comparisonAnalysisText?: string;
  vsOpponentSummary?: string;
  recentFormText?: string;
  vsOpponentLogs?: PitcherOpponentGameLog[];
}

export interface SeriesGamePitchLog {
  gameNumber: number;
  gameLabel?: string; // 예: '전전경기 (직전 시리즈)', '전경기 (직전 시리즈)', '1차전 (어제)', '2차전 (어제)', '1차전 (그저께)'
  gameDateStr: string;
  homeStarterName: string;
  homeStarterPitches: number;
  homeStarterBalls?: number; // 볼 수
  homeStarterStrikes?: number; // 스트라이크 수
  homeStarterStatsText?: string;
  homeStarterRecord?: IndividualPitcherRecord;
  homeBullpenTotalPitches: number;
  homeBullpenTotalBalls?: number; // 불펜 볼 수
  homeBullpenTotalStrikes?: number; // 불펜 스트라이크 수
  homeBullpenPitchersText: string;
  homeBullpenPitchers?: IndividualPitcherRecord[];
  homeMatchOpponentInfo?: string; // 예: "vs 한신 (1:3 패)" (1차전 시 이전 상대팀 표출)
  awayStarterName: string;
  awayStarterPitches: number;
  awayStarterBalls?: number; // 원정 볼 수
  awayStarterStrikes?: number; // 원정 스트라이크 수
  awayStarterStatsText?: string;
  awayStarterRecord?: IndividualPitcherRecord;
  awayBullpenTotalPitches: number;
  awayBullpenTotalBalls?: number; // 원정 불펜 볼 수
  awayBullpenTotalStrikes?: number; // 원정 불펜 스트라이크 수
  awayBullpenPitchersText: string;
  awayBullpenPitchers?: IndividualPitcherRecord[];
  awayMatchOpponentInfo?: string; // 예: "vs 야쿠르트 (4:1 패)" (1차전 시 이전 상대팀 표출)
  sourceStatus?: DataVerificationSourceStatus; // RAW | VERIFIED | FLAGGED (집계 중 ⏳)
}

export interface TodaySeriesMatchupInfo {
  gameNumber?: number;
  gameLabel?: string;
  gameDateStr?: string;
  homeStarter?: any;
  awayStarter?: any;
  homeStarterName?: string;
  homeStarterSeasonEra?: string;
  homeStarterHomeEra?: string; // 홈 경기 방어율
  homeStarterAwayEra?: string; // 원정 경기 방어율
  homeStarterLast5Era?: string; // 최근 5경기 방어율
  homeStarterLast3Era?: string; // 최근 3경기 방어율
  homeStarterVsOpponentEra?: string;
  homeStarterFormTrend?: 'UP' | 'DOWN' | 'STABLE'; // 상승 🟢, 하강 🔴, 보합 🟡
  homeStarterTrendBadge?: string;
  homeStarterComparisonText?: string;
  homeStarterAvgIp?: number; // ⚾ 당일 선발 평균 소화 이닝 (예: 5.2)
  homeBullpenRemainingIp?: number; // 🛡️ 불펜 잔여 담당 이닝 (9.0 - avgIp, 예: 3.8)
  homeStarterFormBadge?: { label: string; isUp: boolean };
  homeBullpenExpectation?: string;
  homeEstimatedBullpenUsage?: string;
  homeWinningBullpenStatus?: string; // 🟢 필승조(마무리/셋업맨) 가동 상태
  homeChaseBullpenStatus?: string; // 🟡 추격조(롱릴리프/패전조) 완충 상태
  homeBullpenRoster?: IndividualPitcherRecord[]; // 홈 불펜진 개별 투수 명단
  awayStarterName?: string;
  awayStarterSeasonEra?: string;
  awayStarterHomeEra?: string; // 홈 경기 방어율
  awayStarterAwayEra?: string; // 원정 경기 방어율
  awayStarterLast5Era?: string; // 최근 5경기 방어율
  awayStarterLast3Era?: string; // 최근 3경기 방어율
  awayStarterVsOpponentEra?: string;
  awayStarterFormTrend?: 'UP' | 'DOWN' | 'STABLE'; // 상승 🟢, 하강 🔴, 보합 🟡
  awayStarterTrendBadge?: string;
  awayStarterComparisonText?: string;
  awayStarterAvgIp?: number; // ⚾ 원정 당일 선발 평균 소화 이닝 (예: 4.2)
  awayBullpenRemainingIp?: number; // 🛡️ 원정 불펜 잔여 담당 이닝 (예: 4.8)
  awayStarterFormBadge?: { label: string; isUp: boolean };
  awayBullpenExpectation?: string;
  awayEstimatedBullpenUsage?: string;
  tacticalAdvantageSummary?: string;
  awayWinningBullpenStatus?: string; // 🟢 원정 필승조 가동 상태
  awayChaseBullpenStatus?: string; // 🔴 원정 추격조 완충 상태
  awayBullpenRoster?: IndividualPitcherRecord[]; // 원정 불펜진 개별 투수 명단
  bullpenHandoverVerdict?: string; // 👑 VVIP 선발-불펜 인수인계 핵심 팩트 결론
  earlyKnockoutScenarioAnalysis?: string; // 🚨 선발 6이닝 QS 호투 vs 5회 이전 조기강판 시 듀얼 시나리오 분석
}

export interface BaseballSeriesPitchTracker {
  seriesName: string;
  seriesRoundType?: 'GAME_1' | 'GAME_2' | 'GAME_3'; // 1차전, 2차전, 3차전 구분
  seriesRoundLabel?: string; // 예: '⚾ 3연전 1차전 (시리즈 첫 경기)', '⚾ 3연전 2차전 (시리즈 두 번째 경기)', '⚾ 3연전 3차전 (시리즈 세 번째 경기)'
  currentGameIndex: number;
  totalGamesInSeries: number;
  homeSeriesBullpenPitchesTotal: number;
  awaySeriesBullpenPitchesTotal: number;
  bullpenOverloadSummaryText: string;
  games: SeriesGamePitchLog[];
  todayMatchupInfo?: TodaySeriesMatchupInfo;
}

export interface BaseballTeamHittingFlow {
  teamName: string;
  seasonAvg: string; // 시즌 팀 타율 (예: '.248')
  seasonObp: string; // 시즌 팀 출루율 (예: '.324')
  seasonRunsPerGame: number; // 시즌 경기당 평균 득점 (예: 5.2)
  recent5Avg: string; // 최근 5경기 팀 타율 (예: '.288')
  recent5Obp: string; // 최근 5경기 팀 출루율 (예: '.372')
  recent5RunsPerGame: number; // 최근 5경기 경기당 평균 득점 (예: 6.4)
  hittingFlowStatus: 'HOT' | 'COLD' | 'NORMAL';
  hittingFlowLabel: string; // '🟢 【🔥 타격감 급상승 (+.037)】' vs '🔴 【📉 타격감 침체 (-.041)】'
  hittingDescription: string;
}

export interface BaseballTeamHittingReport {
  summaryTitle: string;
  homeHitting: BaseballTeamHittingFlow;
  awayHitting: BaseballTeamHittingFlow;
  matchupVerdict: string;
}

export interface BaseballParkReport {
  parkName: string;
  league: string;
  parkFactor: number;
  parkType: string;
  stadiumFeaturesDescription: string;
  windDirectionSpeed: string;
  vvipSensitivityAlert: string;
}

export interface BasketballTeamFatigueInfo {
  teamName: string;
  isBackToBack: boolean; // 백투백 (24시간 미만 연속 경기) 여부
  restHours: number; // 휴식 시간 (시간 단위 수치화)
  restDaysLabel: string; // '0일 (20시간 백투백 🔴)' vs '2일 휴식 (68시간 🟢)'
  travelDistanceKm: number; // 최근 7일 비행 이동거리 (km 단위 수치화)
  timeZoneChanges: number; // 시차 변동 (시간 단위 수치화)
  recentScheduleNotice: string; // 최근 일정 (예: '최근 6일간 4경기 강행군 🔴')
  fatigueLevel: FormColorStatus;
  fatigueStatusText: string;
}

export interface BasketballTravelFatigueTracker {
  summaryText: string;
  homeFatigue: BasketballTeamFatigueInfo;
  awayFatigue: BasketballTeamFatigueInfo;
  vvipSensitivityAlert: string;
}

export type FootballScheduleSequenceType = 'AWAY_TO_AWAY' | 'AWAY_TO_HOME' | 'HOME_TO_AWAY' | 'HOME_TO_HOME';

export interface FootballTeamTravelScheduleInfo {
  teamName: string;
  scheduleSequenceType: FootballScheduleSequenceType; // 원정->원정, 원정->홈, 홈->원정, 홈->홈
  scheduleSequenceLabel: string; // 예: '연속 원정 강행군 (원정 ➡️ 원정 🔴)', '홈 복귀전 (원정 ➡️ 홈 🟡)', '원정 출정 (홈 ➡️ 원정 🟡)', '연속 홈 휴식 (홈 ➡️ 홈 🟢)'
  travelDistanceKm: number; // 최근 14일 누적 이동거리 (km)
  lastMatchVenue: string; // 직전 경기 장소 (예: '맨체스터 원정', '런던 홈')
  currentMatchVenue: string; // 이번 경기 장소 (예: '뉴캐슬 원정', '런던 홈')
  restDays: number; // 휴식일 (예: 3일 휴식, 4일 휴식)
  restHoursLabel: string; // 예: '72시간 휴식'
  fatigueLevel: FormColorStatus; // RED, YELLOW, GREEN
  fatigueStatusText: string; // 상세 피로도 분석 문구
  scheduleDetails: string; // 일정 세부 경로
}

export interface FootballTravelFatigueTracker {
  summaryText: string;
  homeTravelInfo: FootballTeamTravelScheduleInfo;
  awayTravelInfo: FootballTeamTravelScheduleInfo;
  distanceDiffKm: number; // 홈-원정 이동거리 격차
  tacticalImpactText: string; // 전술적 영향 분석 (예: 후반 70분 이후 압박 강도 저하)
  vvipSensitivityAlert?: string;
}

export interface OfficialPlayerInfo {
  id: string;
  name: string;
  number: number;
  position: string;
  marketValue: string;
  marketValueNum: number;
  seasonAvgStat: string;
  recent3FormStat: string;
  formStatus: FormColorStatus;
  stamina: FormColorStatus;
  minutesPlayed14d: number;
  tierCategory?: '1GUN_STARTER' | '2GUN_SUBSTITUTE'; // 1군 주전 vs 2군 대체 선발
  substituteReason?: string; // 2군 대체선발 사유
  yellowCardCount?: number; // 시즌 옐로카드 누적 개수 (예: 4장)
  isCardSuspensionRisk?: boolean; // 🟨 1장 추가 시 다음 경기 출장정지 징계 위험 여부
  isHotForm?: boolean; // 👑🔥 최근 3경기 폼 절정 흐름 최고 활약자 (황금빛 아우라)
  recentMatchGoals?: number; // ⚽ 직전 경기 득점 수 (예: 1골, 2골)
  recentMatchAssists?: number; // 🅰️ 직전 경기 어시스트 수 (예: 1도움)
}

export interface OfficialTeamLineup {
  formation?: string;
  starting11Value?: string;
  starting11ValueNum?: number;
  players?: OfficialPlayerInfo[];
  homeLineup?: any;
  awayLineup?: any;
  publishedTime?: string;
  isConfirmed?: boolean;
}

export interface HeadToHeadMatch {
  dateStr: string;
  homeScore: number;
  awayScore: number;
  winnerName: string;
  matchHomeTeam?: string;
  matchAwayTeam?: string;
}

export interface HeadToHeadRecord {
  summaryText: string;
  homeWins: number;
  draws: number;
  awayWins: number;
  last5Matches: HeadToHeadMatch[];
}

export interface Team {
  id: string;
  apiTeamId?: number;
  name: string;
  logo: string;
  countryName: string;
  rank: number;
  homeSeasonRecord: string;
  awaySeasonRecord: string;
  seasonRemainingGames: string;
  recent3Form: FormColorStatus;
  staminaStatus: FormColorStatus;
  minutesPlayed14d: number;
  totalMarketValue: string;
  totalMarketValueNum: number;
  bullpenStatus?: FormColorStatus;
  starterPitcherInfo?: StarterPitcherInfo;
  recentGamesLog?: RecentGameLog[];
  xgStats?: {
    avgXg: number; // ⚽ 순수 정규 리그 평균 기대득점
    avgXga: number; // 🛡️ 순수 정규 리그 평균 기대실점 (수비 위험도)
    xgMargin: number; // 📈 xG 순수 마진 (avgXg - avgXga)
    finishingEfficiency: string; // 💡 골 결정력 효율성 (예: '+18% (결정력 우수)')
  };
}

export interface RecentMatchLog {
  dateStr?: string;
  date?: string;
  opponentName?: string;
  opponent?: string;
  homeOrAway?: 'HOME' | 'AWAY';
  isHome?: boolean;
  teamScore?: number;
  opponentScore?: number;
  score?: string;
  resultStr?: '승' | '패' | '무' | string;
  result?: string;
  matchTitle?: string;
}

export interface SoccerOffensiveMetrics {
  xg: number; // expected goals
  xa: number; // expected assists
  xgot: number; // expected goals on target
  keyPasses: number; // key passes leading to shots
  bigChancesCreated: number; // 1:1 big chances created
  offensiveVerdict: string;
}

export interface SoccerDefensiveMetrics {
  ppda: number; // passes per defensive action (lower = higher pressing)
  xga: number; // expected goals against
  interceptions: number; // interceptions count
  highTurnovers: number; // high turnovers won in opponent half
  defensiveVerdict: string;
}

export interface SoccerBuildupMetrics {
  xt: number; // expected threat
  progressivePasses: number; // progressive passes > 10 yards
  progressiveCarries: number; // progressive carries > 10 yards
  lineBreakingPasses: number; // line-breaking passes through defensive lines
  buildupVerdict: string;
}

export interface SoccerWinFactorMetrics {
  // 1. xG (기대 득점) & xGA (기대 실점)
  homeXg: number;
  awayXg: number;
  homeXga: number;
  awayXga: number;
  xgMarginDiff: number;

  // 2. 빅 찬스 (Big Chance) 창출 및 허용
  homeBigChances: number;
  awayBigChances: number;
  homeBigChancesConceded: number;
  awayBigChancesConceded: number;

  // 3. 박스 안 슈팅 비율 (Inside Box Shot %)
  homeInsideBoxShotPct: number;
  awayInsideBoxShotPct: number;
  homeInsideBoxShots: number;
  awayInsideBoxShots: number;
  homeTotalShots: number;
  awayTotalShots: number;

  // 4. 필드 틸트 (Field Tilt % - 위험지역 파이널 서드 점유율)
  homeFieldTiltPct: number;
  awayFieldTiltPct: number;
  fieldTiltLeader: 'HOME' | 'AWAY' | 'EQUAL';

  // 5. 선제골 성공률 (First Goal Win Rate %)
  homeFirstGoalWinPct: number;
  awayFirstGoalWinPct: number;
  homeFirstGoalUnbeatenPct: number;
  awayFirstGoalUnbeatenPct: number;

  // 👑 핵심 승패 판정 결론
  winFactorVerdict: string;
  keyWinFactorAdvantage: string;
}

export interface OfficialLineupInfo {
  homeLineup: OfficialTeamLineup | any[];
  awayLineup: OfficialTeamLineup | any[];
  publishedTime: string;
  isConfirmed: boolean;
  formation?: string;
  starting11Value?: string;
  starting11ValueNum?: number;
  players?: any[];
}

export interface Match {
  id: string;
  isCompleted?: boolean;
  h2hRecentMatches?: any[];
  betmanRound: string;
  betmanFolder: string;
  betmanMatchNo: number;
  betmanGameType?: '일반' | '핸디캡' | '언더오버' | '전반전' | '홀짝' | 'SUM' | string;
  handicapValue?: string;
  sport: 'football' | 'baseball' | 'basketball' | 'volleyball';
  league: string;
  countryFlag: string;
  isFavorite: boolean;
  betmanOdds?: {
    win: number | string;
    draw: number | string;
    lose: number | string;
  };
  lineupAlertInfo: {
    isPublished: boolean;
    publishedTime: string;
    alertText: string;
    keyAbsenceNotice: string;
  };
  headToHeadRecord?: HeadToHeadRecord;
  homeRecentLogs?: RecentMatchLog[];
  awayRecentLogs?: RecentMatchLog[];
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  matchTime: string;
  closingTime: string;
  venue: string;
  underOverFact?: {
    last10OverRatio: number;
    last10UnderRatio: number;
    avgScoredGoals: number;
    avgConcededGoals: number;
    isFiveBack: boolean;
    tacticDescription: string;
  };
  homeOfficialLineup?: OfficialTeamLineup;
  awayOfficialLineup?: OfficialTeamLineup;
  baseballSeriesPitchTracker?: BaseballSeriesPitchTracker;
  baseballTeamHittingReport?: BaseballTeamHittingReport;
  baseballParkReport?: BaseballParkReport;
  basketballTravelFatigueTracker?: BasketballTravelFatigueTracker;
  footballTravelFatigueTracker?: FootballTravelFatigueTracker;
  soccerOffensiveMetrics?: SoccerOffensiveMetrics;
  soccerDefensiveMetrics?: SoccerDefensiveMetrics;
  soccerBuildupMetrics?: SoccerBuildupMetrics;
  soccerWinFactorMetrics?: SoccerWinFactorMetrics;
  sourceStatus?: DataVerificationSourceStatus; // RAW | VERIFIED | FLAGGED (집계 중 ⏳)
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
  isDataCheckingPending?: boolean;
  verificationPendingReason?: string;
  isLineupAnnounced?: boolean;
  isPitcherAnnounced?: boolean;
  isQuarantinedForAdminReview?: boolean;
  adminReviewReason?: string;
  isLocked?: boolean; // 🔒 DB Lock: 경기 종료 판정 시 라이브 API 업데이트 영구 차단
  isFinalized?: boolean; // 🏆 최종 1회 단발성 조회(GET /games?id={id}) 검증 완료 여부
  finalizedAt?: string; // 오피셜 마감 시각 타임스탬프
  liveSourceChannel?: 'PRIMARY_API' | 'KBO_OFFICIAL_SUB_PIPELINE' | 'MLB_OFFICIAL_STATS'; // 수집 채널 출처
}

export interface CommunityPost {
  id: string;
  category: 'ALL' | 'FOOTBALL' | 'BASEBALL' | 'BASKETBALL';
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  attachedMatchNo?: number;
  isVvipOnly?: boolean;
  createdAt: string;
  views: number;
  likes: number;
  commentsCount: number;
  tags: string[];
  comments: {
    id: string;
    authorName: string;
    authorBadge: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
    likes: number;
  }[];
}
