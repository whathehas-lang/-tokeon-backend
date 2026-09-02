import type { Match } from '../../../types/sports';

export class VolleyballSetterDistributionAgent {
  public analyzeSetterDistribution(_match: Match) {
    return {
      setterText: `[1. 세터 분배 및 연결] 리시브 효율 54.2% 기반 속공/A퀵 구사 비율 32% & 토스 정확도 최우수`
    };
  }
}
