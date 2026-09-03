# -*- coding: utf-8 -*-
"""
🚀 [TOKEON FastAPI 5대 종목 실시간 서버 - main.py]
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI(title="TOKEON Multi-Sport Realtime API")

# CORS 설정을 통한 앱 프론트엔드 연동 지원
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. API-Sports 인증 키 설정 (오피셜 가입 키)
API_KEY = "96ae3619c2c6f8f76ec75d64bd95d000"
HEADERS = {"x-apisports-key": API_KEY}

# 2. 5대 종목 호스트 및 엔드포인트 세팅
SPORT_CONFIGS = {
    "soccer": {"host": "v3.football.api-sports.io", "endpoint": "fixtures"},
    "baseball": {"host": "v1.baseball.api-sports.io", "endpoint": "games"},
    "basketball": {"host": "v1.basketball.api-sports.io", "endpoint": "games"},
    "volleyball": {"host": "v1.volleyball.api-sports.io", "endpoint": "games"},
    "hockey": {"host": "v1.hockey.api-sports.io", "endpoint": "games"}
}

@app.get("/")
def read_root():
    return {"status": "OK", "message": "TOKEON FastAPI Multi-Sport Backend Active"}

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
