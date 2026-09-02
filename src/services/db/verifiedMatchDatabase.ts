import type { Match } from '../../types/sports';
import { DataVerificationEngine } from '../verification/dataVerificationEngine';
import type { VerifiedMatchEntity, MatchVerificationAudit, VerificationAuditReport, MatchQueryFilter } from '../verification/types';
import { indexedDbStorage } from './indexedDbStorage';
import { adminQuarantineService } from '../verification/adminQuarantineService';

export class VerifiedMatchDatabase {
  private static instance: VerifiedMatchDatabase;
  private memoryStore: Map<string, VerifiedMatchEntity> = new Map();
  private latestAuditReport: VerificationAuditReport | null = null;
  private listeners: Set<() => void> = new Set();
  private isInitialized: boolean = false;

  private constructor() {
    this.initAsync();
  }

  public static getInstance(): VerifiedMatchDatabase {
    if (!VerifiedMatchDatabase.instance) {
      VerifiedMatchDatabase.instance = new VerifiedMatchDatabase();
    }
    return VerifiedMatchDatabase.instance;
  }

  /**
   * 🛡️ Zero-Trust initialization: Load saved matches from IndexedDB and RE-VERIFY all records before loading into memory.
   */
  private async initAsync(): Promise<void> {
    if (this.isInitialized) return;
    try {
      await indexedDbStorage.init();
      const persisted = await indexedDbStorage.getAllMatches();
      if (persisted && persisted.length > 0 && this.memoryStore.size === 0) {
        console.log(`[VerifiedMatchDatabase] Re-verifying ${persisted.length} persisted matches with Zero-Trust Engine...`);
        const rawList = persisted.map(e => e.match).filter(Boolean);
        const { verifiedEntities, auditReport } = DataVerificationEngine.verifyAndSanitizeMatches(rawList);

        for (const entity of verifiedEntities) {
          if (entity.match && entity.match.id) {
            this.memoryStore.set(entity.match.id, entity);
          }
        }
        this.latestAuditReport = auditReport;
        console.log(`[VerifiedMatchDatabase] Successfully verified and loaded ${this.memoryStore.size} clean matches.`);
        this.notifyListeners();
      }
    } catch (err) {
      console.warn('[VerifiedMatchDatabase] Init failed, operating with in-memory store:', err);
    } finally {
      this.isInitialized = true;
    }
  }

  /**
   * 🛡️ Force full Zero-Trust re-verification of all matches currently stored in DB.
   */
  public reverifyAllDatabase(): {
    verifiedMatches: Match[];
    auditReport: VerificationAuditReport;
  } {
    console.log('[VerifiedMatchDatabase] 🔄 Triggering Force Zero-Trust Re-Verification of all matches...');
    const allMatches = Array.from(this.memoryStore.values()).map(e => e.match);
    
    // Clear and re-verify everything from scratch
    this.memoryStore.clear();
    const { verifiedMatches, auditReport } = this.ingestAndVerifyMatches(allMatches);

    console.log(`[VerifiedMatchDatabase] ✅ Re-verification completed: ${verifiedMatches.length} matches verified, audit report generated.`);
    return { verifiedMatches, auditReport };
  }

  /**
   * 🛡️ Core pipeline: Pass raw matches through DataVerificationEngine and save verified records to DB.
   */
  public ingestAndVerifyMatches(rawMatches: Match[]): {
    verifiedMatches: Match[];
    auditReport: VerificationAuditReport;
  } {
    // 1. Run through 5-stage verification & sanitization engine
    const { verifiedEntities, auditReport } = DataVerificationEngine.verifyAndSanitizeMatches(rawMatches);

    // 2. Store verified entities in memory DB
    for (const entity of verifiedEntities) {
      this.memoryStore.set(entity.match.id, entity);
    }

    this.latestAuditReport = auditReport;

    // 3. Persist to IndexedDB asynchronously
    indexedDbStorage.putMatches(verifiedEntities).catch(err => {
      console.warn('[VerifiedMatchDatabase] Async IndexedDB save error:', err);
    });
    indexedDbStorage.saveAuditReport(auditReport).catch(() => {});

    // 4. Notify reactive UI subscribers
    this.notifyListeners();

    return {
      verifiedMatches: verifiedEntities.map(e => e.match),
      auditReport
    };
  }

