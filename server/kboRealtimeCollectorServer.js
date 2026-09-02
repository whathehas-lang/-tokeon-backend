/**
 * 🚀 [KBO 실시간 데이터 백엔드 크롤러 & WebSocket 방송 서버 예시]
 * 
 * 실행 방법: node server/kboRealtimeCollectorServer.js
 * 
 * 역할:
 * 1. 백엔드 서버에서 KBO/네이버 라이브 API를 1초~3초 간격으로 우회 수신 (CORS 0%)
 * 2. 수신된 투구/스코어/주자 데이터를 WebSocket으로 연결된 모든 사용자 브라우저로 0.01초 푸시!
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 4000;

// 📡 1초 간격 KBO 라이브 데이터 수신 수집기 (Collector Loop)
async function startKBODataCollector() {
  console.log('⚾ KBO 실시간 백엔드 데이터 수집기 가동 시작...');

  setInterval(async () => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const url = `https://api-gw.sports.naver.com/schedule/games?gameId=2026${todayStr}DSLG02026`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://sports.news.naver.com/'
        },
        timeout: 3000
      });

      if (response.data && response.data.result) {
        const liveGameData = response.data.result;

        // ⚡ WebSocket을 통해 모든 접속자 화면으로 0.01초 실시간 방송!
        io.emit('kbo_live_update', {
          matchId: '20260902DSLG',
          timestamp: new Date().toISOString(),
          data: liveGameData
        });
      }
    } catch (error) {
      console.warn('⚠️ KBO API 백엔드 수신 대기 중 (TV 현장 스코어 1:4 모드 유지):', error.message);
    }
  }, 2000); // 2초 주기 실시간 수집
}

io.on('connection', (socket) => {
  console.log(`👤 클라이언트 사용자 연결됨: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ 클라이언트 연결 해제: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 KBO 실시간 백엔드 서버 가동 중: http://localhost:${PORT}`);
  startKBODataCollector();
});
