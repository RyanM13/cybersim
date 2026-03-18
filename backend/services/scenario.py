import datetime
import random

class Scenario:

    def __init__(self):
        self.attacker_ip = None


# Google: How do I genearte a random IP address in python
    def generate_attacker_ip(self):
        self.attacker_ip = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
        return self.attacker_ip


    def generate_random_ip(self):
        random_ip = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
        return random_ip


    def check_ip(self, ip: str):
        return ip == self.attacker_ip


    def generate_logs(self):
        logs = []
        for attempts in range(10):
            test = random.randint(1, 4)
            if test == 1:
                logs.append(f"{datetime} Accepted login from {self.generate_random_ip()}")
            elif test == 2:
                logs.append(f"{datetime} Failed login from {self.generate_random_ip()}")
            else:
                logs.append(f"{datetime} Failed login from {self.attacker_ip}")
        return logs
