import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Claude: Will you give me a description for a number of cyber attacks?
const availableAttacks = [
  {
    id: 1,
    title: "SSH Brute Force",
    description:
      "An attacker repeatedly attempts to gain access by guessing SSH credentials. Monitor your auth logs, identify the attacking subnet, and apply the correct firewall rules to stop the attack.",
    difficulty: "Beginner",
    badge: "Available",
    badgeVariant: "secondary",
    route: "/scenario",
  },
];

const futureAttacks = [
  {
    id: 2,
    title: "DDoS Attack",
    description:
      "A distributed denial of service attack overwhelms your server with traffic from multiple sources, making it unavailable to legitimate users.",
    difficulty: "Intermediate",
    badge: "Coming Soon",
    badgeVariant: "outline",
  },
  {
    id: 3,
    title: "SQL Injection",
    description:
      "An attacker exploits poorly sanitized inputs to execute malicious SQL queries against your database, potentially exposing sensitive data.",
    difficulty: "Intermediate",
    badge: "Coming Soon",
    badgeVariant: "outline",
  },
  {
    id: 4,
    title: "Man in the Middle",
    description:
      "An attacker secretly intercepts and potentially alters communications between two parties who believe they are communicating directly.",
    difficulty: "Advanced",
    badge: "Coming Soon",
    badgeVariant: "outline",
  },
  {
    id: 5,
    title: "Ransomware",
    description:
      "Malicious software encrypts your files and demands payment for the decryption key. Detect early warning signs and isolate affected systems.",
    difficulty: "Advanced",
    badge: "Coming Soon",
    badgeVariant: "outline",
  },
];

const difficultyColor = (difficulty) => {
  if (difficulty === "Beginner") return "text-green-400";
  if (difficulty === "Intermediate") return "text-yellow-400";
  if (difficulty === "Advanced") return "text-red-400";
};

export default function DashBoard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full p-6 flex flex-col items-center">
      <Tabs className="w-full max-w-5xl" defaultValue="available">
        <TabsList className="mb-6 bg-black">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="coming-soon">Coming Soon</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <div className="grid gap-6 md:grid-cols-2">
            {availableAttacks.map((attack) => (
              <div
                key={attack.id}
                onClick={() => setSelected(attack.id)}
                className={`
                group cursor-pointer rounded-xl border
                bg-gradient-to-b from-slate-900 to-slate-800
                p-6 shadow-sm transition-all duration-200
                hover:shadow-lg hover:-translate-y-1
                ${
                  selected === attack.id
                    ? "border-white/80 ring-2 ring-white/20"
                    : "border-white/10 hover:border-white/30"
                }
              `}
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={attack.badgeVariant}>{attack.badge}</Badge>

                  <span
                    className={`text-xs font-medium tracking-wide uppercase ${difficultyColor(
                      attack.difficulty,
                    )}`}
                  >
                    {attack.difficulty}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">
                  {attack.title}
                </h3>

                <p className="mb-5 text-sm text-gray-300 leading-relaxed">
                  {attack.description}
                </p>

                <div className="flex w-full justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="transition-all group-hover:scale-[1.03]"
                  >
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(attack.route);
                    }}
                    className="transition-all group-hover:scale-[1.03]"
                  >
                    Start Scenario
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coming-soon">
          <div className="grid gap-6 md:grid-cols-2">
            {futureAttacks.map((attack) => (
              <div
                key={attack.id}
                className="
                rounded-xl border border-white/10
                bg-gradient-to-b from-slate-900 to-slate-800
                p-6 opacity-60
              "
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={attack.badgeVariant}>{attack.badge}</Badge>

                  <span
                    className={`text-xs font-medium uppercase ${difficultyColor(
                      attack.difficulty,
                    )}`}
                  >
                    {attack.difficulty}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">
                  {attack.title}
                </h3>

                <p className="mb-5 text-sm text-gray-300 leading-relaxed">
                  {attack.description}
                </p>

                <Button size="sm" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
