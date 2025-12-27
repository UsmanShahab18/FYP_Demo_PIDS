# api/routing.py - CORRECT
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Use re_path for WebSocket URLs
    re_path(r'ws/packets/$', consumers.PacketConsumer.as_asgi()),
    # OR if you want to keep your original pattern:
    # re_path(r'ws/traffic/$', consumers.PacketConsumer.as_asgi()),
]