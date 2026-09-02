import type { StarterPitcherInfo } from '../../types/sports';

/**
 * 🌟 SportsPlayerMappingService
 * API-Sports (영문 이름, 선수 ID, 다양한 JSON 포맷) ↔ 토큰 앱 (한글 오피셜 선수명 및 스탯)
 * 매핑 누락으로 인한 null / 대기 상태 발생을 원천 차단하는 정밀 번역 & 정규화 엔진
 */

export const KBO_MLB_PLAYER_NAME_DICT: Record<string, { nameKo: string; throwsHand: 'R' | 'L'; number?: number }> = {
  // === KBO 투수진 ===
  'kwak been': { nameKo: '곽빈', throwsHand: 'R', number: 47 },
  'kwak bin': { nameKo: '곽빈', throwsHand: 'R', number: 47 },
  'lim chan-kyu': { nameKo: '임찬규', throwsHand: 'R', number: 1 },
  'im chan-kyu': { nameKo: '임찬규', throwsHand: 'R', number: 1 },
  'im chan kyu': { nameKo: '임찬규', throwsHand: 'R', number: 1 },
  'won tae-in': { nameKo: '원태인', throwsHand: 'R', number: 18 },
  'won tae in': { nameKo: '원태인', throwsHand: 'R', number: 18 },
  'yang hyeon-jong': { nameKo: '양현종', throwsHand: 'L', number: 54 },
  'yang hyun-jong': { nameKo: '양현종', throwsHand: 'L', number: 54 },
  'james nail': { nameKo: '네일', throwsHand: 'R', number: 40 },
  'nail': { nameKo: '네일', throwsHand: 'R', number: 40 },
  'ryu hyun-jin': { nameKo: '류현진', throwsHand: 'L', number: 99 },
  'hyun-jin ryu': { nameKo: '류현진', throwsHand: 'L', number: 99 },
  'ko young-pyo': { nameKo: '고영표', throwsHand: 'R', number: 1 },
  'go young-pyo': { nameKo: '고영표', throwsHand: 'R', number: 1 },
  'william cuevas': { nameKo: '쿠에바스', throwsHand: 'R', number: 32 },
  'cuevas': { nameKo: '쿠에바스', throwsHand: 'R', number: 32 },
  'charlie barnes': { nameKo: '반즈', throwsHand: 'L', number: 28 },
  'barnes': { nameKo: '반즈', throwsHand: 'L', number: 28 },
  'aaron wilkerson': { nameKo: '윌커슨', throwsHand: 'R', number: 46 },
  'wilkerson': { nameKo: '윌커슨', throwsHand: 'R', number: 46 },
  'ariel jurado': { nameKo: '후라도', throwsHand: 'R', number: 75 },
  'jurado': { nameKo: '후라도', throwsHand: 'R', number: 75 },
  'enzo heyesus': { nameKo: '헤이수스', throwsHand: 'L', number: 54 },
  'heyesus': { nameKo: '헤이수스', throwsHand: 'L', number: 54 },
  'kim kwang-hyun': { nameKo: '김광현', throwsHand: 'L', number: 29 },
  'kwang-hyun kim': { nameKo: '김광현', throwsHand: 'L', number: 29 },
  'drew anderson': { nameKo: '앤더슨', throwsHand: 'R', number: 61 },
  'anderson': { nameKo: '앤더슨', throwsHand: 'R', number: 61 },
  'kyle hart': { nameKo: '하트', throwsHand: 'L', number: 30 },
  'hart': { nameKo: '하트', throwsHand: 'L', number: 30 },
  'shin min-hyeok': { nameKo: '신민혁', throwsHand: 'R', number: 53 },
  'moon dong-ju': { nameKo: '문동주', throwsHand: 'R', number: 1 },

  // === MLB 투수진 ===
  'gerrit cole': { nameKo: '게릿 콜', throwsHand: 'R', number: 45 },
  'cole': { nameKo: '게릿 콜', throwsHand: 'R', number: 45 },
  'jose soriano': { nameKo: '호세 소리아노', throwsHand: 'R', number: 59 },
  'soriano': { nameKo: '호세 소리아노', throwsHand: 'R', number: 59 },
  'zac gallen': { nameKo: '잭 갤런', throwsHand: 'R', number: 23 },
  'gallen': { nameKo: '잭 갤런', throwsHand: 'R', number: 23 },
  'zack wheeler': { nameKo: '잭 휠러', throwsHand: 'R', number: 45 },
  'wheeler': { nameKo: '잭 휠러', throwsHand: 'R', number: 45 },
  'yoshinobu yamamoto': { nameKo: '야마모토', throwsHand: 'R', number: 18 },
  'yamamoto': { nameKo: '야마모토', throwsHand: 'R', number: 18 },
  'jack flaherty': { nameKo: '플래허티', throwsHand: 'R', number: 0 },
  'flaherty': { nameKo: '플래허티', throwsHand: 'R', number: 0 },
  'yu darvish': { nameKo: '다르빗슈', throwsHand: 'R', number: 11 },
  'darvish': { nameKo: '다르빗슈', throwsHand: 'R', number: 11 },
  'dylan cease': { nameKo: '딜런 시즈', throwsHand: 'R', number: 84 },
  'shota imanaga': { nameKo: '이마나가', throwsHand: 'L', number: 18 },
  'paul skenes': { nameKo: '폴 스킨스', throwsHand: 'R', number: 30 },
  'corbin burnes': { nameKo: '코빈 번스', throwsHand: 'R', number: 39 },
  'freddy peralta': { nameKo: '페랄타', throwsHand: 'R', number: 51 }
};

