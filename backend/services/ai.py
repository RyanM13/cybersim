import httpx


class AIAnalyzer:
    def __init__(self):
        self.model = "gemma3:1b"
        self.ollama_url = "http://localhost:11434/api/generate"

    def analyze(self, defenses_applied: list, attack_stopped: bool) -> str:
        command_labels = {
            "ufw_limit_ssh": "ufw limit ssh",
            "ufw_deny_": "ufw deny from <subnet>/24",
            "ufw_deny_wrong_ip": "ufw deny from wrong ip (incorrect subnet)",
        }
        readable_commands = [command_labels.get(d, d) for d in defenses_applied]

        prompt = f"""
        You are reviewing a cybersecurity exercise. Address the user as "you".

        Commands the user ran: {readable_commands}
        Commands the user skipped: {[c for c in ["netstat", "ufw limit ssh", "ufw deny from <subnet>/24"] if c not in readable_commands]}
        Attack stopped: {attack_stopped}

        Write exactly 3 sentences:
        Sentence 1: Praise only the commands the user actually ran from {readable_commands}.
        Sentence 2: If commands were skipped, explain why they matter. If nothing was skipped say "You followed the ideal order."
        Sentence 3: Always say exactly this: "The ideal order is netstat to investigate, ufw limit ssh to slow the attack, then ufw deny from subnet to block."

        No markdown. No backticks. Address user as you. Max 20 words per sentence.
        """

        try:
            response = httpx.post(
                self.ollama_url,
                json={"model": self.model, "prompt": prompt, "stream": False},
                timeout=30.0,
            )
            return response.json()["response"]
        except Exception as e:
            return f"AI analysis unavailable: {str(e)}"
            pass


# Okay, here's some feedback focusing solely on the SSH brute force attack response: 1. **What the user did well:** The student correctly identified and implemented `ufw_deny_` which is a crucial first step in mitigating a brute force attack on SSH connections. 2. **What they could improve:** While blocking the connection is effective, a more robust strategy would involve monitoring the connection attempts and logging them for later analysis. Furthermore, implementing rate limiting or using SSH keys for authentication would significantly increase security. 3. **What the best practice approach would have been:** A layered approach is recommended, including continuous monitoring of SSH activity, using SSH key-based authentication instead of passwords, and implementing intrusion detection systems to identify and respond to suspicious behavior proactively.
