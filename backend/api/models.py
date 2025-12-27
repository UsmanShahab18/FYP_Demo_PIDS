from django.db import models

class TrafficLog(models.Model):
    STATUS_CHOICES = [
        ("Normal", "Normal"),
        ("Suspicious", "Suspicious"),
        ("Attack", "Attack"),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True)
    src_ip = models.CharField(max_length=45)
    dst_ip = models.CharField(max_length=45)
    
    # === NEW FIELDS FOR PORTS ===
    src_port = models.IntegerField(default=0)
    dst_port = models.IntegerField(default=0)
    # ============================

    protocol = models.CharField(max_length=10)
    length = models.IntegerField()
    prediction = models.CharField(max_length=100)
    confidence = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    attack_type = models.CharField(max_length=100, null=True, blank=True)
    involves_local_pc = models.BooleanField(default=False)
    
    class Meta:
        ordering = ["-timestamp"]
    
    def __str__(self):
        return f"{self.timestamp} - {self.src_ip}:{self.src_port} -> {self.dst_ip}:{self.dst_port} ({self.status})"


class SystemAlert(models.Model):
    SEVERITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Critical", "Critical"),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True)
    alert_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    message = models.TextField()
    source_ip = models.CharField(max_length=45, null=True, blank=True)
    resolved = models.BooleanField(default=False)
    
    class Meta:
        ordering = ["-timestamp"]
    
    def __str__(self):
        return f"{self.timestamp} - {self.alert_type} ({self.severity})"