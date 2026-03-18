import api from "@/lib/axios";

// Claude: How do I write the service for the commands
export async function sendCommand(command) {
  const { data } = await api.post("/commands/command", { command });
  return data.output;
}

export async function startScenario() {
  const { data } = await api.get("/scenario/start");
  return data.attacker_ip;
}

export async function defendScenario(ip) {
  const { data } = await api.post("scenario/defend", { ip });
  return data.result;
}

export async function getLogs() {
  const { data } = await api.get("/log");
  return data.logs;
}
