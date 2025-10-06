from io import BytesIO
from PIL import Image

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


# ------ ダミーAPI（公開エンドポイント / 認証不要） ------

@api_view(["GET"])
@permission_classes([AllowAny])  # ← 403対策：誰でもGETできる
def heatmap_data(request):
    data = [
        {"lat": 35.6585, "lng": 139.7013, "intensity": 0.85,
         "restaurants": ["A飯店", "Bカフェ", "Cバーガー"]},
        {"lat": 35.6610, "lng": 139.7038, "intensity": 0.68,
         "restaurants": ["Dラーメン", "Eピザ"]},
        {"lat": 35.6555, "lng": 139.6990, "intensity": 0.48,
         "restaurants": ["Fストア"]},
        {"lat": 35.6592, "lng": 139.7001, "intensity": 0.75,
         "restaurants": ["G丼", "Hカレー"]},
        {"lat": 35.6570, "lng": 139.7055, "intensity": 0.62,
         "restaurants": ["I寿司", "Jそば"]},
        {"lat": 35.6542, "lng": 139.7030, "intensity": 0.55,
         "restaurants": ["K中華"]},
    ]
    return JsonResponse(data, safe=False)


@api_view(["GET"])
@permission_classes([AllowAny])  # ← 403対策：誰でもGETできる
@csrf_exempt  # 念のため（POST化した時でも弾かれないように）
def daily_route(request):
    # ?area=渋谷エリア などを受け取ってもOK（未使用なら既定値）
    area = request.GET.get("area", "渋谷エリア")
    payload = {
        "recommended_area": area,
        "predicted_income": 18500,
        "timeline": [
            {"time": "12:00-12:30", "action": "渋谷ストリーム周辺で待機"},
            {"time": "12:30-13:00", "action": "道玄坂のファストフード店集中エリアを巡回"},
            {"time": "13:00-13:30", "action": "ピーク終了。神泉駅方面へ移動しつつ案件を待つ"},
            {"time": "13:30-14:00", "action": "南平台〜代官山の回遊。大通りは避けて裏路地重視"},
        ],
    }
    return JsonResponse(payload, safe=False)


@api_view(["GET"])
@permission_classes([AllowAny])
def daily_summary(request):
    summary = {
        "total_sales": 12540,
        "orders": 18,
        "avg_wage": 1650,
        "worked_minutes": 95,
        "badges": ["ランチ帯マスター", "雨の日の勇者"],
    }
    return JsonResponse(summary, safe=False)


@api_view(["GET"])
@permission_classes([AllowAny])
def weekly_forecast(request):
    # 表示用のダミー
    days = [
        {"day": "Mon", "weather": "cloudy", "level": 2},
        {"day": "Tue", "weather": "sunny", "level": 3},
        {"day": "Wed", "weather": "rain", "level": 4},
        {"day": "Thu", "weather": "sunny", "level": 3},
        {"day": "Fri", "weather": "cloudy", "level": 2},
        {"day": "Sat", "weather": "sunny", "level": 4},
        {"day": "Sun", "weather": "rain", "level": 5},
    ]
    return JsonResponse(days, safe=False)


# ------ 参考：スクショアップロード（今はダミー動作） ------

@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def upload_screenshot(request):
    """
    file: multipart/form-data のフィールド名 'file'
    """
    f = request.FILES.get("file")
    if not f:
        return JsonResponse({"ok": False, "error": "ファイルがありません"}, status=400)

    # ここでは読み込みテストのみ（実際のOCRは後で差し替え）
    try:
        img = Image.open(BytesIO(f.read()))
        w, h = img.size
        return JsonResponse({
            "ok": True,
            "meta": {"width": w, "height": h},
            "parsed": {"amount": "不明", "time": "不明", "shop": "不明"},
        })
    except Exception as e:
        return JsonResponse({"ok": False, "error": str(e)}, status=400)
