import api from "@/lib/axios";

// Claude: How do I write the service for the commands
export async function sendCommand(command) {
  const { data } = await api.post("/commands/command", { command });
  return data.output;
}
