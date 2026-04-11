import { useState, useEffect, useRef } from "react";
import { sendCommand, startScenario } from "@/services/scenarioService";
import { Terminal as LogTerminal } from "../components/ai/terminal.jsx";
import { Terminal } from "../components/ui/terminal.jsx";

export default function Scenario() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [memory, setMemory] = useState([]);
  const [attackerIp, setAttackerIp] = useState([]);
  const [messages, setMessages] = useState([]);

  // Handles enter key pressed for terminal use
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      console.log(command);
      handleCommand(command);
      // Sets command back to empty for next input
      setCommand("");
    }
  }

  useEffect(() => {
    async function init() {
      const ip = await startScenario();
      setAttackerIp(ip);
    }
    init();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/scenario/logs");

    socket.onmessage = (event) => {
      const data = event.data;
      setMessages((prev) => [...prev, data]);
    };
    return () => socket.close();
  }, []);

  async function handleCommand(command) {
    if (command.trim() === "clear") {
      setHistory([]);
      return;
    }

    // Claude: How do I handle the history for the array
    try {
      const output = await sendCommand(command);
      setMemory((prev) => [...prev, command]);
      setHistory((prev) => [
        ...prev,
        { type: "input", text: command },
        { type: "output", text: output },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        { type: "input", text: command },
        { type: "output", text: "Error: coult not connect to the server." },
      ]);
    }
  }
  const logOutput = messages.join("\n");
  return (
    <div className="w-full min-h-[calc(90vh-4rem)] flex p-6 gap-4">
      {/* Log panel - 30% */}
      <div className="w-[30%] rounded-t-lg overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
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
      <div className="w-[70%]">
        <Terminal
          welcomeMessage={[
            "CyberSim Defense Terminal v1.0",
            'Type "--help" to see available commands.',
          ]}
          className="h-full"
        />
      </div>
    </div>
  );
}
