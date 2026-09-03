# -*- coding: utf-8 -*-
"""
🏆 [API-Sports 5대 종목 (축구, 야구, 농구, 배구, 하키) 무인 자동 수집 & rapidfuzz 매칭 파이프라인]
"""

from datetime import datetime
import json
import requests
try:
    from rapidfuzz import fuzz
except ImportError:
    fuzz = None

# 1. API-Sports 인증 키 설정 (오피셜 가입 키)
API_KEY = "96ae3619c2c6f8f76ec75d64bd95d000"
HEADERS = {
    "x-apisports-key": API_KEY
}

# 2. 5대 종목별 API 엔드포인트 및 멀티 스포츠 엔드포인트 설정
SPORT_CONFIGS = {
    "soccer": {
        "host": "v3.football.api-sports.io",
        "endpoint": "fixtures",
        "default_league": 39,  # 예: 프리미어리그 / 주요 축구 리그
    },
    "baseball": {
        "host": "v1.baseball.api-sports.io",
        "endpoint": "games",
        "default_league": 1,   # 예: MLB / KBO / NPB
    },
    "basketball": {
        "host": "v1.basketball.api-sports.io",
        "endpoint": "games",
        "default_league": 12,  # 예: NBA / KBL
    },
    "volleyball": {
        "host": "v1.volleyball.api-sports.io",
        "endpoint": "games",
        "default_league": 1,   # 예: 주요 배구 리그 ID
    },
    "hockey": {
        "host": "v1.hockey.api-sports.io",
        "endpoint": "games",
        "default_league": 57,  # 예: NHL
    }
}

def fetch_sport_fixtures(sport_name, season_year="2026", target_date=None):
    """
    선택한 종목의 특정 시즌 전체 또는 특정 날짜의 경기 일정을 가져오는 함수
    """
    config = SPORT_CONFIGS.get(sport_name)
    if not config:
        print(f"지원하지 않는 종목입니다: {sport_name}")
        return []

    url = f"https://{config['host']}/{config['endpoint']}"
    
    # 파라미터 설정 (특정 날짜가 있으면 date 우선, 없으면 리그/시즌 전체)
    params = {
        "league": config["default_league"],
        "season": season_year
    }
    if target_date:
        params = {"date": target_date}

    headers = {**HEADERS, "x-rapidapi-host": config["host"]}
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        data = response.json()
        return data.get("response", [])
    except Exception as e:
        print(f"[{sport_name}] API 요청 에러 발생: {e}")
        return []

def fuzzy_match_team(korean_name, target_list):
    """
    rapidfuzz 문자열 유사도 기반 1:1 팀명 매칭 함수
    """
    if not fuzz or not target_list:
        return None
    best_match = None
    best_score = 0
    for item in target_list:
        score = fuzz.ratio(korean_name, item)
        if score > best_score and score >= 75:
            best_score = score
            best_match = item
    return best_match

if __name__ == "__main__":
    today_str = datetime.now().strftime("%Y-%m-%d")
    print(f"=== [5대 종목 (축구, 야구, 농구, 배구, 하키) 실시간 무인 수집 가동 ({today_str})] ===")
    
    results = {}
    for sport in ["soccer", "baseball", "basketball", "volleyball", "hockey"]:
        fixtures = fetch_sport_fixtures(sport, season_year="2026", target_date=today_str)
        print(f"[{sport.upper()} 종목 수집 완료: {len(fixtures)}건]")
        results[sport] = len(fixtures)

    print("\n✅ 5대 종목 실시간 수집 및 매칭 완료:", json.dumps(results, ensure_ascii=False))
