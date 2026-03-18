import { useState, useEffect } from "react";
import {
  sendCommand,
  startScenario,
  getLogs,
} from "@/services/scenarioService";

export default function Scenario() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [memory, setMemory] = useState([]);
  const [attackerIp, setAttackerIp] = useState(null);

  // Claude:
  //  //useEffect(() => {
  //    setAttackerIp() = startScenario()
  //  });
  //Why can't I do this, since startscenario is returning the ip I want to store it in the attackerIp?
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

  // Claude: How do I use the useEffect to start scenario and get logs?
  useEffect(() => {
    async function initScenario() {
      const ip = await startScenario();
      setAttackerIp(ip);
      const logs = await getLogs();
      setLogs(logs);
    }
    initScenario();
  }, []);

  return (
    // Claude: Can you give me a mac style terminal and log panes?
    <div className="w-full min-h-[calc(90vh-4rem)]  flex p-6 gap-4">
      {/* Log panel - 30% */}
      <div className="w-[30%] rounded-t-lg overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
        <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400 text-sm mx-auto">auth.log — live</span>
        </div>
        <div className="bg-gray-900 p-3 flex-1 font-mono text-xs">
          <p className="text-red-400 mb-1">
            Mar 15 14:01:45 Failed password for root from 192.168.1.105
          </p>
          <p className="text-green-400 mb-1">
            Mar 15 14:02:10 Accepted password for mwilson from 10.0.0.8
          </p>
          <p className="text-red-400 mb-1">
            Mar 15 14:02:33 Failed password for root from 192.168.1.105
          </p>
        </div>
      </div>

      {/* Terminal panel - 70% */}
      <div className="w-[70%] rounded-t-lg  shadow-2xl border border-gray-700 flex flex-col">
        <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400 text-sm mx-auto">terminal</span>
        </div>
        <div className="bg-gray-900 p-4 flex-1 font-mono text-sm gap-4">
          {/* Claude: How do I handle writing to the terminal? */}
          {history.map((line, i) => (
            <p key={i}>
              {line.type === "input" && (
                <>
                  <span className="text-blue-400">user@cybersim</span>
                  <span className="text-white">:~$ </span>
                </>
              )}
              <span
                className={
                  line.type === "output" ? "text-green-400" : "text-white"
                }
              >
                {line.text}
              </span>
            </p>
          ))}
        </div>

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
