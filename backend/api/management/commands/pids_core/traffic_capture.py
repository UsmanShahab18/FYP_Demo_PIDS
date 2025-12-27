from scapy.all import sniff, IP, TCP, UDP
from colorama import Fore, Style
import traceback

class TrafficCapture:
    def __init__(self, interface, feature_extractor, ml_engine, stats, ws, db_model, pc_ip):
        self.interface = interface
        self.extractor = feature_extractor
        self.ml = ml_engine
        self.stats = stats
        self.ws = ws
        self.db = db_model
        self.pc_ip = pc_ip

    def process_packet(self, packet):
        try:
            # 1. Extract Features
            features = self.extractor.extract_31_features(packet)
            if not features: 
                return

            # 2. Get Port Info for Display & DB
            proto = "OTHER"
            sport = 0
            dport = 0
            
            if packet.haslayer(TCP):
                proto = "TCP"
                sport = packet[TCP].sport
                dport = packet[TCP].dport
            elif packet.haslayer(UDP):
                proto = "UDP"
                sport = packet[UDP].sport
                dport = packet[UDP].dport

            # 3. Predict
            pred, conf, status = self.ml.predict(features)
            
            # 4. Update Stats
            self.stats.update(status)

            # 5. Display (With Port Info)
            src = packet[IP].src
            dst = packet[IP].dst
            
            # Check if local PC involved
            arrow = "->"
            if src == self.pc_ip: arrow = "OUT ->"
            elif dst == self.pc_ip: arrow = "IN <-"

            color = Fore.GREEN
            if status == 'Attack': color = Fore.RED
            elif status == 'Suspicious': color = Fore.YELLOW

            # Print to console
            print(f"{color}🔍 {src}:{sport} {arrow} {dst}:{dport} | {proto} | {pred} ({conf:.2%}){Style.RESET_ALL}")

            # 6. DB & WebSocket
            if self.db:
                try:
                    log = self.db.objects.create(
                        src_ip=src, 
                        dst_ip=dst, 
                        # === SAVE PORTS ===
                        src_port=int(sport),
                        dst_port=int(dport),
                        # ==================
                        protocol=proto,
                        length=len(packet), 
                        prediction=pred, 
                        confidence=float(conf), 
                        status=status,
                        involves_local_pc=(src == self.pc_ip or dst == self.pc_ip)
                    )
                    self.ws.send_update(log)
                except Exception:
                    pass # DB write failed, usually locked or busy
                    
        except Exception as e:
            # This helps debug "Unknown" errors
            print(f"{Fore.RED}Processing Error: {e}{Style.RESET_ALL}")

    def start(self):
        print(f"{Fore.CYAN}🚀 Sniffing on {self.interface}...{Style.RESET_ALL}")
        try:
            # Handle socket error on Windows gracefully
            sniff(iface=self.interface, prn=self.process_packet, store=0)
        except OSError:
            pass # Ignore the WinError 10038 on stop
        except KeyboardInterrupt:
            pass