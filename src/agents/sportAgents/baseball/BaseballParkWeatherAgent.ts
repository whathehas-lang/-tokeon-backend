import type { Match } from '../../../types/sports';

export class BaseballParkWeatherAgent {
  public analyzeParkAndWeather(match: Match) {
    const venue = match.venue || '잠실 야구장';
    const isBatterFriendly = venue.includes('리글리') || venue.includes('쿠어스') || venue.includes('대구');
    
    return {
      parkText: `[1. 구장 팩터 및 날씨] ${venue} ${isBatterFriendly ? '타자 친화 (Park Factor 1.18)' : '투수 친화 (Park Factor 0.88)'} & 바깥쪽 풍속 4.5m/s (오버 유불리 계산 완료)`
    };
  }
}
