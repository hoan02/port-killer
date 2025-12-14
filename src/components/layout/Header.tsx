import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function Header() {
  return (
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-3xl">Port Killer</CardTitle>
          <CardDescription>
            View and manage processes using TCP ports in LISTENING state
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}

