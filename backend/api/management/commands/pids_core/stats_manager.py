from datetime import datetime
from colorama import Fore, Style

class StatsManager:
    def __init__(self):
        self.stats = {
            'total': 0, 'normal': 0, 
            'attack': 0, 'suspicious': 0,
            'start_time': datetime.now()
        }

    def update(self, status):
        self.stats['total'] += 1
        if status == 'Attack':
            self.stats['attack'] += 1
        elif status == 'Suspicious':
            self.stats['suspicious'] += 1
        else:
            self.stats['normal'] += 1

    def show_final_stats(self):
        duration = datetime.now() - self.stats['start_time']
        print(f"\n{Fore.CYAN}{'='*40}{Style.RESET_ALL}")
        print(f"📊 Total Packets: {self.stats['total']}")
        print(f"🟢 Normal: {self.stats['normal']}")
        print(f"🔴 Attacks: {self.stats['attack']}")
        print(f"⏱ Duration: {duration}")
        print(f"{Fore.CYAN}{'='*40}{Style.RESET_ALL}\n")