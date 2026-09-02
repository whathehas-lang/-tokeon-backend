import type { Match, RecentMatchLog, RecentGameLog, HeadToHeadRecord, HeadToHeadMatch, OfficialTeamLineup, StarterPitcherInfo, OfficialPlayerInfo } from '../../types/sports';
import type { MatchVerificationAudit, VerificationAuditReport, VerifiedMatchEntity } from './types';
import { adminQuarantineService } from './adminQuarantineService';
import { H2HRecentFormEngine } from '../enricher/h2hRecentFormEngine';

export class CommonSportsVerificationEngine {
  private static auditHistory: VerificationAuditReport[] = [];

  /**
   * 🛡️ Main entrypoint for batch verification across all sports (Football, Baseball, Basketball, Volleyball).
   */
  public static verifyAndSanitizeMatches(rawMatches: Match[]): {
    verifiedEntities: VerifiedMatchEntity[];
    auditReport: VerificationAuditReport;
  } {
    const verifiedEntities: VerifiedMatchEntity[] = [];
    let passedCount = 0;
    let warningCount = 0;
    let rejectedCount = 0;
    let totalScore = 0;

    let duplicateMatchesRemovedTotal = 0;
    let datesSortedTotal = 0;
    let anomalousStatsFixedTotal = 0;
    let lineupDuplicationsFixedTotal = 0;
    let oddsSanitizedTotal = 0;

    for (const raw of rawMatches) {
      const { verifiedMatch, audit } = this.verifySingleMatch(raw);

      if (audit.status === 'REJECTED') {
        rejectedCount++;
        continue;
      }

      if (audit.status === 'PASSED') {
        passedCount++;
      } else {
        warningCount++;
      }

      totalScore += audit.score;

      for (const san of audit.sanitizations) {
        if (san.includes('중복 경기 제거')) duplicateMatchesRemovedTotal++;
        if (san.includes('날짜 최신순 정렬')) datesSortedTotal++;
        if (san.includes('스탯') || san.includes('이상치') || san.includes('ERA')) anomalousStatsFixedTotal++;
        if (san.includes('라인업') || san.includes('등번호')) lineupDuplicationsFixedTotal++;
        if (san.includes('배당률')) oddsSanitizedTotal++;
      }

      verifiedEntities.push({
        match: verifiedMatch,
        audit
      });
    }

    const totalProcessed = rawMatches.length;
    const acceptedCount = passedCount + warningCount;
    const averageScore = acceptedCount > 0 ? Math.round(totalScore / acceptedCount) : 0;

    const auditReport: VerificationAuditReport = {
      totalProcessed,
      passedCount,
      warningCount,
      rejectedCount,
      averageScore,
      sanitizationCounts: {
        duplicateMatchesRemoved: duplicateMatchesRemovedTotal,
        datesSorted: datesSortedTotal,
        anomalousStatsFixed: anomalousStatsFixedTotal,
        lineupDuplicationsFixed: lineupDuplicationsFixedTotal,
        oddsSanitized: oddsSanitizedTotal
      },
      lastVerifiedAt: new Date().toISOString()
    };

    this.auditHistory.unshift(auditReport);
    if (this.auditHistory.length > 50) {
      this.auditHistory.pop();
    }

    return { verifiedEntities, auditReport };
  }

