import type { Match } from '../../types/sports';

/**
 * 🎰 [배트맨 오피셜 공식 14경기 슬립 레지스트리]
 * 
 * - 축구 승무패 (G011): 50회차 (EPL & 세리에A 공식 14경기)
 * - 야구 승1패 (G024): 65회차 (KBO & MLB 공식 14경기)
 * - 농구 승5패 (G032): 현재 발매 대기 중
 */

export const BETMAN_SEUNGMUBAE_50TH_SLIP: Match[] = [
  {
    id: 'smb-50-1',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 1,
    sport: 'football',
    league: '잉글랜드 프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 23:00',
    closingTime: '09.05(토) 22:50',
    venue: 'Gtech 커뮤니티 스타디움',
    homeTeam: {
      id: 'brentford',
      name: '브렌트포드',
      rank: 10,
      homeSeasonRecord: '1승 0무 1패',
      awaySeasonRecord: '0승 1무 1패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '3.8억 유로'
    },
    awayTeam: {
      id: 'sunderland',
      name: '선덜랜드',
      rank: 16,
      homeSeasonRecord: '0승 1무 1패',
      awaySeasonRecord: '1승 0무 1패',
      recent3Form: 'YELLOW',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 180,
      totalMarketValue: '1.2억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '공식 라인업 발표',
      alertText: '🚨 1번 경기 (브렌트포드 vs 선덜랜드) 배트맨 오피셜 슬립',
      keyAbsenceNotice: '브렌트포드 홈 득점력 우세 vs 선덜랜드 역습 대비'
    }
  },
  {
    id: 'smb-50-2',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 2,
    sport: 'football',
    league: '잉글랜드 프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 23:00',
    closingTime: '09.05(토) 22:50',
    venue: '아멕스 스타디움',
    homeTeam: {
      id: 'brighton',
      name: '브라이턴',
      rank: 6,
      homeSeasonRecord: '1승 1무 0패',
      awaySeasonRecord: '1승 0무 1패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '5.2억 유로'
    },
    awayTeam: {
      id: 'leeds',
      name: '리즈U',
      rank: 14,
      homeSeasonRecord: '0승 2무 0패',
      awaySeasonRecord: '0승 1무 1패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '2.1억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '라인업 발표 완료',
      alertText: '🚨 2번 경기 (브라이턴 vs 리즈U) 배트맨 오피셜 슬립',
      keyAbsenceNotice: '브라이턴 미토마 측면 돌파 주목'
    }
  },
  {
    id: 'smb-50-3',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 3,
    sport: 'football',
    league: '잉글랜드 프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 23:00',
    closingTime: '09.05(토) 22:50',
    venue: '크레이븐 코티지',
    homeTeam: {
      id: 'fulham',
      name: '풀럼',
      rank: 11,
      homeSeasonRecord: '1승 0무 1패',
      awaySeasonRecord: '0승 1무 1패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '3.1억 유로'
    },
    awayTeam: {
      id: 'crystal',
      name: '크리스털 팰리스',
      rank: 12,
      homeSeasonRecord: '1승 0무 1패',
      awaySeasonRecord: '0승 0무 2패',
      recent3Form: 'YELLOW',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 180,
      totalMarketValue: '3.4억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '라인업 확정',
      alertText: '🚨 3번 경기 (풀럼 vs 크리스털) 런던 더비',
      keyAbsenceNotice: '중원 압박 접전 예상'
    }
  },
  {
    id: 'smb-50-4',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 4,
    sport: 'football',
    league: '잉글랜드 프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 23:00',
    closingTime: '09.05(토) 22:50',
    venue: '에티하드 스타디움',
    homeTeam: {
      id: 'mancity',
      name: '맨체스터 시티',
      rank: 1,
      homeSeasonRecord: '2승 0무 0패',
      awaySeasonRecord: '1승 0무 0패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '12.8억 유로'
    },
    awayTeam: {
      id: 'coventry',
      name: '코번트리',
      rank: 18,
      homeSeasonRecord: '0승 1무 1패',
      awaySeasonRecord: '0승 0무 2패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 180,
      totalMarketValue: '0.9억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '라인업 확정',
      alertText: '🚨 4번 경기 (맨체스터 시티 vs 코번트리) 압도적 화력 점검',
      keyAbsenceNotice: '홀란 선발 출격 확정'
    }
  },
  {
    id: 'smb-50-5',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 5,
    sport: 'football',
    league: '잉글랜드 프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 23:00',
    closingTime: '09.05(토) 22:50',
    venue: '더 시티 그라운드',
    homeTeam: {
      id: 'nottingham',
      name: '노팅엄 포레스트',
      rank: 9,
      homeSeasonRecord: '1승 1무 0패',
      awaySeasonRecord: '0승 1무 1패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '4.1억 유로'
    },
    awayTeam: {
      id: 'tottenham',
      name: '토트넘 홋스퍼',
      rank: 5,
      homeSeasonRecord: '1승 0무 1패',
      awaySeasonRecord: '1승 0무 1패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '7.8억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '손흥민 선발 출격',
      alertText: '🚨 5번 경기 (노팅엄 vs 토트넘) 손흥민 선발 출격 확정!',
      keyAbsenceNotice: '토트넘 공격 라인 최정예 가동'
    }
  },
  {
    id: 'smb-50-6',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 6,
    sport: 'football',
    league: '이탈리아 세리에A',
    countryFlag: '🇮🇹',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 01:00',
    closingTime: '09.05(토) 22:50',
    venue: '주세페 메아차',
    homeTeam: {
      id: 'inter',
      name: '인테르',
      rank: 1,
      homeSeasonRecord: '1승 0무 0패',
      awaySeasonRecord: '1승 1무 0패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '6.8억 유로'
    },
    awayTeam: {
      id: 'napoli',
      name: '나폴리',
      rank: 4,
      homeSeasonRecord: '1승 0무 0패',
      awaySeasonRecord: '1승 0무 1패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '5.6억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '빅매치 선발 확정',
      alertText: '🚨 6번 경기 (인테르 vs 나폴리) 세리에A 최고의 빅매치!',
      keyAbsenceNotice: '라우타로 vs 흐비차 에이스 격돌'
    }
  },
  {
    id: 'smb-50-7',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 7,
    sport: 'football',
    league: '잉글랜드 프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 01:30',
    closingTime: '09.05(토) 22:50',
    venue: 'MKM 스타디움',
    homeTeam: {
      id: 'hullcity',
      name: '헐시티',
      rank: 17,
      homeSeasonRecord: '0승 1무 1패',
      awaySeasonRecord: '0승 0무 2패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 180,
      totalMarketValue: '1.0억 유로'
    },
    awayTeam: {
      id: 'astonvilla',
      name: '아스톤 빌라',
      rank: 4,
      homeSeasonRecord: '1승 1무 0패',
      awaySeasonRecord: '1승 0무 1패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '6.2억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '라인업 확정',
      alertText: '🚨 7번 경기 (헐시티 vs 아스톤 빌라)',
      keyAbsenceNotice: '아스톤 빌라 왓킨스 선발 출격'
    }
  },
  {
    id: 'smb-50-8',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 8,
    sport: 'football',
    league: '이탈리아 세리에A',
    countryFlag: '🇮🇹',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 03:45',
    closingTime: '09.05(토) 22:50',
    venue: '스타디오 올림피코',
    homeTeam: {
      id: 'asroma',
      name: 'AS 로마',
      rank: 6,
      homeSeasonRecord: '1승 0무 1패',
      awaySeasonRecord: '0승 1무 1패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '3.9억 유로'
    },
    awayTeam: {
      id: 'atalanta',
      name: '아탈란타',
      rank: 3,
      homeSeasonRecord: '2승 0무 0패',
      awaySeasonRecord: '1승 0무 0패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '4.8억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '라인업 공개',
      alertText: '🚨 8번 경기 (AS 로마 vs 아탈란타) 챔스권 쟁탈전',
      keyAbsenceNotice: '디발라 선발 출격'
    }
  },
  {
    id: 'smb-50-9',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 9,
    sport: 'football',
    league: '잉글랜드 프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 22:00',
    closingTime: '09.05(토) 22:50',
    venue: '구디슨 파크',
    homeTeam: {
      id: 'everton',
      name: '에버턴',
      rank: 15,
      homeSeasonRecord: '0승 1무 1패',
      awaySeasonRecord: '0승 0무 2패',
      recent3Form: 'RED',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '3.2억 유로'
    },
    awayTeam: {
      id: 'manutd',
      name: '맨체스터 유나이티드',
      rank: 7,
      homeSeasonRecord: '1승 0무 1패',
      awaySeasonRecord: '1승 0무 1패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '8.5억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '선발 라인업 발표',
      alertText: '🚨 9번 경기 (에버턴 vs 맨체스터 유나이티드)',
      keyAbsenceNotice: '맨유 브루노 페르난데스, 래시포드 공격 선봉'
    }
  },
  {
    id: 'smb-50-10',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 10,
    sport: 'football',
    league: '이탈리아 세리에A',
    countryFlag: '🇮🇹',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 22:00',
    closingTime: '09.05(토) 22:50',
    venue: '스타디오 베니토 스티르페',
    homeTeam: {
      id: 'frosinone',
      name: '프로시노네',
      rank: 18,
      homeSeasonRecord: '0승 1무 1패',
      awaySeasonRecord: '0승 0무 2패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 180,
      totalMarketValue: '0.8억 유로'
    },
    awayTeam: {
      id: 'venezia',
      name: '베네치아',
      rank: 19,
      homeSeasonRecord: '0승 0무 2패',
      awaySeasonRecord: '0승 1무 1패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 180,
      totalMarketValue: '0.7억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '라인업 확정',
      alertText: '🚨 10번 경기 (프로시노네 vs 베네치아) 강등권 단두대 매치',
      keyAbsenceNotice: '승점 3점 절실한 양 팀의 총력전'
    }
  },
  {
    id: 'smb-50-11',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 11,
    sport: 'football',
    league: '이탈리아 세리에A',
    countryFlag: '🇮🇹',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 22:00',
    closingTime: '09.05(토) 22:50',
    venue: '스타디오 엔니오 타르디니',
    homeTeam: {
      id: 'parma',
      name: '파르마',
      rank: 13,
      homeSeasonRecord: '1승 0무 1패',
      awaySeasonRecord: '0승 1무 1패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '1.4억 유로'
    },
    awayTeam: {
      id: 'monza',
      name: 'AC 몬차',
      rank: 14,
      homeSeasonRecord: '0승 1무 1패',
      awaySeasonRecord: '0승 1무 1패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '1.2억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '라인업 발표',
      alertText: '🚨 11번 경기 (파르마 vs AC 몬차)',
      keyAbsenceNotice: '중위권 수성을 위한 치열한 접전'
    }
  },
  {
    id: 'smb-50-12',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 12,
    sport: 'football',
    league: '잉글랜드 프리미어리그 (EPL)',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.07(월) 00:30',
    closingTime: '09.05(토) 22:50',
    venue: '에미레이트 스타디움',
    homeTeam: {
      id: 'arsenal',
      name: '아스널',
      rank: 2,
      homeSeasonRecord: '2승 0무 0패',
      awaySeasonRecord: '1승 0무 0패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '11.5억 유로'
    },
    awayTeam: {
      id: 'chelsea',
      name: '첼시',
      rank: 3,
      homeSeasonRecord: '1승 1무 0패',
      awaySeasonRecord: '1승 0무 1패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '9.8억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '런던 슈퍼 매치 선발 발표',
      alertText: '🚨 12번 경기 (아스널 vs 첼시) 런던 최고 빅매치!',
      keyAbsenceNotice: '사카, 외데고르 선발 vs 파머 공격 진두지휘'
    }
  },
  {
    id: 'smb-50-13',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 13,
    sport: 'football',
    league: '이탈리아 세리에A',
    countryFlag: '🇮🇹',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.07(월) 01:00',
    closingTime: '09.05(토) 22:50',
    venue: '스타디오 레나토 달라라',
    homeTeam: {
      id: 'bologna',
      name: '볼로냐',
      rank: 8,
      homeSeasonRecord: '1승 0무 1패',
      awaySeasonRecord: '1승 0무 0패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '2.8억 유로'
    },
    awayTeam: {
      id: 'sassuolo',
      name: '사수올로',
      rank: 15,
      homeSeasonRecord: '0승 1무 1패',
      awaySeasonRecord: '0승 1무 1패',
      recent3Form: 'YELLOW',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 180,
      totalMarketValue: '1.5억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '라인업 확정',
      alertText: '🚨 13번 경기 (볼로냐 vs 사수올로)',
      keyAbsenceNotice: '볼로냐 홈 득점 우세 기대'
    }
  },
  {
    id: 'smb-50-14',
    betmanRound: '축구 승무패 50회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNGMUBAE',
    betmanMatchNo: 14,
    sport: 'football',
    league: '이탈리아 세리에A',
    countryFlag: '🇮🇹',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.07(월) 03:45',
    closingTime: '09.05(토) 22:50',
    venue: '알리안츠 스타디움',
    homeTeam: {
      id: 'juventus',
      name: '유벤투스',
      rank: 2,
      homeSeasonRecord: '2승 0무 0패',
      awaySeasonRecord: '1승 0무 0패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '6.4억 유로'
    },
    awayTeam: {
      id: 'acmilan',
      name: 'AC 밀란',
      rank: 5,
      homeSeasonRecord: '1승 0무 1패',
      awaySeasonRecord: '1승 0무 1패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180,
      totalMarketValue: '5.9억 유로'
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '이탈리아 더비 선발 발표',
      alertText: '🚨 14번 경기 (유벤투스 vs AC 밀란) 최후의 메가 매치!',
      keyAbsenceNotice: '블라호비치 vs 레앙 특급 공격수 정면 격돌'
    }
  }
];

