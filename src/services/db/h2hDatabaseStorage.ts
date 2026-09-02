import { indexedDbStorage } from './indexedDbStorage';
import { SportsEntityMappingService } from '../mappers/sportsEntityMappingService';

export interface H2HMatchRecord {
  dateStr: string;
  matchHomeTeam?: string;
  matchAwayTeam?: string;
  homeScore: number;
  awayScore: number;
  winnerName: string;
}

export interface H2HDatabaseEntity {
  h2hKey: string; // e.g. "포항스틸러스_전북현대"
  homeTeamName: string;
  awayTeamName: string;
  summaryText: string;
  homeWins: number;
  draws: number;
  awayWins: number;
  last5Matches: H2HMatchRecord[];
  lastFetchedAt: string; // ISO timestamp
  expiresAt?: string;    // 24시간 캐시 만료 시각 (ISO timestamp)
  source: 'BATCH_PREFETCH' | 'OFFICIAL_STATIC_DB' | 'FALLBACK_CROSS_FILTER';
  status: 'VERIFIED';
}

/**
 * 🏛️ H2H Database Storage (Internal DB with 24h TTL Caching)
 * 24시간 캐싱을 통해 Fallback 교차 호출 시 발생하는 API 쿼리를 0회로 절약합니다.
 */
export class H2HDatabaseStorage {
  public static readonly CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24시간
  private static instance: H2HDatabaseStorage;
  private memoryStore: Map<string, H2HDatabaseEntity> = new Map();
  private isInitialized: boolean = false;

  private constructor() {
    this.initAsync();
  }

  public static getInstance(): H2HDatabaseStorage {
    if (!H2HDatabaseStorage.instance) {
      H2HDatabaseStorage.instance = new H2HDatabaseStorage();
    }
    return H2HDatabaseStorage.instance;
  }

  public static generateKey(teamA: string, teamB: string): string {
    const a = SportsEntityMappingService.normalize(teamA);
    const b = SportsEntityMappingService.normalize(teamB);
    return `${a}_${b}`;
  }

  private isInvalidOrStale(entity: H2HDatabaseEntity): boolean {
    if (!entity || !entity.last5Matches || entity.last5Matches.length === 0) return false;
    return entity.last5Matches.some(m => {
      if (!m || !m.dateStr) return true;
      if (m.matchHomeTeam?.includes('상대팀') || m.matchAwayTeam?.includes('상대팀')) return true;
      return false;
    });
  }

  private async initAsync(): Promise<void> {
    if (this.isInitialized) return;
    try {
      // Load cached batch prefetch data from IndexedDB
      await indexedDbStorage.init();
      const persisted = await indexedDbStorage.getAllH2HRecords();
      if (persisted && persisted.length > 0) {
        for (const p of persisted) {
          if (p && p.h2hKey && !this.isInvalidOrStale(p)) {
            this.memoryStore.set(p.h2hKey, p);
          }
        }
      }
    } catch (err) {
      console.warn('[H2HDatabaseStorage] Init error:', err);
    } finally {
      this.isInitialized = true;
    }
  }

  /**
   * Save verified batch prefetch / fallback H2H record to DB (24-hour TTL).
   */
  public async saveH2HRecord(entity: H2HDatabaseEntity): Promise<void> {
    if (this.isInvalidOrStale(entity)) {
      return;
    }

    const enrichedEntity: H2HDatabaseEntity = {
      ...entity,
      expiresAt: entity.expiresAt || new Date(Date.now() + H2HDatabaseStorage.CACHE_TTL_MS).toISOString()
    };

    const normKey = H2HDatabaseStorage.generateKey(entity.homeTeamName, entity.awayTeamName);
    this.memoryStore.set(entity.h2hKey, enrichedEntity);
    this.memoryStore.set(normKey, enrichedEntity);

    try {
      await indexedDbStorage.putH2HRecords([enrichedEntity]);
    } catch (e) {
      console.warn('[H2HDatabaseStorage] Save to IndexedDB error:', e);
    }
  }

  /**
   * 🔍 Query internal DB for H2H record (No external API call)
   */
  public getH2H(teamA: string, teamB: string): H2HDatabaseEntity | null {
    if (!teamA || !teamB) return null;
    const key1 = H2HDatabaseStorage.generateKey(teamA, teamB);
    const key2 = H2HDatabaseStorage.generateKey(teamB, teamA);

    // Direct match
    if (this.memoryStore.has(key1)) {
      const rec = this.memoryStore.get(key1)!;
      if (this.isInvalidOrStale(rec)) {
        this.memoryStore.delete(key1);
        return null;
      }
      return rec;
    }

    // Reversed match (swap home/away wins)
    if (this.memoryStore.has(key2)) {
      const rev = this.memoryStore.get(key2)!;
      if (this.isInvalidOrStale(rev)) {
        this.memoryStore.delete(key2);
        return null;
      }
      return {
        ...rev,
        h2hKey: key1,
        homeTeamName: teamA,
        awayTeamName: teamB,
        homeWins: rev.awayWins,
        awayWins: rev.homeWins
      };
    }

    // Exact Entity Matching in internal DB
    for (const [dbKey, entity] of this.memoryStore.entries()) {
      const parts = dbKey.split('_');
      if (parts.length < 2) continue;
      const dbA = parts[0];
      const dbB = parts[1];

      if (SportsEntityMappingService.isSameTeam(dbA, teamA) && SportsEntityMappingService.isSameTeam(dbB, teamB)) {
        return entity;
      }
      if (SportsEntityMappingService.isSameTeam(dbA, teamB) && SportsEntityMappingService.isSameTeam(dbB, teamA)) {
        return {
          ...entity,
          h2hKey: key1,
          homeTeamName: teamA,
          awayTeamName: teamB,
          homeWins: entity.awayWins,
          awayWins: entity.homeWins
        };
      }
    }

    return null;
  }

  public hasRecord(teamA: string, teamB: string): boolean {
    return this.getH2H(teamA, teamB) !== null;
  }

  public getAll(): H2HDatabaseEntity[] {
    return Array.from(this.memoryStore.values());
  }

  public count(): number {
    return this.memoryStore.size;
  }
}

export const h2hDatabaseStorage = H2HDatabaseStorage.getInstance();
