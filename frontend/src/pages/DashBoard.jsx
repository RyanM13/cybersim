import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Array of attack descriptions
const attacks = [
  {
    id: 1,
    title: "Brute Force",
    description:
      "A brute force attack involves repeatedly guessing login credentials until the correct combination is found, typically resulting in many rapid failed authentication attempts.",
  },
  { id: 2, title: "Attack 2", description: "Description of attack 2." },
  { id: 3, title: "Attack 3", description: "Description of attack 3." },
];

export default function DashBoard() {
  // useState variables for changeable and useable variables
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  // Claude: How do I handle selection of multiple attacks
  // using map to select multiple selections
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Claude: How do I handle navigation between dashboard and scenario
  // Navigates user to scenario after selecting attacks.
  const handleStart = () => {
    if (selected.length === 0) return;
    // Testing purposes
    navigate("/dashboard/scenario", { state: { selectedAttacks: selected } });
  };

  return (
    <div className="w-full p-6 flex-col items-center">
      <h1 className="text-4xl text-center mb-6">Attack Selections</h1>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {/* using array to not have to hardcode attacks. Scalability */}
        {attacks.map((attack) => (
          <Card
            key={attack.id}
            className={`flex flex-col items-center text-center min-h-80 transition-colors bg-gradient-to-b from-slate-900 to-slate-700 ${
              selected.includes(attack.id) ? "border-white border-2" : ""
            }`}
          >
            <CardHeader className="mt-4 w-full">
              <h2 className="text-2xl font-semibold">{attack.title}</h2>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <p className="text-sm ">{attack.description}</p>
            </CardContent>
            <div className="flex  justify-center mb-4 w-full">
              <Button onClick={() => toggleSelect(attack.id)}>
                {selected.includes(attack.id) ? "Deselect" : "Select"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div>
        {/* Claude: How do I handle navigation between dashboard and scenario */}
        <Button
          onClick={handleStart}
          disabled={selected.length === 0}
          className={
            "px-8 py-4 text-lg mt-5 bg-gray-700 flex items-center w-full"
          }
        >
          Start Scenario
        </Button>
      </div>
    </div>
  );
}