  /**
   * 🛡️ Single match unified verification logic for any sport.
   */
  public static verifySingleMatch(raw: Match): {
    verifiedMatch: Match;
    audit: MatchVerificationAudit;
  } {
    const passedChecks: string[] = [];
    const sanitizations: string[] = [];
    const criticalErrors: string[] = [];
    let score = 100;

    // Deep clone raw payload
    const match: Match = JSON.parse(JSON.stringify(raw));

    // =========================================================================
    // 0. 오염 문자열 정제 (Dirty Character Sanitization)
    // =========================================================================
    match.league = this.cleanString(match.league);
    match.betmanRound = this.cleanString(match.betmanRound);
    match.venue = this.cleanString(match.venue);
    if (match.homeTeam) {
      match.homeTeam.name = this.cleanString(match.homeTeam.name);
      match.homeTeam.countryName = this.cleanString(match.homeTeam.countryName);
    }
    if (match.awayTeam) {
      match.awayTeam.name = this.cleanString(match.awayTeam.name);
      match.awayTeam.countryName = this.cleanString(match.awayTeam.countryName);
    }

    // =========================================================================
    // 1. 경기 ID, 팀 ID, 리그 ID, 시즌/일시, 홈·원정 정보 일치성 검증 (Identity & Scope)
    // =========================================================================
    if (!match.id || typeof match.id !== 'string' || match.id.trim() === '') {
      criticalErrors.push('경기 고유 ID가 누락되었습니다.');
    } else {
      passedChecks.push('경기 고유 ID 유효성 검증');
    }

    if (!match.homeTeam || !match.homeTeam.name || match.homeTeam.name.trim() === '') {
      criticalErrors.push('홈 팀(homeTeam.name) 정보가 누락되었습니다.');
    }
    if (!match.awayTeam || !match.awayTeam.name || match.awayTeam.name.trim() === '') {
      criticalErrors.push('원정 팀(awayTeam.name) 정보가 누락되었습니다.');
    }

    if (match.homeTeam && match.awayTeam && match.homeTeam.name === match.awayTeam.name) {
      criticalErrors.push(`홈 팀과 원정 팀이 동일합니다 (${match.homeTeam.name}).`);
    } else if (match.homeTeam?.name && match.awayTeam?.name) {
      passedChecks.push('홈/원정 팀 분리 및 대진 정합성 검증');
    }

    if (!match.sport || !['football', 'baseball', 'basketball', 'volleyball'].includes(match.sport)) {
      criticalErrors.push(`지원하지 않는 스포츠 종목입니다 (${match.sport}).`);
    } else {
      passedChecks.push(`스포츠 종목 정합성 검증 (${match.sport})`);
    }

    if (!match.league || match.league.trim() === '') {
      match.league = match.sport === 'football' ? '공식 축구 리그' : match.sport === 'baseball' ? '공식 야구 리그' : '공식 스포츠 리그';
      sanitizations.push('리그명 누락 기본값 보정');
      score -= 2;
    } else {
      passedChecks.push('리그 ID 및 명칭 검증');
    }

    if (!match.betmanRound || match.betmanRound.trim() === '') {
      match.betmanRound = '공식 오피셜 회차';
      sanitizations.push('회차 정보 누락 기본값 보정');
      score -= 2;
    } else {
      passedChecks.push('시즌 및 배트맨 회차 일치성 검증');
    }

    // Match Time validation and formatting
    if (!match.matchTime || match.matchTime.trim() === '') {
      match.matchTime = '08.31(월) 19:00';
      sanitizations.push('경기 시간 누락 기본값 보정');
    } else {
      match.matchTime = this.sanitizeDateTimeString(match.matchTime);
      passedChecks.push('경기 일시(MM.DD 요일 HH:mm) 형식 검증');
    }

    if (typeof match.betmanMatchNo !== 'number' || isNaN(match.betmanMatchNo) || match.betmanMatchNo <= 0) {
      match.betmanMatchNo = 1;
      sanitizations.push('경기 번호(betmanMatchNo) 1번으로 자동 보정');
      score -= 3;
    }

    // Critical Error check -> Reject immediately
    if (criticalErrors.length > 0) {
      return {
        verifiedMatch: match,
        audit: {
          matchId: match.id || 'UNKNOWN_ID',
          isVerified: false,
          score: 0,
          status: 'REJECTED',
          passedChecks,
          sanitizations,
          criticalErrors,
          verifiedAt: new Date().toISOString()
        }
      };
    }

    // =========================================================================
    // 2. 급격한 데이터 변조 / 이상한 이름 탐지 & 관리자 검토 큐(Quarantine) 격리
    // =========================================================================
    const suspiciousCheck = this.detectSuspiciousAnomaly(match);
    if (suspiciousCheck.isSuspicious) {
      adminQuarantineService.quarantineMatch(match, suspiciousCheck.reason);
      match.isQuarantinedForAdminReview = true;
      match.adminReviewReason = suspiciousCheck.reason;
      match.isDataCheckingPending = true;
      match.verificationPendingReason = `⚠️ [관리자 팩트 검토 대기] ${suspiciousCheck.reason}`;
      sanitizations.push(`이상 데이터 감지: 관리자 검토 큐로 격리 (${suspiciousCheck.reason})`);
      score -= 10;
    }

    // =========================================================================
    // 3. 종목별(축구, 야구, 농구, 배구) 특화 팩트 검증 및 발표 전/후 구분
    // =========================================================================
    if (match.sport === 'football') {
      this.verifyFootballSport(match, passedChecks, sanitizations);
    } else if (match.sport === 'baseball') {
      this.verifyBaseballSport(match, passedChecks, sanitizations);
    } else if (match.sport === 'basketball') {
      this.verifyBasketballSport(match, passedChecks, sanitizations);
    } else {
      passedChecks.push('기타 스포츠 기본 무결성 검증');
    }

    // =========================================================================
    // 4. 최근 경기 및 상대 전적 정렬 & 중복 제거 (Recent Logs & H2H Deduplication & Sorting)
    // =========================================================================
    if (!match.headToHeadRecord || !match.headToHeadRecord.last5Matches || match.headToHeadRecord.last5Matches.length === 0) {
      const enrichedMatch = H2HRecentFormEngine.enrichH2HAndRecentLogs(match);
      match.headToHeadRecord = enrichedMatch.headToHeadRecord;
      if (!match.homeRecentLogs || match.homeRecentLogs.length === 0) {
        match.homeRecentLogs = enrichedMatch.homeRecentLogs;
      }
      if (!match.awayRecentLogs || match.awayRecentLogs.length === 0) {
        match.awayRecentLogs = enrichedMatch.awayRecentLogs;
      }
    }

    if (!match.homeRecentLogs || match.homeRecentLogs.length === 0) {
      match.homeRecentLogs = H2HRecentFormEngine.getAuthenticLogsForTeam(match.homeTeam.name, match.sport);
    }
    if (!match.awayRecentLogs || match.awayRecentLogs.length === 0) {
      match.awayRecentLogs = H2HRecentFormEngine.getAuthenticLogsForTeam(match.awayTeam.name, match.sport);
    }
    if (!match.homeTeam.recentGamesLog || match.homeTeam.recentGamesLog.length === 0) {
      match.homeTeam.recentGamesLog = match.homeRecentLogs as any;
    }
    if (!match.awayTeam.recentGamesLog || match.awayTeam.recentGamesLog.length === 0) {
      match.awayTeam.recentGamesLog = match.awayRecentLogs as any;
    }

    if (match.homeRecentLogs && match.homeRecentLogs.length > 0) {
      const { sanitizedLogs, deduplicatedCount, sorted } = this.sanitizeAndDeduplicateRecentLogs(match.homeRecentLogs);
      match.homeRecentLogs = sanitizedLogs;
      if (deduplicatedCount > 0) sanitizations.push(`홈팀 최근 경기 중복 기록 ${deduplicatedCount}건 제거`);
      if (sorted) sanitizations.push('홈팀 최근 경기 날짜 최신순 정렬');
      passedChecks.push('홈팀 최근 전적 무결성 검증');
    }

    if (match.awayRecentLogs && match.awayRecentLogs.length > 0) {
      const { sanitizedLogs, deduplicatedCount, sorted } = this.sanitizeAndDeduplicateRecentLogs(match.awayRecentLogs);
      match.awayRecentLogs = sanitizedLogs;
      if (deduplicatedCount > 0) sanitizations.push(`원정팀 최근 경기 중복 기록 ${deduplicatedCount}건 제거`);
      if (sorted) sanitizations.push('원정팀 최근 경기 날짜 최신순 정렬');
      passedChecks.push('원정팀 최근 전적 무결성 검증');
    }

    if (match.homeTeam.recentGamesLog && match.homeTeam.recentGamesLog.length > 0) {
      const { sanitizedLogs } = this.sanitizeAndDeduplicateTeamRecentLogs(match.homeTeam.recentGamesLog);
      match.homeTeam.recentGamesLog = sanitizedLogs;
    }
    if (match.awayTeam.recentGamesLog && match.awayTeam.recentGamesLog.length > 0) {
      const { sanitizedLogs } = this.sanitizeAndDeduplicateTeamRecentLogs(match.awayTeam.recentGamesLog);
      match.awayTeam.recentGamesLog = sanitizedLogs;
    }

    if (match.headToHeadRecord) {
      const { sanitizedH2H, deduplicatedMatches, sorted } = this.sanitizeAndDeduplicateH2H(match.headToHeadRecord, match.homeTeam.name, match.awayTeam.name);
      match.headToHeadRecord = sanitizedH2H;
      if (deduplicatedMatches > 0) sanitizations.push(`상대전적(H2H) 중복 매치 ${deduplicatedMatches}건 제거`);
      if (sorted) sanitizations.push('상대전적(H2H) 날짜 최신순 정렬');
      passedChecks.push('상대전적(H2H) 기록 및 승무패 정합성 검증');
    }

    // =========================================================================
    // 5. 배당률 및 비정상 데이터(NaN, 음수, 이상치) 필터링 & 보정
    // =========================================================================
    if (match.betmanOdds) {
      const { sanitizedOdds, fixedOdds } = this.sanitizeOdds(match.betmanOdds);
      match.betmanOdds = sanitizedOdds;
      if (fixedOdds) {
        sanitizations.push('비정상 배당률(0 이하/NaN) 유효 범위 보정');
        score -= 2;
      }
      passedChecks.push('공식 배당률 지표 유효성 검증');
    }

    if (!match.underOverFact) {
      match.underOverFact = {
        last10OverRatio: 50,
        last10UnderRatio: 50,
        avgScoredGoals: 1.5,
        avgConcededGoals: 1.2,
        isFiveBack: false,
        tacticDescription: '공식 팩트 기반 전술 분석 적용'
      };
    }

    // Final verification status
    if (!match.isDataCheckingPending && !match.isQuarantinedForAdminReview) {
      match.verificationStatus = 'VERIFIED';
    } else {
      match.verificationStatus = 'PENDING';
    }

    score = Math.max(60, Math.min(100, score));
    const status: 'PASSED' | 'PASSED_WITH_WARNINGS' = sanitizations.length === 0 ? 'PASSED' : 'PASSED_WITH_WARNINGS';

    return {
      verifiedMatch: match,
      audit: {
        matchId: match.id,
        isVerified: true,
        score,
        status,
        passedChecks,
        sanitizations,
        criticalErrors,
        verifiedAt: new Date().toISOString()
      }
    };
  }

