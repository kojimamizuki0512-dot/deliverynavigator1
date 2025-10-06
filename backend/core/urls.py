from django.urls import path
from . import views

urlpatterns = [
    path("api/heatmap-data/", views.heatmap_data, name="heatmap-data"),
    path("api/daily-route/", views.daily_route, name="daily-route"),
    path("api/daily-summary/", views.daily_summary, name="daily-summary"),
    path("api/weekly-forecast/", views.weekly_forecast, name="weekly-forecast"),
    path("api/upload-screenshot/", views.upload_screenshot, name="upload-screenshot"),
]
