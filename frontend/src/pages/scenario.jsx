import { useState, useEffect, useRef } from "react";
import { sendCommand, startScenario } from "@/services/scenarioService";
import { Terminal as LogTerminal } from "../components/ai/terminal.jsx";
import { Terminal } from "../components/ui/terminal.jsx";

export default function Scenario() {
  // useState variables, keeps variables useable and changable
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [memory, setMemory] = useState([]);
  const [attackerIp, setAttackerIp] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchIp() {
      const ip = await startScenario();
      setAttackerIp(ip);
    }
    fetchIp();
  }, []);
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

  // Claude: How do I handle the history for the array
  //
  // sets memory for the evaluation, sets history for dispalying the terminal

  const logOutput = messages.join("\n");
  return (
    <div className="w-full min-h-[calc(90vh-4rem)] flex p-6 gap-4">
      return ( // Claude: Can you give me a mac style terminal and log panes? //
      Mac style terminal for logs
      <div className="w-full min-h-[calc(90vh-4rem)]  flex p-6 gap-4">
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

        <div className="border-t border-white flex flex-row">
          <label className="text-blue-400 ml-1 mr-0.5" for="command">
            <span>Input</span>:
          </label>
          <input
            id="command"
            type="text"
            name="command"
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            value={command}
            autoFocus
            className="bg-transparent outline-none text-white caret-green-400 w-full"
          />
        </div>
      </div>
    </div>
  );
}
