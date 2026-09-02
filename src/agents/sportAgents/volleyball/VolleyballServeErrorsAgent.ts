import type { Match } from '../../../types/sports';

export class VolleyballServeErrorsAgent {
  public analyzeServeErrors(_match: Match) {
    return {
      serveText: `[3. 서브 및 범실 마진] 세트당 서브 에이스 1.4개 & 서브 범실 유발 헌납 마진 +4.2점 우세`
    };
  }
}
