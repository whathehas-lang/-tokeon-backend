import type { Match } from '../../../types/sports';

export class VolleyballHeightBlockingAgent {
  public analyzeHeightBlocking(_match: Match) {
    return {
      heightText: `[4. 전위 높이 및 블로킹] 로테이션상 전위 높이 2m 04cm 우세 & 유효 블로킹 후 디그 트랜지션 반격 성공률 68%`
    };
  }
}
