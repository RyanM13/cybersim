export const ddosAttack = {
  id: 2,
  name: "DDoS Attack",

  async start() {
    const ip = await startScenario("ddos");
    return { attackerIp: ip };
  },

  commands: {
    netstat: async (args, context) => {
      const data = await sendCommand("netstat");
      data.output.split("\n").forEach((line) => context.addLine(line));
    },
  },

  winCondition(data) {
    return data.result === "mitigated";
  },
};
