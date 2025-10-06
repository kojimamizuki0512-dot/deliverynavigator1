from django.urls import path
from . import views

urlpatterns = [
    path("heatmap-data/", views.heatmap_data),
    path("daily-route/", views.daily_route),
    path("daily-summary/", views.daily_summary),
    path("weekly-forecast/", views.weekly_forecast),
    path("upload-screenshot/", views.upload_screenshot),
]
