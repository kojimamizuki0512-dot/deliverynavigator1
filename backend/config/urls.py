# backend/config/urls.py
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path
from core import views

urlpatterns = [
    # 健康チェック（Koyeb healthz とは別。人間確認用）
    path("healthz", lambda r: HttpResponse("ok")),

    # ---- ここから API（必ず /api/ で始まるパスで統一）----
    path("api/heatmap-data/", views.heatmap_data, name="heatmap-data"),
    path("api/daily-route/", views.daily_route, name="daily-route"),
    path("api/daily-summary/", views.daily_summary, name="daily-summary"),
    path("api/weekly-forecast/", views.weekly_forecast, name="weekly-forecast"),
    path("api/upload-screenshot/", views.upload_screenshot, name="upload-screenshot"),

    # 管理画面（使わなければ無視）
    path("admin/", admin.site.urls),
]
