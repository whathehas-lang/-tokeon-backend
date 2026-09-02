import type { Match } from '../../types/sports';

export interface QuarantinedMatchItem {
  id: string;
  match: Match;
  reason: string;
  detectedAt: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  originalRawPayload?: any;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
}

export class AdminQuarantineService {
  private static instance: AdminQuarantineService;
  private quarantineQueue: Map<string, QuarantinedMatchItem> = new Map();
  private listeners: Set<() => void> = new Set();

  private constructor() {}

  public static getInstance(): AdminQuarantineService {
    if (!AdminQuarantineService.instance) {
      AdminQuarantineService.instance = new AdminQuarantineService();
    }
    return AdminQuarantineService.instance;
  }

  /**
   * Put suspicious or suddenly mutated match into Quarantine.
   */
  public quarantineMatch(match: Match, reason: string, severity: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH'): void {
    const item: QuarantinedMatchItem = {
      id: match.id,
      match: {
        ...match,
        isQuarantinedForAdminReview: true,
        adminReviewReason: reason,
        isDataCheckingPending: true,
        verificationPendingReason: `⚠️ [관리자 팩트 검토 대기] ${reason}`
      },
      reason,
      detectedAt: new Date().toISOString(),
      severity,
      status: 'PENDING_REVIEW'
    };

    this.quarantineQueue.set(match.id, item);
    console.warn(`[AdminQuarantineService] 🚨 Match ${match.id} (${match.homeTeam?.name} vs ${match.awayTeam?.name}) quarantined: ${reason}`);
    this.notifyListeners();
  }

  /**
   * Check if a match is currently in quarantine queue.
   */
  public isQuarantined(matchId: string): boolean {
    const item = this.quarantineQueue.get(matchId);
    return !!item && item.status === 'PENDING_REVIEW';
  }

  /**
   * Get all pending quarantined items.
   */
  public getPendingQuarantinedItems(): QuarantinedMatchItem[] {
    return Array.from(this.quarantineQueue.values()).filter(item => item.status === 'PENDING_REVIEW');
  }

  /**
   * Admin approves a quarantined match.
   */
  public approveMatch(matchId: string): Match | null {
    const item = this.quarantineQueue.get(matchId);
    if (!item) return null;

    item.status = 'APPROVED';
    const approvedMatch: Match = {
      ...item.match,
      isQuarantinedForAdminReview: false,
      adminReviewReason: undefined,
      isDataCheckingPending: false,
      verificationPendingReason: undefined,
      verificationStatus: 'VERIFIED'
    };

    this.notifyListeners();
    return approvedMatch;
  }

  /**
   * Admin rejects a quarantined match.
   */
  public rejectMatch(matchId: string): void {
    const item = this.quarantineQueue.get(matchId);
    if (item) {
      item.status = 'REJECTED';
      this.notifyListeners();
    }
  }

  /**
   * Count of items waiting for admin review.
   */
  public getPendingCount(): number {
    return this.getPendingQuarantinedItems().length;
  }

  /**
   * Clear quarantine queue.
   */
  public clear(): void {
    this.quarantineQueue.clear();
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    if (this.listeners.size === 0) return;
    queueMicrotask(() => {
      this.listeners.forEach(l => {
        try { l(); } catch (e) { console.error(e); }
      });
    });
  }
}

export const adminQuarantineService = AdminQuarantineService.getInstance();
