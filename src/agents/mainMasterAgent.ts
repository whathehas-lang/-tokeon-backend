import type { Match } from '../types/sports';

export interface RawApiPayload {
  apiProvider: 'API-Football' | 'Sportradar' | 'KBO-Stats';
  timestamp: string;
  matchId: string;
  rawStats: Record<string, unknown>;
}

export class MainMasterAgent {
  private rawArchives: RawApiPayload[] = [];
  private matchesDatabase: Match[] = [];

  constructor(initialMatches: Match[]) {
    this.matchesDatabase = initialMatches;
  }

  // Record all raw API responses and logs
  public archiveRawApiData(payload: RawApiPayload): void {
    this.rawArchives.push(payload);
  }

  // Get raw match records by Betman Match Sequence No
  public getMatchBySequenceNo(matchNo: number): Match | undefined {
    return this.matchesDatabase.find(m => m.betmanMatchNo === matchNo);
  }

  // Get all active Betman matches for a specific round
  public getMatchesForRound(roundName: string): Match[] {
    return this.matchesDatabase.filter(m => m.betmanRound === roundName);
  }

  // Save updated match data back to central warehouse
  public updateMatchRecord(updatedMatch: Match): void {
    const idx = this.matchesDatabase.findIndex(m => m.id === updatedMatch.id);
    if (idx >= 0) {
      this.matchesDatabase[idx] = updatedMatch;
    } else {
      this.matchesDatabase.push(updatedMatch);
    }
  }

  public getArchiveCount(): number {
    return this.rawArchives.length;
  }
}
