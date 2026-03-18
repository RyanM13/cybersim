import api from "@/lib/axios";

// Claude: How do I write the service for the commands
// Accepts user command, calls backend to receive correct output
export async function sendCommand(command) {
  const { data } = await api.post("/commands/command", { command });
  return data.output;
}

// Calls backend to start scenario
export async function startScenario() {
  const { data } = await api.get("/scenario/start");
  return data.attacker_ip;
}

// Accepts ip, calls backend recieves confirmation
export async function defendScenario(ip) {
  const { data } = await api.post("scenario/defend", { ip });
  return data.result;
}

// Calls backend to receive logs
export async function getLogs() {
  const { data } = await api.get("/log");
  return data.logs;
}
