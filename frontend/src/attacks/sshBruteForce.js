export const sshBruteForce = {
  id: 1,
  name: "SSH Brute Force",

  async start() {
    const ip = await startScenario("ssh");
    return { attackerIp: ip };
  },

  commands: {
    ufw: async (args, context, setState) => {
      const subcommand = args.join(" ");
      const data = await sendCommand(`ufw ${subcommand}`);

      data.output.split("\n").forEach((line) => context.addLine(line));

      if (data.result === "win") {
        setState({
          attackComplete: true,
          feedback: data.feedback,
        });
      }
    },
  },

  winCondition(data) {
    return data.result === "win";
  },
};
