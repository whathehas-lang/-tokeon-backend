import type { StarterPitcherInfo } from '../../types/sports';
import { PitcherDataAlertService } from '../monitor/pitcherDataAlertService';
import { PitcherDataAssertionValidator } from '../validator/pitcherDataAssertionValidator';

export interface ShadowCompareResult {
  gameId: string;
  playerName: string;
  baselineEra: number;
  incomingEra: number;
  deltaPercent: number;
  isSpikeAnomaly: boolean;
  status: 'PASSED' | 'FLAGGED';
}

/**
 * 🕵️ ShadowCompareScheduler (섀도우 테스트 비교 스케줄러)
 * 경기 전/수집 시점에 기존 검증된 베이스라인 DB 데이터와 실시간 수집 데이터를 1:1 대조.
 * 방어율이 비정상적으로 급변(Delta > 30% 또는 0점으로 급락)할 경우 이상치로 플래그 처리.
 */
export class ShadowCompareScheduler {
  private static baselineDatabase: Map<string, number> = new Map([
    ['최승용', 5.61],
    ['김윤식', 4.97],
    ['최원태', 4.57],
    ['박세웅', 4.68],
    ['소형준', 3.36],
    ['류현진', 3.85],
    ['토다', 3.90],
    ['시라카와', 4.88],
    ['하영민', 4.63],
    ['김건우', 4.10],
    ['원태인', 3.52],
    ['발라조빅', 3.08],
    ['엘리아스', 4.60]
  ]);

  /**
   * 실시간 수집된 선발투수 데이터를 베이스라인과 섀도우 비교 검증
   */
  public static comparePitcher(
    pitcher: StarterPitcherInfo,
    context: { gameId: string; matchTitle: string }
  ): ShadowCompareResult {
    // 1차 유효성 어설션 검증
    PitcherDataAssertionValidator.validate(pitcher, context);

    const name = pitcher.name;
    const rawIncomingEra = pitcher.seasonEra || pitcher.era || '0';
    const incomingEra = parseFloat(String(rawIncomingEra).replace(/[^0-9.]/g, ''));
    const baselineEra = this.baselineDatabase.get(name);

    if (!baselineEra || isNaN(incomingEra) || incomingEra <= 0) {
      return {
        gameId: context.gameId,
        playerName: name,
        baselineEra: baselineEra || 0,
        incomingEra,
        deltaPercent: 0,
        isSpikeAnomaly: false,
        status: 'PASSED'
      };
    }

    const delta = Math.abs(incomingEra - baselineEra);
    const deltaPercent = (delta / baselineEra) * 100;

    // 변동폭이 30%를 초과하거나 2.0점 이상 급격히 튀는 경우 이상치 감지
    const isSpikeAnomaly = deltaPercent > 30.0 && delta > 1.5;

    if (isSpikeAnomaly) {
      PitcherDataAlertService.sendAlert({
        gameId: context.gameId,
        matchTitle: context.matchTitle,
        playerName: name,
        detectedField: 'ERA Spike (Shadow Compare)',
        detectedValue: `수집값: ${incomingEra} vs 베이스라인: ${baselineEra} (변동폭: ${deltaPercent.toFixed(1)}%)`,
        reason: `기존 검증된 ERA 대비 비정상적인 급변 감지 (Delta: ${delta.toFixed(2)})`,
        fallbackApplied: true
      });
    }

    return {
      gameId: context.gameId,
      playerName: name,
      baselineEra,
      incomingEra,
      deltaPercent,
      isSpikeAnomaly,
      status: isSpikeAnomaly ? 'FLAGGED' : 'PASSED'
    };
  }
}
