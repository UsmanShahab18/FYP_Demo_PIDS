# backend/api/management/commands/start_sniffer.py

from django.core.management.base import BaseCommand
from django.apps import apps
import time
from colorama import init

# Import our new modules
from .pids_core.network_utils import NetworkUtils
from .pids_core.feature_extractor import FeatureExtractor
from .pids_core.ml_engine import MLEngine
from .pids_core.stats_manager import StatsManager
from .pids_core.websocket_manager import WebSocketManager
from .pids_core.traffic_capture import TrafficCapture
from .pids_core.traffic_simulator import TrafficSimulator

init(autoreset=True)

class Command(BaseCommand):
    help = 'Start PIDS Sniffer'

    def handle(self, *args, **kwargs):
        # 1. Initialize Components
        net_utils = NetworkUtils()
        feature_ext = FeatureExtractor()
        ml_engine = MLEngine(feature_ext.SELECTED_FEATURES)
        stats = StatsManager()
        ws_manager = WebSocketManager()
        
        # 2. Load Models & DB
        ml_engine.load_models()
        try:
            TrafficLog = apps.get_model('api', 'TrafficLog')
        except:
            TrafficLog = None

        # 3. User Selection
        print("1. Real Mode")
        print("2. Test Mode")
        choice = input("Select: ").strip()

        if choice == '1':
            # Real Mode
            interface = net_utils.get_best_interface()
            if not interface:
                print("No interface found.")
                return

            capturer = TrafficCapture(
                interface, feature_ext, ml_engine, 
                stats, ws_manager, TrafficLog, net_utils.your_ip
            )
            capturer.start()

        else:
            # Test Mode
            sim = TrafficSimulator(stats, ws_manager, TrafficLog, net_utils.your_ip)
            try:
                while True:
                    sim.generate_packet()
                    time.sleep(1) # Delay between fake packets
            except KeyboardInterrupt:
                pass

        # 4. Finish
        stats.show_final_stats()