  /**
   * Query verified matches from the database with flexible filtering and sorting.
   */
  public getVerifiedMatches(filter?: MatchQueryFilter): Match[] {
    let list = Array.from(this.memoryStore.values()).map(e => e.match);

    if (!filter) {
      return list.sort((a, b) => (a.betmanMatchNo || 0) - (b.betmanMatchNo || 0));
    }

    if (filter.sport && filter.sport !== 'ALL') {
      list = list.filter(m => m.sport === filter.sport);
    }

    if (filter.betmanFolder && filter.betmanFolder !== 'ALL') {
      list = list.filter(m => m.betmanFolder === filter.betmanFolder);
    }

    if (filter.betmanRound) {
      const targetTs = (filter.betmanRound.match(/\d+/) || [''])[0];
      if (targetTs) {
        list = list.filter(m => m.betmanRound.includes(targetTs) || m.id.includes(targetTs));
      }
    }

    if (filter.searchMatchNo !== undefined && !isNaN(filter.searchMatchNo)) {
      list = list.filter(m => m.betmanMatchNo === filter.searchMatchNo);
    }

    if (filter.searchTeamName && filter.searchTeamName.trim() !== '') {
      const term = filter.searchTeamName.trim().toLowerCase();
      list = list.filter(m =>
        m.homeTeam.name.toLowerCase().includes(term) ||
        m.awayTeam.name.toLowerCase().includes(term) ||
        m.league.toLowerCase().includes(term)
      );
    }

    if (filter.status) {
      list = list.filter(m => m.status === filter.status);
    }

    // Sort by match sequence number
    list.sort((a, b) => (a.betmanMatchNo || 0) - (b.betmanMatchNo || 0));

    if (filter.limit && filter.limit > 0) {
      list = list.slice(0, filter.limit);
    }

    return list;
  }

  /**
   * Retrieve a single verified match by ID.
   */
  public getVerifiedMatchById(id: string): Match | null {
    const entity = this.memoryStore.get(id);
    return entity ? entity.match : null;
  }

  /**
   * Retrieve verification audit details for a specific match.
   */
  public getMatchAudit(id: string): MatchVerificationAudit | null {
    const entity = this.memoryStore.get(id);
    return entity ? entity.audit : null;
  }

  /**
   * Get the latest global audit report.
   */
  public getLatestAuditReport(): VerificationAuditReport | null {
    return this.latestAuditReport;
  }

  /**
   * Get total count of verified matches in DB.
   */
  public count(): number {
    return this.memoryStore.size;
  }

  /**
   * Get count of matches currently waiting for official data confirmation.
   */
  public getPendingCount(): number {
    let count = 0;
    for (const entity of this.memoryStore.values()) {
      if (entity.match?.isDataCheckingPending) count++;
    }
    return count;
  }

  /**
   * Get count of matches currently quarantined in admin review queue.
   */
  public getQuarantinedCount(): number {
    return adminQuarantineService.getPendingCount();
  }

  /**
   * Clear all records in DB.
   */
  public async clearDatabase(): Promise<void> {
    this.memoryStore.clear();
    this.latestAuditReport = null;
    await indexedDbStorage.clear();
    this.notifyListeners();
  }

  /**
   * Subscribe to database updates.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    if (this.listeners.size === 0) return;
    queueMicrotask(() => {
      this.listeners.forEach(listener => {
        try {
          listener();
        } catch (err) {
          console.error('[VerifiedMatchDatabase] Listener error:', err);
        }
      });
    });
  }
}

export const verifiedMatchDatabase = VerifiedMatchDatabase.getInstance();
