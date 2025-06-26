
"use client";

import * as React from "react";
import { observer } from "mobx-react-lite";
import { Wifi, WifiOff } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Switch } from "@/components/ui/switch";

export const ModeSwitcher = observer(() => {
  const { mode, setMode } = useApp();
  const isOnline = mode === 'online';

  const handleSwitch = (checked: boolean) => {
    setMode(checked ? 'online' : 'offline');
  };

  return (
    <div className="flex items-center space-x-2">
      <WifiOff className={`h-4 w-4 ${isOnline ? 'text-muted-foreground' : ''}`} />
      <Switch
        id="mode-switch"
        checked={isOnline}
        onCheckedChange={handleSwitch}
        aria-label="Toggle online/offline mode"
      />
      <Wifi className={`h-4 w-4 ${!isOnline ? 'text-muted-foreground' : 'text-primary'}`} />
    </div>
  );
});
