import datetime
import random

# Class for scenario, encourages scalability
class Scenario:


    def __init__(self):
        self.attacker_ip = None


# Google: How do I genearte a random IP address in python
    # Generates a random ip for the attacker to be assigned
    def generate_attacker_ip(self):
        self.attacker_ip = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
        return self.attacker_ip


    # Generates a random ip for fake users
    def generate_random_ip(self):
        random_ip = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
        return random_ip

    # Accepts user input ip and checks to see if it is the attackers ip
    def check_ip(self, ip: str):
        return ip == self.attacker_ip


    # Generates random logs to make it a real world situation
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
