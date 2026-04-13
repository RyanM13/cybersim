import { useState, useEffect, useRef } from "react";
import { sendCommand, startScenario } from "@/services/scenarioService";
import { Terminal as LogTerminal } from "../components/ai/terminal.jsx";
import { Terminal } from "../components/ui/terminal.jsx";
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Scenario() {
  const navigate = useNavigate();

  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [memory, setMemory] = useState([]);
  const [attackerIp, setAttackerIp] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [attackState, setAttackState] = useState(true);
  const [dialog, setDialog] = useState(false);

  const scenarioCommands = {
    netstat: {
      name: "netstat",
      description: "Shows active network connections and IPs",
      handler: async (args, context) => {
        const data = await sendCommand("netstat");
        data.output.split("\n").forEach((line) => context.addLine(line));
      },
    },
    ufw: {
      name: "ufw",
      description: "Firewall management",
      handler: async (args, context) => {
        const subcommand = args.join(" ");
        const data = await sendCommand(`ufw ${subcommand}`);

        data.output.split("\n").forEach((line) => context.addLine(line));

        if (data.result === "win") {
          setAttackState(false);
          setFeedback(data.feedback);
          setDialog(true);
        }
      },
    },
  };

  useEffect(() => {
    async function fetchIp() {
      const ip = await startScenario();
      setAttackerIp(ip);
    }
    fetchIp();
  }, []);

  useEffect(() => {
    if (!attackState) return;

    const socket = new WebSocket("ws://localhost:8000/scenario/logs");

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => socket.close();
  }, [attackState]);

  const resetScenario = async () => {
    setMessages([]);
    setAttackState(true);
    setDialog(false);

    const ip = await startScenario();
    setAttackerIp(ip);
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const logOutput = messages.join("\n");

  return (
    <div className="w-full min-h-[calc(90vh-4rem)] flex p-6 gap-4 relative">
      <AlertDialog open={dialog} onOpenChange={setDialog}>
        <AlertDialogContent className="z-[9999]">
          <AlertDialogHeader>
            <AlertDialogTitle>Simulation Complete</AlertDialogTitle>
            <AlertDialogDescription>
              You successfully mitigated the attack.
              <br />
              <br />
              <div className="space-y-2">
                <div>
                  <strong>Attacker Subnet:</strong> {attackerIp}
                </div>
                <div>
                  <strong>Feedback:</strong>
                  <p className="text-sm text-muted-foreground">
                    {feedback || "Awaiting analysis from system..."}
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Viewing Logs</AlertDialogCancel>
            <AlertDialogAction onClick={resetScenario}>
              Restart Simulation
            </AlertDialogAction>
            <AlertDialogAction onClick={goToDashboard}>
              Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Log panel - 30% */}
      <div className="w-[50%] rounded-t-lg overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
        <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400 text-sm mx-auto">auth.log — live</span>
        </div>
        <LogTerminal
          output={logOutput}
          isStreaming={true}
          className="flex-1 bg-gray-900 font-mono text-xs"
        />
      </div>

      {/* Terminal panel - 70% */}
      <div className="w-[50%]">
        <Terminal
          commands={scenarioCommands}
          welcomeMessage={[
            "CyberSim Defense Terminal v1.0",
            'Type "help" to see available commands.',
          ]}
          className="h-[calc(90vh-4rem)]"
        />
      </div>
    </div>
  );
}
