import type { Match, BetmanFolderCategory } from '../types/sports';

export class BetmanGameManagerAgent {
  public categorizeBetmanFolder(folder: BetmanFolderCategory): string {
    switch (folder) {
      case 'SEUNGBUSHIK': return '🎟️ 프로토 승부식';
      case 'SEUNGMUPAE': return '⚽ 축구 승무패 (1~14번)';
      case 'SEUNG1PAE': return '🏀 농구 승1패 (5점차 접전 1마킹)';
      case 'SEUNG5PAE': return '⚾ 야구 승5패 (1점차 접전 1마킹)';
      case 'GIROKSIK': return '📊 프로토 기록식';
      default: return '베트맨 대진표';
    }
  }

  public formatFactReportHeader(match: Match): string {
    return `[${match.betmanMatchNo}번] ${match.homeTeam.name} vs ${match.awayTeam.name} (${match.league})`;
  }
}
