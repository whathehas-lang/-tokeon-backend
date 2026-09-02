export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const games = [
      {
        gameId: '2026_LG_OB',
        gameDateTime: '18:30',
        homeTeamName: '두산',
        awayTeamName: 'LG',
        homeStarter: { name: '최승용', number: 28, throwsHand: 'L', era: '5.61', seasonEra: '5.61', last5GamesEra: '4.80', last3GamesEra: '3.90', whip: '1.45', wins: 4, losses: 5, inningsPitched: '52.0', strikeouts: 48 },
        awayStarter: { name: '김윤식', number: 57, throwsHand: 'L', era: '4.97', seasonEra: '4.97', last5GamesEra: '5.20', last3GamesEra: '4.50', whip: '1.38', wins: 5, losses: 4, inningsPitched: '48.0', strikeouts: 44 }
      },
      {
        gameId: '2026_LT_SS',
        gameDateTime: '18:30',
        homeTeamName: '삼성',
        awayTeamName: '롯데',
        homeStarter: { name: '최원태', number: 20, throwsHand: 'R', era: '4.57', seasonEra: '4.57', last5GamesEra: '4.20', last3GamesEra: '3.80', whip: '1.36', wins: 9, losses: 7, inningsPitched: '126.2', strikeouts: 103 },
        awayStarter: { name: '박세웅', number: 21, throwsHand: 'R', era: '4.68', seasonEra: '4.68', last5GamesEra: '4.80', last3GamesEra: '4.20', whip: '1.38', wins: 6, losses: 11, inningsPitched: '173.1', strikeouts: 124 }
      },
      {
        gameId: '2026_HH_KT',
        gameDateTime: '18:30',
        homeTeamName: 'KT',
        awayTeamName: '한화',
        homeStarter: { name: '소형준', number: 11, throwsHand: 'R', era: '3.36', seasonEra: '3.36', last5GamesEra: '3.10', last3GamesEra: '2.40', whip: '1.18', wins: 7, losses: 3, inningsPitched: '65.0', strikeouts: 55 },
        awayStarter: { name: '류현진', number: 99, throwsHand: 'L', era: '3.85', seasonEra: '3.85', last5GamesEra: '3.50', last3GamesEra: '2.90', whip: '1.24', wins: 10, losses: 8, inningsPitched: '158.1', strikeouts: 135 }
      },
      {
        gameId: '2026_HT_NC',
        gameDateTime: '18:30',
        homeTeamName: 'NC',
        awayTeamName: 'KIA',
        homeStarter: { name: '토다', number: 41, throwsHand: 'R', era: '3.90', seasonEra: '3.90', last5GamesEra: '3.80', last3GamesEra: '3.50', whip: '1.25', wins: 3, losses: 2, inningsPitched: '32.0', strikeouts: 28 },
        awayStarter: { name: '시라카와', number: 43, throwsHand: 'R', era: '4.88', seasonEra: '4.88', last5GamesEra: '4.50', last3GamesEra: '3.80', whip: '1.42', wins: 4, losses: 5, inningsPitched: '57.1', strikeouts: 52 }
      },
      {
        gameId: '2026_SK_WO',
        gameDateTime: '18:30',
        homeTeamName: '키움',
        awayTeamName: 'SSG',
        homeStarter: { name: '하영민', number: 43, throwsHand: 'R', era: '4.63', seasonEra: '4.63', last5GamesEra: '4.20', last3GamesEra: '3.60', whip: '1.40', wins: 9, losses: 8, inningsPitched: '144.0', strikeouts: 95 },
        awayStarter: { name: '김건우', number: 59, throwsHand: 'L', era: '4.10', seasonEra: '4.10', last5GamesEra: '4.00', last3GamesEra: '3.80', whip: '1.32', wins: 3, losses: 2, inningsPitched: '35.0', strikeouts: 32 }
      }
    ];

    return res.status(200).json({ success: true, timestamp: Date.now(), games });
  } catch (error) {
    return res.status(500).json({ success: false, error: String(error) });
  }
}
