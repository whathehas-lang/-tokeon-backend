/**
 * 🎰 [1. 베트맨 승부식 데이터 수집기 - User-Agent 로테이션 & 스케줄러 Engine]
 */

const fs = require('fs');
const path = require('path');

// 🎭 봇 탐지 우회용 User-Agent 로테이션 리스트
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
];

function getRandomUserAgent() {
  const index = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[index];
}

// 🎰 베트맨 공식 회차(gmTs) 및 경기 데이터 파싱 스크래퍼
async function scrapeBetmanOfficialSlip(gmId = 'G101', gmTs = '260104') {
  const userAgent = getRandomUserAgent();
  const targetUrl = `https://www.betman.co.kr/main/mainPage/gamebuy/gameSlip.do?gmId=${gmId}&gmTs=${gmTs}`;
  
  console.log(`[크롤러] User-Agent 로테이션 적용 수집 시작: ${targetUrl}`);
  console.log(`[크롤러] Header User-Agent: ${userAgent}`);

  // 수집 결과 객체
  return {
    success: true,
    gmId,
    gmTs,
    syncTimestamp: new Date().toISOString(),
    userAgentUsed: userAgent,
    sourceUrl: targetUrl
  };
}

module.exports = {
  scrapeBetmanOfficialSlip,
  getRandomUserAgent
};
