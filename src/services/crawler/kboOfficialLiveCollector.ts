import type { StarterPitcherInfo, Match } from '../../types/sports';

export interface KboOfficialGamePreview {
  gameId: string;
  gameDateTime: string;
  homeTeamName: string;
  awayTeamName: string;
  homeStarter: StarterPitcherInfo;
  awayStarter: StarterPitcherInfo;
}

/**
 * 🇰🇷 KboOfficialLiveCollector
 * 3단계 아키텍처: [앱] -> [자체 프록시 서버 /api/kbo] -> [KBO 공식 & 네이버/스포조이 게이트웨이]
 * 15분 SWR 캐싱 & 헤더 역공학 탑재
 */
export class KboOfficialLiveCollector {
  private static cache: Map<string, KboOfficialGamePreview> = new Map();
  private static lastFetchTime: number = 0;
  private static CACHE_TTL_MS = 15 * 60 * 1000;

  public static normalizeKboTeamName(name: string): string {
    const clean = (name || '').replace(/[\s\-_()]/g, '');
    if (clean.includes('LG') || clean.includes('엘지') || clean.includes('트윈스')) return 'LG';
    if (clean.includes('두산') || clean.includes('베어스')) return '두산';
    if (clean.includes('한화') || clean.includes('이글스')) return '한화';
    if (clean.includes('KIA') || clean.includes('기아') || clean.includes('타이거즈')) return 'KIA';
    if (clean.includes('삼성') || clean.includes('라이온즈')) return '삼성';
    if (clean.includes('롯데') || clean.includes('자이언츠')) return '롯데';
    if (clean.includes('키움') || clean.includes('히어로즈')) return '키움';
    if (clean.includes('KT') || clean.includes('케이티') || clean.includes('위즈')) return 'KT';
    if (clean.includes('SSG') || clean.includes('랜더스') || clean.includes('에스에스지')) return 'SSG';
    if (clean.includes('NC') || clean.includes('엔씨') || clean.includes('다이노스')) return 'NC';
    return name;
  }

  public static async fetchOfficialKboDaySchedule(): Promise<Map<string, KboOfficialGamePreview>> {
    const now = Date.now();
    if (this.cache.size > 0 && (now - this.lastFetchTime < this.CACHE_TTL_MS)) {
      return this.cache;
    }

    try {
      const scheduleUrl = `/api/kbo/schedule`;
      const response = await fetch(scheduleUrl, {
        headers: { 'Accept': 'application/json' }
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        if (data && data.games) {
          const resultMap = new Map<string, KboOfficialGamePreview>();
          for (const g of data.games) {
            resultMap.set(`${g.awayTeamName}_vs_${g.homeTeamName}`, g);
            resultMap.set(`${g.homeTeamName}_vs_${g.awayTeamName}`, g);
            resultMap.set(g.homeTeamName, g);
            resultMap.set(g.awayTeamName, g);
          }
          this.cache = resultMap;
          this.lastFetchTime = now;
          return resultMap;
        }
      }
    } catch {
      // fallback
    }

    const fallback = this.getTodayOfficialVerifiedMap();
    this.cache = fallback;
    this.lastFetchTime = now;
    return fallback;
  }

  /**
   * 🌟 100% 팩트 원칙: 공식 발표 전 임의 추측 및 과거 더미 투수 원천 차단
   * 미공시 시 빈 맵 반환 ➔ 호출부에서 '선발 미정 (공식 발표 대기 ⏳)'으로 일관 처리
   */
  public static getTodayOfficialVerifiedMap(): Map<string, KboOfficialGamePreview> {
    return new Map<string, KboOfficialGamePreview>();
  }

  public static async getOfficialStarterForMatch(match: Match): Promise<{ homeStarter: StarterPitcherInfo | null; awayStarter: StarterPitcherInfo | null }> {
    const map = await this.fetchOfficialKboDaySchedule();
    const homeClean = this.normalizeKboTeamName(match.homeTeam.name);
    const awayClean = this.normalizeKboTeamName(match.awayTeam.name);

    const direct = map.get(`${awayClean}_vs_${homeClean}`) || map.get(`${homeClean}_vs_${awayClean}`);
    if (direct) {
      const isHome = direct.homeTeamName === homeClean;
      return {
        homeStarter: isHome ? direct.homeStarter : direct.awayStarter,
        awayStarter: isHome ? direct.awayStarter : direct.homeStarter
      };
    }

    const h = map.get(homeClean);
    const a = map.get(awayClean);

    return {
      homeStarter: h ? (h.homeTeamName === homeClean ? h.homeStarter : h.awayStarter) : null,
      awayStarter: a ? (a.awayTeamName === awayClean ? a.awayStarter : a.homeStarter) : null
    };
  }
}
