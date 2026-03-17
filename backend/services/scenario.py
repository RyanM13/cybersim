import datetime
import random

attacker_ip = None


# Google: How do I genearte a random IP address in python
def generate_attacker_ip():
    global attacker_ip
    attacker_ip = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
    return attacker_ip


def generate_random_ip():
    random_ip = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
    return random_ip


def check_ip(ip: str):
    return ip == attacker_ip


def generate_logs():
    logs = []
    for attempts in range(10):
        test = random.randint(1, 4)
        if test == 1:
            logs.append(f"{datetime} Accepted login from {generate_random_ip()}")
        elif test == 2:
            logs.append(f"{datetime} Failed login from {generate_random_ip()}")
        else:
            logs.append(f"{datetime} Failed login from {attacker_ip}")
    return logs