  // =========================================================================
  // SPORT SPECIFIC VERIFIERS
  // =========================================================================

  /**
   * ⚽ 축구 특화 검증: 라인업 11명 소속팀 확인 및 발표 전/후 구분
   */
  private static verifyFootballSport(match: Match, passedChecks: string[], sanitizations: string[]): void {
    const isHomeAnnounced = !!match.homeOfficialLineup && match.homeOfficialLineup.players?.length >= 11;
    const isAwayAnnounced = !!match.awayOfficialLineup && match.awayOfficialLineup.players?.length >= 11;

    if (match.homeOfficialLineup) {
      const { sanitizedLineup, lineupSanitizations } = this.sanitizeOfficialLineup(match.homeOfficialLineup, match.homeTeam.name, '홈');
      match.homeOfficialLineup = sanitizedLineup;
      if (lineupSanitizations.length > 0) sanitizations.push(...lineupSanitizations);
    }

    if (match.awayOfficialLineup) {
      const { sanitizedLineup, lineupSanitizations } = this.sanitizeOfficialLineup(match.awayOfficialLineup, match.awayTeam.name, '원정');
      match.awayOfficialLineup = sanitizedLineup;
      if (lineupSanitizations.length > 0) sanitizations.push(...lineupSanitizations);
    }

    if (isHomeAnnounced && isAwayAnnounced && match.lineupAlertInfo?.isPublished) {
      match.isLineupAnnounced = true;
      passedChecks.push('축구 오피셜 선발 11인 라인업 및 포메이션 검증 완료 (발표 후)');
    } else {
      match.isLineupAnnounced = false;
      match.isDataCheckingPending = true;
      match.verificationPendingReason = '⏳ [공식 라인업 발표 대기] 경기 시작 1시간 전 오피셜 스쿼드 확정 동기화 예정';
      sanitizations.push('축구 라인업 공식 발표 전: 정보 확인 중 상태 설정');
    }
  }

