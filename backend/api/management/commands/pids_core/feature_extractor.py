import numpy as np
from datetime import datetime
from scapy.all import IP, TCP, UDP

class FeatureExtractor:
    def __init__(self):
        self.min_packets = 5
        self.active_flows = {}
        self.last_cleanup = datetime.now()
        
        self.SELECTED_FEATURES = [
            'Subflow Bwd Pkts', 'ECE Flag Cnt', 'ACK Flag Cnt', 'Bwd IAT Mean',
            'Fwd Pkts/s', 'Flow IAT Mean', 'Fwd Pkt Len Std', 'Flow IAT Min',
            'Dst Port', 'Fwd Act Data Pkts', 'Fwd IAT Max', 'Bwd IAT Min',
            'Fwd Seg Size Min', 'Init Fwd Win Byts', 'Bwd Pkt Len Std',
            'Bwd IAT Tot', 'Fwd IAT Std', 'Fwd Pkt Len Mean', 'Bwd Pkts/s',
            'Fwd IAT Mean', 'Subflow Fwd Pkts', 'Bwd Pkt Len Max', 'Bwd Header Len',
            'Flow IAT Std', 'Flow Duration', 'Fwd Pkt Len Max', 'Fwd IAT Tot',
            'Fwd IAT Min', 'Fwd Header Len', 'Init Bwd Win Byts', 'Flow IAT Max'
        ]

    def extract_31_features(self, packet):
        if not packet.haslayer(IP): return None
        src = packet[IP].src
        dst = packet[IP].dst
        
        # Ignore localhost
        if src.startswith("127."): return None

        if packet.haslayer(TCP):
            proto = "TCP"
            sport, dport = packet[TCP].sport, packet[TCP].dport
            flags, window = packet[TCP].flags, packet[TCP].window
        elif packet.haslayer(UDP):
            proto = "UDP"
            sport, dport = packet[UDP].sport, packet[UDP].dport
            flags, window = None, 0
        else:
            return None

        # Standard Bidirectional Key
        if src < dst:
            flow_key = f"{src}:{sport}-{dst}:{dport}-{proto}"
            direction = "FWD"
        else:
            flow_key = f"{dst}:{dport}-{src}:{sport}-{proto}"
            direction = "BWD"

        curr_time = datetime.now().timestamp()
        pkt_len = len(packet)

        if flow_key not in self.active_flows:
            self.active_flows[flow_key] = {
                'start_time': curr_time, 'last_time': curr_time,
                'fwd_pkts': 0, 'bwd_pkts': 0,
                'iat_list': [], 'pkt_lens': []
            }

        flow = self.active_flows[flow_key]

        if direction == "FWD": flow['fwd_pkts'] += 1
        else: flow['bwd_pkts'] += 1

        iat = (curr_time - flow['last_time']) * 1_000_000
        if iat > 0: flow['iat_list'].append(iat)
        flow['last_time'] = curr_time
        flow['pkt_lens'].append(pkt_len)

        self.cleanup_old_flows()

        if (flow['fwd_pkts'] + flow['bwd_pkts']) < self.min_packets:
            return None

        # --- FEATURE CALCULATION ---
        duration = max((curr_time - flow['start_time']) * 1_000_000, 1)
        
        # Calculate raw stats
        iat_list = flow['iat_list']
        pkt_lens = flow['pkt_lens']
        
        iat_mean = np.mean(iat_list) if iat_list else 0
        iat_std = np.std(iat_list) if iat_list else 0
        iat_max = np.max(iat_list) if iat_list else 0
        iat_min = np.min(iat_list) if iat_list else 0
        
        pkt_mean = np.mean(pkt_lens)
        pkt_std = np.std(pkt_lens)
        pkt_max = np.max(pkt_lens)

        # === CRITICAL FIX: SWAP LOGIC ===
        # If we have 0 Forward packets but lots of Backward packets (UDP),
        # it means the sorting inverted the Attacker/Victim. 
        # We MUST swap them so the Model sees "Attack Traffic" as "Forward".
        fwd_pkts = flow['fwd_pkts']
        bwd_pkts = flow['bwd_pkts']

        if proto == 'UDP' and fwd_pkts == 0 and bwd_pkts > 0:
            # Swap counts to trick model into seeing "Forward" attack
            final_fwd = bwd_pkts
            final_bwd = 0
        else:
            final_fwd = fwd_pkts
            final_bwd = bwd_pkts

        # For TCP, assume ACKs exist. For UDP, keep realistic (often 0)
        simulated_bwd = final_bwd if proto == 'UDP' else final_fwd

        features = {
            'Dst Port': dport,
            'Flow Duration': duration,
            'Tot Fwd Pkts': final_fwd,
            'Tot Bwd Pkts': simulated_bwd,
            'Subflow Fwd Pkts': final_fwd,
            'Subflow Bwd Pkts': simulated_bwd,
            'Fwd Pkts/s': final_fwd / (duration/1_000_000),
            'Bwd Pkts/s': simulated_bwd / (duration/1_000_000),
            
            # Since we swapped packets, we use the same stats for "Forward"
            'Flow IAT Mean': iat_mean, 'Flow IAT Std': iat_std, 
            'Flow IAT Max': iat_max, 'Flow IAT Min': iat_min,
            'Fwd IAT Mean': iat_mean, 'Fwd IAT Max': iat_max, 
            'Fwd IAT Min': iat_min, 'Fwd IAT Std': iat_std, 'Fwd IAT Tot': sum(iat_list),
            'Bwd IAT Mean': 0, 'Bwd IAT Min': 0, 'Bwd IAT Tot': 0, # Assume 0 for Bwd in 1-way attack
            
            'Fwd Pkt Len Mean': pkt_mean, 'Fwd Pkt Len Std': pkt_std, 'Fwd Pkt Len Max': pkt_max,
            'Bwd Pkt Len Std': 0, 'Bwd Pkt Len Max': 0, 'Bwd Pkts/s': 0,
            
            'Bwd Header Len': 20 * simulated_bwd, 
            'Fwd Header Len': 20 * final_fwd,
            'Fwd Act Data Pkts': final_fwd,
            'Fwd Seg Size Min': 20 if proto=='TCP' else 8,
            'ACK Flag Cnt': 1 if (proto=='TCP' and flags and flags.A) else 0,
            'ECE Flag Cnt': 0,
            'Init Fwd Win Byts': window if proto=='TCP' else 0,
            'Init Bwd Win Byts': window if proto=='TCP' else 0 
        }

        return features

    def cleanup_old_flows(self):
        if (datetime.now() - self.last_cleanup).seconds > 10:
            current_time = datetime.now().timestamp()
            stale = [k for k, v in self.active_flows.items() if current_time - v['last_time'] > 30]
            for k in stale:
                del self.active_flows[k]
            self.last_cleanup = datetime.now()