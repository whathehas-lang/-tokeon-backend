import type { IndividualPitcherRecord, SeriesGamePitchLog } from '../../types/sports';

export type ValidationStatus = 'VALID' | 'REJECTED' | 'WARNING' | 'QUARANTINE_PENDING';

export interface ValidationIssue {
  ruleCode: string;
  severity: 'ERROR' | 'WARNING' | 'QUARANTINE';
  fieldName: string;
  message: string;
  observedValue: any;
}

export interface PitcherValidationResult {
  pitcherName: string;
  isValid: boolean;
  status: ValidationStatus;
  issues: ValidationIssue[];
  sanitizedPitcherRecord?: IndividualPitcherRecord;
}

export interface GameLogValidationResult {
  gameId?: string | number;
  isValid: boolean;
  status: ValidationStatus;
  issues: ValidationIssue[];
  actionTaken: 'SAVED_TO_DB' | 'REJECTED_SAVE' | 'SAVED_WITH_WARNING_FLAG' | 'HELD_IN_QUARANTINE';
}

/**
 * 🛡️ BaseballDataValidator
 * 야구 데이터 교차 검증(Cross-Validation) 및 이상치(Outlier) 자동 필터링 엔진
 */
export class BaseballDataValidator {
  /**
   * 이닝 문자열을 숫자 이닝으로 변환 (예: '5.2' -> 5 + 2/3 = 5.666, '0.1' -> 0.333)
   */
  public static parseInningsToDecimal(inningsStr?: string): number {
    if (!inningsStr) return 0;
    const parts = inningsStr.split('.');
    const fullInnings = parseInt(parts[0], 10) || 0;
    const outs = parts.length > 1 ? parseInt(parts[1], 10) || 0 : 0;
    return fullInnings + outs / 3.0;
  }

  /**
   * 1️⃣ 투수 개별 수치 상식 수준 검증
   */
  public static validatePitcher(pitcher: Partial<IndividualPitcherRecord>): PitcherValidationResult {
    const issues: ValidationIssue[] = [];
    const name = pitcher.name || '알 수 없는 투수';
    const totalPitches = pitcher.pitches ?? 0;
    const strikes = pitcher.strikes ?? 0;
    const balls = pitcher.balls ?? 0;
    const inningsStr = pitcher.inningsPitched || '0.0';
    const decimalInnings = this.parseInningsToDecimal(inningsStr);

    // 🚨 룰 1. 음수값 검증
    if (totalPitches < 0 || strikes < 0 || balls < 0) {
      issues.push({
        ruleCode: 'RULE_NEGATIVE_VALUE',
        severity: 'ERROR',
        fieldName: 'pitches',
        message: '투구수, 스트라이크 또는 볼 수가 음수입니다.',
        observedValue: { totalPitches, strikes, balls }
      });
    }

    // 🚨 룰 2. 총 투구수 < 스트라이크 수 + 볼수 인 경우 ➡️ 오류 데이터 처리 (DB 저장 거부)
    if (strikes > 0 && balls > 0 && totalPitches < strikes + balls) {
      issues.push({
        ruleCode: 'RULE_PITCH_SUM_MISMATCH',
        severity: 'ERROR',
        fieldName: 'pitches',
        message: `물리적 불가능: 총 투구수(${totalPitches}구)가 스트라이크(${strikes}) + 볼(${balls}) 합계(${strikes + balls}구)보다 적습니다.`,
        observedValue: { totalPitches, sum: strikes + balls }
      });
    }

    // 🚨 룰 3. 투수 1명의 총 투구수 > 160구 인 경우 ➡️ 이상치(Outlier) 경고 플래그 생성
    if (totalPitches > 160) {
      issues.push({
        ruleCode: 'RULE_EXTREME_OUTLIER_PITCHES',
        severity: 'WARNING',
        fieldName: 'pitches',
        message: `현대 야구 이상치(Outlier) 경고: 투수 1명 투구수 ${totalPitches}구 감지 (160구 초과)`,
        observedValue: totalPitches
      });
    }

    // 🚨 룰 4. 이닝 수 대비 투구수 불일치 ➡️ 검증 대기 상태 전환
    // 예: 1/3이닝(0.1이닝) 던졌는데 80구 이상 입력, 또는 7이닝 이상 던졌는데 20구 미만 입력
    if (decimalInnings > 0) {
      const pitchesPerInning = totalPitches / decimalInnings;

      if (decimalInnings <= 0.34 && totalPitches >= 65) {
        issues.push({
          ruleCode: 'RULE_INNING_PITCH_ANOMALY_HIGH',
          severity: 'QUARANTINE',
          fieldName: 'inningsPitched',
          message: `이닝 대비 비정상 투구수: ${inningsStr}이닝 동안 ${totalPitches}구 투구 감지 (검증 대기 전환)`,
          observedValue: { inningsStr, totalPitches }
        });
      } else if (decimalInnings >= 6.0 && totalPitches < 25) {
        issues.push({
          ruleCode: 'RULE_INNING_PITCH_ANOMALY_LOW',
          severity: 'QUARANTINE',
          fieldName: 'inningsPitched',
          message: `이닝 대비 극단적 과소 투구수: ${inningsStr}이닝 동안 ${totalPitches}구만 기록됨 (검증 대기 전환)`,
          observedValue: { inningsStr, totalPitches }
        });
      }
    }

    // 최종 상태 판정
    const hasError = issues.some(i => i.severity === 'ERROR');
    const hasQuarantine = issues.some(i => i.severity === 'QUARANTINE');
    const hasWarning = issues.some(i => i.severity === 'WARNING');

    let status: ValidationStatus = 'VALID';
    if (hasError) status = 'REJECTED';
    else if (hasQuarantine) status = 'QUARANTINE_PENDING';
    else if (hasWarning) status = 'WARNING';

    return {
      pitcherName: name,
      isValid: !hasError && !hasQuarantine,
      status,
      issues
    };
  }

