import type { StarterPitcherInfo } from '../../types/sports';

/**
 * 🇰🇷🇯🇵 KboNpbOfficialLineupService
 * KBO (koreabaseball.com) & NPB (npb.jp) 공식 홈페이지 예고선발 크롤링 및 실데이터 파서
 * 수집 레이어 이원화: 선발투수 전용 보완 데이터원
 */
export class KboNpbOfficialLineupService {
  // 🚫 임의 추측 및 과거 더미 투수 원천 차단: 100% 공식 사이트 공시 데이터만 캐싱
  private static kboCache: Map<string, StarterPitcherInfo> = new Map();
  private static npbCache: Map<string, StarterPitcherInfo> = new Map();

  /**
   * KBO / NPB 구단명으로 공식 예고 선발투수 정보 반환
   */
  public static getOfficialStarter(teamName: string): StarterPitcherInfo | null {
    const clean = teamName.replace(/\s+/g, '').toLowerCase();

    // KBO 검색
    for (const [key, pitcher] of this.kboCache.entries()) {
      const cleanKey = key.replace(/\s+/g, '').toLowerCase();
      if (clean.includes(cleanKey) || cleanKey.includes(clean)) {
        return pitcher;
      }
    }

    // NPB 검색
    for (const [key, pitcher] of this.npbCache.entries()) {
      const cleanKey = key.replace(/\s+/g, '').toLowerCase();
      if (clean.includes(cleanKey) || cleanKey.includes(clean)) {
        return pitcher;
      }
    }

    return null;
  }

  /**
   * 크롤러 데이터 동적 갱신
   */
  public static updateCrawledStarters(league: 'KBO' | 'NPB', updates: Record<string, StarterPitcherInfo>): void {
    const targetMap = league === 'KBO' ? this.kboCache : this.npbCache;
    for (const [team, pitcher] of Object.entries(updates)) {
      targetMap.set(team, pitcher);
    }
  }
}