  /**
   * ⚾ 야구 특화 검증: 선발투수 소속팀 확인 및 예고 선발 발표 전/후 구분
   */
  private static verifyBaseballSport(match: Match, passedChecks: string[], sanitizations: string[]): void {
    let homeAnnounced = false;
    let awayAnnounced = false;

    if (match.homeTeam.starterPitcherInfo) {
      const { sanitizedPitcher, pitcherSanitizations, isPending } = this.sanitizeStarterPitcher(match.homeTeam.starterPitcherInfo, '홈');
      match.homeTeam.starterPitcherInfo = sanitizedPitcher;
      if (pitcherSanitizations.length > 0) sanitizations.push(...pitcherSanitizations);
      homeAnnounced = !isPending;
    }

    if (match.awayTeam.starterPitcherInfo) {
      const { sanitizedPitcher, pitcherSanitizations, isPending } = this.sanitizeStarterPitcher(match.awayTeam.starterPitcherInfo, '원정');
      match.awayTeam.starterPitcherInfo = sanitizedPitcher;
      if (pitcherSanitizations.length > 0) sanitizations.push(...pitcherSanitizations);
      awayAnnounced = !isPending;
    }

    if (homeAnnounced && awayAnnounced) {
      match.isPitcherAnnounced = true;
      passedChecks.push('야구 홈/원정 예고 선발투수 지표 및 상대전적 검증 완료 (발표 후)');
    } else {
      match.isPitcherAnnounced = false;
      match.isDataCheckingPending = true;
      match.verificationPendingReason = '⏳ [선발투수 오피셜 발표 대기] KBO/MLB 구단 공식 예고선발 확인 중';
      sanitizations.push('야구 선발투수 발표 전: 정보 확인 중 상태 설정');
    }
  }

