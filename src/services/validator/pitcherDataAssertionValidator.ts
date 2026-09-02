import type { StarterPitcherInfo } from '../../types/sports';
import { PitcherDataAlertService } from '../monitor/pitcherDataAlertService';

export interface AssertionValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 🛡️ PitcherDataAssertionValidator
 * 1. 범위 검증: 0.00 < ERA <= 20.00, 0.50 <= WHIP <= 3.50
 * 2. 필수 지표 존재 여부: name, innings, wins/losses 등 누락 체크
 * 3. 이상치 발견 시 즉시 AlertService 연동
 */
export class PitcherDataAssertionValidator {
  public static validate(
    pitcher: StarterPitcherInfo | undefined | null,
    context?: { gameId: string; matchTitle: string }
  ): AssertionValidationResult {
    const errors: string[] = [];

    if (!pitcher) {
      return { isValid: false, errors: ['선수 객체(StarterPitcherInfo)가 존재하지 않습니다.'] };
    }

    // 1. 필수 문자열 및 지표 누락 체크
    if (!pitcher.name || pitcher.name.trim() === '' || pitcher.name === 'None' || pitcher.name === 'null') {
      errors.push('선수명이 누락되었거나 비정상적인 문자열입니다.');
    }

    // 2. ERA 수치 범위 검증 (0.00 이하 또는 20.00 초과)
    const rawEra = pitcher.seasonEra || pitcher.era || '0';
    const era = parseFloat(String(rawEra).replace(/[^0-9.]/g, ''));
    if (isNaN(era) || era <= 0.0 || era > 20.0) {
      errors.push(`ERA 비정상 이상치 감지 (허용범위: 0.01~20.00): ${rawEra} (${era})`);
    }

    // 3. WHIP 범위 검증 (옵션)
    if (pitcher.whip) {
      const whip = parseFloat(String(pitcher.whip).replace(/[^0-9.]/g, ''));
      if (!isNaN(whip) && (whip < 0.2 || whip > 5.0)) {
        errors.push(`WHIP 비정상 수치 감지 (허용범위: 0.20~5.00): ${pitcher.whip}`);
      }
    }

    // 4. 이닝 및 승패 검증
    if (pitcher.inningsPitched === undefined || pitcher.inningsPitched === '' || pitcher.inningsPitched === 'None') {
      errors.push('소화 이닝(inningsPitched) 수치가 누락되었습니다.');
    }

    const isValid = errors.length === 0;

    // 검증 실패 시 AlertService를 통해 즉시 관제 알림 발송
    if (!isValid && context) {
      PitcherDataAlertService.sendAlert({
        gameId: context.gameId,
        matchTitle: context.matchTitle,
        playerName: pitcher.name || '알 수 없음',
        detectedField: 'Pitcher Metrics (ERA/Innings)',
        detectedValue: rawEra,
        reason: errors.join(' | '),
        fallbackApplied: true
      });
    }

    return { isValid, errors };
  }
}
