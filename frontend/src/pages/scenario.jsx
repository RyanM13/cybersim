import { useState, useEffect, useRef } from "react";
import { sendCommand, startScenario } from "@/services/scenarioService";
import { Terminal as LogTerminal } from "../components/ai/terminal.jsx";
import { Terminal } from "../components/ui/terminal.jsx";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { attackRegistry } from "../attacks/index.js";

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

  const [attackerIp, setAttackerIp] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [attackState, setAttackState] = useState(true);
  const [dialog, setDialog] = useState(false);
  const location = useLocation();
  const selectedAttacks = location.state?.attacks || [];

  // chatgpt: How do I change this to accepct different attacks?
  const scenarioCommands = {};

  selectedAttacks.forEach((attack) => {
    const attackDef = attackRegistry[attack.id];

    if (!attackDef) return;

    Object.entries(attackDef.commands).forEach(([cmdName, handler]) => {
      scenarioCommands[cmdName] = {
        name: cmdName,
        description: "Dynamic command",
        handler: async (args, context) => {
          await handler(args, context, ({ attackComplete, feedback }) => {
            if (attackComplete) {
              setAttackState(false);
              setFeedback(feedback);
              setDialog(true);
            }
          });
        },
      };
    });
  });

  useEffect(() => {
    async function init() {
      const results = await Promise.all(
        selectedAttacks.map((attack) => {
          const attackDef = attackRegistry[attack.id];
          if (!attackDef) return null;
          return attackDef.start();
        }),
      );

      const ips = results.filter(Boolean).map((r) => r.attackerIp);

      setAttackerIp(ips);
    }

    init();
  }, [selectedAttacks]);

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

    const results = await Promise.all(
      selectedAttacks.map((attack) => {
        const attackDef = attackRegistry[attack.id];
        if (!attackDef) return null;
        return attackDef.start();
      }),
    );

    const ips = results.filter(Boolean).map((r) => r.attackerIp);

    setAttackerIp(ips);
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
                  <strong>Attacker Subnet(s):</strong> {attackerIp.join(", ")}
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