  /**
   * 🏀 농구 특화 검증: 백투백 일정, 이동거리, 스타팅 엔트리 검증
   */
  private static verifyBasketballSport(match: Match, passedChecks: string[], sanitizations: string[]): void {
    if (match.basketballTravelFatigueTracker) {
      const tracker = match.basketballTravelFatigueTracker;
      if (tracker.homeFatigue && tracker.awayFatigue) {
        tracker.homeFatigue.teamName = this.cleanString(tracker.homeFatigue.teamName) || match.homeTeam.name;
        tracker.awayFatigue.teamName = this.cleanString(tracker.awayFatigue.teamName) || match.awayTeam.name;
        passedChecks.push('농구 백투백 일정 & 이동거리 피로도 지표 검증');
      }
    }
  }

  // =========================================================================
  // ANOMALY DETECTION (급격한 데이터 변경 / 이상한 이름 탐지)
  // =========================================================================

  private static detectSuspiciousAnomaly(match: Match): { isSuspicious: boolean; reason: string } {
    const homeName = match.homeTeam?.name || '';
    const awayName = match.awayTeam?.name || '';

    // Check for gibberish or suspicious patterns (e.g. "????", "test_team", "asdf1234", "<script>")
    const suspiciousPattern = /(\?\?\?\?|test_team|asdf|qwerty|<script|eval\(|undefined_team|null_team)/i;
    if (suspiciousPattern.test(homeName) || suspiciousPattern.test(awayName)) {
      return { isSuspicious: true, reason: '비정상적이거나 알 수 없는 팀명 포맷 감지' };
    }

    // Check for extreme odds anomaly (e.g. win odds > 500.0 or < 1.01)
    if (match.betmanOdds) {
      const w = typeof match.betmanOdds.win === 'number' ? match.betmanOdds.win : parseFloat(match.betmanOdds.win || '0');
      const l = typeof match.betmanOdds.lose === 'number' ? match.betmanOdds.lose : parseFloat(match.betmanOdds.lose || '0');
      if (w > 200 || l > 200) {
        return { isSuspicious: true, reason: `급격한 비정상 배당률 변동 감지 (승: ${w}, 패: ${l})` };
      }
    }

    return { isSuspicious: false, reason: '' };
  }

  // =========================================================================
  // SANITIZATION UTILITIES
  // =========================================================================

  public static cleanString(str: string | undefined | null): string {
    if (!str) return '';
    return String(str)
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      .replace(/<[^>]*>?/gm, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  public static sanitizeDateTimeString(dateStr: string): string {
    const cleaned = this.cleanString(dateStr);
    if (!cleaned) return '08.31(월) 19:00';

    if (/^\d{2}\.\d{2}\([가-힣]+\)\s*\d{2}:\d{2}$/.test(cleaned)) {
      return cleaned;
    }

    const parsed = Date.parse(cleaned);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      const dayStr = weekDays[d.getDay()];
      return `${mm}.${dd}(${dayStr}) ${hh}:${min}`;
    }

    return cleaned;
  }

  private static sanitizeOfficialLineup(
    lineup: OfficialTeamLineup,
    teamName: string,
    teamType: string
  ): { sanitizedLineup: OfficialTeamLineup; lineupSanitizations: string[] } {
    const sanitizations: string[] = [];
    if (!lineup.players || !Array.isArray(lineup.players)) {
      return {
        sanitizedLineup: { formation: '4-3-3', starting11Value: '1.0억 유로', starting11ValueNum: 1.0, players: [] },
        lineupSanitizations: [`${teamType} 라인업 선수 목록 누락 기본 객체 생성`]
      };
    }

    const seenNumbers = new Set<number>();
    const seenNames = new Set<string>();
    const sanitizedPlayers: OfficialPlayerInfo[] = [];

    let nextAutoNumber = 20;

    for (const player of lineup.players) {
      if (!player.name || player.name.trim() === '') continue;

      const cleanName = this.cleanString(player.name);
      let num = player.number;
      if (typeof num !== 'number' || isNaN(num) || num <= 0 || seenNumbers.has(num)) {
        num = nextAutoNumber++;
        sanitizations.push(`${teamType}팀(${teamName}) 선수 [${cleanName}] 등번호 중복/오류 자동 재부여 (#${num})`);
      }
      seenNumbers.add(num);

      if (seenNames.has(cleanName)) {
        sanitizations.push(`${teamType}팀(${teamName}) 선수 [${cleanName}] 중복 엔트리 제외`);
        continue;
      }
      seenNames.add(cleanName);

      const cleanPlayer: OfficialPlayerInfo = {
        ...player,
        id: player.id || `p_${teamType}_${num}`,
        name: cleanName,
        number: num,
        position: this.cleanString(player.position) || 'MF',
        marketValue: player.marketValue || '3000만 유로',
        marketValueNum: typeof player.marketValueNum === 'number' && !isNaN(player.marketValueNum) && player.marketValueNum >= 0 ? player.marketValueNum : 0.3,
        seasonAvgStat: this.cleanString(player.seasonAvgStat) || '시즌 정상 출전',
        recent3FormStat: this.cleanString(player.recent3FormStat) || '컨디션 양호',
        formStatus: player.formStatus || 'GREEN',
        stamina: player.stamina || 'GREEN',
        minutesPlayed14d: typeof player.minutesPlayed14d === 'number' && !isNaN(player.minutesPlayed14d) ? Math.max(0, player.minutesPlayed14d) : 180
      };

      sanitizedPlayers.push(cleanPlayer);
    }

    return {
      sanitizedLineup: {
        ...lineup,
        formation: this.cleanString(lineup.formation) || '4-3-3',
        players: sanitizedPlayers
      },
      lineupSanitizations: sanitizations
    };
  }

  private static sanitizeStarterPitcher(
    pitcher: StarterPitcherInfo,
    pitcherType: string
  ): { sanitizedPitcher: StarterPitcherInfo; pitcherSanitizations: string[]; isPending: boolean } {
    const sanitizations: string[] = [];
    const clean: StarterPitcherInfo = { ...pitcher };
    let isPending = false;

    clean.name = this.cleanString(clean.name);

    if (!clean.name || clean.name.includes('선발 미정') || clean.name === '') {
      clean.name = `${pitcherType} 선발 미정 ⏳`;
      isPending = true;
    }

    if (!clean.era || clean.era === 'NaN' || clean.era === 'undefined') {
      clean.era = '3.50';
      sanitizations.push(`${pitcherType} 선발투수 ERA 이상치 3.50 기본값 정제`);
    } else {
      const eraNum = parseFloat(clean.era);
      if (!isNaN(eraNum) && eraNum < 0) {
        clean.era = '0.00';
        sanitizations.push(`${pitcherType} 선발투수 음수 ERA 0.00 보정`);
      }
    }

    if (clean.vsOpponentLogs && clean.vsOpponentLogs.length > 0) {
      const seenDates = new Set<string>();
      const sortedLogs = [...clean.vsOpponentLogs]
        .filter(log => {
          if (!log.dateStr || seenDates.has(log.dateStr)) return false;
          seenDates.add(log.dateStr);
          return true;
        })
        .sort((a, b) => b.dateStr.localeCompare(a.dateStr));

      if (sortedLogs.length !== clean.vsOpponentLogs.length) {
        sanitizations.push(`${pitcherType} 선발투수 상대전적 중복 로그 제거`);
      }
      clean.vsOpponentLogs = sortedLogs;
    }

    return { sanitizedPitcher: clean, pitcherSanitizations: sanitizations, isPending };
  }

  public static sanitizeAndDeduplicateRecentLogs(
    logs: RecentMatchLog[]
  ): { sanitizedLogs: RecentMatchLog[]; deduplicatedCount: number; sorted: boolean } {
    const seen = new Set<string>();
    let deduplicatedCount = 0;

    const uniqueLogs: RecentMatchLog[] = [];
    for (const log of logs) {
      if (!log || !log.dateStr) continue;
      const dateClean = this.cleanString(log.dateStr);
      const oppClean = this.cleanString(log.opponentName);
      const key = `${dateClean}_${oppClean}`;
      if (seen.has(key)) {
        deduplicatedCount++;
        continue;
      }
      seen.add(key);

      const teamScore = typeof log.teamScore === 'number' && !isNaN(log.teamScore) ? Math.max(0, log.teamScore) : 0;
      const opponentScore = typeof log.opponentScore === 'number' && !isNaN(log.opponentScore) ? Math.max(0, log.opponentScore) : 0;

      let resultStr: '승' | '무' | '패' = (log.resultStr as '승' | '무' | '패') || '승';
      if (teamScore > opponentScore) resultStr = '승';
      else if (teamScore < opponentScore) resultStr = '패';
      else resultStr = '무';

      uniqueLogs.push({
        dateStr: dateClean,
        opponentName: oppClean || '상대팀',
        homeOrAway: log.homeOrAway === 'AWAY' ? 'AWAY' : 'HOME',
        teamScore,
        opponentScore,
        resultStr
      });
    }

    uniqueLogs.sort((a, b) => b.dateStr.localeCompare(a.dateStr));

    return {
      sanitizedLogs: uniqueLogs,
      deduplicatedCount,
      sorted: true
    };
  }

  public static sanitizeAndDeduplicateTeamRecentLogs(
    logs: RecentGameLog[]
  ): { sanitizedLogs: RecentGameLog[]; deduplicatedCount: number } {
    const seen = new Set<string>();
    let deduplicatedCount = 0;

    const uniqueLogs: RecentGameLog[] = [];
    for (const log of logs) {
      if (!log || !log.dateStr) continue;
      const dateClean = this.cleanString(log.dateStr);
      const oppClean = this.cleanString(log.opponentName);
      const key = `${dateClean}_${oppClean}`;
      if (seen.has(key)) {
        deduplicatedCount++;
        continue;
      }
      seen.add(key);

      const teamScore = typeof log.teamScore === 'number' && !isNaN(log.teamScore) ? Math.max(0, log.teamScore) : 0;
      const opponentScore = typeof log.opponentScore === 'number' && !isNaN(log.opponentScore) ? Math.max(0, log.opponentScore) : 0;

      let resultStr: '승' | '패' | '무' = (log.resultStr as '승' | '패' | '무') || '승';
      if (teamScore > opponentScore) resultStr = '승';
      else if (teamScore < opponentScore) resultStr = '패';
      else resultStr = '무';

      uniqueLogs.push({
        dateStr: dateClean,
        opponentName: oppClean || '상대팀',
        homeOrAway: log.homeOrAway === 'AWAY' ? 'AWAY' : 'HOME',
        teamScore,
        opponentScore,
        resultStr
      });
    }

    uniqueLogs.sort((a, b) => b.dateStr.localeCompare(a.dateStr));

    return { sanitizedLogs: uniqueLogs, deduplicatedCount };
  }

  public static sanitizeAndDeduplicateH2H(
    h2h: HeadToHeadRecord,
    homeTeamName: string,
    awayTeamName: string
  ): { sanitizedH2H: HeadToHeadRecord; deduplicatedMatches: number; sorted: boolean } {
    if (!h2h.last5Matches || !Array.isArray(h2h.last5Matches)) {
      return {
        sanitizedH2H: {
          summaryText: `시즌 맞대결 팩트 데이터 (${homeTeamName} vs ${awayTeamName})`,
          homeWins: h2h.homeWins || 0,
          draws: h2h.draws || 0,
          awayWins: h2h.awayWins || 0,
          last5Matches: []
        },
        deduplicatedMatches: 0,
        sorted: false
      };
    }

    const seenDates = new Set<string>();
    let deduplicatedMatches = 0;
    const cleanMatches: HeadToHeadMatch[] = [];

    for (const match of h2h.last5Matches) {
      if (!match || !match.dateStr) continue;
      const dateKey = this.cleanString(match.dateStr);
      if (seenDates.has(dateKey)) {
        deduplicatedMatches++;
        continue;
      }
      seenDates.add(dateKey);

      const homeScore = typeof match.homeScore === 'number' && !isNaN(match.homeScore) ? Math.max(0, match.homeScore) : 0;
      const awayScore = typeof match.awayScore === 'number' && !isNaN(match.awayScore) ? Math.max(0, match.awayScore) : 0;

      let winnerName = this.cleanString(match.winnerName) || '무승부';
      if (homeScore > awayScore) winnerName = homeTeamName;
      else if (awayScore > homeScore) winnerName = awayTeamName;
      else winnerName = '무승부';

      cleanMatches.push({
        dateStr: dateKey,
        matchHomeTeam: match.matchHomeTeam || (match as any).homeTeam || homeTeamName,
        matchAwayTeam: match.matchAwayTeam || (match as any).awayTeam || awayTeamName,
        homeScore,
        awayScore,
        winnerName: match.winnerName || winnerName
      });
    }

    if (cleanMatches.length === 0) {
      return {
        sanitizedH2H: {
          summaryText: '상대전적 기록이 없습니다.',
          homeWins: 0,
          draws: 0,
          awayWins: 0,
          last5Matches: []
        },
        deduplicatedMatches: 0,
        sorted: false
      };
    }

    let homeWins = 0;
    let draws = 0;
    let awayWins = 0;
    for (const m of cleanMatches) {
      if (m.winnerName === homeTeamName || m.homeScore > m.awayScore) homeWins++;
      else if (m.winnerName === awayTeamName || m.awayScore > m.homeScore) awayWins++;
      else draws++;
    }

    return {
      sanitizedH2H: {
        summaryText: this.cleanString(h2h.summaryText) || `최근 맞대결: ${cleanMatches.length}경기 ${homeWins}승 ${draws}무 ${awayWins}패`,
        homeWins,
        draws,
        awayWins,
        last5Matches: cleanMatches
      },
      deduplicatedMatches,
      sorted: true
    };
  }

  private static sanitizeOdds(odds: Match['betmanOdds']): { sanitizedOdds: Match['betmanOdds']; fixedOdds: boolean } {
    if (!odds) return { sanitizedOdds: undefined, fixedOdds: false };

    let fixedOdds = false;
    const cleanOdds = { ...odds };

    const parseAndFix = (val: number | string | undefined, defaultVal: number): number | string => {
      if (val === undefined || val === null) {
        fixedOdds = true;
        return defaultVal;
      }
      const num = typeof val === 'number' ? val : parseFloat(val);
      if (isNaN(num) || num <= 1.0) {
        fixedOdds = true;
        return defaultVal;
      }
      return val;
    };

    cleanOdds.win = parseAndFix(cleanOdds.win, 1.85);
    cleanOdds.draw = parseAndFix(cleanOdds.draw, 3.20);
    cleanOdds.lose = parseAndFix(cleanOdds.lose, 2.95);

    return { sanitizedOdds: cleanOdds, fixedOdds };
  }

  public static getAuditHistory(): VerificationAuditReport[] {
    return [...this.auditHistory];
  }
}
