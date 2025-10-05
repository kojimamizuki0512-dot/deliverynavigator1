from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from io import BytesIO
from PIL import Image
import json
import random

# 1) ヒートマップ用（ダミー：渋谷周辺）
@api_view(["GET"])
def heatmap_data(request):
    data = [
        {"lat": 35.6585, "lng": 139.7013, "intensity": 0.85, "restaurants": ["A飯店", "Bカフェ", "Cバーガー"]},
        {"lat": 35.6610, "lng": 139.7038, "intensity": 0.68, "restaurants": ["Dラーメン", "Eピザ"]},
        {"lat": 35.6555, "lng": 139.6990, "intensity": 0.48, "restaurants": ["Fストア"]},
    ]
    return JsonResponse(data, safe=False)

# 2) 日次ルート（ダミー）
@csrf_exempt
@api_view(["POST", "GET"])
def daily_route(request):
    area = "渋谷エリア"
    if request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8")) if request.body else {}
            area = body.get("area") or area
        except Exception:
            pass

    resp = {
        "recommended_area": area,
        "predicted_income": 18500,
        "timeline": [
            {"time": "12:00-12:30", "action": "渋谷ストリーム周辺で待機"},
            {"time": "12:30-13:00", "action": "道玄坂のファストフード店集中エリアを巡回"},
            {"time": "13:00-13:30", "action": "ピーク終了。神泉駅方面へ移動しつつ案件を待つ"},
        ],
    }
    return JsonResponse(resp)

# 3) 画像アップ（疑似OCR）
@csrf_exempt
@api_view(["POST"])
def upload_screenshot(request):
    f = request.FILES.get("file")
    if not f:
        return JsonResponse({"ok": False, "error": "ファイルが見つかりません"}, status=400)

    try:
        img = Image.open(BytesIO(f.read()))
        w, h = img.size
    except Exception:
        return JsonResponse({"ok": False, "error": "画像として開けませんでした"}, status=400)

    # ダミー抽出（ランダム値をまぜる）
    yen = random.choice([1250, 1380, 1420, 1560, 1620, 1710])
    resp = {
        "ok": True,
        "preview": {"width": w, "height": h},
        "extracted": {
            "配達報酬": f"¥{yen}",
            "配達完了時刻": "12:34",
            "レストラン名": "サンプルキッチン",
            "配達先エリア": "渋谷区円山町",
            "配達距離": "2.1km",
            "ブースト料金": "¥120",
        },
        "note": "ここはダミーです。実OCRは後で差し替えます。",
    }
    return JsonResponse(resp)