export const BETMAN_SEUNG1PAE_65TH_SLIP: Match[] = [
  {
    id: 's1p-65-1',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 1,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.04(금) 18:30',
    closingTime: '09.04(금) 18:20',
    venue: '잠실야구장',
    homeTeam: {
      id: 'lg',
      name: 'LG 트윈스',
      rank: 3,
      homeSeasonRecord: '32승 2무 24패',
      awaySeasonRecord: '31승 1무 26패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '켈리', era: '3.42', winLoss: '9승 6패' }
    },
    awayTeam: {
      id: 'samsung',
      name: '삼성 라이온즈',
      rank: 2,
      homeSeasonRecord: '34승 1무 22패',
      awaySeasonRecord: '29승 1무 28패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '원태인', era: '3.12', winLoss: '11승 4패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBO 공식 발표',
      alertText: '🚨 1번 경기 (LG vs 삼성) 잠실 라이벌 명승부!',
      keyAbsenceNotice: '켈리 vs 원태인 명품 투수전'
    }
  },
  {
    id: 's1p-65-2',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 2,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.04(금) 18:30',
    closingTime: '09.04(금) 18:20',
    venue: '사직야구장',
    homeTeam: {
      id: 'lotte',
      name: '롯데 자이언츠',
      rank: 7,
      homeSeasonRecord: '28승 2무 28패',
      awaySeasonRecord: '24승 1무 31패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '반즈', era: '3.18', winLoss: '8승 5패' }
    },
    awayTeam: {
      id: 'hanwha',
      name: '한화 이글스',
      rank: 6,
      homeSeasonRecord: '29승 1무 27패',
      awaySeasonRecord: '25승 2무 30패',
      recent3Form: 'YELLOW',
      staminaStatus: 'YELLOW',
      starterPitcherInfo: { name: '류현진', era: '3.65', winLoss: '7승 6패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBO 공식 발표',
      alertText: '🚨 2번 경기 (롯데 vs 한화) 사직 좌완 에이스 대격돌!',
      keyAbsenceNotice: '반즈 vs 류현진 특급 선발 대전'
    }
  },
  {
    id: 's1p-65-3',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 3,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.04(금) 18:30',
    closingTime: '09.04(금) 18:20',
    venue: '인천 SSG랜더스필드',
    homeTeam: {
      id: 'ssg',
      name: 'SSG 랜더스',
      rank: 5,
      homeSeasonRecord: '30승 1무 26패',
      awaySeasonRecord: '27승 1무 29패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '김광현', era: '3.88', winLoss: '8승 7패' }
    },
    awayTeam: {
      id: 'doosan',
      name: '두산 베어스',
      rank: 4,
      homeSeasonRecord: '31승 2무 25패',
      awaySeasonRecord: '28승 2무 28패',
      recent3Form: 'GREEN',
      staminaStatus: 'YELLOW',
      starterPitcherInfo: { name: '곽빈', era: '3.55', winLoss: '10승 6패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBO 공식 발표',
      alertText: '🚨 3번 경기 (SSG vs 두산) 5강 굳히기 총력전',
      keyAbsenceNotice: '김광현 vs 곽빈 신구 국가대표 선발 맞대결'
    }
  },
  {
    id: 's1p-65-4',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 4,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.04(금) 18:30',
    closingTime: '09.04(금) 18:20',
    venue: '광주 챔피언스 필드',
    homeTeam: {
      id: 'kia',
      name: 'KIA 타이거즈',
      rank: 1,
      homeSeasonRecord: '38승 1무 19패',
      awaySeasonRecord: '34승 2무 21패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '양현종', era: '3.75', winLoss: '10승 3패' }
    },
    awayTeam: {
      id: 'kt',
      name: 'KT 위즈',
      rank: 5,
      homeSeasonRecord: '30승 1무 28패',
      awaySeasonRecord: '29승 1무 27패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '고영표', era: '3.45', winLoss: '8승 5패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBO 공식 발표',
      alertText: '🚨 4번 경기 (KIA vs KT) 1위 수성 vs 가을야구 진격',
      keyAbsenceNotice: '양현종 vs 고영표 제구력 에이스 맞대결'
    }
  },
  {
    id: 's1p-65-5',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 5,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.04(금) 18:30',
    closingTime: '09.04(금) 18:20',
    venue: '고척스카이돔',
    homeTeam: {
      id: 'kiwoom',
      name: '키움 히어로즈',
      rank: 10,
      homeSeasonRecord: '24승 0무 32패',
      awaySeasonRecord: '22승 0무 35패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '후라도', era: '3.25', winLoss: '9승 7패' }
    },
    awayTeam: {
      id: 'nc',
      name: 'NC 다이노스',
      rank: 8,
      homeSeasonRecord: '26승 2무 30패',
      awaySeasonRecord: '25승 0무 31패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      starterPitcherInfo: { name: '하트', era: '2.55', winLoss: '11승 2패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBO 공식 발표',
      alertText: '🚨 5번 경기 (키움 vs NC) 외국인 1선발 대결',
      keyAbsenceNotice: '후라도 vs 하트 탈삼진 대전'
    }
  },
  {
    id: 's1p-65-6',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 6,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 07:40',
    closingTime: '09.04(금) 18:20',
    venue: 'PNC 파크',
    homeTeam: {
      id: 'pittsburgh',
      name: '피츠버그 파이리츠',
      rank: 4,
      homeSeasonRecord: '32승 34패',
      awaySeasonRecord: '29승 38패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '폴 스킨스', era: '2.15', winLoss: '8승 2패' }
    },
    awayTeam: {
      id: 'laangels',
      name: 'LA 에인절스',
      rank: 5,
      homeSeasonRecord: '28승 38패',
      awaySeasonRecord: '27승 39패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      starterPitcherInfo: { name: '데트머스', era: '5.20', winLoss: '4승 7패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 오피셜',
      alertText: '🚨 6번 경기 (피츠버그 vs LA 에인절스) 배트맨 오피셜 슬립',
      keyAbsenceNotice: '괴물 신인 스킨스 선발 출격 확정'
    }
  },
  {
    id: 's1p-65-7',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 7,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 08:10',
    closingTime: '09.04(금) 18:20',
    venue: '론디포 파크',
    homeTeam: {
      id: 'miami',
      name: '마이애미 말린스',
      rank: 5,
      homeSeasonRecord: '24승 44패',
      awaySeasonRecord: '22승 44패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      starterPitcherInfo: { name: '카브레라', era: '4.88', winLoss: '3승 5패' }
    },
    awayTeam: {
      id: 'chicago_cubs',
      name: '시카고 컵스',
      rank: 2,
      homeSeasonRecord: '36승 32패',
      awaySeasonRecord: '31승 35패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '이마нага 쇼타', era: '2.95', winLoss: '11승 3패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 공식 발표',
      alertText: '🚨 7번 경기 (마이애미 vs 시카고 컵스)',
      keyAbsenceNotice: '이마нага 쇼타 선발 등판'
    }
  },
  {
    id: 's1p-65-8',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 8,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 09:05',
    closingTime: '09.04(금) 18:20',
    venue: '글로브 라이프 필드',
    homeTeam: {
      id: 'texas',
      name: '텍사스 레인저스',
      rank: 3,
      homeSeasonRecord: '36승 31패',
      awaySeasonRecord: '30승 38패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '이볼디', era: '3.60', winLoss: '9승 7패' }
    },
    awayTeam: {
      id: 'tampabay',
      name: '탬파베이 레이스',
      rank: 4,
      homeSeasonRecord: '33승 34패',
      awaySeasonRecord: '31승 35패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '바즈', era: '3.80', winLoss: '3승 2패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 오피셜',
      alertText: '🚨 8번 경기 (텍사스 vs 탬파베이)',
      keyAbsenceNotice: '이볼디 베테랑 관록 투구 기대'
    }
  },
  {
    id: 's1p-65-9',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 9,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 09:10',
    closingTime: '09.04(금) 18:20',
    venue: '코프먼 스타디움',
    homeTeam: {
      id: 'kansascity',
      name: '캔자스시티 로열스',
      rank: 2,
      homeSeasonRecord: '41승 27패',
      awaySeasonRecord: '34승 33패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '라간스', era: '3.25', winLoss: '10승 8패' }
    },
    awayTeam: {
      id: 'toronto',
      name: '토론토 블루제이스',
      rank: 5,
      homeSeasonRecord: '33승 34패',
      awaySeasonRecord: '32승 37패',
      recent3Form: 'YELLOW',
      staminaStatus: 'YELLOW',
      starterPitcherInfo: { name: '베리오스', era: '3.75', winLoss: '13승 9패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 오피셜',
      alertText: '🚨 9번 경기 (캔자스시티 vs 토론토)',
      keyAbsenceNotice: '라간스 vs 베리오스 투수전'
    }
  },
  {
    id: 's1p-65-10',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 10,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 09:10',
    closingTime: '09.04(금) 18:20',
    venue: '다이킨 파크',
    homeTeam: {
      id: 'houston',
      name: '휴스턴 애스트로스',
      rank: 1,
      homeSeasonRecord: '39승 29패',
      awaySeasonRecord: '36승 33패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '발데스', era: '3.15', winLoss: '13승 6패' }
    },
    awayTeam: {
      id: 'arizona',
      name: '애리조나 다이아몬드백스',
      rank: 2,
      homeSeasonRecord: '39승 29패',
      awaySeasonRecord: '38승 30패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '갤런', era: '3.65', winLoss: '11승 6패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 빅매치 발표',
      alertText: '🚨 10번 경기 (휴스턴 vs 애리조나) 포스트시즌 전초전!',
      keyAbsenceNotice: '프람버 발데스 vs 잭 갤런 에이스 빅뱅'
    }
  },
  {
    id: 's1p-65-11',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 11,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 09:40',
    closingTime: '09.04(금) 18:20',
    venue: '쿠어스 필드',
    homeTeam: {
      id: 'colorado',
      name: '콜로라도 로키스',
      rank: 5,
      homeSeasonRecord: '28승 39패',
      awaySeasonRecord: '21승 49패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      starterPitcherInfo: { name: '프릴랜드', era: '4.95', winLoss: '4승 7패' }
    },
    awayTeam: {
      id: 'stlouis',
      name: '세인트루이스 카디널스',
      rank: 3,
      homeSeasonRecord: '37승 32패',
      awaySeasonRecord: '32승 36패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '마이콜라스', era: '5.10', winLoss: '8승 10패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: '쿠어스 필드 배당 확정',
      alertText: '🚨 11번 경기 (콜로라도 vs 세인트루이스) 고지대 난타전',
      keyAbsenceNotice: '쿠어스 특성상 다득점 양상 예상'
    }
  },
  {
    id: 's1p-65-12',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 12,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 10:40',
    closingTime: '09.04(금) 18:20',
    venue: '체이스 필드',
    homeTeam: {
      id: 'seattle',
      name: '시애틀 매리너스',
      rank: 2,
      homeSeasonRecord: '41승 28패',
      awaySeasonRecord: '30승 38패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '조지 커비', era: '3.40', winLoss: '10승 10패' }
    },
    awayTeam: {
      id: 'oakland',
      name: '오클랜드 애슬레틱스',
      rank: 4,
      homeSeasonRecord: '33승 37패',
      awaySeasonRecord: '28승 38패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '스펜스', era: '4.45', winLoss: '7승 9패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 오피셜',
      alertText: '🚨 12번 경기 (시애틀 vs 오클랜드) 서부 지구 라이벌',
      keyAbsenceNotice: '조지 커비 칼날 제구력 주목'
    }
  },
  {
    id: 's1p-65-13',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 13,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 10:40',
    closingTime: '09.04(금) 18:20',
    venue: '오라클 파크',
    homeTeam: {
      id: 'sf_giants',
      name: '샌프란시스코 자이언츠',
      rank: 4,
      homeSeasonRecord: '38승 30패',
      awaySeasonRecord: '30승 39패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '웹', era: '3.30', winLoss: '11승 9패' }
    },
    awayTeam: {
      id: 'miami_extra',
      name: '마이애미',
      rank: 5,
      homeSeasonRecord: '24승 44패',
      awaySeasonRecord: '22승 44패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      starterPitcherInfo: { name: '무뇨스', era: '5.50', winLoss: '2승 7패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 공식 발표',
      alertText: '🚨 13번 경기 (샌프란시스코 vs 마이애미)',
      keyAbsenceNotice: '로건 웹 싱커볼 위력 기대'
    }
  },
  {
    id: 's1p-65-14',
    betmanRound: '야구 승1패 65회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG1PAE',
    betmanMatchNo: 14,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 11:10',
    closingTime: '09.04(금) 18:20',
    venue: '다저 스타디움',
    homeTeam: {
      id: 'la_dodgers',
      name: 'LA 다저스',
      rank: 1,
      homeSeasonRecord: '46승 23패',
      awaySeasonRecord: '38승 31패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '야마모토 요시노부', era: '2.85', winLoss: '7승 2패' }
    },
    awayTeam: {
      id: 'cleveland',
      name: '클리블랜드 가디언스',
      rank: 1,
      homeSeasonRecord: '43승 24패',
      awaySeasonRecord: '37승 34패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '바이비', era: '3.50', winLoss: '11승 6패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 최고 매치업 확정',
      alertText: '🚨 14번 경기 (LA 다저스 vs 클리블랜드) 1위끼리의 슈퍼 매치!',
      keyAbsenceNotice: '오타니 50-50 도전 & 야마모토 선발 출격'
    }
  }
];

export const BETMAN_SEUNG5PAE_15TH_SLIP: Match[] = [
  {
    id: 's5p-15-1',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 1,
    sport: 'basketball',
    league: 'KBL 프로농구',
    countryFlag: '🇰🇷',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 14:00',
    closingTime: '09.05(토) 13:50',
    venue: '부산 사직실내체육관',
    homeTeam: {
      id: 'kcc',
      name: '부산 KCC',
      rank: 3,
      homeSeasonRecord: '18승 8패',
      awaySeasonRecord: '14승 12패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180
    },
    awayTeam: {
      id: 'db',
      name: '원주 DB',
      rank: 1,
      homeSeasonRecord: '20승 6패',
      awaySeasonRecord: '17승 9패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 190
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBL 오피셜 라인업 발표',
      alertText: '🚨 1번 경기 (부산 KCC vs 원주 DB) 개막 빅매치',
      keyAbsenceNotice: '허웅 3점 핫폼 vs 알바노-로슨 원투펀치'
    }
  },
  {
    id: 's5p-15-2',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 2,
    sport: 'basketball',
    league: 'KBL 프로농구',
    countryFlag: '🇰🇷',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 16:00',
    closingTime: '09.05(토) 13:50',
    venue: '잠실학생체육관',
    homeTeam: {
      id: 'sk',
      name: '서울 SK',
      rank: 2,
      homeSeasonRecord: '19승 7패',
      awaySeasonRecord: '15승 11패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180
    },
    awayTeam: {
      id: 'kt',
      name: '수원 KT',
      rank: 4,
      homeSeasonRecord: '17승 9패',
      awaySeasonRecord: '14승 12패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 175
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBL 공식 발표',
      alertText: '🚨 2번 경기 (서울 SK vs 수원 KT) 속공 대결',
      keyAbsenceNotice: '김선형-워니 콤비 vs 배스 골밑 장악'
    }
  },
  {
    id: 's5p-15-3',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 3,
    sport: 'basketball',
    league: 'KBL 프로농구',
    countryFlag: '🇰🇷',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 16:00',
    closingTime: '09.05(토) 13:50',
    venue: '창원체육관',
    homeTeam: {
      id: 'lg_sakers',
      name: '창원 LG',
      rank: 5,
      homeSeasonRecord: '16승 10패',
      awaySeasonRecord: '13승 13패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180
    },
    awayTeam: {
      id: 'hyundai_mobis',
      name: '현대모비스',
      rank: 6,
      homeSeasonRecord: '15승 11패',
      awaySeasonRecord: '12승 14패',
      recent3Form: 'GREEN',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 190
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBL 공식 발표',
      alertText: '🚨 3번 경기 (창원 LG vs 현대모비스) 수비전',
      keyAbsenceNotice: '마레이 리바운드 vs 게이지 프림 골밑 대결'
    }
  },
  {
    id: 's5p-15-4',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 4,
    sport: 'basketball',
    league: 'KBL 프로농구',
    countryFlag: '🇰🇷',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 18:00',
    closingTime: '09.05(토) 13:50',
    venue: '고양체육관',
    homeTeam: {
      id: 'sono',
      name: '고양 소노',
      rank: 8,
      homeSeasonRecord: '12승 14패',
      awaySeasonRecord: '9승 17패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180
    },
    awayTeam: {
      id: 'kogas',
      name: '한국가스공사',
      rank: 7,
      homeSeasonRecord: '13승 13패',
      awaySeasonRecord: '10승 16패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBL 공식 발표',
      alertText: '🚨 4번 경기 (고양 소노 vs 한국가스공사)',
      keyAbsenceNotice: '이정현 3점 슛감 최고조'
    }
  },
  {
    id: 's5p-15-5',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 5,
    sport: 'basketball',
    league: 'KBL 프로농구',
    countryFlag: '🇰🇷',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 18:00',
    closingTime: '09.05(토) 13:50',
    venue: '안양 정관장 아레나',
    homeTeam: {
      id: 'kgc',
      name: '안양 정관장',
      rank: 9,
      homeSeasonRecord: '11승 15패',
      awaySeasonRecord: '8승 18패',
      recent3Form: 'RED',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 180
    },
    awayTeam: {
      id: 'samsung_thunders',
      name: '서울 삼성',
      rank: 10,
      homeSeasonRecord: '9승 17패',
      awaySeasonRecord: '6승 20패',
      recent3Form: 'RED',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 190
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBL 공식 발표',
      alertText: '🚨 5번 경기 (안양 정관장 vs 서울 삼성)',
      keyAbsenceNotice: '외곽 지원 화력 집중'
    }
  },
  {
    id: 's5p-15-6',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 6,
    sport: 'basketball',
    league: 'NBA 미국프로농구',
    countryFlag: '🇺🇸',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 08:30',
    closingTime: '09.05(토) 13:50',
    venue: 'TD 가든',
    homeTeam: {
      id: 'bos',
      name: '보스턴 셀틱스',
      rank: 1,
      homeSeasonRecord: '36승 6패',
      awaySeasonRecord: '28승 12패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 220
    },
    awayTeam: {
      id: 'mil',
      name: '밀워키 벅스',
      rank: 3,
      homeSeasonRecord: '31승 11패',
      awaySeasonRecord: '18승 22패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 230
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'NBA 공식 발표',
      alertText: '🚨 6번 경기 (보스턴 vs 밀워키) 동부 콘퍼런스 파이널 전초전',
      keyAbsenceNotice: '테이텀-브라운 듀오 vs 아데토쿤보-릴라드'
    }
  },
  {
    id: 's5p-15-7',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 7,
    sport: 'basketball',
    league: 'NBA 미국프로농구',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 09:00',
    closingTime: '09.05(토) 13:50',
    venue: '매디슨 스퀘어 가든',
    homeTeam: {
      id: 'nyk',
      name: '뉴욕 닉스',
      rank: 2,
      homeSeasonRecord: '27승 14패',
      awaySeasonRecord: '23승 18패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 210
    },
    awayTeam: {
      id: 'phi',
      name: '필라델피아',
      rank: 5,
      homeSeasonRecord: '25승 16패',
      awaySeasonRecord: '22승 19패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 210
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'NBA 공식 발표',
      alertText: '🚨 7번 경기 (뉴욕 닉스 vs 필라델피아)',
      keyAbsenceNotice: '브런슨 클러치 득점력 가동'
    }
  },
  {
    id: 's5p-15-8',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 8,
    sport: 'basketball',
    league: 'NBA 미국프로농구',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 09:30',
    closingTime: '09.05(토) 13:50',
    venue: '볼 아레나',
    homeTeam: {
      id: 'den',
      name: '덴버 너게츠',
      rank: 2,
      homeSeasonRecord: '33승 8패',
      awaySeasonRecord: '24승 17패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 230
    },
    awayTeam: {
      id: 'min',
      name: '미네소타',
      rank: 3,
      homeSeasonRecord: '30승 11패',
      awaySeasonRecord: '26승 15패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 220
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'NBA 공식 발표',
      alertText: '🚨 8번 경기 (덴버 vs 미네소타) 서부 골밑 지배권 쟁탈',
      keyAbsenceNotice: '요키치 트리플더블 vs 에드워즈 폭발력'
    }
  },
  {
    id: 's5p-15-9',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 9,
    sport: 'basketball',
    league: 'NBA 미국프로농구',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 10:00',
    closingTime: '09.05(토) 13:50',
    venue: '아메리칸 에어라인스 센터',
    homeTeam: {
      id: 'dal',
      name: '댈러스 매버릭스',
      rank: 5,
      homeSeasonRecord: '26승 15패',
      awaySeasonRecord: '24승 17패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 230
    },
    awayTeam: {
      id: 'okc',
      name: '오클라호마',
      rank: 1,
      homeSeasonRecord: '33승 8패',
      awaySeasonRecord: '24승 17패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 210
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'NBA 공식 발표',
      alertText: '🚨 9번 경기 (댈러스 vs 오클라호마) MVP 후보 정면 대결',
      keyAbsenceNotice: '돈치치-어빙 vs 길저스-알렉산더(SGA)'
    }
  },
  {
    id: 's5p-15-10',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 10,
    sport: 'basketball',
    league: 'NBA 미국프로농구',
    countryFlag: '🇺🇸',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 11:30',
    closingTime: '09.05(토) 13:50',
    venue: '크립토닷컴 아레나',
    homeTeam: {
      id: 'lal',
      name: 'LA 레이커스',
      rank: 7,
      homeSeasonRecord: '28승 14패',
      awaySeasonRecord: '19승 21패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      minutesPlayed14d: 220
    },
    awayTeam: {
      id: 'gsw',
      name: '골든스테이트',
      rank: 8,
      homeSeasonRecord: '21승 20패',
      awaySeasonRecord: '25승 16패',
      recent3Form: 'YELLOW',
      staminaStatus: 'YELLOW',
      minutesPlayed14d: 240
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'NBA 공식 발표',
      alertText: '🚨 10번 경기 (LA 레이커스 vs 골든스테이트) 세기의 라이벌전',
      keyAbsenceNotice: '르브론 제임스 vs 스테픈 커리 불꽃 3점전'
    }
  },
  {
    id: 's5p-15-11',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 11,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 17:00',
    closingTime: '09.05(토) 13:50',
    venue: '잠실야구장',
    homeTeam: {
      id: 'lg',
      name: 'LG 트윈스',
      rank: 3,
      homeSeasonRecord: '32승 2무 24패',
      awaySeasonRecord: '31승 1무 26패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '임찬규', era: '3.62', winLoss: '9승 5패' }
    },
    awayTeam: {
      id: 'samsung',
      name: '삼성 라이온즈',
      rank: 2,
      homeSeasonRecord: '34승 1무 22패',
      awaySeasonRecord: '29승 1무 28패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '코너', era: '3.35', winLoss: '10승 5패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBO 공식 발표',
      alertText: '🚨 11번 경기 (LG vs 삼성) 5점차 승부 예측',
      keyAbsenceNotice: '불펜 총력전 예고'
    }
  },
  {
    id: 's5p-15-12',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 12,
    sport: 'baseball',
    league: 'KBO 리그',
    countryFlag: '🇰🇷',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.05(토) 17:00',
    closingTime: '09.05(토) 13:50',
    venue: '사직야구장',
    homeTeam: {
      id: 'lotte',
      name: '롯데 자이언츠',
      rank: 7,
      homeSeasonRecord: '28승 2무 28패',
      awaySeasonRecord: '24승 1무 31패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '박세웅', era: '4.10', winLoss: '6승 8패' }
    },
    awayTeam: {
      id: 'hanwha',
      name: '한화 이글스',
      rank: 6,
      homeSeasonRecord: '29승 1무 27패',
      awaySeasonRecord: '25승 2무 30패',
      recent3Form: 'YELLOW',
      staminaStatus: 'YELLOW',
      starterPitcherInfo: { name: '문동주', era: '3.88', winLoss: '7승 7패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'KBO 공식 발표',
      alertText: '🚨 12번 경기 (롯데 vs 한화)',
      keyAbsenceNotice: '토종 영건 선발 맞대결'
    }
  },
  {
    id: 's5p-15-13',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 13,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: false,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 08:15',
    closingTime: '09.05(토) 13:50',
    venue: '양키 스타디움',
    homeTeam: {
      id: 'ny_yankees',
      name: '뉴욕 양키스',
      rank: 1,
      homeSeasonRecord: '41승 25패',
      awaySeasonRecord: '41승 28패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '게릿 콜', era: '3.15', winLoss: '8승 3패' }
    },
    awayTeam: {
      id: 'cubs',
      name: '시카고 컵스',
      rank: 2,
      homeSeasonRecord: '36승 32패',
      awaySeasonRecord: '32승 35패',
      recent3Form: 'YELLOW',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '이마나가 쇼타', era: '2.95', winLoss: '11승 3패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 공식 발표',
      alertText: '🚨 13번 경기 (뉴욕 양키스 vs 시카고 컵스) 에이스 대격돌!',
      keyAbsenceNotice: '게릿 콜 vs 이마나가 쇼타 특급 선발 대전'
    }
  },
  {
    id: 's5p-15-14',
    betmanRound: '농구/야구 승5패 15회차 (betman.co.kr 오피셜 슬립)',
    betmanFolder: 'SEUNG5PAE',
    betmanMatchNo: 14,
    sport: 'baseball',
    league: '메이저리그 (MLB)',
    countryFlag: '🇺🇸',
    isFavorite: true,
    status: 'SCHEDULED',
    matchTime: '09.06(일) 10:10',
    closingTime: '09.05(토) 13:50',
    venue: '다저 스타디움',
    homeTeam: {
      id: 'la_dodgers',
      name: 'LA 다저스',
      rank: 1,
      homeSeasonRecord: '46승 23패',
      awaySeasonRecord: '38승 31패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '플래허티', era: '2.95', winLoss: '10승 5패' }
    },
    awayTeam: {
      id: 'cleveland',
      name: '클리블랜드 가디언스',
      rank: 1,
      homeSeasonRecord: '43승 24패',
      awaySeasonRecord: '37승 34패',
      recent3Form: 'GREEN',
      staminaStatus: 'GREEN',
      starterPitcherInfo: { name: '바이비', era: '3.50', winLoss: '11승 6패' }
    },
    lineupAlertInfo: {
      isPublished: true,
      publishedTime: 'MLB 공식 발표',
      alertText: '🚨 14번 경기 (LA 다저스 vs 클리블랜드)',
      keyAbsenceNotice: '오타니 홈런포 가동 & 다저스 타선 화력'
    }
  }
];

export function getOfficialBetmanSlip(category: string): Match[] {
  if (category === 'SEUNGMUBAE') {
    return BETMAN_SEUNGMUBAE_50TH_SLIP;
  }
  if (category === 'SEUNG1PAE') {
    return BETMAN_SEUNG1PAE_65TH_SLIP;
  }
  if (category === 'SEUNG5PAE') {
    return BETMAN_SEUNG5PAE_15TH_SLIP;
  }
  return [];
}

