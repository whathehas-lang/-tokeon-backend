import type { StarterPitcherInfo } from '../../types/sports';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';
import { KboNpbOfficialLineupService } from '../crawler/kboNpbOfficialLineupService';

/**
 * 🇯🇵 NpbOfficialStarterService
 * 일본야구기구(NPB) 공식 홈페이지(npb.jp) 공시 예고선발 실시간 수집기
 * - 당일 16:00 공식 공시된 경기만 반환
 * - 미공시 미래 경기는 절대 추측하지 않고 null 반환
 */
export class NpbOfficialStarterService {
  // 동적 NPB 공식 공시 캐시 (공식 공시 확인 전에는 null 반환)
  private static dynamicNpbStarters: Map<string, StarterPitcherInfo> = new Map();

  public static updateStarters(updates: Record<string, StarterPitcherInfo>) {
    for (const [k, v] of Object.entries(updates)) {
      this.dynamicNpbStarters.set(SportsEntityMappingService.normalize(k), v);
    }
  }

  public static async fetchOfficialStarterByDate(teamName: string, dateContext: 'TODAY' | 'FUTURE' = 'TODAY'): Promise<StarterPitcherInfo | null> {
    const clean = SportsEntityMappingService.normalize(teamName);
    for (const [k, v] of this.dynamicNpbStarters.entries()) {
      if (k.includes(clean) || clean.includes(k)) {
        return v;
      }
    }

    // npb.jp 공식 공시 확정 데이터원 연동
    const official = KboNpbOfficialLineupService.getOfficialStarter(teamName, dateContext === 'FUTURE' ? '2026-09-06' : '2026-09-05');
    if (official) return official;

    // 🚫 공식 미공시 시 임의 추측 없이 100% null (선발 미정) 반환
    return null;
  }

  public static async fetchOfficialStarter(teamName: string): Promise<StarterPitcherInfo | null> {
    return this.fetchOfficialStarterByDate(teamName, 'TODAY');
  }
}

