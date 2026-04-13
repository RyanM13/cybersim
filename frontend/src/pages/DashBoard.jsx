import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Attacks from "../components/attacks";

export default function DashBoard() {
  return (
    <div>
      <Attacks />
    </div>
  );
}
