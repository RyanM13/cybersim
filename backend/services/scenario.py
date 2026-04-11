import random
from datetime import datetime


# Class for scenario, encourages scalability
class Scenario:
    def __init__(self):
        self.attacker_subnet = None
        self.attacker_ips = []
        self.safe_ips = [self.generate_random_ip() for _ in range(10)]

    # Google: How do I genearte a random IP address in python
    # Generates a random ip for the attacker to be assigned
    def generate_attacker_ip(self):
        # Generate a subnet so multiple IPs come from same range
        self.attacker_subnet = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
        self.attacker_ips = [
            f"{self.attacker_subnet}.{i}" for i in random.sample(range(1, 255), 5)
        ]
        return self.attacker_subnet  # return subnet so frontend knows what to block

    # Generates a random ip for fake users
    def generate_random_ip(self):
        return f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"

    # Accepts user input ip and checks to see if it is the attackers ip
    def check_ip(self, ip: str):
        # User should block the subnet e.g. "209.132.191.0/24"
        return self.attacker_subnet in ip

    # Generated fake username and noise using claude
    attack_usernames = [
        "root",
        "admin",
        "ubuntu",
        "deploy",
        "test",
        "pi",
        "oracle",
        "guest",
    ]

    real_usernames = ["jsmith", "mwilson", "tlee", "rgarcia", "bknight"]
    noise_types = ["cron", "sudo", "systemd"]

    # Generates random logs to make it a real world situation
    def generate_logs(self):
        timestamp = datetime.now().strftime("%b %d %H:%M:%S")
        pid = random.randint(10000, 99999)
        port = random.randint(10000, 65535)
        test = random.randint(1, 6)

        # Asked for example attack and noise from claude
        if test == 1:
            # Real user successful login
            user = random.choice(self.real_usernames)
            return f"{timestamp} webserver01 sshd[{pid}]: Accepted password for {user} from {random.choice(self.safe_ips)} port {port} ssh2"

        elif test == 2:
            # Real user failed login
            user = random.choice(self.real_usernames)
            return f"{timestamp} webserver01 sshd[{pid}]: Failed password for {user} from {random.choice(self.safe_ips)} port {port} ssh2"

        elif test == 3:
            # System noise - cron/sudo/systemd
            user = random.choice(self.real_usernames)
            return f"{timestamp} webserver01 CRON[{pid}]: pam_unix(cron:session): session opened for user {user}"

        else:
            # Attacker attempt - comes from rotating IPs in same subnet
            attacker_ip = random.choice(self.attacker_ips)
            username = random.choice(self.attack_usernames)
            return f"{timestamp} webserver01 sshd[{pid}]: Failed password for invalid user {username} from {attacker_ip} port {port} ssh2"
