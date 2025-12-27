from rest_framework import serializers
from .models import TrafficLog, SystemAlert

class TrafficLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficLog
        fields = '__all__'
    
    def to_representation(self, instance):
        """Custom representation for frontend"""
        data = super().to_representation(instance)
        # Format timestamp for frontend
        if 'timestamp' in data:
            data['timestamp'] = instance.timestamp.strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
        return data

class SystemAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemAlert
        fields = '__all__'

class StatsSerializer(serializers.Serializer):
    total_traffic = serializers.IntegerField()
    attacks = serializers.IntegerField()
    suspicious = serializers.IntegerField()
    normal = serializers.IntegerField()
    attack_percentage = serializers.FloatField()