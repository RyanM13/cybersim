import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function DashBoard() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center justify-center">
      <Card
        // Google: How do I turn this card into a checkbox
        className={`flex items-center space-x-4 p-4 cursor-pointer ${checked ? "border-primary" : ""}`}
        onClick={() => setChecked(!checked)}
      >
        <Checkbox
          id="scenerios"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <CardHeader>
          <CardTitle>Attack</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is an attack that does something</p>

          <Button>Select</Button>
        </CardContent>
      </Card>
    </div>
  );
}
