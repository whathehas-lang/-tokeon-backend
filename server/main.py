# -*- coding: utf-8 -*-
"""
🚀 [TOKEON FastAPI 5대 종목 실시간 서버 - main.py]
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import asyncio
from typing import Dict, List

app = FastAPI(title="TOKEON Multi-Sport Realtime API & WebSocket Engine")

# CORS 설정을 통한 앱 프론트엔드 연동 지원
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🌐 고성능 WebSocket 커넥션 매니저 (룸별 브로드캐스트)
class ConnectionManager:
    def __init__(self):
        # room_id -> list of active websockets
        self.active_rooms: Dict[str, List[WebSocket]] = {}
        # live match subscribers
        self.match_subscribers: List[WebSocket] = []

    async def connect_room(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_rooms:
            self.active_rooms[room_id] = []
        self.active_rooms[room_id].append(websocket)
        # 룸 접속자 수 업데이트 알림
        await self.broadcast_to_room(room_id, {
            "type": "USER_COUNT",
            "room_id": room_id,
            "count": len(self.active_rooms[room_id])
        })

    def disconnect_room(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_rooms and websocket in self.active_rooms[room_id]:
            self.active_rooms[room_id].remove(websocket)
            if not self.active_rooms[room_id]:
                del self.active_rooms[room_id]

    async def broadcast_to_room(self, room_id: str, message_data: dict):
        if room_id in self.active_rooms:
            text_payload = json.dumps(message_data, ensure_ascii=False)
            dead_sockets = []
            for connection in self.active_rooms[room_id]:
                try:
                    await connection.send_text(text_payload)
                except Exception:
                    dead_sockets.append(connection)
            for dead in dead_sockets:
                self.disconnect_room(dead, room_id)

    async def connect_matches(self, websocket: WebSocket):
        await websocket.accept()
        self.match_subscribers.append(websocket)

    def disconnect_matches(self, websocket: WebSocket):
        if websocket in self.match_subscribers:
            self.match_subscribers.remove(websocket)

    async def broadcast_matches_update(self, payload: dict):
        text_payload = json.dumps(payload, ensure_ascii=False)
        dead = []
        for ws in self.match_subscribers:
            try:
                await ws.send_text(text_payload)
            except Exception:
                dead.append(ws)
        for d in dead:
            self.disconnect_matches(d)

manager = ConnectionManager()

# 💬 1. 실시간 채팅 WebSocket 엔드포인트
@app.websocket("/ws/chat/{room_id}")
async def websocket_chat_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect_room(websocket, room_id)
    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                msg_json = json.loads(data_text)
            except Exception:
                msg_json = {"text": data_text}

            # 수신 메시지를 해당 룸의 모든 접속자에게 0.01초 즉시 브로드캐스트
            await manager.broadcast_to_room(room_id, {
                "type": "CHAT_MESSAGE",
                "room_id": room_id,
                "data": msg_json
            })
    except WebSocketDisconnect:
        manager.disconnect_room(websocket, room_id)
        if room_id in manager.active_rooms:
            await manager.broadcast_to_room(room_id, {
                "type": "USER_COUNT",
                "room_id": room_id,
                "count": len(manager.active_rooms[room_id])
            })
    except Exception:
        manager.disconnect_room(websocket, room_id)

# 📡 2. 실시간 경기 스코어/투구수 푸시 WebSocket 엔드포인트
@app.websocket("/ws/live-matches")
async def websocket_live_matches_endpoint(websocket: WebSocket):
    await manager.connect_matches(websocket)
    try:
        while True:
            # 클라이언트 핑-퐁 유지
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_matches(websocket)
    except Exception:
        manager.disconnect_matches(websocket)

@app.get("/")
def read_root():
    return {
        "status": "OK",
        "message": "TOKEON FastAPI Multi-Sport & WebSocket Backend Active",
        "active_rooms": list(manager.active_rooms.keys())
    }

@app.get("/api/matches/{sport}")
def get_matches(sport: str, date: str = "2026-09-03"):
    """
    앱에서 요청하는 엔드포인트: /api/matches/soccer?date=2026-09-03
    """
    config = SPORT_CONFIGS.get(sport)
    if not config:
        return {"error": "지원하지 않는 종목입니다."}

    url = f"https://{config['host']}/{config['endpoint']}"
    params = {"date": date}
    headers = {**HEADERS, "x-rapidapi-host": config["host"]}

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        data = response.json()
    except Exception as e:
        return {"error": f"API-Sports 요청 예외 발생: {str(e)}"}
    
    # 앱에서 쓰기 편하게 필요한 데이터만 정제해서 리턴
    match_list = []
    for match in data.get("response", []):
        try:
            home = match.get("teams", {}).get("home", {}).get("name", "Unknown Home")
            away = match.get("teams", {}).get("away", {}).get("name", "Unknown Away")
            
            # 종목별 키 차이 흡수 (fixture vs status/date)
            status_obj = match.get("fixture", {}).get("status", {}) or match.get("status", {})
            status_short = status_obj.get("short", "NS")
            
            match_time = match.get("fixture", {}).get("date") or match.get("date") or date

            match_list.append({
                "home_team": home,
                "away_team": away,
                "status": status_short,
                "time": match_time
            })
        except Exception:
            continue
            
    return {
        "sport": sport,
        "date": date,
        "total_count": len(match_list),
        "matches": match_list
    }

# 서버 실행 명령어: uvicorn main:app --reload --port 8000
