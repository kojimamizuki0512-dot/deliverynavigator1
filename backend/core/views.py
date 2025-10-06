from __future__ import annotations
from typing import Any, Dict, List
from io import BytesIO

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
import pytesseract


# ============ 共通ヘルパ ============

def ok(data: Any, status: int = 200) -> JsonResponse:
    """日本語をそのまま返す & 配列もOKにする"""
    return JsonResponse(
        data,
        status=status,
        safe=False,
        json_dumps_params={"ensure_ascii": False, "indent": 2},
    )


# ============ 1) ヒートマップ ============

def heatmap_data(request):
    """緯度・経度・強度・人気店のリスト（ダミー）"""
    points: List[Dict[str, Any]] = [
        {"lat": 35.6585, "lng": 139.7013, "intensity": 0.85, "restaurants": ["A飯店", "Bカフェ", "Cバーガー"]},
        {"lat": 35.6610, "lng": 139.7038, "intensity": 0.68, "restaurants": ["Dラーメン", "Eピザ"]},
        {"lat": 35.6555, "lng": 139.6990, "intensity": 0.48, "restaurants": ["Fストア"]},
        {"lat": 35.6626, "lng": 139.6998, "intensity": 0.72, "restaurants": ["G寿司", "Hカレー"]},
        {"lat": 35.6604, "lng": 139.7065, "intensity": 0.56, "restaurants": ["I定食", "Jタコス"]},
        {"lat": 35.6539, "lng": 139.7051, "intensity": 0.40, "restaurants": ["K丼", "Lうどん"]},
    ]
    return ok(points)


# ============ 2) AIルート提案 ============

def daily_route(request):
    data = {
        "recommended_area": "渋谷エリア",
        "predicted_income": 18500,
        "timeline": [
            {"time": "12:00-12:30", "action": "渋谷ストリーム周辺で待機"},
            {"time": "12:30-13:00", "action": "道玄坂のファストフード店集中エリアを巡回"},
            {"time": "13:00-13:30", "action": "ピーク終了。神泉駅方面へ移動しつつ案件を待つ"},
            {"time": "13:30-14:00", "action": "南平台〜代官山の回遊。大通りは避けて裏路地重視"},
        ],
    }
    return ok(data)


# ============ 3) 実績サマリー ============

def daily_summary(request):
    data = {
        "total_revenue": 12540,
        "orders": 9,
        "avg_hourly_wage": 1650,
        "worked_minutes": 270,
        "goal_amount": 18000,
        "progress_to_goal": 12540 / 18000,
        "current_hourly_wage": 1780,
        "streak_minutes": 95,
        "badges_unlocked": ["ランチピークハンター", "回遊職人"],
    }
    return ok(data)


# ============ 4) 週間予測 ============

def weekly_forecast(request):
    days = [
        {"day": "Mon", "weather": "晴れ", "demand": "med", "note": "夕方に少し上がる"},
        {"day": "Tue", "weather": "曇り", "demand": "low", "note": "夜は雨待ちの可能性"},
        {"day": "Wed", "weather": "小雨", "demand": "high", "note": "雨バフで案件増"},
        {"day": "Thu", "weather": "晴れ", "demand": "med", "note": "ランチ集中"},
        {"day": "Fri", "weather": "晴れ", "demand": "med", "note": "夜の伸びに期待"},
        {"day": "Sat", "weather": "雨", "demand": "high", "note": "防水装備で攻め"},
        {"day": "Sun", "weather": "曇り", "demand": "med", "note": "昼〜夕が狙い目"},
    ]
    return ok(days)


# ============ 5) 画像アップロード（OCR器の“形”） ============

@csrf_exempt
def upload_screenshot(request):
    if request.method != "POST":
        return ok({"ok": False, "error": "POST で送ってください。"}, status=405)

    f = request.FILES.get("file")
    if not f:
        return ok({"ok": False, "error": "file が見つかりません。"}, status=400)

    try:
        img = Image.open(BytesIO(f.read()))
        try:
            text = pytesseract.image_to_string(img, lang="jpn+eng")
        except Exception:
            text = ""
        record = {
            "amount": _extract_amount(text) or "不明",
            "time": _extract_time(text) or "不明",
            "restaurant": _extract_name(text) or "不明",
            "area": _extract_area(text) or "不明",
            "distance_km": _extract_distance(text) or "不明",
            "boost": _extract_boost(text) or "不明",
        }
        return ok({"ok": True, "record": record})
    except Exception as e:
        return ok({"ok": False, "error": f"読み取りに失敗: {e}"} , status=400)


# ---- 超簡易パターン抽出 ----
def _extract_amount(text: str):
    import re
    m = re.search(r"(\d{3,5})\s*円", text)
    return m.group(1) if m else None

def _extract_time(text: str):
    import re
    m = re.search(r"(\d{1,2}:\d{2})", text)
    return m.group(1) if m else None

def _extract_name(text: str):
    for line in text.splitlines():
        line = line.strip()
        if 2 <= len(line) <= 12 and any(ch.isalpha() or "\u3040" <= ch <= "\u30FF" for ch in line):
            return line
    return None

def _extract_area(text: str):
    for key in ["渋谷", "新宿", "恵比寿", "代官山", "中目黒", "六本木"]:
        if key in text:
            return key + "周辺"
    return None

def _extract_distance(text: str):
    import re
    m = re.search(r"(\d+(?:\.\d+)?)\s*km", text, flags=re.I)
    return m.group(1) if m else None

def _extract_boost(text: str):
    import re
    m = re.search(r"(\d+(?:\.\d+)?)\s*倍", text)
    return m.group(1) if m else None
