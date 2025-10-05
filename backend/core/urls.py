from django.urls import path
from .views import heatmap_data, daily_route, upload_screenshot

urlpatterns = [
    path('heatmap-data/', heatmap_data, name='heatmap-data'),
    path('daily-route/', daily_route, name='daily-route'),
    path('upload-screenshot/', upload_screenshot, name='upload-screenshot'),
]
