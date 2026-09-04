import React, { useState } from 'react';
import { Calculator, RotateCcw, Sparkles, TrendingUp, Trophy, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { Match, MembershipTier } from '../types/sports';
import { getLocalizedTeamName, type AppLanguage } from '../utils/languageHelper';

export interface TotoMatchRowData {
  matchNo: number;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  winRate: number;   // 승 투표율 (%)
  drawRate: number;  // 1 (또는 무) 투표율 (%)
  loseRate: number;  // 패 투표율 (%)
  matchObj?: Match;
}

export interface TotoRoundMeta {
  roundId: string;
  roundTitle: string;
  salePeriod: string;
  totalVotesCount: number;
  firstPrizeAmount: number;
  carryOverAmount: number;
  carryOverCount: number;
  status: '발매중' | '마감' | '대기';
}

// 📌 회차별 메타데이터 레지스트리 (야구 승1패, 축구 승무패, 이전 64회차 등 동적 지원)
export const TOTO_ROUNDS_REGISTRY: Record<string, TotoRoundMeta> = {
  'SEUNG1PAE-65': {
    roundId: 'SEUNG1PAE-65',
    roundTitle: '2026년 65회차 (야구 승1패)',
    salePeriod: '09.03(목) 08:00 ~ 09.04(금) 18:20',
    totalVotesCount: 148520,
    firstPrizeAmount: 512400000,
    carryOverAmount: 254491250,
    carryOverCount: 3,
    status: '발매중',
  },
  'SEUNG1PAE-64': {
    roundId: 'SEUNG1PAE-64',
    roundTitle: '2026년 64회차 (야구 승1패 - 예시)',
    salePeriod: '08.31(월) 08:00 ~ 09.01(화) 18:30',
    totalVotesCount: 65820,
    firstPrizeAmount: 270946250,
    carryOverAmount: 254491250,
    carryOverCount: 3,
    status: '마감',
  },
  'SEUNGMUBAE-50': {
    roundId: 'SEUNGMUBAE-50',
    roundTitle: '2026년 50회차 (축구 승무패)',
    salePeriod: '09.03(목) 08:00 ~ 09.05(토) 22:50',
    totalVotesCount: 231500,
    firstPrizeAmount: 1140000000,
    carryOverAmount: 0,
    carryOverCount: 0,
    status: '발매중',
  },
};

// 64회차 오피셜 투표율 및 경기 데이터 (유저 첨부 이미지 원본 데이터)
export const TOTO_64TH_SEUNG1PAE_ROWS: TotoMatchRowData[] = [
  { matchNo: 1, homeTeam: '두산', awayTeam: 'LG', matchTime: '(화)18:30', winRate: 32.7, drawRate: 29.3, loseRate: 38.0 },
  { matchNo: 2, homeTeam: '삼성', awayTeam: '롯데', matchTime: '(화)18:30', winRate: 57.1, drawRate: 16.0, loseRate: 26.9 },
  { matchNo: 3, homeTeam: 'KT', awayTeam: '한화', matchTime: '(화)18:30', winRate: 62.0, drawRate: 16.9, loseRate: 21.1 },
  { matchNo: 4, homeTeam: 'NC', awayTeam: 'KIA', matchTime: '(화)18:30', winRate: 28.3, drawRate: 21.7, loseRate: 50.1 },
  { matchNo: 5, homeTeam: '키움', awayTeam: 'SSG', matchTime: '(화)18:30', winRate: 43.6, drawRate: 23.4, loseRate: 33.0 },
  { matchNo: 6, homeTeam: '탬파레이', awayTeam: '뉴욕메츠', matchTime: '(수)07:40', winRate: 68.7, drawRate: 15.8, loseRate: 15.5 },
  { matchNo: 7, homeTeam: '피츠파이', awayTeam: '샌프자이', matchTime: '(수)07:40', winRate: 38.4, drawRate: 31.4, loseRate: 30.1 },
  { matchNo: 8, homeTeam: '캔자로얄', awayTeam: '마이말린', matchTime: '(수)08:40', winRate: 49.1, drawRate: 22.9, loseRate: 28.0 },
  { matchNo: 9, homeTeam: '텍사레인', awayTeam: '애슬레틱', matchTime: '(수)09:05', winRate: 51.0, drawRate: 24.4, loseRate: 24.6 },
  { matchNo: 10, homeTeam: '휴스애스', awayTeam: '시카화이', matchTime: '(수)09:10', winRate: 43.8, drawRate: 25.3, loseRate: 30.8 },
  { matchNo: 11, homeTeam: '콜로로키', awayTeam: '볼티오리', matchTime: '(수)09:40', winRate: 18.3, drawRate: 15.8, loseRate: 65.9 },
  { matchNo: 12, homeTeam: 'LA에인절', awayTeam: '뉴욕양키', matchTime: '(수)10:38', winRate: 14.7, drawRate: 15.5, loseRate: 69.8 },
  { matchNo: 13, homeTeam: '애리다이', awayTeam: '필라필리', matchTime: '(수)10:40', winRate: 35.7, drawRate: 37.3, loseRate: 27.0 },
  { matchNo: 14, homeTeam: 'LA다저스', awayTeam: '세인카디', matchTime: '(수)11:10', winRate: 67.2, drawRate: 17.7, loseRate: 15.1 },
];

// 65회차 오피셜 14경기 투표율 추정 데이터 (LG vs 삼성, 롯데 vs 한화 등)
export const TOTO_65TH_SEUNG1PAE_ROWS: TotoMatchRowData[] = [
  { matchNo: 1, homeTeam: 'LG', awayTeam: '삼성', matchTime: '(금)18:30', winRate: 45.2, drawRate: 25.1, loseRate: 29.7 },
  { matchNo: 2, homeTeam: '롯데', awayTeam: '한화', matchTime: '(금)18:30', winRate: 48.0, drawRate: 22.0, loseRate: 30.0 },
  { matchNo: 3, homeTeam: 'SSG', awayTeam: '두산', matchTime: '(금)18:30', winRate: 41.5, drawRate: 26.5, loseRate: 32.0 },
  { matchNo: 4, homeTeam: 'KIA', awayTeam: 'KT', matchTime: '(금)18:30', winRate: 58.3, drawRate: 20.2, loseRate: 21.5 },
  { matchNo: 5, homeTeam: 'NC', awayTeam: '키움', matchTime: '(금)18:30', winRate: 52.1, drawRate: 23.4, loseRate: 24.5 },
  { matchNo: 6, homeTeam: '볼티오리', awayTeam: '탬파레이', matchTime: '(토)08:05', winRate: 61.2, drawRate: 18.3, loseRate: 20.5 },
  { matchNo: 7, homeTeam: '보스레드', awayTeam: '시카화이', matchTime: '(토)08:10', winRate: 72.4, drawRate: 14.1, loseRate: 13.5 },
  { matchNo: 8, homeTeam: '뉴욕메츠', awayTeam: '신시레즈', matchTime: '(토)08:10', winRate: 54.0, drawRate: 24.2, loseRate: 21.8 },
  { matchNo: 9, homeTeam: '애틀브레', awayTeam: '토론블루', matchTime: '(토)08:20', winRate: 63.8, drawRate: 17.5, loseRate: 18.7 },
  { matchNo: 10, homeTeam: '시카컵스', awayTeam: '뉴욕양키', matchTime: '(토)09:05', winRate: 33.5, drawRate: 27.5, loseRate: 39.0 },
  { matchNo: 11, homeTeam: '휴스애스', awayTeam: '애리다이', matchTime: '(토)09:10', winRate: 49.2, drawRate: 24.0, loseRate: 26.8 },
  { matchNo: 12, homeTeam: '샌디파드', awayTeam: '샌프자이', matchTime: '(토)10:40', winRate: 55.4, drawRate: 23.1, loseRate: 21.5 },
  { matchNo: 13, homeTeam: 'LA에인절', awayTeam: '텍사레인', matchTime: '(토)10:38', winRate: 36.2, drawRate: 28.3, loseRate: 35.5 },
  { matchNo: 14, homeTeam: 'LA다저스', awayTeam: '클리블랜', matchTime: '(토)11:10', winRate: 66.5, drawRate: 18.0, loseRate: 15.5 },
];

// 축구 승무패 50회차 투표율 데이터
export const TOTO_50TH_SEUNGMUBAE_ROWS: TotoMatchRowData[] = [
  { matchNo: 1, homeTeam: '브렌트포드', awayTeam: '선덜랜드', matchTime: '(토)23:00', winRate: 58.4, drawRate: 24.2, loseRate: 17.4 },
  { matchNo: 2, homeTeam: '브라이턴', awayTeam: '리즈U', matchTime: '(토)23:00', winRate: 51.2, drawRate: 26.5, loseRate: 22.3 },
  { matchNo: 3, homeTeam: '풀럼', awayTeam: '사우샘프', matchTime: '(토)23:00', winRate: 62.1, drawRate: 21.4, loseRate: 16.5 },
  { matchNo: 4, homeTeam: '맨시티', awayTeam: '코번트리', matchTime: '(토)23:00', winRate: 85.3, drawRate: 10.2, loseRate: 4.5 },
  { matchNo: 5, homeTeam: '노팅엄', awayTeam: '토트넘', matchTime: '(토)23:00', winRate: 31.2, drawRate: 27.8, loseRate: 41.0 },
  { matchNo: 6, homeTeam: '인테르', awayTeam: '나폴리', matchTime: '(일)01:00', winRate: 44.5, drawRate: 31.0, loseRate: 24.5 },
  { matchNo: 7, homeTeam: '첼시', awayTeam: '뉴캐슬', matchTime: '(일)01:30', winRate: 47.8, drawRate: 28.2, loseRate: 24.0 },
  { matchNo: 8, homeTeam: '울버햄프', awayTeam: '본머스', matchTime: '(일)22:00', winRate: 40.2, drawRate: 32.1, loseRate: 27.7 },
  { matchNo: 9, homeTeam: '아스널', awayTeam: '에버턴', matchTime: '(일)22:00', winRate: 78.9, drawRate: 14.1, loseRate: 7.0 },
  { matchNo: 10, homeTeam: '애스턴빌', awayTeam: '웨스트햄', matchTime: '(일)22:00', winRate: 53.4, drawRate: 25.6, loseRate: 21.0 },
  { matchNo: 11, homeTeam: '유벤투스', awayTeam: 'AS로마', matchTime: '(일)03:45', winRate: 46.2, drawRate: 30.8, loseRate: 23.0 },
  { matchNo: 12, homeTeam: 'AC밀란', awayTeam: '라치오', matchTime: '(월)01:00', winRate: 50.1, drawRate: 28.5, loseRate: 21.4 },
  { matchNo: 13, homeTeam: '맨유', awayTeam: '리버풀', matchTime: '(월)00:30', winRate: 33.1, drawRate: 29.4, loseRate: 37.5 },
  { matchNo: 14, homeTeam: '아탈란타', awayTeam: '피오렌티', matchTime: '(월)03:45', winRate: 55.0, drawRate: 25.0, loseRate: 20.0 },
];

interface TotoSlipTableViewProps {
  category: 'SEUNG1PAE' | 'SEUNGMUBAE' | 'SEUNG5PAE';
  roundTitle?: string;
  salePeriod?: string;
  totalVotesCount?: number;
  firstPrizeAmount?: number;
  carryOverAmount?: number;
  carryOverCount?: number;
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  theme?: 'light' | 'dark';
  lang?: AppLanguage;
}

export const TotoSlipTableView: React.FC<TotoSlipTableViewProps> = ({
  category,
  roundTitle,
  salePeriod,
  totalVotesCount,
  firstPrizeAmount,
  carryOverAmount,
  carryOverCount,
  matches,
  onSelectMatch,
  theme = 'dark',
  lang = 'ko',
}) => {
  const isLight = theme === 'light';

  // 현재 선택된 회차 키 관리 (카테고리에 따라 기본값 설정)
  const defaultRoundKey = category === 'SEUNG1PAE' ? 'SEUNG1PAE-65' : category === 'SEUNGMUBAE' ? 'SEUNGMUBAE-50' : 'SEUNG1PAE-65';
  const [selectedRoundKey, setSelectedRoundKey] = useState<string>(defaultRoundKey);

  // 선택된 회차의 메타데이터 가져오기
  const currentMeta = TOTO_ROUNDS_REGISTRY[selectedRoundKey] || TOTO_ROUNDS_REGISTRY[defaultRoundKey];

  // 프롭으로 명시 전달된 값이 있으면 최우선, 없으면 회차 메타데이터 값 사용 (완전 동적!)
  const displayRoundTitle = roundTitle || currentMeta.roundTitle;
  const displaySalePeriod = salePeriod || currentMeta.salePeriod;
  const displayTotalVotes = totalVotesCount ?? currentMeta.totalVotesCount;
  const displayFirstPrize = firstPrizeAmount ?? currentMeta.firstPrizeAmount;
  const displayCarryOver = carryOverAmount ?? currentMeta.carryOverAmount;
  const displayCarryOverCount = carryOverCount ?? currentMeta.carryOverCount;

  // 14개 경기별 선택 마킹 상태: matchNo (1~14) -> Set<'WIN' | 'DRAW' | 'LOSE'>
  const [picks, setPicks] = useState<Record<number, Set<'WIN' | 'DRAW' | 'LOSE'>>>({});
  const [betUnit, setBetUnit] = useState<number>(1000);
  const [calcResults, setCalcResults] = useState<{
    calculated: boolean;
    combinationsCount: number;
    totalAmount: number;
    probabilityRank1: number; // 1등(14경기 올킬) 확률 (%)
    probabilityRank2: number; // 2등(13경기 적중) 확률 (%)
    probabilityRank3: number; // 3등(12경기 적중) 확률 (%)
    probabilityRank4: number; // 4등(11경기 적중) 확률 (%)
    expectedDividendRank1: number; // 1등 예상 배당금
    expectedDividendRank2: number;
    expectedDividendRank3: number;
    expectedDividendRank4: number;
    difficultyTier: 'NORMAL' | 'HARD' | 'VERY_HARD' | 'EXTREME_REVERSE';
    unfoldingNotice: string;
  } | null>(null);

  // 💡 [동적 테이블 행 데이터 생성]:
  // 1. 전달받은 matches 배열에 1~14번 실제 경기들이 있으면 그 팀명과 시간 등을 최우선으로 반영
  // 2. 회차별 투표율 기본 셋과 결합하여 동적으로 14개 행 구성
  const baseDefaultRows = selectedRoundKey === 'SEUNG1PAE-64'
    ? TOTO_64TH_SEUNG1PAE_ROWS
    : selectedRoundKey === 'SEUNGMUBAE-50' || category === 'SEUNGMUBAE'
    ? TOTO_50TH_SEUNGMUBAE_ROWS
    : TOTO_65TH_SEUNG1PAE_ROWS;

  const rows: TotoMatchRowData[] = Array.from({ length: 14 }, (_, idx) => {
    const matchNo = idx + 1;
    // matches prop에서 해당 번호 매칭 찾기
    const matched = matches.find((m) => (m.betmanMatchNo || (m as any).matchNo) === matchNo) || matches[idx];
    const fallback = baseDefaultRows[idx] || baseDefaultRows[0];

    // 팀명 정제 (한국어/약칭 형태 지원)
    let homeName = matched ? getLocalizedTeamName(matched.homeTeam?.name || '', lang) : fallback.homeTeam;
    let awayName = matched ? getLocalizedTeamName(matched.awayTeam?.name || '', lang) : fallback.awayTeam;

    // 배트맨 스타일 약칭 트리밍 (예: 'LG 트윈스' -> 'LG', '맨체스터 시티' -> '맨시티')
    if (homeName.length > 5) {
      homeName = homeName.replace(' 트윈스', '').replace(' 라이온즈', '').replace(' 자이언츠', '')
        .replace(' 이글스', '').replace(' 랜더스', '').replace(' 베어스', '').replace(' 타이거즈', '')
        .replace(' 위즈', '').replace(' 히어로즈', '').replace(' 다이노스', '').replace('맨체스터 시티', '맨시티')
        .replace('토트넘 홋스퍼', '토트넘');
    }
    if (awayName.length > 5) {
      awayName = awayName.replace(' 트윈스', '').replace(' 라이온즈', '').replace(' 자이언츠', '')
        .replace(' 이글스', '').replace(' 랜더스', '').replace(' 베어스', '').replace(' 타이거즈', '')
        .replace(' 위즈', '').replace(' 히어로즈', '').replace(' 다이노스', '').replace('맨체스터 시티', '맨시티')
        .replace('토트넘 홋스퍼', '토트넘');
    }

    // 경기 시간 추출 (예: '09.04(금) 18:30' -> '(금)18:30')
    let matchTimeStr = fallback.matchTime;
    if (matched?.matchTime) {
      const timeMatch = matched.matchTime.match(/(\([월화수목금토일]\)\s*\d{2}:\d{2})/);
      if (timeMatch) {
        matchTimeStr = timeMatch[1].replace(' ', '');
      } else {
        const parts = matched.matchTime.split(' ');
        matchTimeStr = parts.length > 1 ? parts.slice(1).join('') : matched.matchTime;
      }
    }

    // 투표율 계산 (matched에 odds가 있으면 암묵적 확률 산출, 없으면 회차 기본 투표율 사용)
    let winR = fallback.winRate;
    let drawR = fallback.drawRate;
    let loseR = fallback.loseRate;

    if (matched?.betmanOdds && typeof matched.betmanOdds.win === 'number' && typeof matched.betmanOdds.lose === 'number') {
      const wInv = 1 / Number(matched.betmanOdds.win);
      const dInv = matched.betmanOdds.draw ? 1 / Number(matched.betmanOdds.draw) : 0.3;
      const lInv = 1 / Number(matched.betmanOdds.lose);
      const sum = wInv + dInv + lInv;
      winR = Number(((wInv / sum) * 100).toFixed(1));
      drawR = Number(((dInv / sum) * 100).toFixed(1));
      loseR = Number((100 - winR - drawR).toFixed(1));
    }

    return {
      matchNo,
      homeTeam: homeName,
      awayTeam: awayName,
      matchTime: matchTimeStr,
      winRate: winR,
      drawRate: drawR,
      loseRate: loseR,
      matchObj: matched,
    };
  });

  const handleToggleOption = (matchNo: number, opt: 'WIN' | 'DRAW' | 'LOSE') => {
    setPicks((prev) => {
      const current = prev[matchNo] ? new Set(prev[matchNo]) : new Set<'WIN' | 'DRAW' | 'LOSE'>();
      if (current.has(opt)) {
        current.delete(opt);
      } else {
        current.add(opt);
      }
      return {
        ...prev,
        [matchNo]: current,
      };
    });
    setCalcResults(null); // 수정 시 결과 초기화
  };

  // 전체 초기화
  const handleReset = () => {
    setPicks({});
    setCalcResults(null);
  };

  // 자동 추천 픽 (투표율 1위 기반 정배열 + 복통 자동 조합)
  const handleAutoPicks = () => {
    const newPicks: Record<number, Set<'WIN' | 'DRAW' | 'LOSE'>> = {};
    rows.forEach((r) => {
      const set = new Set<'WIN' | 'DRAW' | 'LOSE'>();
      // 투표율 최대값 찾기
      const maxVal = Math.max(r.winRate, r.drawRate, r.loseRate);
      if (maxVal === r.winRate) set.add('WIN');
      else if (maxVal === r.drawRate) set.add('DRAW');
      else set.add('LOSE');

      // 혼전 경기 (투표율 35% 미만 박빙일 때 복통 추가)
      if (maxVal < 42.0) {
        if (r.drawRate > 25.0) set.add('DRAW');
        if (r.winRate > 30.0 && !set.has('WIN')) set.add('WIN');
      }
      newPicks[r.matchNo] = set;
    });
    setPicks(newPicks);
    setCalcResults(null);
  };

  // 🧮 [계산하기] 통계적 순위 및 당첨 등위별 시뮬레이션 계산 알고리즘
  const handleCalculate = () => {
    let combCount = 1;
    let selectedMatchesCount = 0;

    rows.forEach((r) => {
      const count = picks[r.matchNo]?.size || 0;
      if (count > 0) {
        combCount *= count;
        selectedMatchesCount++;
      }
    });

    if (selectedMatchesCount === 0) {
      alert('최소 1경기 이상의 승/1/패 항목을 마킹해 주세요.');
      return;
    }

    const totalCost = combCount * betUnit;

    // 14경기 투표율 기반 수학적 확률 계산
    let jointProb14 = 1.0;
    rows.forEach((r) => {
      const chosen = picks[r.matchNo];
      if (chosen && chosen.size > 0) {
        let matchProbSum = 0;
        if (chosen.has('WIN')) matchProbSum += r.winRate / 100;
        if (chosen.has('DRAW')) matchProbSum += r.drawRate / 100;
        if (chosen.has('LOSE')) matchProbSum += r.loseRate / 100;
        jointProb14 *= Math.max(0.01, matchProbSum);
      } else {
        // 미선택 경기는 평균 기대치 곱함
        jointProb14 *= 0.333;
      }
    });

    // 1등(14개 올킬), 2등(1개 틀림), 3등(2개 틀림), 4등(3개 틀림) 이항분포 가중 계산
    const rank1Prob = Math.min(100, jointProb14 * 100);
    const rank2Prob = Math.min(100, rank1Prob * 14 * 1.8);
    const rank3Prob = Math.min(100, rank1Prob * 91 * 2.5);
    const rank4Prob = Math.min(100, rank1Prob * 364 * 3.2);

    // 총 발매 금액 추정 (총투표수 * 1,000원)
    const estimatedPool = (displayTotalVotes || 65820) * 1000;
    const totalPrizePool = estimatedPool * 0.5 + displayCarryOver; // 50% 환급 + 이월금

    // 배트맨 공식 등위별 배분 비율:
    // 1등(14경기): 50% + 이월금
    // 2등(13경기): 20%
    // 3등(12경기): 10%
    // 4등(11경기): 20%
    const prizeRank1Total = totalPrizePool * 0.5;
    const prizeRank2Total = totalPrizePool * 0.2;
    const prizeRank3Total = totalPrizePool * 0.1;
    const prizeRank4Total = totalPrizePool * 0.2;

    // 예상 적중자 수 기반 1인당 예상 수령액
    const estWinnersRank1 = Math.max(1, Math.round(displayTotalVotes * (rank1Prob / 100)));
    const estWinnersRank2 = Math.max(3, Math.round(displayTotalVotes * (rank2Prob / 100)));
    const estWinnersRank3 = Math.max(15, Math.round(displayTotalVotes * (rank3Prob / 100)));
    const estWinnersRank4 = Math.max(60, Math.round(displayTotalVotes * (rank4Prob / 100)));

    const exp1 = Math.round(prizeRank1Total / estWinnersRank1);
    const exp2 = Math.round(prizeRank2Total / estWinnersRank2);
    const exp3 = Math.round(prizeRank3Total / estWinnersRank3);
    const exp4 = Math.round(prizeRank4Total / estWinnersRank4);

    let difficulty: 'NORMAL' | 'HARD' | 'VERY_HARD' | 'EXTREME_REVERSE' = 'NORMAL';
    let notice = '정배열 위주의 무난한 회차 구성입니다.';
    if (rank1Prob < 0.05) {
      difficulty = 'EXTREME_REVERSE';
      notice = '역배 및 난전 중심의 고배당 이월 유력 회차입니다!';
    } else if (rank1Prob < 0.2) {
      difficulty = 'VERY_HARD';
      notice = '1점차 접전 승부가 5경기 이상 예상되는 고난도 회차입니다.';
    } else if (rank1Prob < 0.8) {
      difficulty = 'HARD';
      notice = '중위권 박빙 매치업이 많아 복통 마킹이 필수적인 회차입니다.';
    }

    setCalcResults({
      calculated: true,
      combinationsCount: combCount,
      totalAmount: totalCost,
      probabilityRank1: Number(rank1Prob.toFixed(4)),
      probabilityRank2: Number(rank2Prob.toFixed(2)),
      probabilityRank3: Number(rank3Prob.toFixed(2)),
      probabilityRank4: Number(rank4Prob.toFixed(2)),
      expectedDividendRank1: exp1,
      expectedDividendRank2: exp2,
      expectedDividendRank3: exp3,
      expectedDividendRank4: exp4,
      difficultyTier: difficulty,
      unfoldingNotice: notice,
    });
  };

  const drawColHeader = category === 'SEUNG1PAE' ? '1' : category === 'SEUNG5PAE' ? '5' : '무';

  return (
    <div className={`w-full flex flex-col font-sans select-none text-xs ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* 🏷️ 1. 회차 헤더 요약 바 (유저 첨부 이미지와 완벽 일치 및 회차 변경 지원) */}
      <div className={`p-3.5 border-b space-y-2 ${
        isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/80 border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-black text-sm text-amber-500">
            <span>◇</span>
            <span>{category === 'SEUNG1PAE' ? '야구 승1패' : category === 'SEUNGMUBAE' ? '축구 승무패' : '농구 승5패'}</span>
          </div>

          {/* 🔄 회차 선택 셀렉터 (65회차, 64회차 예시, 50회차 축구 등 자유 전환) */}
          <div className="relative">
            <select
              value={selectedRoundKey}
              onChange={(e) => {
                setSelectedRoundKey(e.target.value);
                setPicks({});
                setCalcResults(null);
              }}
              className={`py-1 pl-2.5 pr-7 rounded-md border text-xs font-bold appearance-none cursor-pointer outline-none transition-colors ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
              }`}
            >
              {Object.values(TOTO_ROUNDS_REGISTRY)
                .filter((r) => category === 'SEUNG1PAE' ? r.roundId.startsWith('SEUNG1PAE') : category === 'SEUNGMUBAE' ? r.roundId.startsWith('SEUNGMUBAE') : true)
                .map((r) => (
                  <option key={r.roundId} value={r.roundId}>
                    {r.roundTitle} [{r.status}]
                  </option>
                ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 판매기간 / 총투표수 / 1등총금액 정보 그리드 (동적 출력) */}
        <div className="grid grid-cols-[85px_1fr] gap-y-1 text-[11px] leading-relaxed">
          <span className="text-slate-400 flex items-center gap-1">
            <span>◇</span> 판매기간
          </span>
          <span className="font-mono text-slate-300">{displaySalePeriod}</span>

          <span className="text-slate-400 flex items-center gap-1">
            <span>◇</span> 총투표수
          </span>
          <span className="font-mono font-bold text-slate-200">{displayTotalVotes.toLocaleString()}</span>

          <span className="text-slate-400 flex items-center gap-1">
            <span>◇</span> 1등총금액 [이월금]
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-black text-blue-400 font-mono text-xs">
              {displayFirstPrize.toLocaleString()}원
            </span>
            <span className="text-slate-400 text-[10px]">
              [ {displayCarryOver.toLocaleString()}원 / {displayCarryOverCount}회 ]
            </span>
          </div>
        </div>
      </div>

      {/* 🛠️ 2. 유틸리티 컨트롤 바: 1000원 선택기 | 초기화(금지아이콘) | 자동 선택 */}
      <div className={`px-3 py-2 border-b flex items-center justify-end gap-2 text-xs ${
        isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-900/50 border-slate-800'
      }`}>
        <select
          value={betUnit}
          onChange={(e) => setBetUnit(Number(e.target.value))}
          className="px-2 py-1 rounded border border-slate-700 bg-slate-900 text-[11px] font-bold text-slate-200 outline-none"
        >
          <option value={100}>100원</option>
          <option value={500}>500원</option>
          <option value={1000}>1000원</option>
          <option value={2000}>2000원</option>
          <option value={5000}>5000원</option>
          <option value={10000}>10000원</option>
        </select>

        <button
          onClick={handleReset}
          title="마킹 전체 초기화"
          className="p-1 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleAutoPicks}
          className="flex items-center gap-1 px-2.5 py-1 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-all cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>자동</span>
        </button>
      </div>

      {/* 📊 3. 14경기 배트맨 슬립 테이블 (이미지와 동일한 컬럼 및 비율 배정) */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className={`border-b text-[11px] font-bold ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}>
              <th className="py-2 px-1 w-8 border-r border-slate-800/40">번호</th>
              <th className="py-2 px-2 w-20 border-r border-slate-800/40">홈</th>
              <th className="py-2 px-1 w-20 border-r border-slate-800/40">시간</th>
              <th className="py-2 px-2 w-20 border-r border-slate-800/40">원정</th>
              <th className="py-2 px-1 w-10 border-r border-slate-800/40">
                <span className="text-rose-500 font-black">+</span>
              </th>
              <th className="py-2 px-2 border-r border-slate-800/40 text-emerald-400">승</th>
              <th className="py-2 px-2 border-r border-slate-800/40 text-amber-400">{drawColHeader}</th>
              <th className="py-2 px-2 text-cyan-400">패</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {rows.map((r) => {
              const currentPick = picks[r.matchNo] || new Set();
              const isWin = currentPick.has('WIN');
              const isDraw = currentPick.has('DRAW');
              const isLose = currentPick.has('LOSE');

              return (
                <tr
                  key={r.matchNo}
                  className={`transition-colors ${
                    isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-900/40'
                  }`}
                >
                  {/* 경기 번호 */}
                  <td className="py-2.5 px-1 font-bold text-slate-400 border-r border-slate-800/30">
                    {r.matchNo}
                  </td>

                  {/* 홈팀 */}
                  <td 
                    onClick={() => r.matchObj && onSelectMatch(r.matchObj)}
                    className="py-2.5 px-2 font-bold text-left truncate cursor-pointer hover:text-amber-400 transition-colors border-r border-slate-800/30 font-sans"
                  >
                    {r.homeTeam}
                  </td>

                  {/* 시간 */}
                  <td className="py-2.5 px-1 text-[10px] text-slate-400 border-r border-slate-800/30">
                    {r.matchTime}
                  </td>

                  {/* 원정팀 */}
                  <td 
                    onClick={() => r.matchObj && onSelectMatch(r.matchObj)}
                    className="py-2.5 px-2 font-bold text-left truncate cursor-pointer hover:text-amber-400 transition-colors border-r border-slate-800/30 font-sans"
                  >
                    {r.awayTeam}
                  </td>

                  {/* [+] 상세 통계 열기 버튼 */}
                  <td className="py-2 px-1 border-r border-slate-800/30">
                    <button
                      onClick={() => r.matchObj && onSelectMatch(r.matchObj)}
                      className="w-6 h-5 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs flex items-center justify-center transition-all cursor-pointer mx-auto"
                      title="상세 상대전적 & 선발투수 조회"
                    >
                      +
                    </button>
                  </td>

                  {/* 승 마킹 버튼 (투표율 % 표기) */}
                  <td className="p-1 border-r border-slate-800/30">
                    <button
                      onClick={() => handleToggleOption(r.matchNo, 'WIN')}
                      className={`w-full py-1.5 px-1 rounded border text-[11px] font-bold transition-all cursor-pointer ${
                        isWin
                          ? 'bg-rose-500 text-white border-rose-400 shadow-sm font-black'
                          : isLight
                            ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {r.winRate}%
                    </button>
                  </td>

                  {/* 1(무) 마킹 버튼 */}
                  <td className="p-1 border-r border-slate-800/30">
                    <button
                      onClick={() => handleToggleOption(r.matchNo, 'DRAW')}
                      className={`w-full py-1.5 px-1 rounded border text-[11px] font-bold transition-all cursor-pointer ${
                        isDraw
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                          : isLight
                            ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {r.drawRate}%
                    </button>
                  </td>

                  {/* 패 마킹 버튼 */}
                  <td className="p-1">
                    <button
                      onClick={() => handleToggleOption(r.matchNo, 'LOSE')}
                      className={`w-full py-1.5 px-1 rounded border text-[11px] font-bold transition-all cursor-pointer ${
                        isLose
                          ? 'bg-blue-600 text-white border-blue-400 shadow-sm font-black'
                          : isLight
                            ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {r.loseRate}%
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🎯 4. 하단 액션 바: 총투표수 노출 | [계산] 버튼 | [리셋] 버튼 */}
      <div className={`p-3 border-t flex items-center justify-between shrink-0 ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="font-black text-sm text-cyan-400 font-mono tracking-wider">
          {displayTotalVotes.toLocaleString()}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCalculate}
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4" />
            <span>계산</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            리셋
          </button>
        </div>
      </div>

      {/* 🏆 5. 계산 결과 패널: 통계적 몇 등 순위까지 적중 확률 및 예상 당첨금 출력 */}
      {calcResults && calcResults.calculated && (
        <div className="p-4 bg-gradient-to-b from-slate-900 to-slate-950 border-t-2 border-emerald-500 space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
              <span className="font-black text-white text-sm">토큰 AI 통계적 등위 시뮬레이션 결과</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              {calcResults.difficultyTier === 'EXTREME_REVERSE' ? '🔥 초고난도 역배' : calcResults.difficultyTier === 'VERY_HARD' ? '⚠️ 1점차 난전' : '🟢 표준 흐름'}
            </span>
          </div>

          <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
            📌 <strong>분석 총평:</strong> {calcResults.unfoldingNotice}
          </p>

          {/* 구매 조합 및 비용 */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">선택한 조합 수</span>
              <span className="text-sm font-black text-amber-400 font-mono">
                {calcResults.combinationsCount.toLocaleString()}개 조합
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">총 구매 금액 ({betUnit}원 기준)</span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {calcResults.totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 🥇 1등 ~ 4등 순위별 통계 확률 및 예상 수령액 카드 그리드 */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">📊 등위별 통계적 적중 확률 & 예상 당첨금</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
              {/* 1등 (14경기 올킬) */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="font-black text-amber-400 text-xs">🥇 1등 (14경기 적중)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">적중 확률: </span>
                  <span className="text-xs font-bold text-amber-300">{calcResults.probabilityRank1}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">예상 1인 당첨금</span>
                  <span className="font-black text-amber-400 text-sm">{calcResults.expectedDividendRank1.toLocaleString()}원</span>
                </div>
              </div>

              {/* 2등 (13경기 적중) */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="font-bold text-slate-200 text-xs">🥈 2등 (13경기 적중)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">적중 확률: </span>
                  <span className="text-xs font-bold text-slate-200">{calcResults.probabilityRank2}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">예상 당첨금</span>
                  <span className="font-bold text-slate-200 text-sm">{calcResults.expectedDividendRank2.toLocaleString()}원</span>
                </div>
              </div>

              {/* 3등 (12경기 적중) */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="font-bold text-slate-300 text-xs">🥉 3등 (12경기 적중)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">적중 확률: </span>
                  <span className="text-xs font-bold text-slate-300">{calcResults.probabilityRank3}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">예상 당첨금</span>
                  <span className="font-bold text-slate-300 text-sm">{calcResults.expectedDividendRank3.toLocaleString()}원</span>
                </div>
              </div>

              {/* 4등 (11경기 적중) */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="font-bold text-slate-400 text-xs">🎖️ 4등 (11경기 적중)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">적중 확률: </span>
                  <span className="text-xs font-bold text-slate-400">{calcResults.probabilityRank4}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">예상 당첨금</span>
                  <span className="font-bold text-slate-400 text-sm">{calcResults.expectedDividendRank4.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const textLines = Object.entries(picks)
                .map(([no, set]) => `${no}번: ${Array.from(set).map(p => p === 'WIN' ? '승' : p === 'DRAW' ? drawColHeader : '패').join('/')}`)
                .join(', ');
              navigator.clipboard.writeText(`[토큰 승1패 마킹 조합]\n${textLines}\n조합: ${calcResults.combinationsCount}개 (${calcResults.totalAmount.toLocaleString()}원)\n1등예상: ${calcResults.expectedDividendRank1.toLocaleString()}원`);
              alert('마킹 조합 및 등위 통계가 클립보드에 복사되었습니다! 📋');
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer text-center"
          >
            📋 마킹 조합 & 당첨 시뮬레이션 복사하기
          </button>
        </div>
      )}
    </div>
  );
};
