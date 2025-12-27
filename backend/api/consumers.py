# api/consumers.py - CORRECT
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import TrafficLog

class PacketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the CORRECT group name
        await self.channel_layer.group_add(
            'packet_updates',  # This must match start_sniffer.py
            self.channel_name
        )
        await self.accept()
        print("✅ WebSocket connected to 'packet_updates' group")
        
        # Send recent traffic history
        try:
            recent_logs = await sync_to_async(list)(
                TrafficLog.objects.order_by('-timestamp')[:50]
            )
            
            for log in recent_logs:
                await self.send(text_data=json.dumps({
                    'type': 'packet',
                    'data': {
                        'id': log.id,
                        'timestamp': log.timestamp.strftime('%Y-%m-%d %H:%M:%S.%f')[:-3],
                        'source_ip': log.src_ip,
                        'destination_ip': log.dst_ip,
                        'protocol': log.protocol,
                        'status': log.status,
                        'prediction': log.prediction,
                        'confidence': log.confidence,
                        'attack_type': log.attack_type or 'Normal',
                        'length': log.length,
                        'involves_local_pc': getattr(log, 'involves_local_pc', False),
                    }
                }))
            print(f"✅ Sent {len(recent_logs)} recent logs to client")
        except Exception as e:
            print(f"⚠ Error sending recent logs: {e}")

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(
            'packet_updates',
            self.channel_name
        )
        print("❌ WebSocket disconnected")

    # This method name MUST match the 'type' in start_sniffer.py
    async def send_packet(self, event):
        """Receive packet data from start_sniffer command"""
        data = event['data']
        
        # Send to WebSocket client
        await self.send(text_data=json.dumps({
            'type': 'packet',
            'data': data
        }))