import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/store/use-settings-store";

const Settings = () => {
  const [gameId, fun_ticket, SESSION, setGameId, setFunTicket, setSession] =
    useSettingsStore((s) => [
      s.gameId,
      s.fun_ticket,
      s.SESSION,
      s.setGameId,
      s.setFunTicket,
      s.setSession,
    ]);

  // Function to handle text selection on focus
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <div className="flex gap-2">
      <div className="space-y-1">
        <Label htmlFor="gameId">Game ID</Label>
        <Input
          id="gameId"
          className="w-full"
          placeholder="Enter Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          onFocus={handleFocus} // Auto-select text on focus
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="fun_ticket">Fun Ticket</Label>
        <Input
          id="fun_ticket"
          className="w-full"
          placeholder="Enter Fun Ticket"
          value={fun_ticket}
          onChange={(e) => setFunTicket(e.target.value)}
          onFocus={handleFocus} // Auto-select text on focus
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="SESSION">Session</Label>
        <Input
          id="SESSION"
          className="w-full"
          placeholder="Enter SESSION"
          value={SESSION}
          onChange={(e) => setSession(e.target.value)}
          onFocus={handleFocus} // Auto-select text on focus
        />
      </div>
    </div>
  );
};

export default Settings;
