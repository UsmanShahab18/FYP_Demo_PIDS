import random
import time
from colorama import Fore, Style

class TrafficSimulator:
    def __init__(self, stats_manager, ws_manager, db_model, pc_ip):
        self.stats = stats_manager
        self.ws = ws_manager
        self.db_model = db_model
        self.pc_ip = pc_ip
        
        self.attack_types = [
            'Bot', 'DDOS attack-HOIC', 'DDoS attacks-LOIC-HTTP', 
            'DoS attacks-SlowHTTPTest', 'DoS attacks-Hulk', 
            'DoS attacks-GoldenEye', 'FTP-BruteForce', 'SSH-Bruteforce', 
            'SQL Injection'
        ]
        
        self.external_ips = [
            '8.8.8.8', '1.1.1.1', '142.250.185.78', '104.16.249.249'
        ]
        self.malicious_ips = [
            '45.155.205.233', '185.220.100.242', '5.188.86.172'
        ]

    def generate_packet(self):
        """Generate varied realistic test traffic"""
        rand = random.random()
        
        # 1. Determine Type
        if rand < 0.20: # 20% Attack
            status = 'Attack'
            src_ip = random.choice(self.malicious_ips)
            dst_ip = self.pc_ip
            pred = random.choice(self.attack_types)
            conf = random.uniform(0.85, 0.99)
            proto = "TCP"
            port = random.choice([80, 443, 22, 21])
        elif rand < 0.30: # 10% Suspicious
            status = 'Suspicious'
            src_ip = random.choice(self.external_ips)
            dst_ip = self.pc_ip
            pred = 'Normal'
            conf = random.uniform(0.60, 0.80)
            proto = "UDP"
            port = random.randint(1024, 9999)
        else: # 70% Normal
            status = 'Normal'
            src_ip = self.pc_ip
            dst_ip = random.choice(self.external_ips)
            pred = 'Normal'
            conf = random.uniform(0.90, 0.99)
            proto = "TCP"
            port = 443
            
        # 2. Update Stats
        self.stats.update(status)
        
        # 3. Display
        color = Fore.GREEN
        if status == 'Attack': color = Fore.RED
        elif status == 'Suspicious': color = Fore.YELLOW
        
        print(f"{color}🎲 [TEST] {src_ip} -> {dst_ip}:{port} | {proto} | {pred} ({conf:.2%}){Style.RESET_ALL}")
        
        # 4. Save to DB & WS
        if self.db_model:
            try:
                log = self.db_model.objects.create(
                    src_ip=src_ip, dst_ip=dst_ip, protocol=proto,
                    length=random.randint(60, 1500), prediction=pred, 
                    confidence=float(conf), status=status, involves_local_pc=True
                )
                self.ws.send_update(log)
            except:
                pass