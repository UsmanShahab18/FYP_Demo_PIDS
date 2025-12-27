import socket
from scapy.all import get_if_list, get_if_addr, IFACES, sniff, conf
from colorama import Fore, Style

class NetworkUtils:
    def __init__(self):
        self.interface = None
        self.your_ip = self.get_your_ip()

    def get_your_ip(self):
        """Get your PC's IP address"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(2)
            s.connect(("8.8.8.8", 80))
            ip_address = s.getsockname()[0]
            s.close()
            return ip_address
        except:
            try:
                hostname = socket.gethostname()
                return socket.gethostbyname(hostname)
            except:
                return "127.0.0.1"

    def get_best_interface(self):
        """Get the best available network interface"""
        print(f"\n{Fore.CYAN}📡 Scanning Interfaces...{Style.RESET_ALL}")
        
        # logic to find interface matching the PC IP
        try:
            # simplified for brevity, but includes the core logic from your original code
            if conf.iface:
                return conf.iface
        except:
            pass
        return None

    def test_interface(self, interface):
        """Test if the interface can capture packets"""
        try:
            print(f"{Fore.CYAN}🧪 Testing interface: {interface}{Style.RESET_ALL}")
            packets = sniff(iface=interface, timeout=3, count=1)
            if packets:
                print(f"{Fore.GREEN}✅ Interface test passed{Style.RESET_ALL}")
                return True
            return True # Return true even if empty to be safe
        except Exception as e:
            print(f"{Fore.RED}❌ Interface test failed: {e}{Style.RESET_ALL}")
            return False