export class SportsPlayerMappingService {
  /**
   * API에서 전달된 영문 또는 불완전한 선수 객체를 완전한 한글 StarterPitcherInfo로 변환
   */
  public static mapApiPitcherToKorean(apiPitcherRaw: any, fallbackTeamName: string): StarterPitcherInfo {
    if (!apiPitcherRaw) {
      return {
        name: '선발투수 오피셜 확인 중',
        number: 1,
        throwsHand: 'R',
        era: '3.50',
        whip: '1.20',
        wins: 0,
        losses: 0,
        inningsPitched: '0.0',
        strikeouts: 0,
        vsOpponentLogs: []
      };
    }

    // 1. Raw name 추출
    let rawName = '';
    if (typeof apiPitcherRaw === 'string') {
      rawName = apiPitcherRaw;
    } else if (apiPitcherRaw.name) {
      rawName = apiPitcherRaw.name;
    } else if (apiPitcherRaw.player && apiPitcherRaw.player.name) {
      rawName = apiPitcherRaw.player.name;
    }

    const cleanLower = rawName.trim().toLowerCase();

    // 2. 한글-영문 사전 매핑 조회
    const mapped = KBO_MLB_PLAYER_NAME_DICT[cleanLower];
    const finalKoreanName = mapped ? mapped.nameKo : rawName;
    const finalHand = mapped ? mapped.throwsHand : (apiPitcherRaw.throwsHand || apiPitcherRaw.hand || 'R');
    const finalNumber = mapped?.number || apiPitcherRaw.number || 1;

    return {
      name: finalKoreanName || '공식 선발투수',
      number: finalNumber,
      throwsHand: finalHand,
      era: apiPitcherRaw.era ? String(apiPitcherRaw.era) : '3.50',
      whip: apiPitcherRaw.whip ? String(apiPitcherRaw.whip) : '1.20',
      wins: apiPitcherRaw.wins || 0,
      losses: apiPitcherRaw.losses || 0,
      inningsPitched: apiPitcherRaw.inningsPitched ? String(apiPitcherRaw.inningsPitched) : '0.0',
      strikeouts: apiPitcherRaw.strikeouts || 0,
      vsOpponentLogs: apiPitcherRaw.vsOpponentLogs || []
    };
  }

  /**
   * 영문 구단명을 한글 표준 구단명으로 정규화
   */
  public static normalizeTeamName(teamName: string): string {
    const lower = teamName.toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
    
    if (lower.includes('doosan') || lower.includes('bears') || lower.includes('두산')) return '두산 베어스';
    if (lower.includes('lg') || lower.includes('twins') || lower.includes('트윈스')) return 'LG 트윈스';
    if (lower.includes('samsung') || lower.includes('lions') || lower.includes('삼성')) return '삼성 라이온즈';
    if (lower.includes('lotte') || lower.includes('giants') || lower.includes('롯데')) return '롯데 자이언츠';
    if (lower.includes('hanwha') || lower.includes('eagles') || lower.includes('한화')) return '한화 이글스';
    if (lower.includes('kia') || lower.includes('tigers') || lower.includes('기아')) return 'KIA 타이거즈';
    if (lower.includes('kt') || lower.includes('wiz') || lower.includes('위즈')) return 'KT 위즈';
    if (lower.includes('nc') || lower.includes('dinos') || lower.includes('다이노스')) return 'NC 다이노스';
    if (lower.includes('kiwoom') || lower.includes('heroes') || lower.includes('키움')) return '키움 히어로즈';
    if (lower.includes('ssg') || lower.includes('landers') || lower.includes('랜더스')) return 'SSG 랜더스';

    if (lower.includes('yankees') || lower.includes('양키스')) return '뉴욕 양키스';
    if (lower.includes('angels') || lower.includes('에인절스')) return 'LA 에인절스';
    if (lower.includes('dodgers') || lower.includes('다저스')) return 'LA 다저스';
    if (lower.includes('diamondbacks') || lower.includes('애리조나')) return '애리조나 다이아몬드백스';
    if (lower.includes('phillies') || lower.includes('필라델피아')) return '필라델피아 필리스';
    if (lower.includes('padres') || lower.includes('샌디에이고')) return '샌디에이고 파드리스';

    return teamName;
  }
}
