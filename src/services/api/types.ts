// DTO Definitions for External Sports API

export interface RawApiTeam {
  id: number | string;
  name: string;
  logo?: string;
  country?: string;
  rank?: number;
}

export interface RawApiFixture {
  id: number | string;
  date: string;
  status: {
    short: string; // 'NS' (Not Started), '1H', '2H', 'FT' (Finished)
    elapsed?: number;
  };
  venue?: {
    name?: string;
    city?: string;
  };
}

export interface RawApiScore {
  home?: number | null;
  away?: number | null;
}

export interface RawApiMatchResponse {
  fixture: RawApiFixture;
  league: {
    id: number | string;
    name: string;
    country: string;
    flag?: string;
    season: number;
    round?: string;
  };
  teams: {
    home: RawApiTeam;
    away: RawApiTeam;
  };
  goals?: RawApiScore;
  score?: {
    fulltime?: RawApiScore;
  };
}

export interface ApiResponseWrapper<T> {
  get: string;
  parameters?: Record<string, string>;
  errors: string[] | Record<string, string>;
  results: number;
  response: T[];
}
