from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import viewsets, status
from django.http import HttpResponse, JsonResponse
from django.db.models import Count, Q, F
from datetime import datetime, timedelta
import csv
import json

from .models import TrafficLog, SystemAlert
from .serializers import TrafficLogSerializer, SystemAlertSerializer, StatsSerializer

@api_view(['GET'])
def get_traffic_logs(request):
    """Get recent traffic logs with optional filtering"""
    limit = int(request.GET.get('limit', 100))
    status_filter = request.GET.get('status', None)
    
    queryset = TrafficLog.objects.all().order_by('-timestamp')
    
    if status_filter:
        queryset = queryset.filter(status=status_filter)
    
    logs = queryset[:limit]
    serializer = TrafficLogSerializer(logs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_alerts(request):
    """Get unresolved system alerts"""
    alerts = SystemAlert.objects.filter(resolved=False).order_by('-timestamp')
    serializer = SystemAlertSerializer(alerts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_stats(request):
    """Get dashboard statistics"""
    total = TrafficLog.objects.count()
    attacks = TrafficLog.objects.filter(status='Attack').count()
    suspicious = TrafficLog.objects.filter(status='Suspicious').count()
    normal = TrafficLog.objects.filter(status='Normal').count()
    
    attack_percentage = (attacks / total * 100) if total > 0 else 0
    
    # Get hourly stats for last 24 hours
    hourly_stats = get_hourly_stats()
    
    return Response({
        'total_traffic': total,
        'attacks': attacks,
        'suspicious': suspicious,
        'normal': normal,
        'attack_percentage': attack_percentage,
        'hourly_stats': hourly_stats
    })

@api_view(['GET'])
def get_protocol_stats(request):
    """Get protocol distribution"""
    protocol_stats = TrafficLog.objects.values('protocol').annotate(
        count=Count('id'),
        attacks=Count('id', filter=Q(status='Attack')),
        normal=Count('id', filter=Q(status='Normal'))
    ).order_by('-count')
    
    return Response(list(protocol_stats))

@api_view(['GET'])
def get_top_ips(request):
    """Get top source IPs by activity"""
    top_src_ips = TrafficLog.objects.values('src_ip').annotate(
        count=Count('id'),
        attacks=Count('id', filter=Q(status='Attack'))
    ).order_by('-count')[:10]
    
    top_dst_ips = TrafficLog.objects.values('dst_ip').annotate(
        count=Count('id'),
        attacks=Count('id', filter=Q(status='Attack'))
    ).order_by('-count')[:10]
    
    return Response({
        'source_ips': list(top_src_ips),
        'destination_ips': list(top_dst_ips)
    })

@api_view(['GET'])
def download_report(request):
    """Download CSV report"""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="pids_report.csv"'
    
    writer = csv.writer(response)
    writer.writerow([
        'Timestamp', 'Source IP', 'Destination IP', 'Protocol',
        'Status', 'Prediction', 'Confidence', 'Attack Type', 'Length',
        'Dst Port', 'Flow Duration', 'Packet Count'
    ])
    
    logs = TrafficLog.objects.all().order_by('-timestamp')[:1000]
    for log in logs:
        writer.writerow([
            log.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            log.src_ip,
            log.dst_ip,
            log.protocol,
            log.status,
            log.prediction,
            f"{log.confidence:.2%}",
            log.attack_type or 'N/A',
            log.length,
            log.dst_port,
            log.flow_duration,
            log.subflow_fwd_pkts + log.subflow_bwd_pkts
        ])
    
    return response

@api_view(['POST'])
def clear_alerts(request):
    """Mark all alerts as resolved"""
    SystemAlert.objects.filter(resolved=False).update(resolved=True)
    return Response({'status': 'success', 'message': 'All alerts cleared'})

@api_view(['POST'])
def create_alert(request):
    """Create a new system alert"""
    try:
        data = request.data
        alert = SystemAlert.objects.create(
            severity=data.get('severity', 'MEDIUM'),
            message=data.get('message', ''),
            resolved=False
        )
        serializer = SystemAlertSerializer(alert)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def clear_traffic_logs(request):
    """Clear all traffic logs (for testing)"""
    if request.method == 'DELETE':
        count = TrafficLog.objects.all().delete()[0]
        return Response({'status': 'success', 'deleted_count': count})
    return Response({'error': 'Method not allowed'}, status=405)

def get_hourly_stats():
    """Get hourly statistics for last 24 hours"""
    hourly_stats = []
    now = datetime.now()
    
    for i in range(24):
        hour_start = now - timedelta(hours=i+1)
        hour_end = now - timedelta(hours=i)
        
        stats = TrafficLog.objects.filter(
            timestamp__gte=hour_start,
            timestamp__lt=hour_end
        ).aggregate(
            total=Count('id'),
            attacks=Count('id', filter=Q(status='Attack')),
            suspicious=Count('id', filter=Q(status='Suspicious'))
        )
        
        hourly_stats.append({
            'hour': hour_start.strftime('%H:00'),
            'total': stats['total'] or 0,
            'attacks': stats['attacks'] or 0,
            'suspicious': stats['suspicious'] or 0
        })
    
    return list(reversed(hourly_stats))