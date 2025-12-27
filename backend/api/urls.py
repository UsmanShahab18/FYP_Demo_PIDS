from django.urls import path
from . import views

urlpatterns = [
    # Traffic logs
    path('traffic/', views.get_traffic_logs, name='traffic-logs'),
    path('traffic/clear/', views.clear_traffic_logs, name='clear-traffic'),
    
    # Alerts
    path('alerts/', views.get_alerts, name='alerts'),
    path('alerts/create/', views.create_alert, name='create-alert'),
    path('alerts/clear/', views.clear_alerts, name='clear-alerts'),
    
    # Statistics
    path('stats/', views.get_stats, name='stats'),
    path('stats/protocols/', views.get_protocol_stats, name='protocol-stats'),
    path('stats/top-ips/', views.get_top_ips, name='top-ips'),
    
    # Reports
    path('report/', views.download_report, name='download-report'),
]