  /**
   * 2️⃣ 시리즈 경기 로그(Game Log) 전체 교차 검증
   */
  public static validateSeriesGameLog(log: Partial<SeriesGamePitchLog>): GameLogValidationResult {
    const issues: ValidationIssue[] = [];

    // 홈 선발 검증
    const homeStarterVal = this.validatePitcher({
      name: log.homeStarterName,
      pitches: log.homeStarterPitches,
      balls: log.homeStarterBalls,
      strikes: log.homeStarterStrikes
    });
    issues.push(...homeStarterVal.issues);

    // 원정 선발 검증
    const awayStarterVal = this.validatePitcher({
      name: log.awayStarterName,
      pitches: log.awayStarterPitches,
      balls: log.awayStarterBalls,
      strikes: log.awayStarterStrikes
    });
    issues.push(...awayStarterVal.issues);

    // 불펜 투구수 음수 체크
    if ((log.homeBullpenTotalPitches ?? 0) < 0) {
      issues.push({
        ruleCode: 'RULE_NEGATIVE_BULLPEN_PITCHES',
        severity: 'ERROR',
        fieldName: 'homeBullpenTotalPitches',
        message: '홈팀 불펜 총 투구수가 음수입니다.',
        observedValue: log.homeBullpenTotalPitches
      });
    }

    if ((log.awayBullpenTotalPitches ?? 0) < 0) {
      issues.push({
        ruleCode: 'RULE_NEGATIVE_BULLPEN_PITCHES',
        severity: 'ERROR',
        fieldName: 'awayBullpenTotalPitches',
        message: '원정팀 불펜 총 투구수가 음수입니다.',
        observedValue: log.awayBullpenTotalPitches
      });
    }

    const hasError = issues.some(i => i.severity === 'ERROR');
    const hasQuarantine = issues.some(i => i.severity === 'QUARANTINE');
    const hasWarning = issues.some(i => i.severity === 'WARNING');

    let actionTaken: GameLogValidationResult['actionTaken'] = 'SAVED_TO_DB';
    let status: ValidationStatus = 'VALID';

    if (hasError) {
      actionTaken = 'REJECTED_SAVE';
      status = 'REJECTED';
    } else if (hasQuarantine) {
      actionTaken = 'HELD_IN_QUARANTINE';
      status = 'QUARANTINE_PENDING';
    } else if (hasWarning) {
      actionTaken = 'SAVED_WITH_WARNING_FLAG';
      status = 'WARNING';
    }

    return {
      isValid: !hasError && !hasQuarantine,
      status,
      issues,
      actionTaken
    };
  }
}
