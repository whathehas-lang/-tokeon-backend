import type { Match } from '../../types/sports';

export type VerificationStatus = 'PASSED' | 'PASSED_WITH_WARNINGS' | 'REJECTED';

export interface VerificationCheckDetail {
  checkName: string;
  passed: boolean;
  message?: string;
}

export interface MatchVerificationAudit {
  matchId: string;
  isVerified: boolean;
  score: number; // 0 ~ 100
  status: VerificationStatus;
  passedChecks: string[];
  sanitizations: string[];
  criticalErrors: string[];
  verifiedAt: string;
}

export interface VerificationAuditReport {
  totalProcessed: number;
  passedCount: number;
  warningCount: number;
  rejectedCount: number;
  averageScore: number;
  sanitizationCounts: {
    duplicateMatchesRemoved: number;
    datesSorted: number;
    anomalousStatsFixed: number;
    lineupDuplicationsFixed: number;
    oddsSanitized: number;
  };
  lastVerifiedAt: string;
}

export interface MatchQueryFilter {
  sport?: string;
  league?: string;
  betmanFolder?: string;
  betmanRound?: string;
  searchMatchNo?: number;
  searchTeamName?: string;
  status?: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  limit?: number;
}

export interface VerifiedMatchEntity {
  match: Match;
  audit: MatchVerificationAudit;
}
